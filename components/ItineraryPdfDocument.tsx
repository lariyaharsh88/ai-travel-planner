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
import type { DayPlan, TravelPlanResponse } from "@/lib/travel-plan";

const ink = "#1c1917";
const muted = "#57534e";
const subtle = "#a8a29e";
const accent = "#c2410c";
const line = "#e7e5e4";
const surface = "#fafaf9";

const styles = StyleSheet.create({
  /* ——— Cover ——— */
  coverPage: {
    position: "relative",
    width: "100%",
    height: "100%",
    backgroundColor: "#0c0a09",
  },
  coverImage: {
    width: "100%",
    height: "100%",
  },
  coverScrim: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "58%",
    backgroundColor: "rgba(12, 10, 9, 0.78)",
  },
  coverInner: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: 40,
    paddingBottom: 48,
  },
  coverKicker: {
    fontSize: 9,
    letterSpacing: 3.2,
    color: "#fdba74",
    marginBottom: 14,
    textTransform: "uppercase",
  },
  coverTitle: {
    fontSize: 32,
    fontWeight: 700,
    color: "#ffffff",
    letterSpacing: -0.8,
    lineHeight: 1.1,
    marginBottom: 10,
  },
  coverTagline: {
    fontSize: 11.5,
    color: "#d6d3d1",
    lineHeight: 1.55,
    maxWidth: 340,
    marginBottom: 18,
  },
  coverMeta: {
    fontSize: 9,
    color: "#a8a29e",
    letterSpacing: 0.6,
  },
  coverRule: {
    width: 48,
    height: 2,
    backgroundColor: accent,
    marginBottom: 20,
    borderRadius: 1,
  },

  /* ——— Content pages ——— */
  page: {
    paddingTop: 36,
    paddingBottom: 48,
    paddingHorizontal: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: ink,
    backgroundColor: "#ffffff",
  },
  footer: {
    position: "absolute",
    bottom: 28,
    left: 40,
    right: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: line,
    borderTopStyle: "solid",
    paddingTop: 10,
  },
  footerLeft: {
    fontSize: 8,
    color: subtle,
    letterSpacing: 0.8,
  },

  sectionLabel: {
    fontSize: 8,
    letterSpacing: 2.4,
    color: accent,
    marginBottom: 6,
    textTransform: "uppercase",
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: 700,
    color: ink,
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: line,
    borderBottomStyle: "solid",
  },

  /* Day */
  dayKicker: {
    fontSize: 8,
    letterSpacing: 2.2,
    color: accent,
    marginBottom: 4,
    textTransform: "uppercase",
  },
  dayTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: ink,
    letterSpacing: -0.3,
    marginBottom: 6,
  },
  dayCost: {
    fontSize: 9.5,
    color: muted,
    marginBottom: 20,
    lineHeight: 1.4,
  },

  stopCard: {
    marginBottom: 14,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f4",
    borderBottomStyle: "solid",
  },
  stopTime: {
    fontSize: 9,
    fontWeight: 700,
    color: accent,
    marginBottom: 4,
    letterSpacing: 0.2,
  },
  stopActivity: {
    fontSize: 10.5,
    fontWeight: 700,
    color: ink,
    marginBottom: 3,
    lineHeight: 1.35,
  },
  stopPlace: {
    fontSize: 10,
    color: muted,
    marginBottom: 6,
    lineHeight: 1.4,
  },
  stopMeta: {
    fontSize: 9,
    color: muted,
    lineHeight: 1.45,
    marginBottom: 3,
  },
  gemBadge: {
    fontSize: 8,
    fontWeight: 700,
    color: "#b45309",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  link: {
    color: "#2563eb",
    textDecoration: "none",
    fontSize: 9,
    marginTop: 4,
  },

  legBox: {
    marginTop: 8,
    marginBottom: 4,
    marginLeft: 4,
    paddingLeft: 10,
    borderLeftWidth: 1,
    borderLeftColor: "#d6d3d1",
    borderLeftStyle: "dashed",
  },
  legText: {
    fontSize: 8.5,
    color: "#44403c",
    lineHeight: 1.45,
  },
  legDetail: {
    fontSize: 8,
    color: muted,
    lineHeight: 1.4,
    marginTop: 2,
  },

  /* Budget */
  budgetPageTitle: {
    fontSize: 20,
    fontWeight: 700,
    color: ink,
    letterSpacing: -0.4,
    marginBottom: 6,
  },
  budgetIntro: {
    fontSize: 10,
    color: muted,
    marginBottom: 24,
    lineHeight: 1.5,
  },
  budgetCard: {
    backgroundColor: surface,
    borderRadius: 8,
    padding: 20,
    borderWidth: 1,
    borderColor: line,
    borderStyle: "solid",
  },
  budgetRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: line,
    borderBottomStyle: "solid",
  },
  budgetRowLast: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingTop: 10,
  },
  budgetLabel: {
    fontSize: 9,
    fontWeight: 700,
    color: ink,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    width: "28%",
  },
  budgetValue: {
    fontSize: 10,
    color: muted,
    lineHeight: 1.5,
    width: "68%",
    textAlign: "right",
  },

  /* Appendix — creator / blog */
  appendixTitle: {
    fontSize: 16,
    fontWeight: 700,
    marginBottom: 14,
    color: ink,
  },
  card: {
    backgroundColor: surface,
    padding: 10,
    borderRadius: 6,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: line,
    borderStyle: "solid",
  },
  cardTitle: {
    fontSize: 9.5,
    fontWeight: 700,
    marginBottom: 4,
    color: ink,
  },
  small: {
    fontSize: 8.5,
    lineHeight: 1.45,
    color: muted,
  },
  h3: {
    fontSize: 10,
    fontWeight: 700,
    marginTop: 10,
    marginBottom: 4,
    color: ink,
  },
});

