import Papa from 'papaparse';

export function exportSettlementCSV(expenses, participants, settlements) {
  const rows = [];

  rows.push(['Expense Date', 'Description', 'Amount', 'Paid By']);

  expenses.forEach(e => {
    const payer = participants.find(p => p.id === e.paid_by)?.name || '';
    rows.push([
      e.expense_date,
      e.description,
      e.amount,
      payer
    ]);
  });

  rows.push([]);
  rows.push(['Settlement Summary']);

  settlements.forEach(s => {
    rows.push([`${s.from} pays ${s.to}`, s.amount]);
  });

  const csv = Papa.unparse(rows);

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'settlement-summary.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
