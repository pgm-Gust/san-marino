#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const {google} = require('googleapis');

// Load .env.local (if present) so env-based credentials work when running the script
try { require('dotenv').config({ path: path.resolve(process.cwd(), '.env.local') }); } catch (e) { /* ignore if dotenv not installed */ }

const CREDENTIALS_PATH = path.resolve(process.cwd(), 'credentials.json');
const TOKEN_PATH = path.resolve(process.cwd(), 'token.json');
const OUT_PATH = path.resolve(process.cwd(), 'data', 'events.json');

const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];

function loadCredentials() {
  // Support credentials via environment variables for safer secret management.
  const {GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URIS, GOOGLE_PROJECT_ID} = process.env;
  if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET) {
    const redirect_uris = GOOGLE_REDIRECT_URIS ? GOOGLE_REDIRECT_URIS.split(',') : ['urn:ietf:wg:oauth:2.0:oob','http://localhost'];
    const web = {
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uris,
      project_id: GOOGLE_PROJECT_ID,
      auth_uri: 'https://accounts.google.com/o/oauth2/auth',
      token_uri: 'https://oauth2.googleapis.com/token'
    };
    return {web};
  }

  if (!fs.existsSync(CREDENTIALS_PATH)) {
    console.error('Missing credentials.json in project root and no GOOGLE_* env vars found. See README for setup.');
    process.exit(1);
  }
  const content = fs.readFileSync(CREDENTIALS_PATH, 'utf8');
  return JSON.parse(content);
}

function saveToken(token) {
  fs.mkdirSync(path.dirname(TOKEN_PATH), {recursive: true});
  fs.writeFileSync(TOKEN_PATH, JSON.stringify(token, null, 2));
  console.log('Token stored to', TOKEN_PATH);
}

function askQuestion(query) {
  const rl = readline.createInterface({input: process.stdin, output: process.stdout});
  return new Promise((resolve) => rl.question(query, (ans) => { rl.close(); resolve(ans); }));
}

async function authorize() {
  const creds = loadCredentials();
  const {client_secret, client_id, redirect_uris} = creds.installed || creds.web;
  const AUTO_OAUTH = process.env.AUTO_OAUTH === '1' || process.env.AUTO_OAUTH === 'true';
  const localRedirect = 'http://localhost:51234/oauth2callback';
  const chosenRedirect = AUTO_OAUTH ? localRedirect : (redirect_uris && redirect_uris[0]);
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, chosenRedirect);

  // Try load token
  if (fs.existsSync(TOKEN_PATH)) {
    const token = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf8'));
    oAuth2Client.setCredentials(token);
    return oAuth2Client;
  }

  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent',
  });

  if (AUTO_OAUTH) {
    const http = require('http');
    // open is optional, will try and fallback to printing URL
    let open;
    try { open = require('open'); } catch (e) { open = null; }

    console.log('Starting local server to capture OAuth callback at', localRedirect);
    const server = http.createServer(async (req, res) => {
      try {
        const url = new URL(req.url, localRedirect);
        const code = url.searchParams.get('code');
        if (code) {
          res.writeHead(200, {'Content-Type': 'text/html'});
          res.end('<html><body><h1>Authorized</h1><p>You can close this window.</p></body></html>');
          // exchange code
          const {tokens} = await oAuth2Client.getToken(code);
          oAuth2Client.setCredentials(tokens);
          saveToken(tokens);
          server.close();
        } else {
          res.writeHead(400);
          res.end('Missing code');
        }
      } catch (err) {
        console.error('Error handling OAuth callback:', err);
        try { res.writeHead(500); res.end('Error'); } catch (e) {}
      }
    });

    await new Promise((resolve, reject) => {
      server.listen(51234, (err) => err ? reject(err) : resolve());
    });
    console.log('Opening browser for authorization...');
    if (open) {
      try { await open(authUrl); } catch (e) { console.log('Failed to open browser, visit URL manually:', authUrl); }
    } else {
      console.log('Open not available; visit this URL to authorize:');
      console.log(authUrl);
    }
    await new Promise((resolve) => server.on('close', resolve));
    return oAuth2Client;
  }

  console.log('Authorize this app by visiting this url:');
  console.log(authUrl);
  const code = await askQuestion('Enter the code from that page here: ');
  const {tokens} = await oAuth2Client.getToken(code.trim());
  oAuth2Client.setCredentials(tokens);
  saveToken(tokens);
  return oAuth2Client;
}

async function fetchAllEvents(auth) {
  const calendar = google.calendar({version: 'v3', auth});
  const calendars = [];

  // Fetch calendar list (supports pagination)
  let pageToken = null;
  do {
    const res = await calendar.calendarList.list({pageToken});
    const items = res.data.items || [];
    items.forEach((c) => calendars.push({id: c.id, summary: c.summary || c.id}));
    pageToken = res.data.nextPageToken;
  } while (pageToken);

  const out = [];
  for (const cal of calendars) {
    console.log('Fetching events for calendar:', cal.summary);
    const events = [];
    let eventsPageToken = null;
    do {
      const res = await calendar.events.list({
        calendarId: cal.id,
        singleEvents: true,
        orderBy: 'startTime',
        maxResults: 2500,
        pageToken: eventsPageToken,
      });
      const items = res.data.items || [];
      items.forEach((e) => events.push(e));
      eventsPageToken = res.data.nextPageToken;
    } while (eventsPageToken);

    out.push({calendarId: cal.id, summary: cal.summary, events});
  }

  fs.mkdirSync(path.dirname(OUT_PATH), {recursive: true});
  fs.writeFileSync(OUT_PATH, JSON.stringify({fetchedAt: new Date().toISOString(), data: out}, null, 2), 'utf8');
  console.log('Wrote events to', OUT_PATH);
}

