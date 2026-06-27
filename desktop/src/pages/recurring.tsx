import { useState, useEffect } from "react";
import { Plus, Search, Trash2, MoreHorizontal, Play, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RecurringFormDialog } from "@/components/recurring/recurring-form-dialog";
import { DeleteDialog } from "@/components/client/delete-dialog";
import { recurringService } from "@/lib/recurringService";
import { clientService } from "@/lib/clientService";
import { t } from "@/i18n";
import type { Client, RecurringTemplate } from "@/types";

export function RecurringPage() {
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<RecurringTemplate | null>(null);
  const [actionMenu, setActionMenu] = useState<number | null>(null);
  const [templates, setTemplates] = useState<RecurringTemplate[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const userId = "local-user";

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [templatesData, clientsData] = await Promise.all([
        recurringService.getAll(userId),
        clientService.getAll(userId),
      ]);
      setTemplates(templatesData);
      setClients(clientsData);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (data: any) => {
    try {
      const template = await recurringService.create({
        ...data,
        user_id: userId,
      });

      for (let i = 0; i < data.items.length; i++) {
        const item = data.items[i];
        if (item.description) {
          await recurringService.addItem({
            template_id: template.id,
            description: item.description,
            quantity: item.quantity,
            unit_price: item.unit_price,
            sort_order: i,
          });
        }
      }

      setShowForm(false);
      await loadData();
    } catch (error) {
      console.error("Failed to create template:", error);
    }
  };

  const handleGenerate = async (template: RecurringTemplate) => {
    try {
      await recurringService.generateInvoice(template.id, userId);
      await loadData();
      setActionMenu(null);
    } catch (error) {
      console.error("Failed to generate invoice:", error);
    }
  };

  const handleDelete = async () => {
    if (!selectedTemplate) return;
    try {
      await recurringService.delete(selectedTemplate.id);
      setShowDelete(false);
      setSelectedTemplate(null);
      await loadData();
    } catch (error) {
      console.error("Failed to delete template:", error);
    }
  };

  const getClientName = (clientId: number): string => {
    const client = clients.find((c) => c.id === clientId);
    return client?.name || "-";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t("recurring.title")}</h1>
          <p className="text-muted-foreground">{t("recurring.subtitle")}</p>
        </div>
        <Button className="gap-2" onClick={() => { setSelectedTemplate(null); setShowForm(true); }}>
          <Plus className="h-4 w-4" />
          {t("recurring.add")}
        </Button>
      </div>

      <div className="flex items-center gap-2 max-w-sm border px-3 py-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder={t("recurring.search")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">{t("recurring.loading")}</div>
      ) : templates.length === 0 ? (
        <Card>
          <CardContent className="p-0">
            <div className="text-center py-12">
              <p className="text-muted-foreground">{t("recurring.empty")}</p>
              <p className="text-sm text-muted-foreground mt-1">{t("recurring.emptyDesc")}</p>
              <Button variant="outline" className="mt-4 gap-2" onClick={() => { setSelectedTemplate(null); setShowForm(true); }}>
                <Plus className="h-4 w-4" />
                {t("recurring.add")}
              </Button>
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
                    {t("recurring.table.name")}
                  </th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">
                    {t("recurring.table.client")}
                  </th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">
                    {t("recurring.table.interval")}
                  </th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">
                    {t("recurring.table.nextDate")}
                  </th>
                  <th className="text-center text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">
                    Status
                  </th>
                  <th className="text-right text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">
                    {t("recurring.table.actions")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {templates.map((template) => (
                  <tr
                    key={template.id}
                    className="border-b last:border-b-0 hover:bg-muted/50"
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium text-sm">{template.name}</p>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {getClientName(template.client_id)}
                    </td>
                    <td className="px-4 py-3 text-sm capitalize">
                      {t(`recurring.intervals.${template.interval}`)}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground font-mono">
                      {template.next_generate_date}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge variant={template.is_active ? "default" : "secondary"}>
                        {template.is_active ? "Aktif" : "Nonaktif"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="relative inline-block">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            setActionMenu(
                              actionMenu === template.id ? null : template.id
                            )
                          }
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                        {actionMenu === template.id && (
                          <div className="absolute right-0 top-full mt-1 bg-background border shadow-md z-10 w-44">
                            <button
                              className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-muted"
                              onClick={() => handleGenerate(template)}
                            >
                              <Play className="h-3.5 w-3.5" />
                              {t("recurring.actions.generateNow")}
                            </button>
                            <button
                              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-destructive hover:bg-muted"
                              onClick={() => {
                                setSelectedTemplate(template);
                                setShowDelete(true);
                                setActionMenu(null);
                              }}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              {t("recurring.actions.delete")}
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

      <RecurringFormDialog
        open={showForm}
        onClose={() => { setShowForm(false); setSelectedTemplate(null); }}
        onSubmit={handleCreate}
        clients={clients}
        template={selectedTemplate}
      />

      <DeleteDialog
        open={showDelete}
        onClose={() => { setShowDelete(false); setSelectedTemplate(null); }}
        onConfirm={handleDelete}
        clientName={selectedTemplate?.name || ""}
      />
    </div>
  );
}