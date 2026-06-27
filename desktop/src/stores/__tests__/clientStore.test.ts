import { describe, it, expect, beforeEach } from "vitest";
import { useClientStore } from "../clientStore";
import type { Client } from "@/types";

const mockClient: Client = {
  id: 1,
  user_id: "local-user",
  name: "Test Client",
  email: "test@example.com",
  phone: "+628123456789",
  address: "Jl. Test No. 1",
  city: "Jakarta",
  postal_code: "12345",
  notes: null,
  created_at: "2026-01-01T00:00:00Z",
  updated_at: "2026-01-01T00:00:00Z",
};

describe("clientStore", () => {
  beforeEach(() => {
    useClientStore.setState({
      clients: [],
      isLoading: false,
    });
  });

  it("should have initial state", () => {
    const state = useClientStore.getState();
    expect(state.clients).toEqual([]);
    expect(state.isLoading).toBe(false);
  });

  it("should set clients", () => {
    useClientStore.getState().setClients([mockClient]);
    expect(useClientStore.getState().clients).toHaveLength(1);
  });

  it("should add client", () => {
    useClientStore.getState().addClient(mockClient);
    expect(useClientStore.getState().clients).toHaveLength(1);
    expect(useClientStore.getState().clients[0].name).toBe("Test Client");
  });

  it("should update client", () => {
    useClientStore.getState().setClients([mockClient]);
    useClientStore.getState().updateClient(1, { name: "Updated Client" });
    expect(useClientStore.getState().clients[0].name).toBe("Updated Client");
  });

  it("should remove client", () => {
    useClientStore.getState().setClients([mockClient]);
    useClientStore.getState().removeClient(1);
    expect(useClientStore.getState().clients).toHaveLength(0);
  });

  it("should set loading", () => {
    useClientStore.getState().setLoading(true);
    expect(useClientStore.getState().isLoading).toBe(true);
  });
});