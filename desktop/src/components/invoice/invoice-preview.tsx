import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";
import { MinimalisTemplate } from "@/templates/minimalis";
import { ProfesionalTemplate } from "@/templates/profesional";
import { KreatifTemplate } from "@/templates/kreatif";
import type { InvoiceTemplateData } from "@/templates/types";
import { Button } from "@/components/ui/button";
import { Download, X } from "lucide-react";

interface InvoicePreviewProps {
  open: boolean;
  onClose: () => void;
  data: InvoiceTemplateData;
  template: "minimalis" | "profesional" | "kreatif";
}

const templateMap = {
  minimalis: MinimalisTemplate,
  profesional: ProfesionalTemplate,
  kreatif: KreatifTemplate,
};

export function InvoicePreview({
  open,
  onClose,
  data,
  template,
}: InvoicePreviewProps) {
  if (!open) return null;

  const TemplateComponent = templateMap[template];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-background border w-full max-w-4xl h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">
            Preview Invoice — {template.charAt(0).toUpperCase() + template.slice(1)}
          </h2>
          <div className="flex items-center gap-2">
            <PDFDownloadLink
              document={<TemplateComponent data={data} />}
              fileName={`${data.invoice.invoice_number}.pdf`}
            >
              {({ loading }) => (
                <Button size="sm" className="gap-2" disabled={loading}>
                  <Download className="h-4 w-4" />
                  {loading ? "Generating..." : "Download PDF"}
                </Button>
              )}
            </PDFDownloadLink>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex-1 overflow-hidden">
          <PDFViewer width="100%" height="100%" showToolbar={false}>
            <TemplateComponent data={data} />
          </PDFViewer>
        </div>
      </div>
    </div>
  );
}
