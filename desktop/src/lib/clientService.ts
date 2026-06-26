import { query, execute } from "@/lib/database";
import type { Client } from "@/types";

export const clientService = {
  async getAll(userId: string): Promise<Client[]> {
    return query<Client>(
      "SELECT * FROM clients WHERE user_id = $1 ORDER BY name ASC",
      [userId]
    );
  },

  async getById(id: number): Promise<Client | null> {
    const results = query<Client>("SELECT * FROM clients WHERE id = $1", [id]);
    return (await results)[0] || null;
  },

  async create(
    data: Omit<Client, "id" | "created_at" | "updated_at">
  ): Promise<Client> {
    const result = await execute(
      `INSERT INTO clients (user_id, name, email, phone, address, city, postal_code, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        data.user_id,
        data.name,
        data.email,
        data.phone,
        data.address,
        data.city,
        data.postal_code,
        data.notes,
      ]
    );
    const client = await this.getById(result.lastInsertId);
    return client!;
  },

  async update(
    id: number,
    data: Partial<Omit<Client, "id" | "user_id" | "created_at" | "updated_at">>
  ): Promise<Client> {
    const fields: string[] = [];
    const values: unknown[] = [];
    let paramIndex = 1;

    if (data.name !== undefined) {
      fields.push(`name = $${paramIndex++}`);
      values.push(data.name);
    }
    if (data.email !== undefined) {
      fields.push(`email = $${paramIndex++}`);
      values.push(data.email);
    }
    if (data.phone !== undefined) {
      fields.push(`phone = $${paramIndex++}`);
      values.push(data.phone);
    }
    if (data.address !== undefined) {
      fields.push(`address = $${paramIndex++}`);
      values.push(data.address);
    }
    if (data.city !== undefined) {
      fields.push(`city = $${paramIndex++}`);
      values.push(data.city);
    }
    if (data.postal_code !== undefined) {
      fields.push(`postal_code = $${paramIndex++}`);
      values.push(data.postal_code);
    }
    if (data.notes !== undefined) {
      fields.push(`notes = $${paramIndex++}`);
      values.push(data.notes);
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    await execute(
      `UPDATE clients SET ${fields.join(", ")} WHERE id = $${paramIndex}`,
      values
    );

    const client = await this.getById(id);
    return client!;
  },

  async delete(id: number): Promise<void> {
    await execute("DELETE FROM clients WHERE id = $1", [id]);
  },

  async search(userId: string, queryStr: string): Promise<Client[]> {
    return query<Client>(
      `SELECT * FROM clients 
       WHERE user_id = $1 AND (name LIKE $2 OR email LIKE $3 OR phone LIKE $4)
       ORDER BY name ASC`,
      [userId, `%${queryStr}%`, `%${queryStr}%`, `%${queryStr}%`]
    );
  },
};
