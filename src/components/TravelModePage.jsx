"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, BusFront, Plane, Search, Ship, Sparkles, TrainFront } from "lucide-react";
import TicketCard from "./TicketCard";
import { API_URL } from "@/lib/api";

const icons = { Bus: BusFront, Plane, Cruise: Ship, Train: TrainFront };

export default function TravelModePage({ mode, apiType, image, title, intro, points }) {
  const [result, setResult] = useState({ data: [], page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("latest");
  const [route, setRoute] = useState({ from: "", to: "" });
  const Icon = icons[mode] || BusFront;

  useEffect(() => {
    const params = new URLSearchParams({ transport: apiType, limit: "9", sort });
    if (route.from) params.set("from", route.from);
    if (route.to) params.set("to", route.to);
    setLoading(true);
    fetch(`${API_URL}/tickets?${params.toString()}`)
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then(setResult)
      .catch(() => setResult({ data: [], page: 1, totalPages: 1, total: 0 }))
      .finally(() => setLoading(false));
  }, [apiType, route, sort]);

  function search(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setRoute({ from: String(form.get("from") || "").trim(), to: String(form.get("to") || "").trim() });
  }

  return <>
    <section className="mode-page-hero" style={{ backgroundImage: `url(${image})` }}><div className="mode-page-overlay" /><div className="container mode-page-hero-inner"><div><span className="mode-page-chip"><Icon size={17} /> {mode} journeys</span><h1 className="display">{title}</h1><p>{intro}</p></div><div className="mode-page-stat glass"><Sparkles /><span><small>Live approved inventory</small><b>{result.total} {mode.toLowerCase()} ticket{result.total === 1 ? "" : "s"}</b></span></div></div></section>
    <section className="mode-search-band"><div className="container"><form className="mode-search-form surface" onSubmit={search}><label><span>From</span><input name="from" placeholder="Dhaka" /></label><label><span>To</span><input name="to" placeholder="Destination" /></label><button className="btn btn-primary"><Search size={17} /> Find {mode}</button></form><div className="mode-point-grid">{points.map((point, index) => <div key={point}><span>0{index + 1}</span><p>{point}</p></div>)}</div></div></section>
    <section className="section"><div className="container"><div className="mode-results-head"><div><span className="eyebrow">Approved departures</span><h2 className="title">Available {mode} tickets</h2><p className="muted">Only admin-approved listings are shown here.</p></div><label className="mode-sort"><span>Sort</span><select value={sort} onChange={(event) => setSort(event.target.value)}><option value="latest">Newest first</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option></select></label></div>{loading ? <div className="grid-cards">{[1,2,3,4,5,6].map((item) => <div className="skeleton-card" key={item} />)}</div> : result.data.length ? <div className="grid-cards">{result.data.map((ticket) => <TicketCard key={ticket._id} ticket={ticket} />)}</div> : <div className="empty"><Icon /><h3>No matching {mode.toLowerCase()} tickets yet</h3><p className="muted">Try another route, or browse all approved tickets.</p><Link className="btn btn-secondary" href="/tickets">All tickets <ArrowRight size={16} /></Link></div>}</div></section>
  </>;
}
