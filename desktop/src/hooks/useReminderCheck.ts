import { useEffect } from "react";
import { sendNotification, isPermissionGranted, requestPermission } from "@tauri-apps/plugin-notification";
import { reminderService } from "@/lib/reminderService";
import { useSettingsStore } from "@/stores/settingsStore";

export function useReminderCheck() {
  const userId = "local-user";
  const reminderDays = useSettingsStore((s) => s.reminderDays);
  const reminderNotifications = useSettingsStore((s) => s.reminderNotifications);

  useEffect(() => {
    if (!reminderNotifications) return;

    const checkReminders = async () => {
      try {
        const dueInvoices = await reminderService.getOverdueAndDueSoon(
          userId,
          reminderDays
        );

        if (dueInvoices.length === 0) return;

        const hasPermission = await isPermissionGranted();
        if (!hasPermission) {
          const granted = await requestPermission();
          if (!granted) return;
        }

        for (const inv of dueInvoices) {
          const isOverdue = inv.status === "overdue" || inv.due_date < new Date().toISOString().split("T")[0];
          const title = isOverdue ? "Invoice Overdue" : "Invoice Due Soon";
          const body = `${inv.invoice_number} - ${inv.client_name} - Due: ${inv.due_date}`;

          await sendNotification({ title, body });
        }
      } catch (error) {
        console.error("Failed to check reminders:", error);
      }
    };

    checkReminders();
  }, [userId, reminderDays, reminderNotifications]);
}