import { useState } from "react";
import { Plus, Search, Filter, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const statusColors: Record<string, string> = {
  draft: "bg-gray-100 text-gray-700",
  sent: "bg-blue-100 text-blue-700",
  paid: "bg-green-100 text-green-700",
  overdue: "bg-red-100 text-red-700",
  cancelled: "bg-gray-100 text-gray-500",
};

export function InvoicesPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Invoices</h1>
          <p className="text-muted-foreground">Kelola invoice Anda.</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Buat Invoice
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 flex-1 max-w-sm">
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
          <Button
            variant={statusFilter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("all")}
          >
            All
          </Button>
          <Button
            variant={statusFilter === "draft" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("draft")}
          >
            Draft
          </Button>
          <Button
            variant={statusFilter === "sent" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("sent")}
          >
            Sent
          </Button>
          <Button
            variant={statusFilter === "paid" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("paid")}
          >
            Paid
          </Button>
          <Button
            variant={statusFilter === "overdue" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("overdue")}
          >
            Overdue
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="text-center py-12">
            <FileText className="h-12 w-12 mx-auto mb-2 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">Belum ada invoice</p>
            <p className="text-sm text-muted-foreground mt-1">
              Buat invoice pertama Anda untuk memulai.
            </p>
            <Button variant="outline" className="mt-4 gap-2">
              <Plus className="h-4 w-4" />
              Buat Invoice
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
