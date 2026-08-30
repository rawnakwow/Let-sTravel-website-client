import TravelModePage from "@/components/TravelModePage";
export const metadata = { title: "Cruise & Launch Tickets", description: "Browse verified cruise and launch journeys across Bangladesh with Let'sTravel." };
export default function CruisePage() { 
    return <
         TravelModePage mode="Cruise" apiType="Launch" title="Move with the river." intro="Explore approved launch and cruise-style routes with cabin-friendly details, clear schedules and simple booking requests." image="https://images.unsplash.com/photo-1540946485063-a40da27545f8?auto=format&fit=crop&w=1800&q=88" points={["Discover approved river routes and launch departures.", "Check availability, perks and departure countdowns.", "Keep booking status and payment history in your dashboard."]} />; }
