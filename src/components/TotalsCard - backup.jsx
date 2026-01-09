export default function TotalsCard({ participants, expenses }) {
  if (!participants.length) return null;

  const total = expenses.reduce((s, e) => s + Number(e.amount), 0);
  const share = total / participants.length;

  return (
    <>
      <h3>Per-Person Totals</h3>
      <table border="1" cellPadding="6">
        <thead>
          <tr>
            <th>Name</th>
            <th>Paid</th>
            <th>Share</th>
            <th>Balance</th>
          </tr>
        </thead>
        <tbody>
          {participants.map(p => {
            const paid = expenses
              .filter(e => e.paid_by === p.id)
              .reduce((s, e) => s + Number(e.amount), 0);

            const balance = paid - share;

            return (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>${paid.toFixed(2)}</td>
                <td>${share.toFixed(2)}</td>
                <td
                  style={{
                    color: balance < 0 ? 'red' : 'green'
                  }}
                >
                  {balance >= 0
                    ? `Gets $${balance.toFixed(2)}`
                    : `Owes $${(-balance).toFixed(2)}`}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}
