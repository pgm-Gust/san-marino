import { Suspense } from 'react';
import BookingContent from '@components/BookingContent/BookingContent';

import "./page.scss"
export default function BedanktPagina() {
  return (
    <Suspense fallback={
      <div className="loading">
        <p>Gegevens laden...</p>
      </div>
    }>
      <BookingContent />
    </Suspense>
  );
}