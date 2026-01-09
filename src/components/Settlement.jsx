import { exportSettlementCSV } from '../utils/exportSettlement';
import { exportSettlementPDF } from '../utils/exportSettlementPdf';

export default function Settlement({ participants, expenses, tripName }) {
  if (!participants.length || !expenses.length) return null;

  // Total expenses
  const total = expenses.reduce(
    (sum, e) => sum + Number(e.amount),
    0
  );

  // Equal share per person
  const share = total / participants.length;

  // Calculate balances
  const balances = participants.map(p => {
    const paid = expenses
      .filter(e => e.paid_by === p.id)
      .reduce((sum, e) => sum + Number(e.amount), 0);

    return {
      name: p.name,
      balance: paid - share,
    };
  });

  // Separate debtors and creditors
  const debtors = balances
    .filter(b => b.balance < 0)
    .map(b => ({ ...b }));

  const creditors = balances
    .filter(b => b.balance > 0)
    .map(b => ({ ...b }));

  // Calculate exact settlements
  const settlements = [];
  let i = 0;
  let j = 0;

  while (i < debtors.length && j < creditors.length) {
    const amount = Math.min(
      -debtors[i].balance,
      creditors[j].balance
    );

    settlements.push({
      from: debtors[i].name,
      to: creditors[j].name,
      amount,
    });

    debtors[i].balance += amount;
    creditors[j].balance -= amount;

    if (Math.abs(debtors[i].balance) < 0.01) i++;
    if (Math.abs(creditors[j].balance) < 0.01) j++;
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        Settlement Summary
      </h3>

      <p className="text-sm text-gray-600 mb-4">
        Total expenses: <span className="font-medium">${total.toFixed(2)}</span> ·
        Each person owes{' '}
        <span className="font-medium">
          ${share.toFixed(2)}
        </span>
      </p>

      {settlements.length === 0 ? (
        <p className="text-sm text-gray-500">
          No settlements required.
        </p>
      ) : (
        <ul className="space-y-2 mb-4">
          {settlements.map((s, i) => (
            <li
              key={i}
              className="text-sm flex justify-between"
            >
              <span>
                <span className="font-medium">{s.from}</span> owes{' '}
                <span className="font-medium">{s.to}</span>
              </span>
              <span className="font-semibold">
                ${s.amount.toFixed(2)}
              </span>
            </li>
          ))}
        </ul>
      )}

      {/* Export buttons */}
      <div className="flex flex-wrap gap-3 mt-4">
        <button
          onClick={() =>
            exportSettlementCSV(expenses, participants, settlements)
          }
          className="px-4 py-2 text-sm bg-gray-800 text-white rounded hover:bg-gray-900"
        >
          Export CSV
        </button>

        <button
          onClick={() =>
            exportSettlementPDF(
              tripName || 'Trip Settlement',
              expenses,
              participants,
              settlements
            )
          }
          className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Download PDF
        </button>
      </div>
    </div>
  );
}
