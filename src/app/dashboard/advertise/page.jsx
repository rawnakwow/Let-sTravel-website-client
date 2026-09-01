"use client";

import { useEffect,useMemo,useState } from "react";
import { Megaphone } from "lucide-react";
import toast from "react-hot-toast";
import { apiFetch } from "@/lib/api";

export default function AdvertisePage(){
    const[tickets,setTickets]=useState([]);
    const[loading,setLoading]=useState(true);
    const active=useMemo(()=>tickets.filter(t=>t.advertised).length,[tickets]);
    const load=()=>apiFetch("/admin/advertisements").then(setTickets).catch(e=>toast.error(e.message)).finally(()=>setLoading(false));useEffect(()=>{load()},[]);async function toggle(ticket){try{await apiFetch(`/admin/tickets/${ticket._id}/advertise`,{method:"PATCH",body:JSON.stringify({advertised:!ticket.advertised})});toast.success(ticket.advertised?"Removed from homepage":"Added to homepage");load()}catch(e){toast.error(e.message)}}return <><div className="dash-head"><div><span className="eyebrow">Homepage curation</span><h1 className="display">Advertise tickets</h1><p className="muted">Select exactly the journeys worth highlighting—up to six at once.</p></div><div className="ad-counter"><Megaphone/><b>{active}/6</b><span>slots used</span></div></div>{loading?<div className="spinner"/>:<div className="table-wrap"><table><thead><tr><th>Ticket</th><th>Route</th><th>Transport</th><th>Price</th><th>Homepage</th></tr></thead>
    <tbody>{tickets.map(t=><tr key={t._id}><td><b>{t.title}</b></td><td>{t.from} → {t.to}</td><td>{t.transportType}</td><td>৳{Number(t.price).toLocaleString("en-BD")}</td><td><button className={`ad-toggle ${t.advertised?"on":""}`} disabled={!t.advertised&&active>=6} onClick={()=>toggle(t)}><span/>{t.advertised?"Advertised":"Hidden"}</button></td></tr>)}</tbody></table></div>}</>}
