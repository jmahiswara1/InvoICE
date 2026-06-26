declare module "@tauri-apps/plugin-sql" {
  interface QueryResult {
    rowsAffected: number;
    lastInsertId: number;
  }

  export default class Database {
    static load(path: string): Promise<Database>;
    execute(sql: string, params?: unknown[]): Promise<QueryResult>;
    select<T>(sql: string, params?: unknown[]): Promise<T>;
    close(): Promise<void>;
  }
}
