import React from 'react';
import { FaExclamationCircle } from 'react-icons/fa';

export default function ErrorMessage({ error }) {
  return (
    <div className="error-message" role="alert">
      <FaExclamationCircle aria-hidden="true" />
      <p>{error}</p>
    </div>
  );
}
