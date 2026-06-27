import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "@/components/layout/main-layout";
import { DashboardPage } from "@/pages/dashboard";
import { InvoicesPage } from "@/pages/invoices";
import { ClientsPage } from "@/pages/clients";
import { RecurringPage } from "@/pages/recurring";
import { SettingsPage } from "@/pages/settings";
import { InvoiceEditorPage } from "@/pages/invoice-editor";
import { useSettingsStore } from "@/stores/settingsStore";
import { useSync } from "@/hooks/useSync";

function App() {
  const theme = useSettingsStore((s) => s.theme);
  const applyTheme = useSettingsStore((s) => s.applyTheme);

  // Initialize auto-sync
  useSync();

  useEffect(() => {
    applyTheme();
  }, [theme, applyTheme]);

  useEffect(() => {
    if (theme !== "system") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => applyTheme();
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, [theme, applyTheme]);

  const language = useSettingsStore((s) => s.language);
  const applyLanguage = useSettingsStore((s) => s.applyLanguage);

  useEffect(() => {
    applyLanguage();
  }, [language, applyLanguage]);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/invoices" element={<InvoicesPage />} />
          <Route path="/clients" element={<ClientsPage />} />
          <Route path="/recurring" element={<RecurringPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/invoices/new" element={<InvoiceEditorPage />} />
          <Route path="/invoices/:id/edit" element={<InvoiceEditorPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;