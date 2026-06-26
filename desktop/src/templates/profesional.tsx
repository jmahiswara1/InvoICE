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
    backgroundColor: "#1e3a5f",
    padding: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: {
    flexDirection: "column",
  },
  businessName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 4,
  },
  businessDetail: {
    fontSize: 9,
    color: "#a8c4e0",
    marginBottom: 2,
  },
  headerRight: {
    alignItems: "flex-end",
  },
  invoiceTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 6,
  },
  invoiceNumber: {
    fontSize: 11,
    color: "#a8c4e0",
  },
  content: {
    padding: 40,
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
    color: "#1e3a5f",
    textTransform: "uppercase",
    letterSpacing: 1,
    fontWeight: "bold",
    marginBottom: 6,
  },
  value: {
    fontSize: 10,
    marginBottom: 2,
  },
  dateBox: {
    backgroundColor: "#f0f5fa",
    padding: 12,
    marginBottom: 10,
  },
  dateLabel: {
    fontSize: 8,
    color: "#1e3a5f",
    textTransform: "uppercase",
    letterSpacing: 0.5,
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
    backgroundColor: "#1e3a5f",
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  tableHeaderText: {
    fontSize: 8,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    color: "#ffffff",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  tableRowAlt: {
    backgroundColor: "#f8fafc",
  },
  colDesc: { width: "50%" },
  colQty: { width: "15%", textAlign: "center" },
  colPrice: { width: "20%", textAlign: "right" },
  colAmount: { width: "15%", textAlign: "right" },
  summary: {
    marginTop: 20,
    alignItems: "flex-end",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 250,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  summaryLabel: {
    fontSize: 10,
    color: "#666",
  },
  summaryValue: {
    fontSize: 10,
    textAlign: "right",
  },
  totalBox: {
    backgroundColor: "#1e3a5f",
    padding: 15,
    marginTop: 10,
    width: 270,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  totalLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#ffffff",
  },
  totalValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "right",
  },
  footer: {
    marginTop: 30,
    paddingHorizontal: 40,
    paddingTop: 20,
    borderTopWidth: 2,
    borderTopColor: "#1e3a5f",
  },
  notesTitle: {
    fontSize: 9,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#1e3a5f",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  notesText: {
    fontSize: 9,
    color: "#666",
    lineHeight: 1.5,
  },
  statusBadge: {
    fontSize: 8,
    textTransform: "uppercase",
    letterSpacing: 1,
    color: "#a8c4e0",
    marginTop: 6,
  },
});

interface ProfesionalTemplateProps {
  data: InvoiceTemplateData;
}

export function ProfesionalTemplate({ data }: ProfesionalTemplateProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
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
          <View style={styles.headerRight}>
            <Text style={styles.invoiceTitle}>INVOICE</Text>
            <Text style={styles.invoiceNumber}>
              {data.invoice.invoice_number}
            </Text>
            <Text style={styles.statusBadge}>
              {data.invoice.status}
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
              <View style={styles.dateBox}>
                <Text style={styles.dateLabel}>Tanggal Invoice</Text>
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
              <View
                key={i}
                style={[
                  styles.tableRow,
                  ...(i % 2 === 1 ? [styles.tableRowAlt] : []),
                ]}
              >
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
            <View style={styles.totalBox}>
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
            {data.invoice.notes && (
              <View style={{ marginBottom: 10 }}>
                <Text style={styles.notesTitle}>Catatan</Text>
                <Text style={styles.notesText}>{data.invoice.notes}</Text>
              </View>
            )}
            {data.invoice.terms && (
              <View>
                <Text style={styles.notesTitle}>
                  Syarat & Ketentuan
                </Text>
                <Text style={styles.notesText}>{data.invoice.terms}</Text>
              </View>
            )}
          </View>
        )}
      </Page>
    </Document>
  );
}
