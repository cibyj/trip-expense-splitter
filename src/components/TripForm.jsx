import { useState } from 'react';
import { supabase } from '../lib/supabase';



export default function TripForm({ onCreate }) {
  const [name, setName] = useState('');

  async function createTrip() {
    if (!name) return;

    const { data } = await supabase
      .from('trips')
      .insert([{ name }])
      .select()
      .single();

    onCreate(data);
  }

  return (
    <div>
      <input
        className="w-full border rounded px-3 py-2 text-sm
             focus:outline-none focus:ring focus:ring-blue-200"
        placeholder="Trip name"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button 
       className="bg-blue-600 text-white px-4 py-2 rounded
             hover:bg-blue-700 text-sm"
      onClick={createTrip}>Create</button>
    </div>
  );
}
