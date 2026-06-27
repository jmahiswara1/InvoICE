import { useEffect } from "react";
import { recurringService } from "@/lib/recurringService";

export function useRecurringCheck(onGenerate?: () => void) {
  const userId = "local-user";

  useEffect(() => {
    const checkRecurring = async () => {
      try {
        const dueTemplates = await recurringService.getDueForGeneration(userId);
        if (dueTemplates.length > 0 && onGenerate) {
          onGenerate();
        }
      } catch (error) {
        console.error("Failed to check recurring:", error);
      }
    };

    checkRecurring();
  }, []);
}