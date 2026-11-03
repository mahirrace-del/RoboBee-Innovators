"use client";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export interface ProcurementItem {
  id?: string;
  name: string;
  quantity: number | string;
  category?: string;
  source?: string;
  projectName?: string;
  notes?: string;
}

export interface ProcurementDocOptions {
  title?: string;
  requisitionId?: string;
  projectName?: string;
  studentName?: string;
  classGrade?: string;
  requestedBy?: string;
  purchaseDate?: string;
  notes?: string;
  items: ProcurementItem[];
}

/**
 * Loads an image from a URL or public path and converts to Base64 data URL
 */
async function getBase64ImageFromUrl(url: string): Promise<string | null> {
  if (typeof window === "undefined") return null;
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL("image/png"));
        } else {
          resolve(null);
        }
      } catch {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

/**
 * Generates and downloads a store-ready Parts Procurement PDF Requisition Slip.
 * STRICT REQUIREMENT: Does NOT display estimated prices, leaving blank lines/boxes
 * for manual pricing at the local electronics stores.
 */
export async function generateProcurementPDF(options: ProcurementDocOptions): Promise<void> {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
  const margin = 14;
  const contentWidth = pageWidth - margin * 2; // 182mm

  const todayStr =
    options.purchaseDate ||
    new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const reqId =
    options.requisitionId ||
    `RB-PROC-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

  // 1. Top Decorative Brand Bar (Burgundy #7A1C24 & Golden Yellow #D97706)
  doc.setFillColor(122, 28, 36); // #7A1C24 Burgundy
  doc.rect(0, 0, pageWidth, 6, "F");
  doc.setFillColor(217, 119, 6); // #D97706 Golden Yellow
  doc.rect(0, 6, pageWidth, 1.5, "F");

  let startY = 14;

  // 2. Try loading RoboBee Logo
  const logoData = await getBase64ImageFromUrl("/images/robobee-logo.png");
  if (logoData) {
    try {
      doc.addImage(logoData, "PNG", margin, startY, 22, 22);
    } catch {
      // Fallback: drawn badge
      drawLogoFallback(doc, margin, startY);
    }
  } else {
    drawLogoFallback(doc, margin, startY);
  }

  // 3. Organization Header Details
  const headerLeftX = margin + 26;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(122, 28, 36); // Burgundy
  doc.text("ROBOBEE INNOVATORS", headerLeftX, startY + 5);

  doc.setFont("helvetica", "italic");
  doc.setFontSize(8.5);
  doc.setTextColor(120, 105, 95);
  doc.text('"Dream. Invent. Experiment. Inspire."', headerLeftX, startY + 9.5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(70, 60, 55);
  doc.text("Maker Lab: Flat 2, 75 North Chashara, Narayanganj 1400, Bangladesh", headerLeftX, startY + 14);
  doc.text("Hotline / WhatsApp: +880 1902-821018  |  Web: robobee-seven.vercel.app", headerLeftX, startY + 18);

  // Document Badge (Right aligned)
  const badgeWidth = 62;
  const badgeX = pageWidth - margin - badgeWidth;
  doc.setFillColor(248, 246, 242);
  doc.setDrawColor(218, 208, 195);
  doc.roundedRect(badgeX, startY, badgeWidth, 20, 2, 2, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(122, 28, 36);
  doc.text("OFFICIAL PROCUREMENT SLIP", badgeX + badgeWidth / 2, startY + 5, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(60, 50, 45);
  doc.text(`Ref: ${reqId}`, badgeX + 4, startY + 10);
  doc.text(`Date: ${todayStr}`, badgeX + 4, startY + 14.5);
  doc.text(`Lead: Mahir Rahman`, badgeX + 4, startY + 18.5);

  startY += 26;

  // 4. Horizontal Separator Line
  doc.setDrawColor(220, 212, 200);
  doc.setLineWidth(0.4);
  doc.line(margin, startY, pageWidth - margin, startY);

  startY += 5;

  // 5. Metadata Information Box (2 Columns)
  doc.setFillColor(254, 252, 248);
  doc.setDrawColor(225, 218, 205);
  doc.roundedRect(margin, startY, contentWidth, 22, 2, 2, "FD");

  // Left Column: Project & Student Info
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(122, 28, 36);
  doc.text("TARGET PROJECT / PURPOSE:", margin + 4, startY + 5.5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(30, 25, 20);
  const projTitle = options.projectName || options.title || "RoboBee Maker Lab Prototyping";
  doc.text(projTitle.length > 48 ? projTitle.slice(0, 48) + "..." : projTitle, margin + 4, startY + 10);

  const studentDetails = [options.studentName, options.classGrade].filter(Boolean).join("  •  ");
  if (studentDetails) {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(7.5);
    doc.setTextColor(100, 90, 80);
    doc.text(`Student: ${studentDetails}`, margin + 4, startY + 14.5);
  }

  const requestedByText = options.requestedBy ? `Requested by: ${options.requestedBy}` : "Requisitioned by RoboBee Team";
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(120, 110, 100);
  doc.text(requestedByText, margin + 4, startY + 18.5);

  // Right Column: Store Instructions
  const col2X = margin + contentWidth / 2 + 6;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(180, 83, 9); // Amber
  doc.text("STORE / PROCUREMENT INSTRUCTIONS:", col2X, startY + 5.5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.2);
  doc.setTextColor(70, 60, 50);
  doc.text("• Check off [x] each item upon physical verification.", col2X, startY + 10);
  doc.text("• Write actual shop unit prices in the blank column.", col2X, startY + 14);
  doc.text("• Obtain counter signature/cash memo from vendor.", col2X, startY + 18);

  startY += 26;

  // 6. Procurement Table (NO ESTIMATED PRICES - BLANK PRICING COLUMNS FOR STORE USE)
  const tableData = options.items.map((item, idx) => {
    const qtyText = typeof item.quantity === "number" ? `${item.quantity} pcs` : `${item.quantity || 1} pcs`;
    const proj = item.projectName || options.projectName || "RoboBee Build";
    const categoryInfo = [item.category, item.source].filter(Boolean).join(" / ");

    return [
      String(idx + 1),
      "[   ]", // Checkbox for shop
      item.name,
      proj.length > 32 ? proj.slice(0, 32) + "..." : proj,
      categoryInfo || "Standard",
      qtyText,
      "", // Blank for Shop Unit Price
      "", // Blank for Actual Total Cost
      item.notes || "", // Blank / notes
    ];
  });

  autoTable(doc, {
    startY: startY,
    margin: { left: margin, right: margin },
    head: [
      [
        "#",
        "Check",
        "Component / Part Name & Specification",
        "Project / Purpose",
        "Category",
        "Qty",
        "Unit Price (BDT)",
        "Total (BDT)",
        "Store Notes",
      ],
    ],
    body: tableData,
    theme: "grid",
    headStyles: {
      fillColor: [122, 28, 36], // Burgundy #7A1C24
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 7.5,
      halign: "center",
      valign: "middle",
      cellPadding: 2,
    },
    bodyStyles: {
      textColor: [35, 30, 25],
      fontSize: 7.5,
      valign: "middle",
      cellPadding: 2.2,
      lineColor: [225, 218, 205],
      lineWidth: 0.25,
    },
    alternateRowStyles: {
      fillColor: [252, 250, 247],
    },
    columnStyles: {
      0: { cellWidth: 8, halign: "center" }, // #
      1: { cellWidth: 12, halign: "center", fontStyle: "bold", textColor: [122, 28, 36] }, // Check [ ]
      2: { cellWidth: 50, fontStyle: "bold" }, // Name
      3: { cellWidth: 32 }, // Project
      4: { cellWidth: 24, fontSize: 7 }, // Category
      5: { cellWidth: 14, halign: "center", fontStyle: "bold", textColor: [180, 83, 9] }, // Qty
      6: { cellWidth: 21, halign: "center" }, // Blank Unit Price
      7: { cellWidth: 21, halign: "center" }, // Blank Total
      8: { cellWidth: "auto" }, // Store Notes
    },
    didDrawCell: (data) => {
      // Draw faint dotted baseline inside blank pricing cells (columns 6 and 7) so shopkeeper can handwrite neatly
      if (data.section === "body" && (data.column.index === 6 || data.column.index === 7)) {
        const x = data.cell.x + 2;
        const y = data.cell.y + data.cell.height - 2.5;
        const w = data.cell.width - 4;
        doc.setDrawColor(200, 195, 185);
        doc.setLineWidth(0.2);
        doc.line(x, y, x + w, y);
      }
    },
  });

  // 7. Store Settlement & Verification Box
  const finalY = (doc as any).lastAutoTable?.finalY || startY + 60;
  let summaryY = finalY + 6;

  // Check if summary fits on this page, otherwise add a new page
  if (summaryY + 45 > doc.internal.pageSize.getHeight() - 15) {
    doc.addPage();
    summaryY = 20;
  }

  doc.setFillColor(248, 246, 242);
  doc.setDrawColor(218, 208, 195);
  doc.roundedRect(margin, summaryY, contentWidth, 36, 2, 2, "FD");

  // Summary lines (Left side)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(122, 28, 36);
  doc.text("LOCAL STORE RECEIPT & PURCHASE VERIFICATION:", margin + 4, summaryY + 5.5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(60, 50, 45);
  doc.text("Store / Vendor Name:  ____________________________________", margin + 4, summaryY + 12);
  doc.text("Market / Location:        ____________________________________", margin + 4, summaryY + 18);
  doc.text("Vendor Memo / Bill No:  ____________________________________", margin + 4, summaryY + 24);
  doc.text("Shopkeeper Signature:  ____________________________________", margin + 4, summaryY + 30);

  // Summary calculation boxes (Right side)
  const calcX = margin + contentWidth - 68;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(30, 25, 20);
  doc.text("Total Items Count: " + options.items.length + " item(s)", calcX, summaryY + 6);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.text("Subtotal Price (BDT):   __________________", calcX, summaryY + 13);
  doc.text("Discount / Adjustment: __________________", calcX, summaryY + 19);

  doc.setFont("helvetica", "bold");
  doc.setTextColor(122, 28, 36);
  doc.text("GRAND TOTAL PAID:    __________________ BDT", calcX, summaryY + 26);

  doc.setFont("helvetica", "italic");
  doc.setFontSize(7);
  doc.setTextColor(100, 90, 80);
  doc.text("Purchaser: Mahir Rahman (RoboBee Leader)", calcX, summaryY + 32);

  // 8. Footer on all pages
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.8);
    doc.setTextColor(140, 130, 120);

    doc.text(
      `RoboBee Innovators Official Document  •  Ref: ${reqId}  •  Generated: ${todayStr}`,
      margin,
      doc.internal.pageSize.getHeight() - 6
    );

    doc.text(
      `Page ${i} of ${pageCount}`,
      pageWidth - margin,
      doc.internal.pageSize.getHeight() - 6,
      { align: "right" }
    );
  }

  // 9. Save PDF file with clean filename
  const safeProjectSlug = (options.projectName || "procurement")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "_")
    .slice(0, 25);
  const fileName = `RoboBee_Procurement_${safeProjectSlug}_${todayStr.replace(/[\s,]+/g, "_")}.pdf`;

  doc.save(fileName);
}

function drawLogoFallback(doc: jsPDF, x: number, y: number) {
  doc.setFillColor(122, 28, 36); // Burgundy
  doc.roundedRect(x, y, 22, 22, 3, 3, "F");

  doc.setFillColor(245, 158, 11); // Golden yellow
  doc.circle(x + 11, y + 9.5, 4.5, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.setTextColor(255, 255, 255);
  doc.text("ROBO", x + 11, y + 17, { align: "center" });
  doc.text("BEE", x + 11, y + 20, { align: "center" });
}
