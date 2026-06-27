import { save, open, message } from "@tauri-apps/plugin-dialog";
import { writeTextFile, readTextFile, copyFile, exists, BaseDirectory } from "@tauri-apps/plugin-fs";
import { appDataDir, documentDir, join } from "@tauri-apps/api/path";

const DB_FILENAME = "invoice.db";

export const backupService = {
  async getDatabasePath(): Promise<string> {
    return join(await appDataDir(), DB_FILENAME);
  },

  async exportBackup(): Promise<string | null> {
    try {
      const dbPath = await this.getDatabasePath();

      const filePath = await save({
        title: "Export Backup",
        defaultPath: `invoice-backup-${new Date().toISOString().split("T")[0]}.sqlite`,
        filters: [{ name: "SQLite Database", extensions: ["sqlite", "db"] }],
      });

      if (!filePath) return null;

      await copyFile(dbPath, filePath);
      return filePath;
    } catch (error) {
      console.error("Failed to export backup:", error);
      throw error;
    }
  },

  async restoreBackup(): Promise<boolean> {
    try {
      const filePath = await open({
        title: "Restore Backup",
        multiple: false,
        filters: [{ name: "SQLite Database", extensions: ["sqlite", "db"] }],
      });

      if (!filePath) return false;

      const confirmed = await message(
        "This will overwrite your current data. Are you sure?",
        { title: "Confirm Restore", kind: "warning" }
      );

      if (!confirmed) return false;

      const dbPath = await this.getDatabasePath();
      await copyFile(filePath as string, dbPath);
      return true;
    } catch (error) {
      console.error("Failed to restore backup:", error);
      throw error;
    }
  },

  async autoBackup(): Promise<string | null> {
    try {
      const dbPath = await this.getDatabasePath();
      const docsDir = await documentDir();
      const backupDir = await join(docsDir, "Invoice Backups");

      const dateStr = new Date().toISOString().split("T")[0];
      const fileName = `invoice-auto-${dateStr}.sqlite`;
      const backupPath = await join(backupDir, fileName);

      try {
        await copyFile(dbPath, backupPath);
      } catch {
        // If file exists, overwrite is fine
      }

      return backupPath;
    } catch (error) {
      console.error("Auto-backup failed:", error);
      return null;
    }
  },

  async shouldRunAutoBackup(lastBackup: string | null): Promise<boolean> {
    if (!lastBackup) return true;
    const last = new Date(lastBackup);
    const now = new Date();
    const daysSince = (now.getTime() - last.getTime()) / 86400000;
    return daysSince >= 7;
  },
};