import React from 'react';

export default function SubmitButton({ isSubmitting, isAvailable, totalPrice }) {
  return (
    <button
      type="submit"
      disabled={!isAvailable || isSubmitting}
      className="submit-button button"
    >
      {isSubmitting ? (
        <span className="loading">Bevestigen...</span>
      ) : (
        <>
          Bevestig boeking
          <span className="price">€{totalPrice.toLocaleString('nl-NL')}</span>
        </>
      )}
    </button>
  );
}