type ItineraryPdfDocumentProps = {
  result: TravelPlanResponse;
  destinationLabel: string;
  /** Prefer Unsplash hero when available */
  coverImageUrl?: string;
};

function PageFooter() {
  return (
    <View style={styles.footer}>
      <Text style={styles.footerLeft}>EpicIndiaTrips AI Planner</Text>
    </View>
  );
}

function DayPage({ day }: { day: DayPlan }) {
  return (
    <Page size="A4" style={styles.page}>
      <PageFooter />
      <Text style={styles.dayKicker}>Itinerary</Text>
      <Text style={styles.dayTitle}>
        Day {day.day} · {day.title}
      </Text>
      {day.estimatedDayCost ? <Text style={styles.dayCost}>{day.estimatedDayCost}</Text> : null}

      {day.schedule.map((stop, idx) => (
        <View key={`${day.day}-${idx}`} wrap={false}>
          <View style={styles.stopCard}>
            {stop.hiddenGem ? <Text style={styles.gemBadge}>Hidden gem</Text> : null}
            <Text style={styles.stopTime}>{stop.timeSlot ?? stop.time}</Text>
            {stop.timeSlot ? (
              <Text style={styles.stopMeta}>
                Starts {stop.time}
              </Text>
            ) : null}
            <Text style={styles.stopActivity}>{stop.activity}</Text>
            <Text style={styles.stopPlace}>{stop.place}</Text>
            <Text style={styles.stopMeta}>
              <Text style={{ fontWeight: 700, color: ink }}>Cost </Text>
              {stop.estimatedCost}
            </Text>
            {stop.localInsight ? (
              <Text style={styles.stopMeta}>
                <Text style={{ fontWeight: 700, color: ink }}>Insight </Text>
                {stop.localInsight}
              </Text>
            ) : null}
            {stop.localTip ? (
              <Text style={styles.stopMeta}>
                <Text style={{ fontWeight: 700, color: ink }}>Tip </Text>
                {stop.localTip}
              </Text>
            ) : null}
            <Link src={stop.mapsLink} style={styles.link}>
              Open in Google Maps →
            </Link>
          </View>

          {idx < day.travelLegs.length ? (
            <View style={styles.legBox} wrap={false}>
              <Text style={styles.legText}>
                {day.travelLegs[idx].fromPlace} → {day.travelLegs[idx].toPlace}
              </Text>
              <Text style={styles.legText}>
                {day.travelLegs[idx].duration}
                {day.travelLegs[idx].distance ? ` · ${day.travelLegs[idx].distance}` : ""}
                {day.travelLegs[idx].mode ? ` · ${day.travelLegs[idx].mode}` : ""}
                {day.travelLegs[idx].legCost ? ` · ${day.travelLegs[idx].legCost}` : ""}
              </Text>
              {day.travelLegs[idx].route ? (
                <Text style={styles.legDetail}>
                  Route: {day.travelLegs[idx].route}
                </Text>
              ) : null}
              {day.travelLegs[idx].alternatives ? (
                <Text style={styles.legDetail}>Also: {day.travelLegs[idx].alternatives}</Text>
              ) : null}
              {day.travelLegs[idx].note ? (
                <Text style={styles.legDetail}>{day.travelLegs[idx].note}</Text>
              ) : null}
            </View>
          ) : null}
        </View>
      ))}
    </Page>
  );
}

