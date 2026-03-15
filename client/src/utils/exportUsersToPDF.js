import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const exportUsersToPDF = (users, exportedBy = "Admin") => {
  const doc = new jsPDF();

  const dateStr = new Date().toLocaleString();

  // === Top right date ===
  doc.setFontSize(10);
  doc.setTextColor(130); // gray
  doc.text(`${dateStr}`, doc.internal.pageSize.getWidth() - 14, 10, { align: 'right' });

  // === Title centered below date ===
  doc.setFontSize(18);
  doc.setTextColor(0); // black
  doc.text("Users Report", 14, 30);

  // === Table ===
  autoTable(doc, {
    startY: 40,
    head: [['Name', 'Email', 'Role', 'Created At', 'Updated At']],
    body: users.map(user => [
      user.name,
      user.email,
      user.role,
      new Date(user.createdAt).toLocaleString(),
      new Date(user.updatedAt).toLocaleString()
    ]),
    styles: {
      fontSize: 10,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [0, 191, 255],
      textColor: 255,
      fontStyle: 'bold',
      halign: 'center',
    },
    alternateRowStyles: {
      fillColor: [245, 250, 255],
    },
  });

  // === Bottom left "exported by" ===
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setFontSize(10);
  doc.setTextColor(130);
  doc.text(`Exported by: ${exportedBy}`, 14, pageHeight - 10);

  doc.save('users-report.pdf');
};
