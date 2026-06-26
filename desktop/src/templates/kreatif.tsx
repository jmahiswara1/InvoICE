import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { InvoiceTemplateData } from "./types";
import { formatCurrency, formatDate } from "./types";

const styles = StyleSheet.create({
  page: {
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#1a1a1a",
  },
  header: {
    padding: 40,
    paddingBottom: 30,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 30,
  },
  businessName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  businessDetail: {
    fontSize: 9,
    color: "#666",
    marginBottom: 2,
  },
  invoiceNumber: {
    fontSize: 10,
    color: "#8b5cf6",
    fontWeight: "bold",
    textAlign: "right",
  },
  titleSection: {
    borderBottomWidth: 3,
    borderBottomColor: "#8b5cf6",
    paddingBottom: 15,
  },
  invoiceTitle: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#8b5cf6",
    marginBottom: 4,
  },
  invoiceSubtitle: {
    fontSize: 10,
    color: "#666",
  },
  content: {
    padding: 40,
    paddingTop: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  column: {
    flexDirection: "column",
    width: "48%",
  },
  label: {
    fontSize: 8,
    color: "#8b5cf6",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    fontWeight: "bold",
    marginBottom: 6,
  },
  value: {
    fontSize: 10,
    marginBottom: 2,
  },
  dateContainer: {
    flexDirection: "row",
    gap: 15,
    marginBottom: 10,
  },
  dateBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 12,
  },
  dateLabel: {
    fontSize: 7,
    color: "#8b5cf6",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
  },
  dateValue: {
    fontSize: 10,
    fontWeight: "bold",
  },
  table: {
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 2,
    borderColor: "#1a1a1a",
  },
  tableHeaderText: {
    fontSize: 8,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  colDesc: { width: "50%" },
  colQty: { width: "15%", textAlign: "center" },
  colPrice: { width: "20%", textAlign: "right" },
  colAmount: { width: "15%", textAlign: "right" },
  summary: {
    marginTop: 20,
    alignItems: "flex-end",
  },
  summaryBox: {
    width: 260,
    borderWidth: 2,
    borderColor: "#1a1a1a",
    padding: 15,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 3,
  },
  summaryLabel: {
    fontSize: 10,
    color: "#666",
  },
  summaryValue: {
    fontSize: 10,
    textAlign: "right",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderTopWidth: 2,
    borderTopColor: "#8b5cf6",
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#8b5cf6",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#8b5cf6",
    textAlign: "right",
  },
  footer: {
    marginTop: 30,
    paddingHorizontal: 40,
    paddingTop: 20,
  },
  footerDivider: {
    borderBottomWidth: 2,
    borderBottomColor: "#8b5cf6",
    marginBottom: 15,
  },
  notesContainer: {
    flexDirection: "row",
    gap: 20,
  },
  notesColumn: {
    flex: 1,
  },
  notesTitle: {
    fontSize: 8,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#8b5cf6",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  notesText: {
    fontSize: 9,
    color: "#666",
    lineHeight: 1.6,
  },
  statusBadge: {
    fontSize: 8,
    textTransform: "uppercase",
    letterSpacing: 2,
    color: "#8b5cf6",
    fontWeight: "bold",
  },
});

interface KreatifTemplateProps {
  data: InvoiceTemplateData;
}

