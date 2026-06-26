import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { InvoiceTemplateData } from "./types";
import { formatCurrency, formatDate } from "./types";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#1a1a1a",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40,
  },
  businessInfo: {
    flexDirection: "column",
  },
  businessName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  businessDetail: {
    fontSize: 9,
    color: "#666",
    marginBottom: 2,
  },
  invoiceTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "right",
    marginBottom: 8,
  },
  invoiceNumber: {
    fontSize: 10,
    color: "#666",
    textAlign: "right",
  },
  section: {
    marginBottom: 30,
  },
  label: {
    fontSize: 8,
    color: "#999",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
  },
  value: {
    fontSize: 10,
    marginBottom: 2,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  column: {
    flexDirection: "column",
    width: "48%",
  },
  table: {
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 2,
    borderBottomColor: "#1a1a1a",
    paddingBottom: 6,
    marginBottom: 8,
  },
  tableHeaderText: {
    fontSize: 8,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    color: "#666",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
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
    width: 250,
    paddingVertical: 8,
    borderTopWidth: 2,
    borderTopColor: "#1a1a1a",
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 12,
    fontWeight: "bold",
  },
  totalValue: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "right",
  },
  footer: {
    marginTop: 40,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  notesTitle: {
    fontSize: 9,
    fontWeight: "bold",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  notesText: {
    fontSize: 9,
    color: "#666",
    lineHeight: 1.5,
  },
  watermark: {
    position: "absolute",
    bottom: 20,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 7,
    color: "#ccc",
  },
});

interface MinimalisTemplateProps {
  data: InvoiceTemplateData;
}

export function MinimalisTemplate({ data }: MinimalisTemplateProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.businessInfo}>
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
            <Text style={styles.invoiceTitle}>INVOICE</Text>
            <Text style={styles.invoiceNumber}>
              {data.invoice.invoice_number}
            </Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.label}>Ditagihkan Kepada</Text>
            <Text style={[styles.value, { fontWeight: "bold" }]}>
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
            <View style={{ marginBottom: 10 }}>
              <Text style={styles.label}>Tanggal Invoice</Text>
              <Text style={styles.value}>
                {formatDate(data.invoice.issue_date)}
              </Text>
            </View>
            <View>
              <Text style={styles.label}>Jatuh Tempo</Text>
              <Text style={styles.value}>
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
              {formatCurrency(data.invoice.total, data.invoice.currency)}
            </Text>
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

        <Text style={styles.watermark}>
          Invoice - invoice.gdg.my.id
        </Text>
      </Page>
    </Document>
  );
}
