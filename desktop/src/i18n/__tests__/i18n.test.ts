import { describe, it, expect } from "vitest";
import id from "../../i18n/locales/id.json";
import en from "../../i18n/locales/en.json";

function getKeys(obj: any, prefix = ""): string[] {
  return Object.keys(obj).flatMap((key) => {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === "object" && obj[key] !== null) {
      return getKeys(obj[key], fullKey);
    }
    return [fullKey];
  });
}

describe("i18n locale files", () => {
  it("should have matching keys between id and en", () => {
    const idKeys = getKeys(id).sort();
    const enKeys = getKeys(en).sort();
    expect(idKeys).toEqual(enKeys);
  });

  it("should have same number of keys", () => {
    const idKeys = getKeys(id);
    const enKeys = getKeys(en);
    expect(idKeys.length).toBe(enKeys.length);
  });

  it("should have no empty values in id", () => {
    const checkNoEmpty = (obj: any, path = "") => {
      for (const key of Object.keys(obj)) {
        const fullPath = path ? `${path}.${key}` : key;
        if (typeof obj[key] === "object" && obj[key] !== null) {
          checkNoEmpty(obj[key], fullPath);
        } else {
          expect(obj[key], `Empty value at ${fullPath}`).toBeTruthy();
        }
      }
    };
    checkNoEmpty(id);
  });

  it("should have no empty values in en", () => {
    const checkNoEmpty = (obj: any, path = "") => {
      for (const key of Object.keys(obj)) {
        const fullPath = path ? `${path}.${key}` : key;
        if (typeof obj[key] === "object" && obj[key] !== null) {
          checkNoEmpty(obj[key], fullPath);
        } else {
          expect(obj[key], `Empty value at ${fullPath}`).toBeTruthy();
        }
      }
    };
    checkNoEmpty(en);
  });
});