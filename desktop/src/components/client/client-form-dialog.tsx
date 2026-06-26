import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Client } from "@/types";

interface ClientFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Client, "id" | "user_id" | "created_at" | "updated_at">) => void;
  client?: Client | null;
}

export function ClientFormDialog({
  open,
  onClose,
  onSubmit,
  client,
}: ClientFormDialogProps) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postal_code: "",
    notes: "",
  });

  useEffect(() => {
    if (client) {
      setForm({
        name: client.name || "",
        email: client.email || "",
        phone: client.phone || "",
        address: client.address || "",
        city: client.city || "",
        postal_code: client.postal_code || "",
        notes: client.notes || "",
      });
    } else {
      setForm({
        name: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        postal_code: "",
        notes: "",
      });
    }
  }, [client, open]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-background border w-full max-w-lg max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">
            {client ? "Edit Client" : "Tambah Client"}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="text-sm font-medium">
              Nama <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Nama klien atau bisnis"
              required
              className="w-full mt-1 px-3 py-2 border bg-transparent text-sm outline-none focus:border-foreground"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="email@contoh.com"
                className="w-full mt-1 px-3 py-2 border bg-transparent text-sm outline-none focus:border-foreground"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Telepon</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+62 xxx xxxx xxxx"
                className="w-full mt-1 px-3 py-2 border bg-transparent text-sm outline-none focus:border-foreground"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Alamat</label>
            <textarea
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="Alamat lengkap"
              rows={2}
              className="w-full mt-1 px-3 py-2 border bg-transparent text-sm outline-none resize-none focus:border-foreground"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Kota</label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                placeholder="Kota"
                className="w-full mt-1 px-3 py-2 border bg-transparent text-sm outline-none focus:border-foreground"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Kode Pos</label>
              <input
                type="text"
                value={form.postal_code}
                onChange={(e) =>
                  setForm({ ...form, postal_code: e.target.value })
                }
                placeholder="Kode pos"
                className="w-full mt-1 px-3 py-2 border bg-transparent text-sm outline-none focus:border-foreground"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Catatan</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Catatan internal tentang klien ini"
              rows={2}
              className="w-full mt-1 px-3 py-2 border bg-transparent text-sm outline-none resize-none focus:border-foreground"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit">
              {client ? "Simpan Perubahan" : "Tambah Client"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