export default function ItineraryPdfDocument({
  result,
  destinationLabel,
  coverImageUrl,
}: ItineraryPdfDocumentProps) {
  const dest = destinationLabel.trim() || "Your trip";
  const coverSrc = coverImageUrl?.trim() || getPlaceImageUrl(dest, dest);
  const generated = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <Document
      title={`${dest} — Itinerary`}
      author="EpicIndiaTrips AI Planner"
      subject="Travel itinerary & budget"
    >
      {/* Cover */}
      <Page size="A4" style={{ padding: 0 }}>
        <View style={styles.coverPage}>
          {/* @react-pdf/renderer Image does not support `alt`; cover is decorative in PDF */}
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          <Image style={styles.coverImage} src={coverSrc} />
          <View style={styles.coverScrim} />
          <View style={styles.coverInner}>
            <Text style={styles.coverKicker}>Travel itinerary</Text>
            <View style={styles.coverRule} />
            <Text style={styles.coverTitle}>{dest}</Text>
            <Text style={styles.coverTagline}>
              Day-by-day plan, budget snapshot, and links you can use on the ground — ready to save or share.
            </Text>
            <Text style={styles.coverMeta}>Generated · {generated}</Text>
          </View>
        </View>
      </Page>

      {result.dayWisePlan.map((day) => (
        <DayPage key={day.day} day={day} />
      ))}

      {/* Budget summary */}
      <Page size="A4" style={styles.page}>
        <PageFooter />
        <Text style={styles.sectionLabel}>Numbers</Text>
        <Text style={styles.budgetPageTitle}>Budget summary</Text>
        <Text style={styles.budgetIntro}>
          Rough INR split to use when booking — adjust for season and your style.
        </Text>
        <View style={styles.budgetCard}>
          <View style={styles.budgetRow}>
            <Text style={styles.budgetLabel}>Stay</Text>
            <Text style={styles.budgetValue}>{result.budgetBreakdown.stay}</Text>
          </View>
          <View style={styles.budgetRow}>
            <Text style={styles.budgetLabel}>Food</Text>
            <Text style={styles.budgetValue}>{result.budgetBreakdown.food}</Text>
          </View>
          <View style={styles.budgetRow}>
            <Text style={styles.budgetLabel}>Transport</Text>
            <Text style={styles.budgetValue}>{result.budgetBreakdown.transport}</Text>
          </View>
          {result.dayWisePlan.map((d) =>
            d.estimatedDayCost ? (
              <View key={`pdf-day-${d.day}`} style={styles.budgetRow}>
                <Text style={styles.budgetLabel}>{`Day ${d.day}`}</Text>
                <Text style={styles.budgetValue}>{d.estimatedDayCost}</Text>
              </View>
            ) : null,
          )}
          {result.budgetBreakdown.totalTripCost ? (
            <View style={styles.budgetRowLast}>
              <Text style={styles.budgetLabel}>Trip total</Text>
              <Text style={[styles.budgetValue, { color: ink, fontFamily: "Helvetica-Bold" }]}>
                {result.budgetBreakdown.totalTripCost}
              </Text>
            </View>
          ) : (
            <View style={styles.budgetRowLast}>
              <Text style={styles.budgetLabel}>Trip total</Text>
              <Text style={styles.budgetValue}>See day lines + categories above</Text>
            </View>
          )}
        </View>
      </Page>

      {/* Creator appendix */}
      <Page size="A4" style={styles.page}>
        <PageFooter />
        <Text style={styles.appendixTitle}>Reels & creator kit</Text>
        {result.reelIdeas.map((idea, i) => (
          <View key={`reel-${i}`} style={styles.card} wrap={false}>
            <Text style={styles.cardTitle}>{i + 1}. {idea.hook}</Text>
            {idea.script ? (
              <Text style={styles.small}>
                <Text style={{ fontWeight: 700 }}>Script </Text>
                {idea.script}
              </Text>
            ) : null}
            <Text style={[styles.small, { marginTop: 4 }]}>{idea.caption}</Text>
            <Text style={[styles.small, { marginTop: 6, color: subtle }]}>{idea.hashtags.join(" ")}</Text>
          </View>
        ))}

        <Text style={[styles.appendixTitle, { marginTop: 18 }]}>Instagram spots</Text>
        {result.instagramSpots.map((spot, i) => (
          <View key={`ig-${i}`} style={styles.card} wrap={false}>
            <Text style={styles.cardTitle}>{spot.place}</Text>
            <Text style={styles.small}>{spot.whyItWorks}</Text>
            <Text style={[styles.small, { marginTop: 4 }]}>
              <Text style={{ fontWeight: 700 }}>Light </Text>
              {spot.bestTime}
            </Text>
            <Text style={styles.small}>
              <Text style={{ fontWeight: 700 }}>Shot </Text>
              {spot.shotIdea}
            </Text>
            {spot.mapsLink ? (
              <Link src={spot.mapsLink} style={[styles.link, { marginTop: 4 }]}>
                Maps
              </Link>
            ) : null}
          </View>
        ))}

        <Text style={[styles.appendixTitle, { marginTop: 18 }]}>Photo angles</Text>
        {result.photoAngles.map((row, i) => (
          <View key={`pa-${i}`} style={styles.card} wrap={false}>
            <Text style={styles.cardTitle}>{row.spot}</Text>
            <Text style={styles.small}>
              {row.shotType ? `${row.shotType} · ` : ""}
              {row.angle} · {row.composition} · {row.lighting}
            </Text>
          </View>
        ))}
      </Page>

      {/* Blog */}
      <Page size="A4" style={styles.page}>
        <PageFooter />
        <Text style={styles.appendixTitle}>Blog draft</Text>
        <Text style={[styles.cardTitle, { fontSize: 12, marginBottom: 8 }]}>{result.blogContent.title}</Text>
        <Text style={[styles.small, { fontSize: 10, marginBottom: 14 }]}>{result.blogContent.preview}</Text>
        {result.blogContent.seoSections?.map((sec, i) => (
          <View key={`seo-${i}`} wrap={false}>
            <Text style={styles.h3}>{sec.heading}</Text>
            <Text style={[styles.small, { marginBottom: 10 }]}>{sec.body}</Text>
          </View>
        ))}
      </Page>
    </Document>
  );
}
