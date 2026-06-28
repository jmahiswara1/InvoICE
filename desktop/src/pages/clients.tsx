import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Plus, Pencil, Trash2, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SearchInput } from "@/components/ui/search-input";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { ClientFormDialog } from "@/components/client/client-form-dialog";
import { DeleteDialog } from "@/components/ui/delete-dialog";
import { clientService } from "@/lib/clientService";
import { getLocalUserId } from "@/lib/userId";
import { useClientStore } from "@/stores/clientStore";
import type { Client } from "@/types";

export function ClientsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [actionMenu, setActionMenu] = useState<number | null>(null);

  const { clients, isLoading, setClients, addClient, updateClient, removeClient, setLoading } =
    useClientStore();

  const userId = getLocalUserId();

  useEffect(() => {
    loadClients();
  }, []);

  useEffect(() => {
    if (searchParams.get("action") === "new") {
      setSelectedClient(null);
      setShowForm(true);
      searchParams.delete("action");
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams]);

  const loadClients = async () => {
    setLoading(true);
    try {
      const data = search
        ? await clientService.search(userId, search)
        : await clientService.getAll(userId);
      setClients(data);
    } catch (error) {
      console.error("Failed to load clients:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadClients();
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleCreate = async (
    data: Omit<Client, "id" | "user_id" | "created_at" | "updated_at">
  ) => {
    try {
      const newClient = await clientService.create({ ...data, user_id: userId });
      addClient(newClient);
      setShowForm(false);
    } catch (error) {
      console.error("Failed to create client:", error);
    }
  };

  const handleUpdate = async (
    data: Omit<Client, "id" | "user_id" | "created_at" | "updated_at">
  ) => {
    if (!selectedClient) return;
    try {
      const updated = await clientService.update(selectedClient.id, data);
      updateClient(selectedClient.id, updated);
      setShowForm(false);
      setSelectedClient(null);
    } catch (error) {
      console.error("Failed to update client:", error);
    }
  };

  const handleDelete = async () => {
    if (!selectedClient) return;
    try {
      await clientService.delete(selectedClient.id);
      removeClient(selectedClient.id);
      setShowDelete(false);
      setSelectedClient(null);
    } catch (error) {
      console.error("Failed to delete client:", error);
    }
  };

  const openEditForm = (client: Client) => {
    setSelectedClient(client);
    setShowForm(true);
    setActionMenu(null);
  };

  const openDeleteDialog = (client: Client) => {
    setSelectedClient(client);
    setShowDelete(true);
    setActionMenu(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Clients"
        subtitle="Kelola data klien Anda."
        action={
          <Button className="gap-2" onClick={() => { setSelectedClient(null); setShowForm(true); }}>
            <Plus className="h-4 w-4" />
            Tambah Client
          </Button>
        }
      />

      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="Cari klien..."
      />

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">
          Memuat data...
        </div>
      ) : clients.length === 0 ? (
        <Card>
          <CardContent className="p-0">
            <EmptyState
              icon={Plus}
              title={search ? "Tidak ada klien yang cocok" : "Belum ada klien"}
              description={search ? "Coba kata kunci lain" : "Tambah klien pertama Anda untuk mulai membuat invoice."}
              action={
                !search ? (
                  <Button variant="outline" className="gap-2" onClick={() => { setSelectedClient(null); setShowForm(true); }}>
                    <Plus className="h-4 w-4" />
                    Tambah Client
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
                    Nama
                  </th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">
                    Email
                  </th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">
                    Telepon
                  </th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">
                    Kota
                  </th>
                  <th className="text-right text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client) => (
                  <tr
                    key={client.id}
                    className="border-b last:border-b-0 hover:bg-muted/50"
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium text-sm">{client.name}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {client.email || "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {client.phone || "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {client.city || "-"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="relative inline-block">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            setActionMenu(
                              actionMenu === client.id ? null : client.id
                            )
                          }
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                        {actionMenu === client.id && (
                          <div className="absolute right-0 top-full mt-1 bg-background border shadow-md z-10 w-36">
                            <button
                              className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-muted"
                              onClick={() => openEditForm(client)}
                            >
                              <Pencil className="h-3.5 w-3.5" />
                              Edit
                            </button>
                            <button
                              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-destructive hover:bg-muted"
                              onClick={() => openDeleteDialog(client)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              Hapus
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

      <ClientFormDialog
        open={showForm}
        onClose={() => {
          setShowForm(false);
          setSelectedClient(null);
        }}
        onSubmit={selectedClient ? handleUpdate : handleCreate}
        client={selectedClient}
      />

      <DeleteDialog
        open={showDelete}
        onClose={() => {
          setShowDelete(false);
          setSelectedClient(null);
        }}
        onConfirm={handleDelete}
        title="Hapus Client"
        itemName={selectedClient?.name || ""}
      />
    </div>
  );
}
