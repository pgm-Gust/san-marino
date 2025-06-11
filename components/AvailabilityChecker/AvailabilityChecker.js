'use client';
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { FaSpinner, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import './AvailabilityChecker.scss';

const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString('nl-BE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

const debounce = (func, delay) => {
  let timeoutId;
  const wrapped = (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
  wrapped.cancel = () => clearTimeout(timeoutId);
  return wrapped;
};

const StatusMessage = ({ status, message, icon: Icon }) => (
  <div className={`status-message ${status}`}>
    <Icon className={status === 'loading' ? 'spin' : ''} />
    <span>{message}</span>
  </div>
);

const DateInput = ({ id, label, value, min, onChange }) => (
  <div className="input-group">
    <label htmlFor={id}>
      <span>{label}</span>
      <input
        id={id}
        type="date"
        name={id}
        value={value}
        onChange={onChange}
        min={min}
        className="date-input"
      />
    </label>
  </div>
);

const NextWeekendSection = ({ status, data, error, onSelect }) => {
  if (status === 'loading') {
    return <StatusMessage status="loading" message="Weekend datums laden..." icon={FaSpinner} />;
  }

  if (status === 'error') {
    return <StatusMessage status="error" message={error} icon={FaExclamationCircle} />;
  }

  if (status === 'success' && data?.available) {
    const [start, end] = data.weekend.split(' - ');
    return (
      <div className="weekend-notice">
        <div className="weekend-content">
          <h3>Eerst volgend vrij weekend</h3>
          <div className="date-range">
            <time dateTime={start}>{formatDate(start)}</time>
            <span>→</span>
            <time dateTime={end}>{formatDate(end)}</time>
          </div>
          <button
            className="select-weekend"
            onClick={() => onSelect({ arrivalDate: start, departureDate: end })}
          >
            Deze datums gebruiken
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default function AvailabilityChecker({ 
  onDatesChange = () => {},
  onAvailabilityChange = () => {} 
}) {
  const [today] = useState(() => new Date().toISOString().split('T')[0]);
  const [dates, setDates] = useState({
    arrivalDate: today,
    departureDate: '',
  });
  const [availability, setAvailability] = useState({ status: 'idle' });
  const [nextWeekend, setNextWeekend] = useState({ status: 'loading' });
  const abortController = useRef(new AbortController());
  const isInitialMount = useRef(true);

  const fetchAPI = useCallback(async (endpoint, method = 'GET', body = null) => {
    try {
      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: body && JSON.stringify(body),
        signal: abortController.current.signal,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Request failed');
      }

      return await response.json();
    } catch (error) {
      if (error.name !== 'AbortError') throw error;
    }
  }, []);

  useEffect(() => {
    const loadNextWeekend = async () => {
      try {
        const data = await fetchAPI('/api/find-next-weekend');
        setNextWeekend({ status: 'success', data });
      } catch (error) {
        setNextWeekend({ status: 'error', error: error.message });
      }
    };

    loadNextWeekend();
    return () => abortController.current.abort();
  }, [fetchAPI]);

  const checkAvailability = useCallback(
    async (arrival, departure) => {
      if (!arrival || !departure) return;

      try {
        setAvailability({ status: 'loading' });
        const data = await fetchAPI(
          '/api/check-availability',
          'POST',
          {
            arrivalDate: arrival,
            departureDate: departure,
            apartments: [Number(process.env.NEXT_PUBLIC_SMOOBU_APARTMENT_ID)],
            customerId: Number(process.env.SMOOBU_CUSTOMER_ID),
          }
        );

        setAvailability({ status: 'success', data });
        onAvailabilityChange(data);
      } catch (error) {
        setAvailability({ status: 'error', error: error.message });
      }
    },
    [fetchAPI, onAvailabilityChange]
  );

  const debouncedCheck = useMemo(
    () => debounce(checkAvailability, 500),
    [checkAvailability]
  );

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    onDatesChange(dates);
    if (dates.arrivalDate && dates.departureDate) {
      debouncedCheck(dates.arrivalDate, dates.departureDate);
    }
  }, [dates, debouncedCheck]);

  useEffect(() => {
    return () => debouncedCheck.cancel();
  }, [debouncedCheck]);

  const handleDateChange = ({ target: { name, value } }) => {
    setDates(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'arrivalDate' && {
        departureDate: value > prev.departureDate ? '' : prev.departureDate,
      }),
    }));
  };

  const handleWeekendSelect = useCallback((selectedDates) => {
    setDates(selectedDates);
    checkAvailability(selectedDates.arrivalDate, selectedDates.departureDate);
    onDatesChange(selectedDates);
  }, [checkAvailability, onDatesChange]);

  return (
    <div className="availability-checker">
      <div className="input-grid">
        <DateInput
          id="arrivalDate"
          label="Aankomstdatum"
          value={dates.arrivalDate}
          min={today}
          onChange={handleDateChange}
        />

        <DateInput
          id="departureDate"
          label="Vertrekdatum"
          value={dates.departureDate}
          min={dates.arrivalDate || today}
          onChange={handleDateChange}
        />
      </div>

      <div className="availability-feedback">
        {availability.status === 'loading' && (
          <StatusMessage
            status="loading"
            message="Beschikbaarheid controleren..."
            icon={FaSpinner}
          />
        )}

        {availability.status === 'success' && (
          availability.data?.availableApartments?.length > 0 ? (
            <StatusMessage
              status="success"
              message="Beschikbaar!"
              icon={FaCheckCircle}
            />
          ) : (
            <StatusMessage
              status="error"
              message="Niet beschikbaar"
              icon={FaExclamationCircle}
            />
          )
        )}

        {availability.status === 'error' && (
          <StatusMessage
            status="error"
            message={availability.error}
            icon={FaExclamationCircle}
          />
        )}
      </div>

      <NextWeekendSection
        status={nextWeekend.status}
        data={nextWeekend.data}
        error={nextWeekend.error}
        onSelect={handleWeekendSelect}
      />
    </div>
  );
}