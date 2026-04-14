import {
  Document,
  Link,
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
    marginBottom: 6,
  },
  stopBlock: {
    marginBottom: 6,
    paddingLeft: 4,
    borderLeftWidth: 2,
    borderLeftColor: "#FF6B35",
    borderLeftStyle: "solid",
  },
  stopTime: {
    fontSize: 10,
    color: "#C2410C",
    marginBottom: 2,
    fontWeight: 700,
  },
  line: {
    marginBottom: 2,
    lineHeight: 1.4,
  },
  leg: {
    marginBottom: 4,
    marginLeft: 6,
    paddingLeft: 6,
    borderLeftWidth: 1,
    borderLeftColor: "#D1D5DB",
    borderLeftStyle: "dashed",
    fontSize: 9,
    color: "#4B5563",
  },
  budgetRow: {
    marginBottom: 4,
  },
  label: {
    fontWeight: 700,
  },
  link: {
    color: "#2563EB",
    textDecoration: "underline",
  },
  compactCard: {
    marginBottom: 6,
    padding: 6,
    backgroundColor: "#FAFAF9",
    borderRadius: 4,
  },
  small: {
    fontSize: 9,
    lineHeight: 1.35,
    color: "#374151",
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
              {day.schedule.map((stop, idx) => (
                <View key={`${day.day}-${idx}`} wrap={false}>
                  <View style={styles.stopBlock}>
                    <Text style={styles.stopTime}>{stop.time}</Text>
                    <Text style={styles.line}>
                      <Text style={styles.label}>{stop.activity}</Text>
                      {stop.hiddenGem ? " · Hidden gem" : ""}
                    </Text>
                    <Text style={styles.line}>{stop.place}</Text>
                    <Text style={styles.line}>
                      <Text style={styles.label}>Cost: </Text>
                      {stop.estimatedCost}
                    </Text>
                    {stop.localTip ? (
                      <Text style={styles.line}>
                        <Text style={styles.label}>Tip: </Text>
                        {stop.localTip}
                      </Text>
                    ) : null}
                    <Link src={stop.mapsLink} style={[styles.line, styles.link]}>
                      Google Maps
                    </Link>
                  </View>
                  {idx < day.travelLegs.length ? (
                    <Text style={styles.leg}>
                      {day.travelLegs[idx].duration}
                      {day.travelLegs[idx].mode ? ` · ${day.travelLegs[idx].mode}` : ""} —{" "}
                      {day.travelLegs[idx].fromPlace} → {day.travelLegs[idx].toPlace}
                      {day.travelLegs[idx].note ? `. ${day.travelLegs[idx].note}` : ""}
                    </Text>
                  ) : null}
                </View>
              ))}
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

      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Content &amp; photo kit</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reel ideas</Text>
          {result.reelIdeas.map((idea, i) => (
            <View key={`reel-${i}`} style={styles.compactCard} wrap={false}>
              <Text style={styles.line}>
                <Text style={styles.label}>{i + 1}. </Text>
                {idea.hook}
              </Text>
              <Text style={styles.small}>{idea.caption}</Text>
              <Text style={[styles.small, { marginTop: 4 }]}>{idea.hashtags.join(" ")}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Instagram spots</Text>
          {result.instagramSpots.map((spot, i) => (
            <View key={`ig-${i}`} style={styles.compactCard} wrap={false}>
              <Text style={styles.line}>
                <Text style={styles.label}>{spot.place}</Text>
              </Text>
              <Text style={styles.small}>{spot.whyItWorks}</Text>
              <Text style={styles.small}>
                <Text style={styles.label}>Light: </Text>
                {spot.bestTime}
              </Text>
              <Text style={styles.small}>
                <Text style={styles.label}>Shot: </Text>
                {spot.shotIdea}
              </Text>
              {spot.mapsLink ? (
                <Link src={spot.mapsLink} style={[styles.small, styles.link]}>
                  Maps
                </Link>
              ) : null}
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Photo angles</Text>
          {result.photoAngles.map((row, i) => (
            <View key={`pa-${i}`} style={styles.compactCard} wrap={false}>
              <Text style={styles.line}>
                <Text style={styles.label}>{row.spot}</Text>
              </Text>
              <Text style={styles.small}>
                <Text style={styles.label}>Angle: </Text>
                {row.angle}
              </Text>
              <Text style={styles.small}>
                <Text style={styles.label}>Composition: </Text>
                {row.composition}
              </Text>
              <Text style={styles.small}>
                <Text style={styles.label}>Light: </Text>
                {row.lighting}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Blog draft</Text>
          <Text style={styles.line}>
            <Text style={styles.label}>{result.blogContent.title}</Text>
          </Text>
          <Text style={styles.small}>{result.blogContent.preview}</Text>
        </View>
      </Page>
    </Document>
  );
}
