import TravelPlanningForm from "@/components/TravelPlanningForm";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-8">
      <section className="w-full max-w-3xl text-center">
        <h1 className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl">
          AI Travel Planner
        </h1>
        <TravelPlanningForm />
      </section>
    </main>
  );
}
