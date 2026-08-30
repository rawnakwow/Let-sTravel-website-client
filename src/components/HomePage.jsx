"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Headphones, Map, ShieldCheck } from "lucide-react";
import { API_URL } from "@/lib/api";
import HeroSlider from "./HeroSlider";
import ModeExplorer from "./ModeExplorer";
import SectionTitle from "./SectionTitle";
import TicketCard from "./TicketCard";

const routes = [["Dhaka", "Chattogram", "6h 30m"], ["Dhaka", "Sylhet", "5h 15m"], ["Dhaka", "Cox's Bazar", "1h 05m"], ["Khulna", "Dhaka", "7h 40m"]];

export default function HomePage() {
  const [data, setData] = useState({ ads: [], latest: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/tickets/advertised`).then((response) => response.ok ? response.json() : []),
      fetch(`${API_URL}/tickets/latest`).then((response) => response.ok ? response.json() : []),
    ]).then(([ads, latest]) => setData({ ads, latest })).finally(() => setLoading(false));
  }, []);

  return <>
    <HeroSlider />
    <section className="section"><div className="container"><SectionTitle eyebrow="Curated for you" title="Featured journeys" text="Up to six hand-picked departures selected by the admin." action={<Link className="btn btn-secondary" href="/tickets">Explore all <ArrowRight size={16} /></Link>} />{loading ? <LoadingGrid /> : data.ads.length ? <div className="grid-cards">{data.ads.slice(0, 6).map((ticket) => <TicketCard key={ticket._id} ticket={ticket} />)}</div> : <Empty />}</div></section>
    <ModeExplorer />
    <section className="section latest"><div className="container"><SectionTitle eyebrow="Fresh departures" title="Latest tickets" text="The newest admin-approved journeys, ready when you are." />{loading ? <LoadingGrid /> : data.latest.length ? <div className="grid-cards">{data.latest.slice(0, 8).map((ticket) => <TicketCard key={ticket._id} ticket={ticket} />)}</div> : <Empty />}</div></section>
    <section id="popular" className="section"><div className="container"><SectionTitle eyebrow="Popular this week" title="Routes travellers love" /><div className="route-grid">{routes.map(([from, to, time], index) => <Link key={to} href={`/tickets?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`}><span>0{index + 1}</span><div><b>{from} → {to}</b><small>Average {time}</small></div><ArrowRight /></Link>)}</div></div></section>
    <section id="why-us" className="section why"><div className="container"><SectionTitle eyebrow="Why Let'sTravel" title="Built around your peace of mind" /><div className="why-grid"><Why icon={ShieldCheck} title="Verified listings" text="Every public ticket passes an admin review before you see it." /><Why icon={Map} title="All travel modes" text="Move across bus, rail, river, and air without switching platforms." /><Why icon={Headphones} title="Human support" text="Clear booking statuses and operator decisions keep you informed." /></div></div></section>
  </>;
}

function Why({ icon: Icon, title, text }) { return <div className="why-card surface"><span><Icon /></span><h3>{title}</h3><p className="muted">{text}</p></div>; }
function LoadingGrid() { return <div className="grid-cards">{[1,2,3].map((item) => <div className="surface skeleton-card" key={item} />)}</div>; }
function Empty() { return <div className="empty"><h3>No journeys yet</h3><p className="muted">Approved tickets will appear here automatically.</p></div>; }
