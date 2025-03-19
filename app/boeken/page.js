import BookingForm from '@components/BookingForm/BookingForm';

import "@styles/container.css";
import "./page.scss";

export default function BoekenPage() {
  return (
    <>
    <div className="container">
      <div className='text-content'>
      <p className="subheading">Boeken</p>
      <h2>Appartement Boeken</h2>
      </div>
    </div>

    <BookingForm />


  </>
  );
}