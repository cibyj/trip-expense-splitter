import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';

import ParticipantForm from '../components/ParticipantForm';
import ParticipantList from '../components/ParticipantList';

export default function ParticipantsPage() {
  const { tripId } = useParams();
  const navigate = useNavigate();

  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    if (!tripId) return;
    loadParticipants();
  }, [tripId]);

  async function loadParticipants() {
    const { data, error } = await supabase
      .from('participants')
      .select('*')
      .eq('trip_id', tripId)
      .order('name');

    if (error) {
      toast.error('Failed to load participants');
      return;
    }

    setParticipants(data || []);
  }

  async function handleDeleteParticipant(participantId) {
    // Check if participant has expenses
    const { data: expenses, error: expenseError } = await supabase
      .from('expenses')
      .select('id')
      .eq('paid_by', participantId)
      .limit(1);

    if (expenseError) {
      toast.error('Failed to validate participant');
      return;
    }

    if (expenses.length > 0) {
      toast.error('Cannot delete a participant with existing expenses');
      return;
    }

    // Safe to delete
    const { error: deleteError } = await supabase
      .from('participants')
      .delete()
      .eq('id', participantId);

    if (deleteError) {
      if (deleteError.message?.includes('foreign key')) {
        toast.error('This participant has expenses and cannot be deleted');
      } else {
        toast.error('Failed to delete participant');
      }
      return;
    }

    toast.success('Participant deleted');
    loadParticipants();
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto p-4">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Manage Participants</h1>

          <button
            onClick={() => navigate(`/trip/${tripId}`)}
            className="px-4 py-2 text-white bg-orange-600 rounded hover:bg-orange-700"
          >
            ← Back to Expenses
          </button>
        </div>

        {/* Add Participant */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <ParticipantForm
            tripId={tripId}
            onAdd={loadParticipants}
          />
        </div>

        {/* Participant List */}
        <div className="bg-white rounded-lg shadow p-4">
          <ParticipantList
            participants={participants}
            onDelete={handleDeleteParticipant}
            onChange={loadParticipants}
          />
        </div>

      </div>
    </div>
  );
}
