import Papa from "papaparse";
import ExcelJS from "exceljs";
import { save } from "@tauri-apps/plugin-dialog";
import { writeTextFile, writeFile } from "@tauri-apps/plugin-fs";
import { clientService } from "./clientService";
import { invoiceService } from "./invoiceService";

export const exportService = {
  async exportClientsToCSV(userId: string): Promise<string | null> {
    try {
      const clients = await clientService.getAll(userId);
      const data = clients.map((c) => ({
        Name: c.name,
        Email: c.email || "",
        Phone: c.phone || "",
        Address: c.address || "",
        City: c.city || "",
        PostalCode: c.postal_code || "",
        Notes: c.notes || "",
      }));

      const csv = Papa.unparse(data);

      const filePath = await save({
        title: "Export Clients",
        defaultPath: `clients-${new Date().toISOString().split("T")[0]}.csv`,
        filters: [{ name: "CSV", extensions: ["csv"] }],
      });

      if (!filePath) return null;
      await writeTextFile(filePath, csv);
      return filePath;
    } catch (error) {
      console.error("Failed to export clients:", error);
      throw error;
    }
  },

  async exportInvoicesToExcel(userId: string): Promise<string | null> {
    try {
      const invoices = await invoiceService.getAll(userId);

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Invoices");

      worksheet.columns = [
        { header: "Invoice Number", key: "invoice_number", width: 25 },
        { header: "Client", key: "client_name", width: 30 },
        { header: "Issue Date", key: "issue_date", width: 15 },
        { header: "Due Date", key: "due_date", width: 15 },
        { header: "Status", key: "status", width: 12 },
        { header: "Template", key: "template", width: 12 },
        { header: "Currency", key: "currency", width: 10 },
        { header: "Subtotal", key: "subtotal", width: 15 },
        { header: "Discount", key: "discount_amount", width: 15 },
        { header: "Tax", key: "tax_amount", width: 15 },
        { header: "Shipping", key: "shipping_cost", width: 15 },
        { header: "Total", key: "total", width: 15 },
      ];

      invoices.forEach((inv) => {
        worksheet.addRow({
          invoice_number: inv.invoice_number,
          client_name: (inv as any).client_name || "",
          issue_date: inv.issue_date,
          due_date: inv.due_date,
          status: inv.status,
          template: inv.template,
          currency: inv.currency,
          subtotal: inv.subtotal,
          discount_amount: inv.discount_amount,
          tax_amount: inv.tax_amount,
          shipping_cost: inv.shipping_cost,
          total: inv.total,
        });
      });

      worksheet.getRow(1).font = { bold: true };

      const filePath = await save({
        title: "Export Invoices",
        defaultPath: `invoices-${new Date().toISOString().split("T")[0]}.xlsx`,
        filters: [{ name: "Excel", extensions: ["xlsx"] }],
      });

      if (!filePath) return null;

      const buffer = await workbook.xlsx.writeBuffer();
      await writeFile(filePath, new Uint8Array(buffer));
      return filePath;
    } catch (error) {
      console.error("Failed to export invoices:", error);
      throw error;
    }
  },
};