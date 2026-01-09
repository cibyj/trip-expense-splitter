import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

import TripSelector from '../components/TripSelector';
import TripForm from '../components/TripForm';
import ParticipantForm from '../components/ParticipantForm';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseTable from '../components/ExpenseTable';
import TotalsCard from '../components/TotalsCard';
import Settlement from '../components/Settlement';



export default function Trip() {
  const [trip, setTrip] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [expenses, setExpenses] = useState([]);

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

    setTrip(null);
  }

  return (

 

    <div>

      {!trip && (
        <>
          <h3>Select Existing Trip</h3>
          <TripSelector onSelect={setTrip} />

          <h3>Create New Trip</h3>
          <TripForm onCreate={setTrip} />
        </>
      )}

      {trip && (
        <>
          {/* Trip Header */}
           
    <div className="flex flex-wrap items-center gap-3 mb-6">

            <h1 style={{ margin: 0 }}>{trip.name}</h1>


<button
  onClick={() => setTrip(null)}
  className="bg-green-800 text-white px-3 py-1.5 text-sm border rounded hover:bg-green-900"

>
  Change Trip
</button>


          <button
            onClick={deleteTrip}
            className="px-3 py-1.5 text-sm text-white bg-red-500 rounded hover:bg-red-700"
           >
            Delete Trip
          </button>

          </div>

          {/* Forms & Tables */}
          <div className="bg-white rounded-lg shadow p-4 mb-6">
           <ParticipantForm tripId={trip.id} onAdd={loadData} />
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
          />
         </div>
        </>
      )}
    </div>
  );
}
