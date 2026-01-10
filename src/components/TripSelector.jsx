import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function TripSelector({ onSelect }) {
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    supabase.from('trips').select('*').then(({ data }) => {
      setTrips(data || []);
    });
  }, []);

  return (
    <select
className="w-64 border rounded px-3 py-2 text-sm
             focus:outline-none focus:ring focus:ring-blue-200"

      onChange={(e) => {
        const trip = trips.find(t => String(t.id) === e.target.value);
        if (trip) onSelect(trip);
      }}
    >
 

      <option value="">-- Select Trip --</option>
      {trips.map(t => (
        <option key={t.id} value={t.id}>
          {t.name}
        </option>
      ))}
    </select>
  );
}
