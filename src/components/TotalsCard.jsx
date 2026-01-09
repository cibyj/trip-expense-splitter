export default function TotalsCard({ participants, expenses }) {
  const totals = {};

  participants.forEach(p => {
    totals[p.id] = 0;
  });

  expenses.forEach(e => {
    totals[e.paid_by] += Number(e.amount);
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {participants.map(p => (
        <div
          key={p.id}
          className="bg-gray-50 border rounded-lg p-4"
        >
          <div className="text-sm text-gray-500">
            {p.name}
          </div>
          <div className="text-xl font-semibold">
            ${totals[p.id].toFixed(2)}
          </div>
        </div>
      ))}
    </div>
  );
}
