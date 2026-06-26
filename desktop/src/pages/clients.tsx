import { useState } from "react";
import { Plus, Search, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function ClientsPage() {
  const [search, setSearch] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Clients</h1>
          <p className="text-muted-foreground">Kelola data klien Anda.</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Tambah Client
        </Button>
      </div>

      <div className="flex items-center gap-2 max-w-sm">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Cari klien..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Belum ada klien</p>
            <p className="text-sm text-muted-foreground mt-1">
              Tambah klien pertama Anda untuk mulai membuat invoice.
            </p>
            <Button variant="outline" className="mt-4 gap-2">
              <Plus className="h-4 w-4" />
              Tambah Client
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
