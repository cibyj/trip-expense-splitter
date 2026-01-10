import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';

export default function ParticipantList({ participants, onChange }) {
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState('');

  function startEdit(p) {
    setEditingId(p.id);
    setName(p.name);
  }

  async function saveEdit(id) {
    if (!name.trim()) {
      toast.error('Name cannot be empty');
      return;
    }

    await supabase
      .from('participants')
      .update({ name })
      .eq('id', id);

    toast.success('Participant updated');
    setEditingId(null);
    setName('');
    onChange();
  }

  async function deleteParticipant(id) {
    if (!confirm('Delete this participant?')) return;

    const { error } = await supabase
      .from('participants')
      .delete()
      .eq('id', id);

    // ✅ If Supabase blocks deletion because of existing expenses
    if (error) {
      toast.error(
        'Cannot delete participant. This person has existing expenses.'
      );
      return;
    }

    toast.success('Participant deleted');
    onChange();
  }

  return (
    <div className="space-y-3">
      <h3 className="text-xl font-semibold">Participants</h3>

      {participants.map(p => (
        <div
          key={p.id}
          className="flex items-center justify-between border rounded px-3 py-2"
        >
          {editingId === p.id ? (
            <>
              <input
                className="border rounded px-2 py-1 text-sm w-full mr-2"
                value={name}
                onChange={e => setName(e.target.value)}
              />
              <button
                className="text-sm px-2 py-1 bg-green-600 text-white rounded mr-2"
                onClick={() => saveEdit(p.id)}
              >
                Save
              </button>
              <button
                className="text-sm px-2 py-1 border rounded"
                onClick={() => setEditingId(null)}
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <span className="font-medium">{p.name}</span>
              <div className="flex gap-2">
                <button
                  className="text-sm px-2 py-1 border rounded"
                  onClick={() => startEdit(p)}
                >
                  Edit
                </button>
                <button
                  className="text-sm px-2 py-1 bg-red-600 text-white rounded"
                  onClick={() => deleteParticipant(p.id)}
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
