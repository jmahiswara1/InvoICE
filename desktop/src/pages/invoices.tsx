import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Plus,
  Eye,
  Trash2,
  MoreHorizontal,
  Send,
  CheckCircle,
  XCircle,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SearchInput } from "@/components/ui/search-input";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { InvoiceFormDialog } from "@/components/invoice/invoice-form-dialog";
import { DeleteDialog } from "@/components/ui/delete-dialog";
import { invoiceService } from "@/lib/invoiceService";
import { clientService } from "@/lib/clientService";
import { statusConfig, type InvoiceWithClient } from "@/lib/constants";
import { getLocalUserId } from "@/lib/userId";
import { useInvoiceStore } from "@/stores/invoiceStore";
import { useSettingsStore } from "@/stores/settingsStore";
import { t } from "@/i18n";
import type { Client, Invoice } from "@/types";

export function InvoicesPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [actionMenu, setActionMenu] = useState<number | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [error, setError] = useState<string | null>(null);

  const {
    invoices,
    isLoading,
    setInvoices,
    addInvoice,
    removeInvoice,
    updateInvoice,
    setLoading,
  } = useInvoiceStore();

  const userId = getLocalUserId();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (searchParams.get("action") === "new") {
      openForm();
      searchParams.delete("action");
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [invoicesData, clientsData] = await Promise.all([
        invoiceService.getAll(userId).catch(() => [] as Invoice[]),
        clientService.getAll(userId).catch(() => [] as Client[]),
      ]);
      setInvoices(invoicesData);
      setClients(clientsData);
    } catch (err) {
      console.error("Failed to load data:", err);
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
      setError(null);
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
    } catch (err) {
      console.error("Failed to create invoice:", err);
      setError("Failed to create invoice. Check console for details.");
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
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const handleDelete = async () => {
    if (!selectedInvoice) return;
    try {
      await invoiceService.delete(selectedInvoice.id);
      removeInvoice(selectedInvoice.id);
      setShowDelete(false);
      setSelectedInvoice(null);
    } catch (err) {
      console.error("Failed to delete invoice:", err);
    }
  };

  const openForm = async () => {
    try {
      setError(null);
      const userId = getLocalUserId();
      let number: string;
      try {
        number = await invoiceService.generateInvoiceNumber(userId);
      } catch {
        const year = new Date().getFullYear();
        const prefix = useSettingsStore.getState().invoicePrefix || "INV";
        number = `${prefix}/${year}/001`;
      }
      setInvoiceNumber(number);
      setShowForm(true);
    } catch (err) {
      console.error("Failed to open form:", err);
      setError("Failed to open invoice form.");
    }
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
      <PageHeader
        title={t("invoices.title")}
        subtitle={t("invoices.subtitle")}
        action={
          <Button className="gap-2" onClick={() => openForm()}>
            <Plus className="h-4 w-4" />
            {t("invoices.create")}
          </Button>
        }
      />

      {error && (
        <div className="border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="flex items-center gap-4">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder={t("invoices.search")}
        />

        <div className="flex items-center gap-2">
          {["all", "draft", "sent", "paid", "overdue"].map((status) => (
            <Button
              key={status}
              variant={statusFilter === status ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter(status)}
            >
              {status === "all"
                ? t("invoices.filters.all")
                : statusConfig[status]?.label || status}
            </Button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">
          {t("invoices.loading")}
        </div>
      ) : invoices.length === 0 ? (
        <Card>
          <CardContent className="p-0">
            <EmptyState
              icon={FileText}
              title={search || statusFilter !== "all" ? t("invoices.noMatch") : t("invoices.empty")}
              description={search || statusFilter !== "all" ? t("invoices.noMatchDesc") : t("invoices.emptyDesc")}
              action={
                !search && statusFilter === "all" ? (
                  <Button variant="outline" className="gap-2" onClick={() => openForm()}>
                    <Plus className="h-4 w-4" />
                    {t("invoices.create")}
                  </Button>
                ) : undefined
              }
            />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">
                    {t("invoices.table.invoice")}
                  </th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">
                    {t("invoices.table.client")}
                  </th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">
                    {t("invoices.table.date")}
                  </th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">
                    {t("invoices.table.dueDate")}
                  </th>
                  <th className="text-right text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">
                    {t("invoices.table.total")}
                  </th>
                  <th className="text-center text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">
                    {t("invoices.table.status")}
                  </th>
                  <th className="text-right text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">
                    {t("invoices.table.actions")}
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
                      {(invoice as InvoiceWithClient).client_name || "-"}
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
                                  {t("invoices.actions.markAsSent")}
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
                                  {t("invoices.actions.delete")}
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
                                  {t("invoices.actions.markAsPaid")}
                                </button>
                                <button
                                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-destructive hover:bg-muted"
                                  onClick={() =>
                                    handleStatusChange(invoice, "cancelled")
                                  }
                                >
                                  <XCircle className="h-3.5 w-3.5" />
                                  {t("invoices.actions.cancel")}
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
                                {t("invoices.actions.markAsPaid")}
                              </button>
                            )}
                            <button
                              className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-muted"
                              onClick={() => {
                                navigate(`/invoices/${invoice.id}/edit`);
                                setActionMenu(null);
                              }}
                            >
                              <Eye className="h-3.5 w-3.5" />
                              {t("invoices.actions.detail")}
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
        title="Hapus Invoice"
        itemName={selectedInvoice?.invoice_number || ""}
      />
    </div>
  );
}