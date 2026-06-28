import { useEffect } from "react";
import { recurringService } from "@/lib/recurringService";
import { getLocalUserId } from "@/lib/userId";

export function useRecurringCheck(onGenerate?: () => void) {
  const userId = getLocalUserId();

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