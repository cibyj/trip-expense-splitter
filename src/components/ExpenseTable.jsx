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
        expense_date: edit.expense_date,
        paid_by: edit.paid_by   // ✅ added
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
      <h3 className="text-2xl sm:text-xl font-bold text-black leading-tight mb-2">
        Expenses
      </h3>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 text-sm">

          <thead>
            <tr>
              <th className="px-3 py-2 border border-gray-300 bg-gray-50 text-left">Date</th>
              <th className="px-3 py-2 border border-gray-300 bg-gray-50 text-left">Description</th>
              <th className="px-3 py-2 border border-gray-300 bg-gray-50 text-left">Paid By</th>
              <th className="px-3 py-2 border border-gray-300 bg-gray-50 text-left">Amount</th>
              <th className="px-3 py-2 border border-gray-300 bg-gray-50 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {expenses.map(e => {
              const isEditing = editingId === e.id;

              return (
                <tr key={e.id} className={isEditing ? 'bg-blue-50' : ''}>

                  {/* Date */}
                  <td className="px-3 py-2 border border-gray-300">
                    {isEditing ? (
                      <input
                        type="date"
                        value={edit.expense_date}
                        onChange={ev =>
                          setEdit({ ...edit, expense_date: ev.target.value })
                        }
                        className="w-full border rounded px-2 py-1 text-sm"
                      />
                    ) : (
                      e.expense_date
                    )}
                  </td>

                  {/* Description */}
                  <td className="px-3 py-2 border border-gray-300">
                    {isEditing ? (
                      <input
                        value={edit.description || ''}
                        onChange={ev =>
                          setEdit({ ...edit, description: ev.target.value })
                        }
                        className="w-full border rounded px-2 py-1 text-sm"
                      />
                    ) : (
                      e.description
                    )}
                  </td>

                  {/* Paid By */}
                  <td className="px-3 py-2 border border-gray-300">
                    {isEditing ? (
                      <select
                        value={edit.paid_by}
                        onChange={ev =>
                          setEdit({ ...edit, paid_by: ev.target.value })
                        }
                        className="w-full border rounded px-2 py-1 text-sm"
                      >
                        {participants.map(p => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      participants.find(p => p.id === e.paid_by)?.name
                    )}
                  </td>

                  {/* Amount */}
                  <td className="px-3 py-2 border border-gray-300">
                    {isEditing ? (
                      <input
                        type="number"
                        value={edit.amount}
                        onChange={ev =>
                          setEdit({ ...edit, amount: Number(ev.target.value) })
                        }
                        className="w-full border rounded px-2 py-1 text-sm"
                      />
                    ) : (
                      `$${Number(e.amount).toFixed(2)}`
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-3 py-2 border border-gray-300 whitespace-nowrap">
                    {isEditing ? (
                      <div className="flex gap-2">
                        <button
                          className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                          onClick={saveEdit}
                        >
                          Save
                        </button>
                        <button
                          className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600"
                          onClick={() => setEditingId(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                          onClick={() => startEdit(e)}
                        >
                          Edit
                        </button>
                        <button
                          className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                          onClick={() => deleteExpense(e.id)}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>

                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
