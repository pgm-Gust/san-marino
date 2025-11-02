# San Marino

## Google Calendar integration

1. Create OAuth credentials in Google Cloud Console for a "Desktop app" or "Web application" and download the JSON. Save it as `credentials.json` in the project root.

2. Install dependencies:

   npm install

3. Run the fetch script to perform the OAuth flow and save `token.json`:

   npm run fetch:google-calendar

   The script will prompt you to visit a URL and paste the code. After that, `token.json` will be created and `data/events.json` will be written with calendar events.

4. View events in the app at `/google-events` (or fetch `/api/google-events`).

Notes:

- The script stores tokens in `token.json`. Keep this file secure.
- The script requests readonly access to calendars. To access private calendars, ensure the account used has access.

Environment variables (recommended)

You can store Google OAuth credentials in environment variables instead of `credentials.json`. Copy `.env.local.example` to `.env.local` and set your values:

GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URIS (comma separated), and optionally GOOGLE_PROJECT_ID.

Important: Do NOT store client secrets or tokens in `data/events.json`. That file is meant for fetched calendar data. If you accidentally put secrets there, delete them and store secrets in `.env.local` or a secret manager.

Automatic OAuth flow (no copy/paste)

If you prefer not to paste the auth code manually, enable the automatic flow:

1. In `.env.local` add:

   AUTO_OAUTH=1

2. In Google Cloud Console, edit your OAuth client and add this redirect URI to the Authorized redirect URIs list exactly:

   http://localhost:51234/oauth2callback

3. Run:

   npm run fetch:google-calendar

The script will open the browser and automatically capture the code.
