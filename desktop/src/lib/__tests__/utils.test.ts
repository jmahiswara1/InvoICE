import { describe, it, expect } from "vitest";
import { cn } from "../utils";

describe("cn", () => {
  it("should merge class names", () => {
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
  });

  it("should handle conditional classes", () => {
    expect(cn("base", true && "active", false && "inactive")).toBe("base active");
  });

  it("should handle arrays", () => {
    expect(cn(["class1", "class2"])).toBe("class1 class2");
  });

  it("should handle undefined and null", () => {
    expect(cn("base", undefined, null)).toBe("base");
  });

  it("should handle empty input", () => {
    expect(cn("")).toBe("");
  });
});