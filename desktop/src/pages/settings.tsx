import { useState, useEffect } from "react";
import { Save, Upload, Globe, Palette, Receipt, Key, RefreshCw, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSettingsStore } from "@/stores/settingsStore";
import { licenseService } from "@/lib/licenseService";
import { useSync } from "@/hooks/useSync";

export function SettingsPage() {
  const store = useSettingsStore();
  const { isSyncing, lastSyncResult, manualSync } = useSync();

  // Local form state (synced from store on mount)
  const [businessName, setBusinessName] = useState(store.businessName);
  const [businessAddress, setBusinessAddress] = useState(store.businessAddress);
  const [businessEmail, setBusinessEmail] = useState(store.businessEmail);
  const [businessPhone, setBusinessPhone] = useState(store.businessPhone);
  const [invoicePrefix, setInvoicePrefix] = useState(store.invoicePrefix);
  const [taxRate, setTaxRate] = useState(store.taxRate);
  const [logoDataUrl, setLogoDataUrl] = useState<string | null>(null);

  const [licenseInput, setLicenseInput] = useState(store.licenseKey || "");
  const [licenseMessage, setLicenseMessage] = useState<string | null>(null);
  const [licenseLoading, setLicenseLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setBusinessName(store.businessName);
    setBusinessAddress(store.businessAddress);
    setBusinessEmail(store.businessEmail);
    setBusinessPhone(store.businessPhone);
    setInvoicePrefix(store.invoicePrefix);
    setTaxRate(store.taxRate);
  }, [store.businessName, store.businessAddress, store.businessEmail, store.businessPhone, store.invoicePrefix, store.taxRate]);

  const handleSave = () => {
    store.setBusinessInfo({
      businessName,
      businessAddress,
      businessEmail,
      businessPhone,
    });
    store.setInvoicePrefix(invoicePrefix);
    store.setTaxRate(taxRate);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleValidateLicense = async () => {
    if (!licenseInput.trim()) return;
    setLicenseLoading(true);
    setLicenseMessage(null);
    try {
      const result = await licenseService.validate(licenseInput);
      setLicenseMessage(result.message);
      if (result.valid) {
        store.setLicenseKey(licenseInput);
        store.setLicenseType(result.licenseType);
      }
    } catch {
      setLicenseMessage("Gagal memvalidasi license.");
    } finally {
      setLicenseLoading(false);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setLogoDataUrl(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const formatSyncDate = (dateStr: string | null) => {
    if (!dateStr) return "Belum pernah sync";
    return new Date(dateStr).toLocaleString("id-ID", {
      day: "numeric", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Kelola pengaturan aplikasi dan bisnis Anda.</p>
      </div>

      {/* Business Info */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <Receipt className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Informasi Bisnis</h3>
          </div>

          <div>
            <label className="text-sm font-medium">Nama Bisnis</label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="Masukkan nama bisnis Anda"
              className="w-full mt-1 px-3 py-2 border text-sm outline-none focus:border-foreground"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Alamat</label>
            <textarea
              value={businessAddress}
              onChange={(e) => setBusinessAddress(e.target.value)}
              placeholder="Masukkan alamat bisnis"
              rows={2}
              className="w-full mt-1 px-3 py-2 border text-sm outline-none resize-none focus:border-foreground"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Email</label>
              <input
                type="email"
                value={businessEmail}
                onChange={(e) => setBusinessEmail(e.target.value)}
                placeholder="email@bisnis.com"
                className="w-full mt-1 px-3 py-2 border text-sm outline-none focus:border-foreground"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Telepon</label>
              <input
                type="tel"
                value={businessPhone}
                onChange={(e) => setBusinessPhone(e.target.value)}
                placeholder="+62 xxx xxxx xxxx"
                className="w-full mt-1 px-3 py-2 border text-sm outline-none focus:border-foreground"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Logo Bisnis</label>
            <div className="mt-1 flex items-center gap-4">
              <div className="w-20 h-20 border-2 border-dashed flex items-center justify-center text-muted-foreground overflow-hidden">
                {logoDataUrl ? (
                  <img src={logoDataUrl} alt="Logo" className="w-full h-full object-contain" />
                ) : (
                  <Upload className="h-6 w-6" />
                )}
              </div>
              <label>
                <span className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-none border bg-background px-3 py-1.5 text-sm font-medium hover:bg-muted cursor-pointer">
                  Upload Logo
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Language & Currency */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <Globe className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Bahasa & Mata Uang</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Bahasa</label>
              <select
                value={store.language}
                onChange={(e) => store.setLanguage(e.target.value as "id" | "en")}
                className="w-full mt-1 px-3 py-2 border text-sm outline-none focus:border-foreground"
              >
                <option value="id">Bahasa Indonesia</option>
                <option value="en">English</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Mata Uang Default</label>
              <select
                value={store.currency}
                onChange={(e) => store.setCurrency(e.target.value)}
                className="w-full mt-1 px-3 py-2 border text-sm outline-none focus:border-foreground"
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

      {/* Appearance */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <Palette className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Tampilan</h3>
          </div>

          <div>
            <label className="text-sm font-medium">Theme</label>
            <div className="flex gap-2 mt-2">
              {(["light", "dark", "system"] as const).map((t) => (
                <Button
                  key={t}
                  variant={store.theme === t ? "default" : "outline"}
                  size="sm"
                  onClick={() => store.setTheme(t)}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invoice Settings */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <Receipt className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Invoice Settings</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Invoice Prefix</label>
              <input
                type="text"
                value={invoicePrefix}
                onChange={(e) => setInvoicePrefix(e.target.value)}
                className="w-full mt-1 px-3 py-2 border text-sm outline-none focus:border-foreground"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Tax Rate (%)</label>
              <input
                type="number"
                value={taxRate}
                onChange={(e) => setTaxRate(Number(e.target.value))}
                min={0}
                max={100}
                className="w-full mt-1 px-3 py-2 border text-sm outline-none focus:border-foreground"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* License */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <Key className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">License</h3>
            <Badge variant={store.licenseType === "paid" ? "default" : "secondary"}>
              {store.licenseType === "paid" ? "Paid" : "Free"}
            </Badge>
          </div>

          <div>
            <label className="text-sm font-medium">License Key</label>
            <div className="flex gap-2 mt-1">
              <input
                type="text"
                value={licenseInput}
                onChange={(e) => setLicenseInput(e.target.value)}
                placeholder="Masukkan license key"
                className="flex-1 px-3 py-2 border text-sm font-mono outline-none focus:border-foreground"
              />
              <Button
                onClick={handleValidateLicense}
                disabled={licenseLoading || !licenseInput.trim()}
                size="sm"
              >
                {licenseLoading ? "Validating..." : "Validate"}
              </Button>
            </div>
          </div>

          {licenseMessage && (
            <div className={`flex items-center gap-2 text-sm ${store.licenseType === "paid" ? "text-green-600" : "text-destructive"}`}>
              {store.licenseType === "paid" ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
              {licenseMessage}
            </div>
          )}

          {store.licenseType === "free" && (
            <p className="text-xs text-muted-foreground">
              Free tier: Max 5 invoice/bulan. Upgrade ke paid untuk unlimited.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Sync Status */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <RefreshCw className={`h-5 w-5 text-primary ${isSyncing ? "animate-spin" : ""}`} />
            <h3 className="font-semibold">Sync Status</h3>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Last Sync:</span>
            <span className="font-mono">{formatSyncDate(store.lastSyncAt)}</span>
          </div>

          {lastSyncResult && (
            <div className="text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pushed:</span>
                <span className="font-mono">{lastSyncResult.pushed} records</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pulled:</span>
                <span className="font-mono">{lastSyncResult.pulled} records</span>
              </div>
              {lastSyncResult.errors.length > 0 && (
                <div className="text-destructive">{lastSyncResult.errors.length} error(s)</div>
              )}
            </div>
          )}

          <Button
            variant="outline"
            size="sm"
            className="w-full gap-2"
            onClick={manualSync}
            disabled={isSyncing}
          >
            <RefreshCw className={`h-4 w-4 ${isSyncing ? "animate-spin" : ""}`} />
            {isSyncing ? "Syncing..." : "Sync Now"}
          </Button>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button className="gap-2" onClick={handleSave}>
          {saved ? (
            <>
              <CheckCircle className="h-4 w-4" />
              Tersimpan!
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Simpan Pengaturan
            </>
          )}
        </Button>
      </div>
    </div>
  );
}