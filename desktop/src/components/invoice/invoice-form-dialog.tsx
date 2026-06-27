import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X, Plus, Trash2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Client } from "@/types";

interface InvoiceItemForm {
  description: string;
  quantity: number;
  unit_price: number;
}

export interface InvoiceFormData {
  client_id: number;
  invoice_number: string;
  template: "minimalis" | "profesional" | "kreatif";
  issue_date: string;
  due_date: string;
  currency: string;
  tax_enabled: boolean;
  tax_rate: number;
  discount_type: "none" | "percentage" | "fixed";
  discount_value: number;
  shipping_cost: number;
  notes: string;
  terms: string;
  items: InvoiceItemForm[];
}

interface InvoiceFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: InvoiceFormData) => void;
  clients: Client[];
  invoiceNumber: string;
}

export function InvoiceFormDialog({
  open,
  onClose,
  onSubmit,
  clients,
  invoiceNumber,
}: InvoiceFormDialogProps) {
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];
  const dueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  const [form, setForm] = useState<InvoiceFormData>({
    client_id: 0,
    invoice_number: invoiceNumber,
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

  useEffect(() => {
    if (open) {
      setForm((prev) => ({
        ...prev,
        invoice_number: invoiceNumber,
        client_id: clients[0]?.id || 0,
      }));
    }
  }, [open, invoiceNumber, clients]);

  if (!open) return null;

  const updateItem = (
    index: number,
    field: keyof InvoiceItemForm,
    value: string | number
  ) => {
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
    setForm({
      ...form,
      items: form.items.filter((_, i) => i !== index),
    });
  };

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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: form.currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-background border w-full max-w-3xl max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-background z-10">
          <h2 className="text-lg font-semibold">Buat Invoice</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">
                Client <span className="text-destructive">*</span>
              </label>
              <select
                value={form.client_id}
                onChange={(e) =>
                  setForm({ ...form, client_id: Number(e.target.value) })
                }
                required
                className="w-full mt-1 px-3 py-2 border bg-transparent text-sm outline-none focus:border-foreground"
              >
                <option value={0}>Pilih client</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Invoice Number</label>
              <input
                type="text"
                value={form.invoice_number}
                readOnly
                className="w-full mt-1 px-3 py-2 border bg-muted text-sm outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Template</label>
              <select
                value={form.template}
                onChange={(e) =>
                  setForm({
                    ...form,
                    template: e.target.value as "minimalis" | "profesional" | "kreatif",
                  })
                }
                className="w-full mt-1 px-3 py-2 border bg-transparent text-sm outline-none focus:border-foreground"
              >
                <option value="minimalis">Minimalis</option>
                <option value="profesional">Profesional</option>
                <option value="kreatif">Kreatif</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">
                Tanggal <span className="text-destructive">*</span>
              </label>
              <input
                type="date"
                value={form.issue_date}
                onChange={(e) =>
                  setForm({ ...form, issue_date: e.target.value })
                }
                required
                className="w-full mt-1 px-3 py-2 border bg-transparent text-sm outline-none focus:border-foreground"
              />
            </div>
            <div>
              <label className="text-sm font-medium">
                Jatuh Tempo <span className="text-destructive">*</span>
              </label>
              <input
                type="date"
                value={form.due_date}
                onChange={(e) => setForm({ ...form, due_date: e.target.value })}
                required
                className="w-full mt-1 px-3 py-2 border bg-transparent text-sm outline-none focus:border-foreground"
              />
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold">Items</h3>
              <Button type="button" variant="outline" size="sm" onClick={addItem}>
                <Plus className="h-3.5 w-3.5 mr-1" />
                Tambah Item
              </Button>
            </div>

            <div className="space-y-2">
              {form.items.map((item, index) => (
                <div key={index} className="grid grid-cols-[1fr_100px_120px_120px_36px] gap-2 items-start">
                  <input
                    type="text"
                    placeholder="Deskripsi item"
                    value={item.description}
                    onChange={(e) =>
                      updateItem(index, "description", e.target.value)
                    }
                    required
                    className="px-3 py-2 border bg-transparent text-sm outline-none focus:border-foreground"
                  />
                  <input
                    type="number"
                    placeholder="Qty"
                    value={item.quantity || ""}
                    onChange={(e) =>
                      updateItem(index, "quantity", Number(e.target.value))
                    }
                    required
                    min={1}
                    className="px-3 py-2 border bg-transparent text-sm outline-none focus:border-foreground text-right"
                  />
                  <input
                    type="number"
                    placeholder="Harga"
                    value={item.unit_price || ""}
                    onChange={(e) =>
                      updateItem(index, "unit_price", Number(e.target.value))
                    }
                    required
                    min={0}
                    className="px-3 py-2 border bg-transparent text-sm outline-none focus:border-foreground text-right"
                  />
                  <div className="px-3 py-2 text-sm text-right bg-muted">
                    {formatCurrency(item.quantity * item.unit_price)}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(index)}
                    disabled={form.items.length <= 1}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-4 grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Catatan</label>
                <textarea
                  value={form.notes}
                  onChange={(e) =>
                    setForm({ ...form, notes: e.target.value })
                  }
                  placeholder="Catatan untuk klien"
                  rows={3}
                  className="w-full mt-1 px-3 py-2 border bg-transparent text-sm outline-none resize-none focus:border-foreground"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Syarat & Ketentuan</label>
                <textarea
                  value={form.terms}
                  onChange={(e) =>
                    setForm({ ...form, terms: e.target.value })
                  }
                  placeholder="Syarat pembayaran"
                  rows={3}
                  className="w-full mt-1 px-3 py-2 border bg-transparent text-sm outline-none resize-none focus:border-foreground"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-mono">{formatCurrency(subtotal)}</span>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={form.discount_type}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      discount_type: e.target.value as "none" | "percentage" | "fixed",
                    })
                  }
                  className="px-2 py-1 border bg-transparent text-xs outline-none"
                >
                  <option value="none">Tanpa Diskon</option>
                  <option value="percentage">Diskon (%)</option>
                  <option value="fixed">Diskon (Rp)</option>
                </select>
                {form.discount_type !== "none" && (
                  <input
                    type="number"
                    value={form.discount_value || ""}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        discount_value: Number(e.target.value),
                      })
                    }
                    min={0}
                    className="w-24 px-2 py-1 border bg-transparent text-xs outline-none text-right"
                  />
                )}
                <span className="text-sm ml-auto font-mono">
                  -{formatCurrency(discountAmount)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.tax_enabled}
                    onChange={(e) =>
                      setForm({ ...form, tax_enabled: e.target.checked })
                    }
                    className="accent-foreground"
                  />
                  PPN
                </label>
                {form.tax_enabled && (
                  <input
                    type="number"
                    value={form.tax_rate}
                    onChange={(e) =>
                      setForm({ ...form, tax_rate: Number(e.target.value) })
                    }
                    min={0}
                    max={100}
                    className="w-16 px-2 py-1 border bg-transparent text-xs outline-none text-right"
                  />
                )}
                {form.tax_enabled && <span className="text-xs text-muted-foreground">%</span>}
                <span className="text-sm ml-auto font-mono">
                  +{formatCurrency(taxAmount)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Ongkir</span>
                <input
                  type="number"
                  value={form.shipping_cost || ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      shipping_cost: Number(e.target.value),
                    })
                  }
                  min={0}
                  className="w-28 px-2 py-1 border bg-transparent text-xs outline-none text-right ml-auto"
                />
              </div>

              <div className="border-t pt-3 flex justify-between">
                <span className="font-semibold">Total</span>
                <span className="font-bold font-mono text-lg">
                  {formatCurrency(total)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-between gap-3 pt-4 border-t">
            <Button type="button" variant="outline" className="gap-2" onClick={() => navigate("/invoices/new")}>
              <ExternalLink className="h-4 w-4" />
              Buka Editor
            </Button>
            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={onClose}>
                Batal
              </Button>
              <Button type="submit">Simpan Draft</Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}