export function KreatifTemplate({ data }: KreatifTemplateProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.businessName}>
                {data.business.name || "Nama Bisnis"}
              </Text>
              {data.business.address && (
                <Text style={styles.businessDetail}>
                  {data.business.address}
                </Text>
              )}
              {data.business.email && (
                <Text style={styles.businessDetail}>
                  {data.business.email}
                </Text>
              )}
              {data.business.phone && (
                <Text style={styles.businessDetail}>
                  {data.business.phone}
                </Text>
              )}
            </View>
            <View>
              <Text style={styles.invoiceNumber}>
                {data.invoice.invoice_number}
              </Text>
              <Text style={styles.statusBadge}>
                {data.invoice.status}
              </Text>
            </View>
          </View>
          <View style={styles.titleSection}>
            <Text style={styles.invoiceTitle}>Invoice</Text>
            <Text style={styles.invoiceSubtitle}>
              Jatuh tempo: {formatDate(data.invoice.due_date)}
            </Text>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.label}>Ditagihkan Kepada</Text>
              <Text style={[styles.value, { fontWeight: "bold", fontSize: 12 }]}>
                {data.client.name}
              </Text>
              {data.client.address && (
                <Text style={styles.value}>{data.client.address}</Text>
              )}
              {data.client.city && (
                <Text style={styles.value}>
                  {data.client.city}
                  {data.client.postal_code
                    ? ` ${data.client.postal_code}`
                    : ""}
                </Text>
              )}
              {data.client.email && (
                <Text style={styles.value}>{data.client.email}</Text>
              )}
              {data.client.phone && (
                <Text style={styles.value}>{data.client.phone}</Text>
              )}
            </View>
            <View style={styles.column}>
              <View style={styles.dateContainer}>
                <View style={styles.dateBox}>
                  <Text style={styles.dateLabel}>Tanggal</Text>
                  <Text style={styles.dateValue}>
                    {formatDate(data.invoice.issue_date)}
                  </Text>
                </View>
                <View style={styles.dateBox}>
                  <Text style={styles.dateLabel}>Jatuh Tempo</Text>
                  <Text style={styles.dateValue}>
                    {formatDate(data.invoice.due_date)}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderText, styles.colDesc]}>
                Deskripsi
              </Text>
              <Text style={[styles.tableHeaderText, styles.colQty]}>
                Qty
              </Text>
              <Text style={[styles.tableHeaderText, styles.colPrice]}>
                Harga
              </Text>
              <Text style={[styles.tableHeaderText, styles.colAmount]}>
                Jumlah
              </Text>
            </View>
            {data.items.map((item, i) => (
              <View key={i} style={styles.tableRow}>
                <Text style={styles.colDesc}>{item.description}</Text>
                <Text style={styles.colQty}>{item.quantity}</Text>
                <Text style={styles.colPrice}>
                  {formatCurrency(item.unit_price, data.invoice.currency)}
                </Text>
                <Text style={styles.colAmount}>
                  {formatCurrency(item.amount, data.invoice.currency)}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.summary}>
            <View style={styles.summaryBox}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>
                  {formatCurrency(
                    data.invoice.subtotal,
                    data.invoice.currency
                  )}
                </Text>
              </View>
              {data.invoice.discount_amount > 0 && (
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Diskon</Text>
                  <Text style={styles.summaryValue}>
                    -
                    {formatCurrency(
                      data.invoice.discount_amount,
                      data.invoice.currency
                    )}
                  </Text>
                </View>
              )}
              {data.invoice.tax_enabled && (
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>
                    PPN {data.invoice.tax_rate}%
                  </Text>
                  <Text style={styles.summaryValue}>
                    {formatCurrency(
                      data.invoice.tax_amount,
                      data.invoice.currency
                    )}
                  </Text>
                </View>
              )}
              {data.invoice.shipping_cost > 0 && (
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Ongkir</Text>
                  <Text style={styles.summaryValue}>
                    {formatCurrency(
                      data.invoice.shipping_cost,
                      data.invoice.currency
                    )}
                  </Text>
                </View>
              )}
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>
                  {formatCurrency(
                    data.invoice.total,
                    data.invoice.currency
                  )}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {(data.invoice.notes || data.invoice.terms) && (
          <View style={styles.footer}>
            <View style={styles.footerDivider} />
            <View style={styles.notesContainer}>
              {data.invoice.notes && (
                <View style={styles.notesColumn}>
                  <Text style={styles.notesTitle}>Catatan</Text>
                  <Text style={styles.notesText}>
                    {data.invoice.notes}
                  </Text>
                </View>
              )}
              {data.invoice.terms && (
                <View style={styles.notesColumn}>
                  <Text style={styles.notesTitle}>
                    Syarat & Ketentuan
                  </Text>
                  <Text style={styles.notesText}>
                    {data.invoice.terms}
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}
      </Page>
    </Document>
  );
}
