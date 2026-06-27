import { useState, useEffect } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Client, RecurringTemplate } from "@/types";
import { t } from "@/i18n";

interface RecurringFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  clients: Client[];
  template?: RecurringTemplate | null;
}

export function RecurringFormDialog({
  open,
  onClose,
  onSubmit,
  clients,
  template,
}: RecurringFormDialogProps) {
  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({
    name: "",
    client_id: 0,
    template: "minimalis",
    interval: "monthly" as "monthly" | "quarterly" | "yearly",
    next_generate_date: today,
    currency: "IDR",
    tax_enabled: true,
    tax_rate: 11,
    notes: "",
    terms: "",
    is_active: 1,
    items: [{ description: "", quantity: 1, unit_price: 0 }],
  });

  useEffect(() => {
    if (template) {
      setForm({
        name: template.name || "",
        client_id: template.client_id,
        template: template.template,
        interval: template.interval as "monthly" | "quarterly" | "yearly",
        next_generate_date: template.next_generate_date || today,
        currency: template.currency,
        tax_enabled: template.tax_enabled,
        tax_rate: template.tax_rate,
        notes: template.notes || "",
        terms: template.terms || "",
        is_active: template.is_active,
        items: [{ description: "", quantity: 1, unit_price: 0 }],
      });
    } else {
      setForm({
        name: "",
        client_id: clients[0]?.id || 0,
        template: "minimalis",
        interval: "monthly",
        next_generate_date: today,
        currency: "IDR",
        tax_enabled: true,
        tax_rate: 11,
        notes: "",
        terms: "",
        is_active: 1,
        items: [{ description: "", quantity: 1, unit_price: 0 }],
      });
    }
  }, [template, open, clients, today]);

  if (!open) return null;

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-background border w-full max-w-2xl max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-background z-10">
          <h2 className="text-lg font-semibold">
            {template ? t("recurring.form.editTitle") : t("recurring.form.addTitle")}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="text-sm font-medium">{t("recurring.form.name")}</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder={t("recurring.form.namePlaceholder")}
              required
              className="w-full mt-1 px-3 py-2 border bg-transparent text-sm outline-none focus:border-foreground"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">{t("recurring.form.client")}</label>
              <select
                value={form.client_id}
                onChange={(e) => setForm({ ...form, client_id: Number(e.target.value) })}
                required
                className="w-full mt-1 px-3 py-2 border bg-transparent text-sm outline-none focus:border-foreground"
              >
                <option value={0}>{t("invoices.form.selectClient")}</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">{t("recurring.form.interval")}</label>
              <select
                value={form.interval}
                onChange={(e) =>
                  setForm({ ...form, interval: e.target.value as any })
                }
                className="w-full mt-1 px-3 py-2 border bg-transparent text-sm outline-none focus:border-foreground"
              >
                <option value="monthly">{t("recurring.intervals.monthly")}</option>
                <option value="quarterly">{t("recurring.intervals.quarterly")}</option>
                <option value="yearly">{t("recurring.intervals.yearly")}</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">{t("recurring.form.template")}</label>
              <select
                value={form.template}
                onChange={(e) => setForm({ ...form, template: e.target.value })}
                className="w-full mt-1 px-3 py-2 border bg-transparent text-sm outline-none focus:border-foreground"
              >
                <option value="minimalis">{t("templates.minimalis")}</option>
                <option value="profesional">{t("templates.profesional")}</option>
                <option value="kreatif">{t("templates.kreatif")}</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">{t("recurring.form.nextDate")}</label>
              <input
                type="date"
                value={form.next_generate_date}
                onChange={(e) =>
                  setForm({ ...form, next_generate_date: e.target.value })
                }
                required
                className="w-full mt-1 px-3 py-2 border bg-transparent text-sm outline-none focus:border-foreground"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold">{t("recurring.form.items")}</h3>
              <Button type="button" variant="outline" size="sm" onClick={addItem}>
                <Plus className="h-3.5 w-3.5 mr-1" />
                {t("recurring.form.addItem")}
              </Button>
            </div>
            <div className="space-y-2">
              {form.items.map((item, index) => (
                <div key={index} className="grid grid-cols-[1fr_80px_100px_36px] gap-2">
                  <input
                    type="text"
                    placeholder={t("invoices.form.description")}
                    value={item.description}
                    onChange={(e) =>
                      updateItem(index, "description", e.target.value)
                    }
                    required
                    className="px-3 py-2 border bg-transparent text-sm outline-none focus:border-foreground"
                  />
                  <input
                    type="number"
                    placeholder={t("invoices.form.qty")}
                    value={item.quantity || ""}
                    onChange={(e) =>
                      updateItem(index, "quantity", Number(e.target.value))
                    }
                    required
                    min={1}
                    className="px-3 py-2 border bg-transparent text-sm outline-none text-right"
                  />
                  <input
                    type="number"
                    placeholder={t("invoices.form.price")}
                    value={item.unit_price || ""}
                    onChange={(e) =>
                      updateItem(index, "unit_price", Number(e.target.value))
                    }
                    required
                    min={0}
                    className="px-3 py-2 border bg-transparent text-sm outline-none text-right"
                  />
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

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={form.is_active === 1}
              onChange={(e) =>
                setForm({ ...form, is_active: e.target.checked ? 1 : 0 })
              }
              className="accent-foreground"
            />
            <label htmlFor="isActive" className="text-sm">
              {t("recurring.form.active")}
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              {t("common.cancel")}
            </Button>
            <Button type="submit">{t("common.save")}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}