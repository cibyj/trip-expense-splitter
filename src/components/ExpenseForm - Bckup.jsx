import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function ExpenseForm({ tripId, participants, onAdd }) {
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(
    new Date().toISOString().slice(0, 10)
  );

  async function addExpense() {
    if (!amount || !paidBy) return;

    await supabase.from('expenses').insert([{
      trip_id: tripId,
      paid_by: paidBy,
      amount: Number(amount),
      description,
      expense_date: date
    }]);

    setAmount('');
    setDescription('');
    onAdd();
  }

  return (
    <div>
      <h3 className="text-2xl sm:text-1xl font-bold text-black-600 leading-tight">Add Expense</h3>
      <input
       className="w-full border rounded px-3 py-2 text-sm
             focus:outline-none focus:ring focus:ring-blue-200"
        placeholder="Description"
        value={description}
        onChange={e => setDescription(e.target.value)}
      />
      <input 

       className="border rounded px-3 py-2 text-sm
             focus:outline-none focus:ring focus:ring-blue-200"
        type="number" placeholder="$0.00"
        value={amount}
        onChange={e => setAmount(e.target.value)}
      />

      


      

      <input
        className="border rounded px-3 py-2 text-sm
             focus:outline-none focus:ring focus:ring-blue-200"
        type="date"
        value={date}
        onChange={e => setDate(e.target.value)}
      />

     
      <select
className="border rounded px-3 py-2 text-sm
             focus:outline-none focus:ring focus:ring-blue-200"
 value={paidBy} onChange={e => setPaidBy(e.target.value)}>
        <option value="">Paid by</option>
        {participants.map(p => (
          <option key={p.id} value={p.id}>{p.name}</option>
        ))}
      </select>
      <h3>        </h3>
      <h3>        </h3>
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded
             hover:bg-blue-700 text-sm"
        onClick={addExpense}>Add</button>
    </div>
  );
}
