import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { InvoiceTemplateData } from "./types";
import { formatCurrency, formatDate } from "./types";

const ACCENT = "#2563eb";
const ACCENT_LIGHT = "#93c5fd";
const ACCENT_BG = "#eff6ff";
const GRAY_LIGHT = "#f8fafc";

const styles = StyleSheet.create({
  page: { fontSize: 10, fontFamily: "Helvetica", color: "#1a1a1a" },
  header: {
    backgroundColor: ACCENT, padding: 40, flexDirection: "row",
    justifyContent: "space-between", alignItems: "flex-start",
  },
  headerLeft: { flexDirection: "column", width: "40%" },
  logoPlaceholder: {
    width: 60, height: 60, borderWidth: 2, borderColor: "#ffffff",
    justifyContent: "center", alignItems: "center", marginBottom: 8,
  },
  logoText: { fontSize: 7, color: "#ffffff" },
  businessName: { fontSize: 14, fontWeight: "bold", color: "#ffffff", marginBottom: 3 },
  businessDetail: { fontSize: 9, color: ACCENT_LIGHT, marginBottom: 1 },
  headerRight: { flexDirection: "column", alignItems: "flex-end", width: "45%" },
  invoiceTitle: { fontSize: 30, fontWeight: "bold", color: "#ffffff", letterSpacing: 3, marginBottom: 5 },
  headerMetaLabel: { fontSize: 7, color: ACCENT_LIGHT, textTransform: "uppercase", letterSpacing: 1 },
  headerMetaValue: { fontSize: 10, color: "#ffffff", marginBottom: 4 },
  content: { padding: 40 },
  grayBlock: {
    backgroundColor: ACCENT_BG, padding: 20, flexDirection: "row", gap: 15, marginBottom: 25,
    borderLeftWidth: 4, borderLeftColor: ACCENT,
  },
  grayCol: { flex: 1 },
  grayLabel: {
    fontSize: 7, fontWeight: "bold", textTransform: "uppercase",
    letterSpacing: 1.5, color: ACCENT, marginBottom: 6, paddingBottom: 4,
    borderBottomWidth: 1, borderBottomColor: ACCENT_LIGHT,
  },
  grayValue: { fontSize: 9, color: "#666", marginBottom: 2 },
  grayValueBold: { fontSize: 10, fontWeight: "bold", marginBottom: 3 },
  tableHeader: {
    flexDirection: "row", borderBottomWidth: 2, borderBottomColor: ACCENT,
    paddingBottom: 8,
  },
  tableHeaderText: {
    fontSize: 7, fontWeight: "bold", textTransform: "uppercase", letterSpacing: 1, color: ACCENT,
  },
  tableRow: {
    flexDirection: "row", paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "#eee",
  },
  tableRowAlt: { backgroundColor: GRAY_LIGHT },
  colProduct: { width: "20%" },
  colDesc: { width: "35%" },
  colQty: { width: "10%", textAlign: "center" },
  colRate: { width: "17%", textAlign: "right" },
  colAmount: { width: "18%", textAlign: "right" },
  tableItemDesc: { fontSize: 9, color: "#888" },
  footer: { flexDirection: "row", marginTop: 25, gap: 30 },
  footerLeft: { flex: 1 },
  footerRight: { width: 250 },
  sectionTitle: {
    fontSize: 7, fontWeight: "bold", textTransform: "uppercase",
    letterSpacing: 1.5, color: ACCENT, marginBottom: 5,
  },
  messageText: { fontSize: 9, color: "#666", lineHeight: 1.5, marginBottom: 15 },
  paymentRow: { flexDirection: "row", gap: 8, marginBottom: 2 },
  paymentLabel: { fontSize: 8, color: ACCENT_LIGHT },
  paymentValue: { fontSize: 9, color: "#666" },
  signatureLine: {
    marginTop: 20, borderBottomWidth: 2, borderBottomColor: ACCENT, width: 200,
    paddingBottom: 5,
  },
  signatureText: { fontSize: 8, color: ACCENT, marginTop: 3 },
  summaryBox: { backgroundColor: ACCENT_BG, padding: 15, borderLeftWidth: 4, borderLeftColor: ACCENT },
  summaryRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 4 },
  summaryLabel: { fontSize: 10, color: "#666" },
  summaryValue: { fontSize: 10, textAlign: "right" },
  totalBox: { backgroundColor: ACCENT, padding: 12, marginTop: 5 },
  totalRow: { flexDirection: "row", justifyContent: "space-between" },
  totalLabel: { fontSize: 14, fontWeight: "bold", color: "#ffffff" },
  totalValue: { fontSize: 16, fontWeight: "bold", color: "#ffffff" },
});

