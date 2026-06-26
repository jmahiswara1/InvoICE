import { Save, Upload, Globe, Palette, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useSettingsStore } from "@/stores/settingsStore";

export function SettingsPage() {
  const { language, currency, theme, setLanguage, setCurrency, setTheme } =
    useSettingsStore();

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Kelola pengaturan aplikasi dan bisnis Anda.
        </p>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <Receipt className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Informasi Bisnis</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Nama Bisnis</label>
              <input
                type="text"
                placeholder="Masukkan nama bisnis Anda"
                className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Alamat</label>
              <textarea
                placeholder="Masukkan alamat bisnis"
                rows={3}
                className="w-full mt-1 px-3 py-2 border rounded-lg text-sm resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Email</label>
                <input
                  type="email"
                  placeholder="email@bisnis.com"
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Telepon</label>
                <input
                  type="tel"
                  placeholder="+62 xxx xxxx xxxx"
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Logo Bisnis</label>
              <div className="mt-1 flex items-center gap-4">
                <div className="w-20 h-20 border-2 border-dashed rounded-lg flex items-center justify-center text-muted-foreground">
                  <Upload className="h-6 w-6" />
                </div>
                <Button variant="outline" size="sm">
                  Upload Logo
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6 space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Bahasa & Mata Uang</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Bahasa</label>
              <select
                value={language}
                onChange={(e) =>
                  setLanguage(e.target.value as "id" | "en")
                }
                className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
              >
                <option value="id">Bahasa Indonesia</option>
                <option value="en">English</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Mata Uang Default</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
              >
                <option value="IDR">IDR - Rupiah</option>
                <option value="USD">USD - Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="SGD">SGD - Dollar Singapura</option>
                <option value="MYR">MYR - Ringgit</option>
                <option value="JPY">JPY - Yen</option>
                <option value="GBP">GBP - Poundsterling</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6 space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <Palette className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Tampilan</h3>
          </div>

          <div>
            <label className="text-sm font-medium">Theme</label>
            <div className="flex gap-2 mt-2">
              <Button
                variant={theme === "light" ? "default" : "outline"}
                size="sm"
                onClick={() => setTheme("light")}
              >
                Light
              </Button>
              <Button
                variant={theme === "dark" ? "default" : "outline"}
                size="sm"
                onClick={() => setTheme("dark")}
              >
                Dark
              </Button>
              <Button
                variant={theme === "system" ? "default" : "outline"}
                size="sm"
                onClick={() => setTheme("system")}
              >
                System
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6 space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <Receipt className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Invoice Settings</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Invoice Prefix</label>
              <input
                type="text"
                defaultValue="INV"
                className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium">
                Tax Rate (%)
              </label>
              <input
                type="number"
                defaultValue={11}
                className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button className="gap-2">
          <Save className="h-4 w-4" />
          Simpan Pengaturan
        </Button>
      </div>
    </div>
  );
}
