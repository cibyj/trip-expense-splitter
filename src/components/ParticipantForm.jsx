import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';

export default function ParticipantForm({ tripId, onAdd }) {
  const [name, setName] = useState('');

  async function addParticipant() {
    if (!name.trim()) {
      toast.error('Participant name is required');
      return;
    }

    await supabase.from('participants').insert([
      { trip_id: tripId, name }
    ]);

    toast.success('Participant added');
    setName('');
    onAdd();
  }

  return (
    <div className="space-y-2">
      <h3 className="text-xl font-semibold">Add Participant</h3>

      <div className="flex gap-2">
        <input
          className="border rounded px-3 py-2 text-sm w-full"
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <button
          onClick={addParticipant}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
        >
          Add
        </button>
      </div>
    </div>
  );
}
