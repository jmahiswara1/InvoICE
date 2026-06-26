import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
  MoreHorizontal,
  Send,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InvoiceFormDialog } from "@/components/invoice/invoice-form-dialog";
import { DeleteDialog } from "@/components/client/delete-dialog";
import { invoiceService } from "@/lib/invoiceService";
import { clientService } from "@/lib/clientService";
import { useInvoiceStore } from "@/stores/invoiceStore";
import type { Client, Invoice } from "@/types";

const statusConfig: Record<
  string,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  draft: { label: "Draft", variant: "secondary" },
  sent: { label: "Sent", variant: "default" },
  paid: { label: "Paid", variant: "outline" },
  overdue: { label: "Overdue", variant: "destructive" },
  cancelled: { label: "Cancelled", variant: "secondary" },
};

export function InvoicesPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [actionMenu, setActionMenu] = useState<number | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [invoiceNumber, setInvoiceNumber] = useState("");

  const {
    invoices,
    isLoading,
    setInvoices,
    addInvoice,
    removeInvoice,
    updateInvoice,
    setLoading,
  } = useInvoiceStore();

  const userId = "local-user";

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [invoicesData, clientsData] = await Promise.all([
        search
          ? invoiceService.search(userId, search)
          : statusFilter !== "all"
          ? invoiceService.getByStatus(userId, statusFilter)
          : invoiceService.getAll(userId),
        clientService.getAll(userId),
      ]);
      setInvoices(invoicesData);
      setClients(clientsData);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadData();
    }, 300);
    return () => clearTimeout(timer);
  }, [search, statusFilter]);

  const handleCreate = async (data: any) => {
    try {
      const newInvoice = await invoiceService.create({
        ...data,
        user_id: userId,
        status: "draft",
        is_recurring: 0,
      });

      for (let i = 0; i < data.items.length; i++) {
        const item = data.items[i];
        if (item.description && item.quantity && item.unit_price) {
          await invoiceService.createItem({
            invoice_id: newInvoice.id,
            description: item.description,
            quantity: item.quantity,
            unit_price: item.unit_price,
            sort_order: i,
          });
        }
      }

      await invoiceService.recalculateInvoice(newInvoice.id);
      const updatedInvoice = await invoiceService.getById(newInvoice.id);

      if (updatedInvoice) {
        addInvoice(updatedInvoice);
      }

      setShowForm(false);
    } catch (error) {
      console.error("Failed to create invoice:", error);
    }
  };

  const handleStatusChange = async (
    invoice: Invoice,
    newStatus: "sent" | "paid" | "cancelled"
  ) => {
    try {
      await invoiceService.updateStatus(invoice.id, newStatus);
      updateInvoice(invoice.id, { status: newStatus });
      setActionMenu(null);
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const handleDelete = async () => {
    if (!selectedInvoice) return;
    try {
      await invoiceService.delete(selectedInvoice.id);
      removeInvoice(selectedInvoice.id);
      setShowDelete(false);
      setSelectedInvoice(null);
    } catch (error) {
      console.error("Failed to delete invoice:", error);
    }
  };

  const openForm = async () => {
    const number = await invoiceService.generateInvoiceNumber(userId);
    setInvoiceNumber(number);
    setShowForm(true);
  };

  const formatCurrency = (amount: number, currency = "IDR") => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Invoices</h1>
          <p className="text-muted-foreground">Kelola invoice Anda.</p>
        </div>
        <Button className="gap-2" onClick={openForm}>
          <Plus className="h-4 w-4" />
          Buat Invoice
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 flex-1 max-w-sm border px-3 py-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari invoice..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>

        <div className="flex items-center gap-2">
          {["all", "draft", "sent", "paid", "overdue"].map((status) => (
            <Button
              key={status}
              variant={statusFilter === status ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter(status)}
            >
              {status === "all"
                ? "Semua"
                : statusConfig[status]?.label || status}
            </Button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">
          Memuat data...
        </div>
      ) : invoices.length === 0 ? (
        <Card>
          <CardContent className="p-0">
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {search || statusFilter !== "all"
                  ? "Tidak ada invoice yang cocok"
                  : "Belum ada invoice"}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {search || statusFilter !== "all"
                  ? "Coba filter atau kata kunci lain"
                  : "Buat invoice pertama Anda untuk memulai."}
              </p>
              {!search && statusFilter === "all" && (
                <Button variant="outline" className="mt-4 gap-2" onClick={openForm}>
                  <Plus className="h-4 w-4" />
                  Buat Invoice
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">
                    Invoice
                  </th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">
                    Client
                  </th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">
                    Tanggal
                  </th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">
                    Jatuh Tempo
                  </th>
                  <th className="text-right text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">
                    Total
                  </th>
                  <th className="text-center text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">
                    Status
                  </th>
                  <th className="text-right text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr
                    key={invoice.id}
                    className="border-b last:border-b-0 hover:bg-muted/50"
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium text-sm font-mono">
                        {invoice.invoice_number}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {(invoice as any).client_name || "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {invoice.issue_date}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {invoice.due_date}
                    </td>
                    <td className="px-4 py-3 text-sm text-right font-mono">
                      {formatCurrency(invoice.total, invoice.currency)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge variant={statusConfig[invoice.status]?.variant}>
                        {statusConfig[invoice.status]?.label}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="relative inline-block">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            setActionMenu(
                              actionMenu === invoice.id ? null : invoice.id
                            )
                          }
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                        {actionMenu === invoice.id && (
                          <div className="absolute right-0 top-full mt-1 bg-background border shadow-md z-10 w-44">
                            {invoice.status === "draft" && (
                              <>
                                <button
                                  className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-muted"
                                  onClick={() =>
                                    handleStatusChange(invoice, "sent")
                                  }
                                >
                                  <Send className="h-3.5 w-3.5" />
                                  Mark as Sent
                                </button>
                                <button
                                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-destructive hover:bg-muted"
                                  onClick={() => {
                                    setSelectedInvoice(invoice);
                                    setShowDelete(true);
                                    setActionMenu(null);
                                  }}
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                  Hapus
                                </button>
                              </>
                            )}
                            {invoice.status === "sent" && (
                              <>
                                <button
                                  className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-muted"
                                  onClick={() =>
                                    handleStatusChange(invoice, "paid")
                                  }
                                >
                                  <CheckCircle className="h-3.5 w-3.5" />
                                  Mark as Paid
                                </button>
                                <button
                                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-destructive hover:bg-muted"
                                  onClick={() =>
                                    handleStatusChange(invoice, "cancelled")
                                  }
                                >
                                  <XCircle className="h-3.5 w-3.5" />
                                  Cancel
                                </button>
                              </>
                            )}
                            {invoice.status === "overdue" && (
                              <button
                                className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-muted"
                                onClick={() =>
                                  handleStatusChange(invoice, "paid")
                                }
                              >
                                <CheckCircle className="h-3.5 w-3.5" />
                                Mark as Paid
                              </button>
                            )}
                            <button
                              className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-muted"
                              onClick={() => setActionMenu(null)}
                            >
                              <Eye className="h-3.5 w-3.5" />
                              Detail
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      <InvoiceFormDialog
        open={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={handleCreate}
        clients={clients}
        invoiceNumber={invoiceNumber}
      />

      <DeleteDialog
        open={showDelete}
        onClose={() => {
          setShowDelete(false);
          setSelectedInvoice(null);
        }}
        onConfirm={handleDelete}
        clientName={selectedInvoice?.invoice_number || ""}
      />
    </div>
  );
}