export function KreatifTemplate({ data }: { data: InvoiceTemplateData }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Solid Blue Header Block */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.logoPlaceholder}>
              <Text style={styles.logoText}>LOGO</Text>
            </View>
            <Text style={styles.businessName}>{data.business.name || "Your Company Name"}</Text>
            {data.business.address && <Text style={styles.businessDetail}>{data.business.address}</Text>}
            {data.business.phone && <Text style={styles.businessDetail}>Tel: {data.business.phone}</Text>}
            {data.business.email && <Text style={styles.businessDetail}>Email: {data.business.email}</Text>}
            {data.business.website && <Text style={styles.businessDetail}>Web: {data.business.website}</Text>}
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.invoiceTitle}>INVOICE</Text>
            <Text style={styles.headerMetaLabel}>Invoice #</Text>
            <Text style={styles.headerMetaValue}>{data.invoice.invoice_number}</Text>
            <Text style={styles.headerMetaLabel}>Issue Date</Text>
            <Text style={styles.headerMetaValue}>{formatDate(data.invoice.issue_date)}</Text>
            <Text style={styles.headerMetaLabel}>Due Date</Text>
            <Text style={styles.headerMetaValue}>{formatDate(data.invoice.due_date)}</Text>
          </View>
        </View>

        <View style={styles.content}>
          {/* Gray Block with Blue Left Border */}
          <View style={styles.grayBlock}>
            <View style={styles.grayCol}>
              <Text style={styles.grayLabel}>Bill To</Text>
              <Text style={styles.grayValueBold}>{data.client.name}</Text>
              {data.client.address && <Text style={styles.grayValue}>{data.client.address}</Text>}
              {data.client.city && <Text style={styles.grayValue}>{data.client.city}{data.client.postal_code ? ` ${data.client.postal_code}` : ""}</Text>}
              {data.client.email && <Text style={styles.grayValue}>{data.client.email}</Text>}
              {data.client.phone && <Text style={styles.grayValue}>{data.client.phone}</Text>}
            </View>
            <View style={styles.grayCol}>
              <Text style={styles.grayLabel}>Ship To</Text>
              <Text style={styles.grayValueBold}>{data.client.ship_to_name || data.client.name}</Text>
              <Text style={styles.grayValue}>{data.client.ship_to_address || data.client.address || "-"}</Text>
              {data.client.ship_to_city && <Text style={styles.grayValue}>{data.client.ship_to_city}</Text>}
              {(data.client.ship_to_address === null && data.client.address === null) && <Text style={styles.grayValue}>Same as Bill To</Text>}
            </View>
            <View style={styles.grayCol}>
              <Text style={styles.grayLabel}>Details</Text>
              <Text style={styles.grayValue}>Invoice #: <Text style={{ fontWeight: "bold" }}>{data.invoice.invoice_number}</Text></Text>
              <Text style={styles.grayValue}>Issue Date: {formatDate(data.invoice.issue_date)}</Text>
              <Text style={styles.grayValue}>Payment Terms: {data.invoice.payment_terms || "Net 30"}</Text>
              <Text style={styles.grayValue}>Due Date: {formatDate(data.invoice.due_date)}</Text>
              <Text style={styles.grayValue}>Status: {data.invoice.status}</Text>
            </View>
          </View>

          {/* Table */}
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, styles.colProduct]}>Product / Service</Text>
            <Text style={[styles.tableHeaderText, styles.colDesc]}>Description</Text>
            <Text style={[styles.tableHeaderText, styles.colQty]}>Qty</Text>
            <Text style={[styles.tableHeaderText, styles.colRate]}>Rate</Text>
            <Text style={[styles.tableHeaderText, styles.colAmount]}>Amount</Text>
          </View>
          {data.items.map((item, i) => (
            <View key={i} style={[styles.tableRow, ...(i % 2 === 1 ? [styles.tableRowAlt] : [])]}>
              <Text style={styles.colProduct}>{item.description}</Text>
              <Text style={styles.colDesc}>
                {item.item_description || ""}
                {"\n"}<Text style={styles.tableItemDesc}>{item.item_description || ""}</Text>
              </Text>
              <Text style={styles.colQty}>{item.quantity}</Text>
              <Text style={styles.colRate}>{formatCurrency(item.unit_price, data.invoice.currency)}</Text>
              <Text style={styles.colAmount}>{formatCurrency(item.amount, data.invoice.currency)}</Text>
            </View>
          ))}

          {/* Footer */}
          <View style={styles.footer}>
            <View style={styles.footerLeft}>
              {data.invoice.customer_message && (
                <View style={{ marginBottom: 15 }}>
                  <Text style={styles.sectionTitle}>Customer Message</Text>
                  <Text style={styles.messageText}>{data.invoice.customer_message}</Text>
                </View>
              )}
              {(data.payment_instructions.bank_name || data.invoice.terms) && (
                <View style={{ marginBottom: 15 }}>
                  <Text style={styles.sectionTitle}>Payment Instructions</Text>
                  {data.payment_instructions.bank_name && (
                    <View style={styles.paymentRow}>
                      <Text style={styles.paymentLabel}>Bank:</Text>
                      <Text style={styles.paymentValue}>{data.payment_instructions.bank_name}</Text>
                    </View>
                  )}
                  {data.payment_instructions.account_number && (
                    <View style={styles.paymentRow}>
                      <Text style={styles.paymentLabel}>Account:</Text>
                      <Text style={styles.paymentValue}>{data.payment_instructions.account_number}</Text>
                    </View>
                  )}
                  {data.payment_instructions.account_holder && (
                    <View style={styles.paymentRow}>
                      <Text style={styles.paymentLabel}>Name:</Text>
                      <Text style={styles.paymentValue}>{data.payment_instructions.account_holder}</Text>
                    </View>
                  )}
                  {data.invoice.terms && <Text style={[styles.messageText, { marginTop: 5 }]}>{data.invoice.terms}</Text>}
                </View>
              )}
              <View style={styles.signatureLine} />
              <Text style={styles.signatureText}>Authorized Signature</Text>
            </View>

            <View style={styles.footerRight}>
              <View style={styles.summaryBox}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Subtotal</Text>
                  <Text style={styles.summaryValue}>{formatCurrency(data.invoice.subtotal, data.invoice.currency)}</Text>
                </View>
                {data.invoice.discount_amount > 0 && (
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Discount</Text>
                    <Text style={styles.summaryValue}>-{formatCurrency(data.invoice.discount_amount, data.invoice.currency)}</Text>
                  </View>
                )}
                {data.invoice.tax_enabled && (
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Tax ({data.invoice.tax_rate}%)</Text>
                    <Text style={styles.summaryValue}>{formatCurrency(data.invoice.tax_amount, data.invoice.currency)}</Text>
                  </View>
                )}
                {data.invoice.shipping_cost > 0 && (
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Shipping</Text>
                    <Text style={styles.summaryValue}>{formatCurrency(data.invoice.shipping_cost, data.invoice.currency)}</Text>
                  </View>
                )}
                <View style={styles.totalBox}>
                  <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>TOTAL</Text>
                    <Text style={styles.totalValue}>{formatCurrency(data.invoice.total, data.invoice.currency)}</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}