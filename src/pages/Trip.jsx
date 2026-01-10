import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';

import TripSelector from '../components/TripSelector';
import TripForm from '../components/TripForm';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseTable from '../components/ExpenseTable';
import TotalsCard from '../components/TotalsCard';
import Settlement from '../components/Settlement';

export default function Trip() {
  const [trip, setTrip] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [expenses, setExpenses] = useState([]);

  const navigate = useNavigate();
  const { tripId } = useParams();

  /* ----------------------------------------
     Clear state when no tripId (Change Trip)
  ---------------------------------------- */
  useEffect(() => {
    if (!tripId) {
      setTrip(null);
      setParticipants([]);
      setExpenses([]);
    }
  }, [tripId]);

  /* ----------------------------------------
     Load trip from URL
  ---------------------------------------- */
  useEffect(() => {
    if (!tripId) return;

    async function loadTrip() {
      const { data } = await supabase
        .from('trips')
        .select('*')
        .eq('id', tripId)
        .single();

      setTrip(data);
    }

    loadTrip();
  }, [tripId]);

  /* ----------------------------------------
     Load expenses & participants
  ---------------------------------------- */
  useEffect(() => {
    if (!trip) return;
    loadData();
  }, [trip]);

  async function loadData() {
    const { data: participants } = await supabase
      .from('participants')
      .select('*')
      .eq('trip_id', trip.id);

    const { data: expenses } = await supabase
      .from('expenses')
      .select('*')
      .eq('trip_id', trip.id)
      .order('expense_date');

    setParticipants(participants || []);
    setExpenses(expenses || []);
  }

  async function deleteTrip() {
    if (!confirm('This will delete the trip and ALL related data. Continue?')) {
      return;
    }

    await supabase.from('expenses').delete().eq('trip_id', trip.id);
    await supabase.from('participants').delete().eq('trip_id', trip.id);
    await supabase.from('trips').delete().eq('id', trip.id);

    navigate('/');
  }

  return (
    <div>
      {/* -------------------------------
          No Trip Selected
      ------------------------------- */}
      {!trip && (
        <>
          <h3 className="text-2xl font-bold mb-2">Select Existing Trip</h3>
          <TripSelector onSelect={(t) => navigate(`/trip/${t.id}`)} />

          <h3 className="text-2xl font-bold mt-6 mb-2">Create New Trip</h3>
          <TripForm onCreate={(t) => navigate(`/trip/${t.id}`)} />
        </>
      )}

      {/* -------------------------------
          Trip Selected
      ------------------------------- */}
      {trip && (
        <>
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div className="bg-teal-600 text-white p-6 rounded-xl shadow">
              <h1 className="text-3xl sm:text-4xl font-bold">
                {trip.name} 🎉
              </h1>
              <p className="text-sm text-teal-100 mt-1">
                Trip overview & expenses
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => navigate(`/trip/${trip.id}/participants`)}
               
                className="px-3 py-1.5 text-sm text-white bg-orange-600 rounded hover:bg-orange-700"
              >
                Manage Participants
              </button>

              <button
                onClick={() => navigate('/')}
                className="px-3 py-1.5 text-sm text-white bg-green-600 rounded hover:bg-green-700"
              >
                Change Trip
              </button>

              <button
                onClick={deleteTrip}
                className="px-3 py-1.5 text-sm text-white bg-red-600 rounded hover:bg-red-700"
              >
                Delete Trip
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <ExpenseForm
              tripId={trip.id}
              participants={participants}
              onAdd={loadData}
            />
          </div>

          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <ExpenseTable
              expenses={expenses}
              participants={participants}
              onChange={loadData}
            />
          </div>

          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <TotalsCard
              participants={participants}
              expenses={expenses}
            />
          </div>

          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <Settlement
              participants={participants}
              expenses={expenses}
              tripName={trip.name}
            />
          </div>
        </>
      )}
    </div>
  );
}
