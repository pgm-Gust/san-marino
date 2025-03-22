"use client";
import { useEffect, useRef } from 'react';
import './SmoobuWidget.scss';

export default function SmoobuWidget() {
  const widgetRef = useRef(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://login.smoobu.com/js/Apartment/CalendarWidget.js";
    script.async = true;
    widgetRef.current.appendChild(script);
  }, []);

  return (
    <div className="smoobu-widget-wrapper">
      <div ref={widgetRef} className="smoobu-widget-container">
        <div
          id="smoobuApartment2594973nl"
          className="calendarWidget"
        >
          <div
            className="calendarContent"
            data-load-calendar-url="https://login.smoobu.com/nl/cockpit/widget/single-calendar/2594973"
            data-verification="7cce09b7d79ef8217a538b7dfa7b08a8f0a3611e8dddbe71775eb2178f8225b8"
            data-baseurl="https://login.smoobu.com" 
            data-disable-css="false"
          ></div>
        </div>
      </div>
    </div>
  );
}