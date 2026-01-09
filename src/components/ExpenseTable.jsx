import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function ExpenseTable({ expenses, participants, onChange }) {
  const [editingId, setEditingId] = useState(null);
  const [edit, setEdit] = useState({});

  function startEdit(expense) {
    setEditingId(expense.id);
    setEdit({ ...expense });
  }

  async function saveEdit() {
    await supabase
      .from('expenses')
      .update({
        amount: edit.amount,
        description: edit.description,
        expense_date: edit.expense_date
      })
      .eq('id', editingId);

    setEditingId(null);
    onChange();
  }

  async function deleteExpense(id) {
    if (!confirm('Delete this expense?')) return;
    await supabase.from('expenses').delete().eq('id', id);
    onChange();
  }

  return (
    <>
      <h3 className="text-2xl sm:text-1xl font-bold text-black-600 leading-tight">Expenses</h3>
      <div className="overflow-x-auto">
       <table className="min-w-full border text-sm">

      
        <thead>
          <tr>
            <th className="px-3 py-2 border bg-gray-50 text-left">
               Date
            </th>
            <th className="px-3 py-2 border bg-gray-50 text-left">
              Description
            </th>
            <th className="px-3 py-2 border bg-gray-50 text-left">
              Paid By 
            </th>
            <th className="px-3 py-2 border bg-gray-50 text-left">
              Amount
            </th>
            <th className="px-3 py-2 border bg-gray-50 text-left">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {expenses.map(e => (
            <tr key={e.id}>
              <td>
                {editingId === e.id ? (
                  <input
                    type="date"
                    value={edit.expense_date}
                    onChange={ev =>
                      setEdit({ ...edit, expense_date: ev.target.value })
                    }
                  />
                ) : (
                  e.expense_date
                )}
              </td>

              <td>
                {editingId === e.id ? (
                  <input
                    value={edit.description || ''}
                    onChange={ev =>
                      setEdit({ ...edit, description: ev.target.value })
                    }
                  />
                ) : (
                  e.description
                )}
              </td>

              <td>
                {participants.find(p => p.id === e.paid_by)?.name}
              </td>

              <td>
                {editingId === e.id ? (
                  <input
                    type="number"
                    value={edit.amount}
                    onChange={ev =>
                      setEdit({ ...edit, amount: Number(ev.target.value) })
                    }
                  />
                ) : (
                  `$${Number(e.amount).toFixed(2)}`
                )}
              </td>

              <td>
                {editingId === e.id ? (
                  <>
                    <button 
                     className="bg-blue-600 text-white px-4 py-2 rounded
                      hover:bg-blue-700 text-sm"

                     onClick={saveEdit}>Save</button>
                    <button
                     className="bg-blue-600 text-white px-4 py-2 rounded
                     hover:bg-blue-700 text-sm"

                     onClick={() => setEditingId(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button 
                     className="bg-blue-600 text-white px-4 py-2 rounded
                      hover:bg-blue-700 text-sm"

                   onClick={() => startEdit(e)}>Edit</button>
                    <button 
                     className="bg-red-500 text-white px-4 py-2 rounded
                     hover:bg-red-700 text-sm"

                    onClick={() => deleteExpense(e.id)}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
     </div> 
    </>
  );
}