async function main() {
  try {
  // If a public ICS URL is provided, always use it and skip OAuth.
  const icalUrl = process.env.GOOGLE_ICAL_URL || process.env.ICAL_URL;
  if (icalUrl) {
      console.log('Found GOOGLE_ICAL_URL, fetching public ICS feed for test...');
      const ical = require('node-ical');
      const axios = require('axios');
      let res;
      try {
        res = await axios.get(icalUrl, {headers: {Accept: 'text/calendar, text/plain, */*'}, maxRedirects: 5, timeout: 10000});
      } catch (err) {
        const errOut = {fetchedAt: new Date().toISOString(), error: 'Failed to fetch ICS', detail: String(err)};
        fs.mkdirSync(path.dirname(OUT_PATH), {recursive: true});
        fs.writeFileSync(OUT_PATH, JSON.stringify(errOut, null, 2), 'utf8');
        console.error('Failed to fetch ICS:', err.message || err);
        return;
      }

      const body = res.data && typeof res.data === 'string' ? res.data : '';
      // quick heuristic: if body contains HTML tags, likely it's a login/HTML page
      if (/<html|<!doctype|<body/i.test(body)) {
        console.log('ICS fetch returned HTML on first attempt — retrying with browser headers...');
        try {
          const browserRes = await axios.get(icalUrl, {
            headers: {
              Accept: 'text/calendar, text/plain, */*',
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
              Referer: 'https://calendar.google.com/'
            },
            maxRedirects: 5,
            timeout: 10000,
          });
          const body2 = browserRes.data && typeof browserRes.data === 'string' ? browserRes.data : '';
          if (!/<html|<!doctype|<body/i.test(body2) && /BEGIN:VEVENT/i.test(body2)) {
            // parse the second response
            const parsed2 = ical.parseICS(body2);
            const events2 = [];
            for (const k of Object.keys(parsed2)) {
              const item = parsed2[k];
              if (item && item.type === 'VEVENT') {
                events2.push({id: item.uid || item.sequence || k, summary: item.summary, start: {dateTime: item.start ? item.start.toISOString() : null}, end: {dateTime: item.end ? item.end.toISOString() : null}, raw: item});
              }
            }
            const out2 = [{calendarId: 'ical-public', summary: 'Public ICS', events: events2}];
            fs.mkdirSync(path.dirname(OUT_PATH), {recursive: true});
            fs.writeFileSync(OUT_PATH, JSON.stringify({fetchedAt: new Date().toISOString(), data: out2}, null, 2), 'utf8');
            console.log('Wrote events to', OUT_PATH, '(from second attempt)');
            return;
          }
        } catch (err2) {
          console.error('Retry with browser headers failed:', err2.message || err2);
        }

  const preview = body.slice(0, 400);
  const errOut = {fetchedAt: new Date().toISOString(), error: 'ICS fetch returned HTML (likely requires auth or is not public)', rawPreview: preview};
  fs.mkdirSync(path.dirname(OUT_PATH), {recursive: true});
  fs.writeFileSync(OUT_PATH, JSON.stringify(errOut, null, 2), 'utf8');
  console.error('ICS URL returned HTML — feed may require authentication or is invalid. Stored rawPreview in data/events.json');
  return;
      }

      if (!/BEGIN:VEVENT/i.test(body)) {
        const errOut = {fetchedAt: new Date().toISOString(), error: 'No VEVENT found in ICS'};
        fs.mkdirSync(path.dirname(OUT_PATH), {recursive: true});
        fs.writeFileSync(OUT_PATH, JSON.stringify(errOut, null, 2), 'utf8');
        console.log('No VEVENT found in ICS feed.');
        return;
      }

      const parsed = ical.parseICS(body);
      const events = [];
      for (const k of Object.keys(parsed)) {
        const item = parsed[k];
        if (item && item.type === 'VEVENT') {
          events.push({id: item.uid || item.sequence || k, summary: item.summary, start: {dateTime: item.start ? item.start.toISOString() : null}, end: {dateTime: item.end ? item.end.toISOString() : null}, raw: item});
        }
      }
      const out = [{calendarId: 'ical-public', summary: 'Public ICS', events}];
      fs.mkdirSync(path.dirname(OUT_PATH), {recursive: true});
      fs.writeFileSync(OUT_PATH, JSON.stringify({fetchedAt: new Date().toISOString(), data: out}, null, 2), 'utf8');
      console.log('Wrote events to', OUT_PATH);
      return;
    }

    const auth = await authorize();
    await fetchAllEvents(auth);
  } catch (err) {
    console.error('Error:', err.message || err);
    process.exit(1);
  }
}

if (require.main === module) main();
