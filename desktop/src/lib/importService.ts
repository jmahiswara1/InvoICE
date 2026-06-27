import Papa from "papaparse";
import { open } from "@tauri-apps/plugin-dialog";
import { readTextFile } from "@tauri-apps/plugin-fs";
import { clientService } from "./clientService";

export interface ImportPreview {
  headers: string[];
  rows: Record<string, string>[];
  fileName: string;
}

export interface ImportResult {
  imported: number;
  skipped: number;
  errors: string[];
}

const CLIENT_FIELD_MAPPING: Record<string, keyof ImportPreview["rows"][0] | null> = {
  Name: "name",
  Email: "email",
  Phone: "phone",
  Address: "address",
  City: "city",
  PostalCode: "postal_code",
  Notes: "notes",
};

export const importService = {
  async previewClientsCSV(): Promise<ImportPreview | null> {
    try {
      const filePath = await open({
        title: "Import Clients",
        multiple: false,
        filters: [{ name: "CSV", extensions: ["csv"] }],
      });

      if (!filePath) return null;

      const csvText = await readTextFile(filePath as string);

      return new Promise((resolve) => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const headers = results.meta.fields || [];
            const rows = results.data as Record<string, string>[];
            const fileName =
              (filePath as string).split(/[\\/]/).pop() || "imported.csv";

            resolve({
              headers,
              rows: rows.filter(
                (r) => Object.values(r).some((v) => v && v.trim())
              ),
              fileName,
            });
          },
          error: () => resolve(null),
        });
      });
    } catch (error) {
      console.error("Failed to preview CSV:", error);
      throw error;
    }
  },

  async importClients(
    userId: string,
    rows: Record<string, string>[],
    columnMapping: Record<string, string>
  ): Promise<ImportResult> {
    const result: ImportResult = {
      imported: 0,
      skipped: 0,
      errors: [],
    };

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      try {
        const data: any = {
          user_id: userId,
          name: "",
          email: null,
          phone: null,
          address: null,
          city: null,
          postal_code: null,
          notes: null,
        };

        Object.entries(columnMapping).forEach(([csvCol, dbField]) => {
          if (dbField && row[csvCol]) {
            data[dbField] = String(row[csvCol]).trim() || null;
          }
        });

        if (!data.name) {
          result.errors.push(`Row ${i + 2}: Name is required`);
          result.skipped++;
          continue;
        }

        await clientService.create(data);
        result.imported++;
      } catch (error) {
        result.errors.push(`Row ${i + 2}: ${(error as Error).message}`);
        result.skipped++;
      }
    }

    return result;
  },

  getClientFieldMapping(): Record<string, string | null> {
    return CLIENT_FIELD_MAPPING;
  },
};