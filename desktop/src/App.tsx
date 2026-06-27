import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "@/components/layout/main-layout";
import { DashboardPage } from "@/pages/dashboard";
import { InvoicesPage } from "@/pages/invoices";
import { ClientsPage } from "@/pages/clients";
import { SettingsPage } from "@/pages/settings";
import { useSettingsStore } from "@/stores/settingsStore";

function App() {
  const theme = useSettingsStore((s) => s.theme);
  const applyTheme = useSettingsStore((s) => s.applyTheme);

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

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/invoices" element={<InvoicesPage />} />
          <Route path="/clients" element={<ClientsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
