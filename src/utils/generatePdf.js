import { jsPDF } from 'jspdf'

// Generate a printable prescription PDF.
export function generatePrescriptionPdf(rx) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' })
  const W = doc.internal.pageSize.getWidth()
  let y = 56

  doc.setFillColor(10, 15, 36)
  doc.rect(0, 0, W, 90, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold'); doc.setFontSize(22)
  doc.text('MediCore Hospital', 40, 50)
  doc.setFont('helvetica', 'normal'); doc.setFontSize(10)
  doc.setTextColor(180, 200, 255)
  doc.text('Prescription / Rx', 40, 70)

  doc.setTextColor(20, 20, 20); y = 130
  const line = (label, val) => {
    doc.setFont('helvetica', 'bold'); doc.setFontSize(11); doc.text(label, 40, y)
    doc.setFont('helvetica', 'normal'); doc.text(String(val ?? '-'), 170, y); y += 22
  }
  line('Prescription ID', (rx.id || '').slice(0, 8))
  line('Date', new Date(rx.issued_at || Date.now()).toLocaleDateString())
  line('Patient', rx.patients?.full_name || rx.patientName || '-')
  line('Doctor', rx.doctors?.full_name || rx.doctorName || '-')
  line('Diagnosis', rx.diagnosis || '-')

  y += 8
  doc.setFont('helvetica', 'bold'); doc.setFontSize(13); doc.text('Medicines', 40, y); y += 8
  doc.setDrawColor(220); doc.line(40, y, W - 40, y); y += 22

  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('Medicine', 40, y); doc.text('Dosage', 240, y); doc.text('Frequency', 340, y); doc.text('Duration', 460, y); y += 6
  doc.line(40, y, W - 40, y); y += 18
  doc.setFont('helvetica', 'normal')
  ;(rx.medicines || []).forEach(m => {
    doc.text(String(m.name || '-'), 40, y)
    doc.text(String(m.dosage || '-'), 240, y)
    doc.text(String(m.frequency || '-'), 340, y)
    doc.text(String(m.duration || '-'), 460, y)
    y += 18
  })

  if (rx.advice) {
    y += 16; doc.setFont('helvetica', 'bold'); doc.text('Advice', 40, y); y += 16
    doc.setFont('helvetica', 'normal')
    doc.text(doc.splitTextToSize(rx.advice, W - 80), 40, y)
  }

  doc.setFontSize(9); doc.setTextColor(140)
  doc.text('This is a system-generated prescription.', 40, doc.internal.pageSize.getHeight() - 40)
  doc.save(`prescription-${(rx.id || 'rx').slice(0, 8)}.pdf`)
}
