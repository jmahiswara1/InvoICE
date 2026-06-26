import { create } from "zustand";
import type { Client } from "@/types";

interface ClientState {
  clients: Client[];
  isLoading: boolean;
  setClients: (clients: Client[]) => void;
  addClient: (client: Client) => void;
  updateClient: (id: number, data: Partial<Client>) => void;
  removeClient: (id: number) => void;
  setLoading: (loading: boolean) => void;
}

export const useClientStore = create<ClientState>((set) => ({
  clients: [],
  isLoading: false,
  setClients: (clients) => set({ clients }),
  addClient: (client) =>
    set((state) => ({ clients: [...state.clients, client] })),
  updateClient: (id, data) =>
    set((state) => ({
      clients: state.clients.map((c) => (c.id === id ? { ...c, ...data } : c)),
    })),
  removeClient: (id) =>
    set((state) => ({
      clients: state.clients.filter((c) => c.id !== id),
    })),
  setLoading: (isLoading) => set({ isLoading }),
}));
