import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateInvoicePDF = (
  userName: string,
  userEmail: string,
  transactionId: string,
  date: string,
  description: string,
  amount: string,
  status: string
) => {
  const doc = new jsPDF();
  
  // Custom font styling
  doc.setFont('helvetica', 'normal');
  
  // Header section
  doc.setFillColor(15, 23, 42); // Navy blue bg
  doc.rect(0, 0, 210, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('FACTURE', 20, 25);
  
  // Logo placeholder text
  doc.setFontSize(16);
  doc.setTextColor(212, 176, 105); // Gold
  doc.text('JKK ETOILE', 140, 25);

  // Reset text color
  doc.setTextColor(15, 23, 42);
  
  // Invoice Info
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Détails de la Facture', 20, 60);
  
  doc.setFont('helvetica', 'normal');
  doc.text(`N° de transaction: ${transactionId}`, 20, 70);
  doc.text(`Date: ${date}`, 20, 77);
  doc.text(`Statut: ${status}`, 20, 84);

  // User Info
  doc.setFont('helvetica', 'bold');
  doc.text('Facturé à', 140, 60);
  
  doc.setFont('helvetica', 'normal');
  doc.text(`${userName}`, 140, 70);
  doc.text(`${userEmail}`, 140, 77);

  // Line separator
  doc.setDrawColor(212, 176, 105);
  doc.setLineWidth(0.5);
  doc.line(20, 100, 190, 100);

  // Table
  autoTable(doc, {
    startY: 110,
    head: [['Description', 'Quantité', 'Montant']],
    body: [
      [description, '1', amount],
    ],
    theme: 'grid',
    headStyles: {
      fillColor: [15, 23, 42],
      textColor: 255,
      halign: 'center',
    },
    styles: {
      halign: 'center',
      font: 'helvetica',
      textColor: [15, 23, 42]
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    }
  });

  // Total
  const finalY = (doc as any).lastAutoTable.finalY || 150;
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(`Total Payé: ${amount}`, 140, finalY + 20);

  // Footer
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text('Merci de votre confiance.', 105, 280, { align: 'center' });
  doc.text('JKK Etoile Services - www.jkketoile.com', 105, 285, { align: 'center' });

  // Save PDF
  doc.save(`Facture_${transactionId}.pdf`);
};
