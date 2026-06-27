import { FileText, Users, DollarSign, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const stats = [
  {
    title: "Total Invoice",
    value: "0",
    icon: FileText,
    description: "Bulan ini",
  },
  {
    title: "Clients",
    value: "0",
    icon: Users,
    description: "Total klien",
  },
  {
    title: "Revenue",
    value: "Rp 0",
    icon: DollarSign,
    description: "Bulan ini",
  },
  {
    title: "Overdue",
    value: "0",
    icon: Clock,
    description: "Belum dibayar",
  },
];

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Selamat datang kembali! Berikut ringkasan bisnis Anda.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.description}
                  </p>
                </div>
                <div className="w-10 h-10 border bg-primary/10 flex items-center justify-center">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-4">Invoice Terbaru</h3>
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Belum ada invoice</p>
              <p className="text-sm">
                Buat invoice pertama Anda untuk memulai.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-4">Invoice Jatuh Tempo</h3>
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Tidak ada invoice jatuh tempo</p>
              <p className="text-sm">
                Semua invoice Anda sudah dibayar atau belum jatuh tempo.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
