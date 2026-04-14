import {
  Document,
  Image,
  Link,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import { getPlaceImageUrl } from "@/lib/place-images";
import { TravelPlanResponse } from "@/lib/travel-plan";

const styles = StyleSheet.create({
  page: {
    padding: 28,
    fontSize: 11,
    fontFamily: "Helvetica",
    color: "#111827",
  },
  coverPage: {
    position: "relative",
    height: "100%",
    width: "100%",
  },
  coverImage: {
    width: "100%",
    height: "100%",
  },
  coverTint: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "42%",
    backgroundColor: "rgba(15, 23, 42, 0.72)",
  },
  coverTextBlock: {
    position: "absolute",
    left: 28,
    right: 28,
    bottom: 36,
  },
  coverBrand: {
    fontSize: 10,
    color: "#fdba74",
    letterSpacing: 2,
    marginBottom: 8,
    textTransform: "uppercase",
  },
  coverTitle: {
    fontSize: 26,
    fontWeight: 700,
    color: "#ffffff",
    marginBottom: 6,
  },
  coverSubtitle: {
    fontSize: 12,
    color: "#e7e5e4",
    lineHeight: 1.45,
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
  h2: {
    fontSize: 11,
    fontWeight: 700,
    marginTop: 6,
    marginBottom: 4,
    color: "#1c1917",
  },
});

type ItineraryPdfDocumentProps = {
  result: TravelPlanResponse;
  destinationLabel: string;
};

export default function ItineraryPdfDocument({
  result,
  destinationLabel,
}: ItineraryPdfDocumentProps) {
  const coverSrc = getPlaceImageUrl(destinationLabel, destinationLabel);

  return (
    <Document>
      <Page size="A4" style={{ padding: 0 }}>
        <View style={styles.coverPage}>
          <Image style={styles.coverImage} src={coverSrc} />
          <View style={styles.coverTint} />
          <View style={styles.coverTextBlock}>
            <Text style={styles.coverBrand}>EpicIndiaTrips AI Planner</Text>
            <Text style={styles.coverTitle}>{destinationLabel}</Text>
            <Text style={styles.coverSubtitle}>
              Your itinerary, budget snapshot, and creator kit — export for offline use.
            </Text>
          </View>
        </View>
      </Page>

      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Day-wise plan</Text>

        <View style={styles.section}>
          {result.dayWisePlan.map((day) => (
            <View key={day.day} style={styles.dayCard}>
              <Text style={styles.dayTitle}>
                Day {day.day}: {day.title}
                {day.estimatedDayCost ? ` — ${day.estimatedDayCost}` : ""}
              </Text>
              {day.schedule.map((stop, idx) => (
                <View key={`${day.day}-${idx}`} wrap={false}>
                  <View style={styles.stopBlock}>
                    <Text style={styles.stopTime}>{stop.timeSlot ?? stop.time}</Text>
                    {stop.timeSlot ? (
                      <Text style={styles.small}>
                        <Text style={styles.label}>Starts: </Text>
                        {stop.time}
                      </Text>
                    ) : null}
                    <Text style={styles.line}>
                      <Text style={styles.label}>{stop.activity}</Text>
                      {stop.hiddenGem ? " · Hidden gem" : ""}
                    </Text>
                    <Text style={styles.line}>{stop.place}</Text>
                    <Text style={styles.line}>
                      <Text style={styles.label}>Cost: </Text>
                      {stop.estimatedCost}
                    </Text>
                    {stop.localInsight ? (
                      <Text style={styles.line}>
                        <Text style={styles.label}>Insight: </Text>
                        {stop.localInsight}
                      </Text>
                    ) : null}
                    {stop.localTip ? (
                      <Text style={styles.line}>
                        <Text style={styles.label}>Tip: </Text>
                        {stop.localTip}
                      </Text>
                    ) : null}
                    <Link src={stop.mapsLink} style={[styles.line, styles.link]}>
                      View on Google Maps
                    </Link>
                  </View>
                  {idx < day.travelLegs.length ? (
                    <View wrap={false}>
                      <Text style={styles.leg}>
                        {day.travelLegs[idx].duration}
                        {day.travelLegs[idx].distance ? ` · ${day.travelLegs[idx].distance}` : ""}
                        {day.travelLegs[idx].mode ? ` · ${day.travelLegs[idx].mode}` : ""}
                        {day.travelLegs[idx].legCost ? ` · ${day.travelLegs[idx].legCost}` : ""} —{" "}
                        {day.travelLegs[idx].fromPlace} → {day.travelLegs[idx].toPlace}
                      </Text>
                      {day.travelLegs[idx].route ? (
                        <Text style={[styles.small, { marginBottom: 4 }]}>
                          <Text style={styles.label}>Route: </Text>
                          {day.travelLegs[idx].route}
                        </Text>
                      ) : null}
                      {day.travelLegs[idx].note ? (
                        <Text style={[styles.small, { marginBottom: 4 }]}>{day.travelLegs[idx].note}</Text>
                      ) : null}
                    </View>
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
        <Text style={styles.title}>Reels & creator kit</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reel ideas</Text>
          {result.reelIdeas.map((idea, i) => (
            <View key={`reel-${i}`} style={styles.compactCard} wrap={false}>
              <Text style={styles.line}>
                <Text style={styles.label}>{i + 1}. </Text>
                {idea.hook}
              </Text>
              {idea.script ? (
                <Text style={styles.small}>
                  <Text style={styles.label}>Script: </Text>
                  {idea.script}
                </Text>
              ) : null}
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
      </Page>

      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Blog draft</Text>
        <View style={styles.section}>
          <Text style={styles.line}>
            <Text style={styles.label}>{result.blogContent.title}</Text>
          </Text>
          <Text style={styles.small}>{result.blogContent.preview}</Text>
          {result.blogContent.seoSections?.map((sec, i) => (
            <View key={`seo-${i}`} wrap={false}>
              <Text style={styles.h2}>{sec.heading}</Text>
              <Text style={styles.small}>{sec.body}</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
}
