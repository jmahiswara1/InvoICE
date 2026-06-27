import { cn } from "@/lib/utils";
import { t } from "@/i18n";

type TemplateType = "minimalis" | "profesional" | "kreatif";

interface TemplateTabsProps {
  value: TemplateType;
  onChange: (template: TemplateType) => void;
}

const templates: TemplateType[] = ["minimalis", "profesional", "kreatif"];

export function TemplateTabs({ value, onChange }: TemplateTabsProps) {
  return (
    <div className="flex border-b">
      {templates.map((tpl) => (
        <button
          key={tpl}
          onClick={() => onChange(tpl)}
          className={cn(
            "px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px",
            value === tpl
              ? "border-foreground text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          {t(`templates.${tpl}`)}
        </button>
      ))}
    </div>
  );
}