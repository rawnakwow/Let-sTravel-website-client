"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Filter, Search, SlidersHorizontal } from "lucide-react";
import TicketCard from "@/components/TicketCard";
import { API_URL } from "@/lib/api";

function TicketsContent() {
  const router = useRouter(); const searchParams = useSearchParams();
  const [result, setResult] = useState({ data: [], page: 1, totalPages: 1, total: 0 }); const [loading, setLoading] = useState(true);
  const query = searchParams.toString();
  useEffect(() => { fetch(`${API_URL}/tickets?${query}`).then(r => r.ok ? r.json() : Promise.reject()).then(setResult).catch(() => setResult({ data: [], page: 1, totalPages: 1, total: 0 })).finally(() => setLoading(false)); }, [query]);
  function update(values) { const params = new URLSearchParams(searchParams); Object.entries(values).forEach(([key,value]) => value && value !== "all" ? params.set(key,value) : params.delete(key)); params.set("page", values.page || "1"); router.push(`/tickets?${params}`); }
  function search(event) { event.preventDefault(); update(Object.fromEntries(new FormData(event.currentTarget))); }
  return <><section className="listing-head"><div className="container"><span className="eyebrow">Find your next departure</span><h1 className="display">Every journey, one search away.</h1><p>Only admin-approved departures from verified operators are shown.</p><form onSubmit={search} className="listing-search glass"><label><span>From</span><input name="from" defaultValue={searchParams.get("from") || ""} placeholder="Dhaka" /></label><label><span>To</span><input name="to" defaultValue={searchParams.get("to") || ""} placeholder="Sylhet" /></label><button><Search size={18} /> Search</button></form></div></section><section className="section"><div className="container"><div className="filter-bar"><div><Filter size={18} /><b>{result.total}</b> journeys found</div><div><label><span className="sr-only">Transport type</span><select value={searchParams.get("transport") || "all"} onChange={e => update({ transport: e.target.value })}><option value="all">All transport</option><option value="Bus">Bus</option><option value="Plane">Plane</option><option value="Train">Train</option><option value="Launch">Cruise / Launch</option></select></label><label><span className="sr-only">Sort price</span><select value={searchParams.get("sort") || "latest"} onChange={e => update({ sort: e.target.value })}><option value="latest">Newest first</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option></select></label></div></div>{loading ? <div className="grid-cards">{[1,2,3,4,5,6].map(i => <div className="skeleton-card" key={i} />)}</div> : result.data.length ? <><div className="grid-cards">{result.data.map(ticket => <TicketCard key={ticket._id} ticket={ticket} />)}</div><div className="pagination"><button disabled={result.page <= 1} onClick={() => update({ page: String(result.page - 1) })}>Previous</button>{Array.from({ length: result.totalPages }, (_,i) => i + 1).map(page => <button className={page === result.page ? "current" : ""} onClick={() => update({ page: String(page) })} key={page}>{page}</button>)}<button disabled={result.page >= result.totalPages} onClick={() => update({ page: String(result.page + 1) })}>Next</button></div></> : <div className="empty"><SlidersHorizontal /><h3>No matching tickets</h3><p className="muted">Try a broader route or another transport type.</p></div>}</div></section></>;
}

export default function TicketsPage() { return <Suspense><TicketsContent /></Suspense>; }
