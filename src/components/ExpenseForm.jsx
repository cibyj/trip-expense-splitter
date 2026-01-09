import toast from 'react-hot-toast';
import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function ExpenseForm({ tripId, participants, onAdd }) {
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(
    new Date().toISOString().slice(0, 10)
  );

  const [error, setError] = useState('');

  async function addExpense() {
    // Validation
    if (!description.trim()) {
      setError('Please enter a description.');
      return;
    }

    if (!amount || Number(amount) <= 0) {
      setError('Please enter a valid amount.');
      return;
    }

    if (!paidBy) {
      setError('Please select who paid for this expense.');
      return;
    }

    setError('');

    await supabase.from('expenses').insert([
      {
        trip_id: tripId,
        paid_by: paidBy,
        amount: Number(amount),
        description,
        expense_date: date,
      },
    ]);
    
    toast.success('Expense added successfully');
    onAdd();

    // Reset form
    setAmount('');
    setDescription('');
    setPaidBy('');
    setDate(new Date().toISOString().slice(0, 10));

    onAdd();
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-800">
        Add Expense
      </h3>

      {/* Description */}
      <input
        className="w-full border rounded px-3 py-2 text-sm
          focus:outline-none focus:ring focus:ring-blue-200"
        placeholder="Description"
        value={description}
        onChange={(e) => {
          setDescription(e.target.value);
          setError('');
        }}
      />

      {/* Amount */}
      <input
        className={`w-full border rounded px-3 py-2 text-sm
          focus:outline-none focus:ring ${
            error && !amount
              ? 'border-red-500 focus:ring-red-200'
              : 'focus:ring-blue-200'
          }`}
        type="number"
        placeholder="$0.00"
        value={amount}
        onChange={(e) => {
          setAmount(e.target.value);
          setError('');
        }}
      />

      {/* Date */}
      <input
        className="w-full border rounded px-3 py-2 text-sm
          focus:outline-none focus:ring focus:ring-blue-200"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      {/* Paid By */}
      <select
        className={`w-full border rounded px-3 py-2 text-sm
          focus:outline-none focus:ring ${
            error && !paidBy
              ? 'border-red-500 focus:ring-red-200'
              : 'focus:ring-blue-200'
          }`}
        value={paidBy}
        onChange={(e) => {
          setPaidBy(e.target.value);
          setError('');
        }}
      >
        <option value="">Paid by</option>
        {participants.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>

      {/* Error message */}
      {error && (
        <p className="text-sm text-red-600">
          {error}
        </p>
      )}

      {/* Submit button */}
      <button
        onClick={addExpense}
        disabled={!amount || !paidBy}
        className={`w-full sm:w-auto px-4 py-2 rounded text-sm text-white
          ${
            !amount || !paidBy
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
      >
        Add Expense
      </button>
    </div>
  );
}
