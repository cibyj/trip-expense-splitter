export default function Settlement({ participants, expenses }) {
  if (!participants.length) return null;

  const total = expenses.reduce((s, e) => s + Number(e.amount), 0);
  const share = total / participants.length;

  const balances = participants.map(p => ({
    name: p.name,
    balance:
      expenses
        .filter(e => e.paid_by === p.id)
        .reduce((s, e) => s + Number(e.amount), 0) - share
  }));

  const debtors = balances.filter(b => b.balance < 0);
  const creditors = balances.filter(b => b.balance > 0);
  const settlements = [];

  let i = 0, j = 0;
  while (i < debtors.length && j < creditors.length) {
    const amount = Math.min(-debtors[i].balance, creditors[j].balance);
    settlements.push({
      from: debtors[i].name,
      to: creditors[j].name,
      amount
    });
    debtors[i].balance += amount;
    creditors[j].balance -= amount;
    if (debtors[i].balance === 0) i++;
    if (creditors[j].balance === 0) j++;
  }

  return (
    <div>
      <h3 className="text-2xl sm:text-1xl font-bold text-black-600 leading-tight">Settlement</h3>
      <p>Total Expenses: ${total.toFixed(2)}</p>
      <ul>
        {settlements.map((s, i) => (
          <li key={i}>
            {s.from} owes {s.to} ${s.amount.toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  );
}
