import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export function exportSettlementPDF(tripName, expenses, participants, settlements) {
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text(tripName, 14, 15);

  autoTable(doc, {
    startY: 25,
    head: [['Date', 'Description', 'Amount', 'Paid By']],
    body: expenses.map(e => [
      e.expense_date,
      e.description,
      `$${e.amount.toFixed(2)}`,
      participants.find(p => p.id === e.paid_by)?.name || ''
    ]),
  });

  const finalY = doc.lastAutoTable.finalY + 10;

  doc.setFontSize(14);
  doc.text('Settlement Summary', 14, finalY);

  autoTable(doc, {
    startY: finalY + 5,
    head: [['From', 'To', 'Amount']],
    body: settlements.map(s => [
      s.from,
      s.to,
      `$${s.amount.toFixed(2)}`
    ]),
  });

  doc.save('settlement-summary.pdf');
}
