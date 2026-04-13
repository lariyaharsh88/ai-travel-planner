import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import { TravelPlanResponse } from "@/lib/travel-plan";

const styles = StyleSheet.create({
  page: {
    padding: 28,
    fontSize: 11,
    fontFamily: "Helvetica",
    color: "#111827",
  },
  title: {
    fontSize: 20,
    marginBottom: 14,
    fontWeight: 700,
  },
  section: {
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    borderBottomStyle: "solid",
  },
  sectionTitle: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: 700,
  },
  dayCard: {
    marginBottom: 8,
    padding: 8,
    backgroundColor: "#F9FAFB",
    borderRadius: 6,
  },
  dayTitle: {
    fontWeight: 700,
    marginBottom: 4,
  },
  line: {
    marginBottom: 2,
    lineHeight: 1.4,
  },
  budgetRow: {
    marginBottom: 4,
  },
  label: {
    fontWeight: 700,
  },
});

type ItineraryPdfDocumentProps = {
  result: TravelPlanResponse;
};

export default function ItineraryPdfDocument({
  result,
}: ItineraryPdfDocumentProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>AI Travel Planner - Itinerary</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Day-wise Plan</Text>
          {result.dayWisePlan.map((day) => (
            <View key={day.day} style={styles.dayCard}>
              <Text style={styles.dayTitle}>
                Day {day.day}: {day.title}
              </Text>
              <Text style={styles.line}>
                <Text style={styles.label}>Activities: </Text>
                {day.activities.join(", ")}
              </Text>
              <Text style={styles.line}>
                <Text style={styles.label}>Places: </Text>
                {day.places.join(", ")}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Budget</Text>
          <Text style={styles.budgetRow}>
            <Text style={styles.label}>Stay: </Text>
            {result.budgetBreakdown.stay}
          </Text>
          <Text style={styles.budgetRow}>
            <Text style={styles.label}>Food: </Text>
            {result.budgetBreakdown.food}
          </Text>
          <Text style={styles.budgetRow}>
            <Text style={styles.label}>Transport: </Text>
            {result.budgetBreakdown.transport}
          </Text>
        </View>
      </Page>
    </Document>
  );
}
