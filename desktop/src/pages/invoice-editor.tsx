import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Download,
  Save,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { TemplateTabs } from "@/components/invoice/template-tabs";
import { MinimalisTemplate } from "@/templates/minimalis";
import { ProfesionalTemplate } from "@/templates/profesional";
import { KreatifTemplate } from "@/templates/kreatif";
import {
  buildInvoiceTemplateData,
  formatCurrency,
  formatDate,
  type InvoiceFormData,
} from "@/templates/types";
import { invoiceService } from "@/lib/invoiceService";
import { clientService } from "@/lib/clientService";
import { useSettingsStore } from "@/stores/settingsStore";
import { t } from "@/i18n";
import type { Client, Invoice } from "@/types";

export function InvoiceEditorPage() {
  const navigate = useNavigate();
  const params = useParams();
  const editId = params.id ? Number(params.id) : null;

  const [clients, setClients] = useState<Client[]>([]);
  const [activeTab, setActiveTab] = useState<"form" | "preview">("form");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const today = new Date().toISOString().split("T")[0];
  const dueDate = new Date(Date.now() + 30 * 86400000)
    .toISOString()
    .split("T")[0];

  const [form, setForm] = useState<InvoiceFormData>({
    client_id: 0,
    invoice_number: "",
    template: "minimalis",
    issue_date: today,
    due_date: dueDate,
    currency: "IDR",
    tax_enabled: true,
    tax_rate: 11,
    discount_type: "none",
    discount_value: 0,
    shipping_cost: 0,
    notes: "",
    terms: "",
    items: [{ description: "", quantity: 1, unit_price: 0 }],
  });

  const {
    businessName,
    businessAddress,
    businessEmail,
    businessPhone,
    currency: defaultCurrency,
  } = useSettingsStore();

  useEffect(() => {
    if (defaultCurrency && !editId) {
      setForm((prev) => ({ ...prev, currency: defaultCurrency }));
    }
  }, [defaultCurrency, editId]);

  useEffect(() => {
    initEditor();
  }, []);

  const initEditor = async () => {
    setIsLoading(true);
    setError(null);
    const userId = "local-user";
    try {
      const clientsData = await clientService.getAll(userId).catch(() => []);
      setClients(clientsData);

      if (editId) {
        const invoice = await invoiceService.getById(editId);
        if (invoice) {
          const items = await invoiceService.getItems(editId);
          setForm({
            client_id: invoice.client_id,
            invoice_number: invoice.invoice_number,
            template: invoice.template as any,
            issue_date: invoice.issue_date,
            due_date: invoice.due_date,
            currency: invoice.currency,
            tax_enabled: invoice.tax_enabled === 1,
            tax_rate: invoice.tax_rate,
            discount_type: invoice.discount_type as any,
            discount_value: invoice.discount_value,
            shipping_cost: invoice.shipping_cost,
            notes: invoice.notes || "",
            terms: invoice.terms || "",
            items: items.length > 0
              ? items.map((i) => ({
                  description: i.description,
                  quantity: i.quantity,
                  unit_price: i.unit_price,
                }))
              : [{ description: "", quantity: 1, unit_price: 0 }],
          });
        }
      } else {
        try {
          const num = await invoiceService.generateInvoiceNumber(userId);
          setForm((prev) => ({
            ...prev,
            invoice_number: num,
            client_id: clientsData[0]?.id || 0,
          }));
        } catch {
          const year = new Date().getFullYear();
          setForm((prev) => ({
            ...prev,
            invoice_number: `INV/APP/${year}/001`,
            client_id: clientsData[0]?.id || 0,
          }));
        }
      }
    } catch (err) {
      console.error("Failed to init editor:", err);
      setError("Failed to initialize editor");
    } finally {
      setIsLoading(false);
    }
  };

  const selectedClient = useMemo(
    () => clients.find((c) => c.id === form.client_id) || null,
    [clients, form.client_id]
  );

  const previewData = useMemo(
    () =>
      buildInvoiceTemplateData(
        form,
        selectedClient,
        {
          name: businessName || "My Business",
          address: businessAddress || null,
          email: businessEmail || null,
          phone: businessPhone || null,
        }
      ),
    [form, selectedClient, businessName, businessAddress, businessEmail, businessPhone]
  );

  const subtotal = form.items.reduce(
    (sum, item) => sum + item.quantity * item.unit_price,
    0
  );
  let discountAmount = 0;
  if (form.discount_type === "percentage") {
    discountAmount = (subtotal * form.discount_value) / 100;
  } else if (form.discount_type === "fixed") {
    discountAmount = form.discount_value;
  }
  const afterDiscount = subtotal - discountAmount;
  const taxAmount = form.tax_enabled
    ? (afterDiscount * form.tax_rate) / 100
    : 0;
  const total = afterDiscount + taxAmount + form.shipping_cost;

  const updateItem = (index: number, field: string, value: string | number) => {
    const newItems = [...form.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setForm({ ...form, items: newItems });
  };

  const addItem = () => {
    setForm({
      ...form,
      items: [...form.items, { description: "", quantity: 1, unit_price: 0 }],
    });
  };

  const removeItem = (index: number) => {
    if (form.items.length <= 1) return;
    setForm({ ...form, items: form.items.filter((_, i) => i !== index) });
  };

  const handleSave = async (markAsSent = false) => {
    setError(null);
    const userId = "local-user";
    try {
      if (editId) {
        await invoiceService.delete(editId);
      }

      const newInvoice = await invoiceService.create({
        user_id: userId,
        client_id: form.client_id,
        invoice_number: form.invoice_number,
        status: markAsSent ? "sent" : "draft",
        template: form.template,
        issue_date: form.issue_date,
        due_date: form.due_date,
        currency: form.currency,
        exchange_rate: 1,
        discount_type: form.discount_type,
        discount_value: form.discount_value,
        tax_enabled: form.tax_enabled ? 1 : 0,
        tax_rate: form.tax_rate,
        shipping_cost: form.shipping_cost,
        notes: form.notes,
        terms: form.terms,
        is_recurring: 0,
        recurring_interval: null,
        recurring_next_date: null,
      });

      for (let i = 0; i < form.items.length; i++) {
        const item = form.items[i];
        if (item.description) {
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

      if (markAsSent) {
        await invoiceService.updateStatus(newInvoice.id, "sent");
      }

      navigate("/invoices");
    } catch (err) {
      console.error("Failed to save invoice:", err);
      setError("Failed to save invoice");
    }
  };

  const formatAmt = (amount: number) =>
    formatCurrency(amount, form.currency);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Loading editor...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full -m-6">
      {/* Top Bar */}
      <div className="h-14 flex items-center justify-between px-4 border-b bg-card shrink-0">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/invoices")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-sm font-semibold">
            {editId ? t("invoices.form.title") : t("invoices.form.title")}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <PDFDownloadLink
            document={
              form.template === "minimalis" ? (
                <MinimalisTemplate data={previewData} />
              ) : form.template === "profesional" ? (
                <ProfesionalTemplate data={previewData} />
              ) : (
                <KreatifTemplate data={previewData} />
              )
            }
            fileName={`${form.invoice_number || "invoice"}.pdf`}
          >
            {({ loading }) => (
              <Button variant="outline" size="sm" className="gap-2" disabled={loading}>
                <Download className="h-4 w-4" />
                {loading ? "Generating..." : "Download PDF"}
              </Button>
            )}
          </PDFDownloadLink>
          <Button variant="outline" size="sm" className="gap-2" onClick={() => handleSave(false)}>
            <Save className="h-4 w-4" />
            {t("invoices.form.save")}
          </Button>
          <Button size="sm" className="gap-2" onClick={() => handleSave(true)}>
            <Send className="h-4 w-4" />
            Save & Send
          </Button>
        </div>
      </div>

      {error && (
        <div className="border-b border-destructive/50 bg-destructive/10 px-4 py-2 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Mobile tab switch */}
      <div className="flex border-b lg:hidden">
        <button
          className={`flex-1 py-2 text-sm font-medium ${activeTab === "form" ? "border-b-2 border-foreground text-foreground" : "text-muted-foreground"}`}
          onClick={() => setActiveTab("form")}
        >
          Form
        </button>
        <button
          className={`flex-1 py-2 text-sm font-medium ${activeTab === "preview" ? "border-b-2 border-foreground text-foreground" : "text-muted-foreground"}`}
          onClick={() => setActiveTab("preview")}
        >
          Preview
        </button>
      </div>

      {/* Main Content - Split View */}
      <div className="flex-1 flex overflow-hidden">
        {/* Form Side */}
        <div className={`${activeTab === "form" ? "block" : "hidden"} lg:block w-full lg:w-1/2 overflow-auto p-6 border-r`}>
          <div className="space-y-6 max-w-xl mx-auto">
            {/* Client & Invoice Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {t("invoices.form.client")} *
                </label>
                <select
                  value={form.client_id}
                  onChange={(e) => setForm({ ...form, client_id: Number(e.target.value) })}
                  className="w-full mt-1 px-3 py-2 border bg-transparent text-sm outline-none focus:border-foreground"
                >
                  <option value={0}>{t("invoices.form.selectClient")}</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {t("invoices.form.invoiceNumber")}
                </label>
                <input
                  type="text"
                  value={form.invoice_number}
                  readOnly
                  className="w-full mt-1 px-3 py-2 border bg-muted text-sm outline-none font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {t("invoices.form.template")}
                </label>
                <select
                  value={form.template}
                  onChange={(e) => setForm({ ...form, template: e.target.value as any })}
                  className="w-full mt-1 px-3 py-2 border bg-transparent text-sm outline-none focus:border-foreground"
                >
                  <option value="minimalis">{t("templates.minimalis")}</option>
                  <option value="profesional">{t("templates.profesional")}</option>
                  <option value="kreatif">{t("templates.kreatif")}</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {t("invoices.form.date")} *
                </label>
                <input
                  type="date"
                  value={form.issue_date}
                  onChange={(e) => setForm({ ...form, issue_date: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border bg-transparent text-sm outline-none focus:border-foreground"
                />
              </div>
              <div>
                <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {t("invoices.form.dueDate")} *
                </label>
                <input
                  type="date"
                  value={form.due_date}
                  onChange={(e) => setForm({ ...form, due_date: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border bg-transparent text-sm outline-none focus:border-foreground"
                />
              </div>
            </div>

            {/* Items */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {t("invoices.form.items")}
                </h3>
                <Button type="button" variant="outline" size="sm" onClick={addItem}>
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  {t("invoices.form.addItem")}
                </Button>
              </div>
              <div className="space-y-2">
                {form.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-[1fr_70px_100px_90px_32px] gap-2 items-center">
                    <input
                      type="text"
                      placeholder={t("invoices.form.description")}
                      value={item.description}
                      onChange={(e) => updateItem(index, "description", e.target.value)}
                      className="px-2 py-1.5 border bg-transparent text-sm outline-none focus:border-foreground"
                    />
                    <input
                      type="number"
                      placeholder="Qty"
                      value={item.quantity || ""}
                      onChange={(e) => updateItem(index, "quantity", Number(e.target.value))}
                      min={1}
                      className="px-2 py-1.5 border bg-transparent text-sm outline-none text-right focus:border-foreground"
                    />
                    <input
                      type="number"
                      placeholder="Price"
                      value={item.unit_price || ""}
                      onChange={(e) => updateItem(index, "unit_price", Number(e.target.value))}
                      min={0}
                      className="px-2 py-1.5 border bg-transparent text-sm outline-none text-right focus:border-foreground"
                    />
                    <div className="px-2 py-1.5 text-sm text-right bg-muted font-mono">
                      {formatAmt(item.quantity * item.unit_price)}
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(index)}
                      disabled={form.items.length <= 1}
                      className="h-7 w-7"
                    >
                      <Trash2 className="h-3.5 w-3.5 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="space-y-2 border-t pt-4">
              <div className="flex items-center gap-2">
                <select
                  value={form.discount_type}
                  onChange={(e) => setForm({ ...form, discount_type: e.target.value as any })}
                  className="px-2 py-1 border bg-transparent text-xs outline-none"
                >
                  <option value="none">{t("invoices.form.noDiscount")}</option>
                  <option value="percentage">{t("invoices.form.discountPercent")}</option>
                  <option value="fixed">{t("invoices.form.discountFixed")}</option>
                </select>
                {form.discount_type !== "none" && (
                  <input
                    type="number"
                    value={form.discount_value || ""}
                    onChange={(e) => setForm({ ...form, discount_value: Number(e.target.value) })}
                    min={0}
                    className="w-24 px-2 py-1 border bg-transparent text-xs outline-none text-right"
                  />
                )}
                <span className="text-sm ml-auto font-mono">-{formatAmt(discountAmount)}</span>
              </div>

              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.tax_enabled}
                    onChange={(e) => setForm({ ...form, tax_enabled: e.target.checked })}
                    className="accent-foreground"
                  />
                  {t("invoices.form.tax")}
                </label>
                {form.tax_enabled && (
                  <input
                    type="number"
                    value={form.tax_rate}
                    onChange={(e) => setForm({ ...form, tax_rate: Number(e.target.value) })}
                    min={0}
                    max={100}
                    className="w-16 px-2 py-1 border bg-transparent text-xs outline-none text-right"
                  />
                )}
                {form.tax_enabled && <span className="text-xs text-muted-foreground">%</span>}
                <span className="text-sm ml-auto font-mono">+{formatAmt(taxAmount)}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{t("invoices.form.shipping")}</span>
                <input
                  type="number"
                  value={form.shipping_cost || ""}
                  onChange={(e) => setForm({ ...form, shipping_cost: Number(e.target.value) })}
                  min={0}
                  className="w-28 px-2 py-1 border bg-transparent text-xs outline-none text-right ml-auto"
                />
              </div>

              <div className="border-t pt-2 flex justify-between">
                <span className="font-semibold">{t("invoices.form.total")}</span>
                <span className="font-bold font-mono text-lg">{formatAmt(total)}</span>
              </div>
            </div>

            {/* Notes & Terms */}
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {t("invoices.form.notes")}
                </label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder={t("invoices.form.notesPlaceholder")}
                  rows={2}
                  className="w-full mt-1 px-3 py-2 border bg-transparent text-sm outline-none resize-none focus:border-foreground"
                />
              </div>
              <div>
                <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {t("invoices.form.terms")}
                </label>
                <textarea
                  value={form.terms}
                  onChange={(e) => setForm({ ...form, terms: e.target.value })}
                  placeholder={t("invoices.form.termsPlaceholder")}
                  rows={2}
                  className="w-full mt-1 px-3 py-2 border bg-transparent text-sm outline-none resize-none focus:border-foreground"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Preview Side */}
        <div className={`${activeTab === "preview" ? "block" : "hidden"} lg:block w-full lg:w-1/2 overflow-auto bg-muted/30`}>
          <div className="sticky top-0 z-10 bg-background border-b">
            <TemplateTabs value={form.template} onChange={(tpl) => setForm({ ...form, template: tpl })} />
          </div>
          <div className="p-6">
            <PDFViewer width="100%" height={800} showToolbar={false}>
              {form.template === "minimalis" ? (
                <MinimalisTemplate data={previewData} />
              ) : form.template === "profesional" ? (
                <ProfesionalTemplate data={previewData} />
              ) : (
                <KreatifTemplate data={previewData} />
              )}
            </PDFViewer>
          </div>
        </div>
      </div>
    </div>
  );
}