import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function ParticipantForm({ tripId, onAdd }) {
  const [name, setName] = useState('');

  async function addParticipant() {
    if (!name) return;

    await supabase.from('participants').insert([
      { trip_id: tripId, name }
    ]);

    setName('');
    onAdd();
  }

  return (
    <div>
      <h3 className="text-2xl sm:text-1xl font-bold text-black-600 leading-tight">Participants</h3>
      <input
       className="border rounded px-3 py-2 text-sm
             focus:outline-none focus:ring focus:ring-blue-200"
        placeholder="Name"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button
       className="bg-blue-600 text-white px-4 py-2 rounded
             hover:bg-blue-700 text-sm"

       onClick={addParticipant}>Add
      </button>
    </div>
  );
}
