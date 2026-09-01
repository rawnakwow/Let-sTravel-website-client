"use client";

import { useEffect,useState } from "react";
import { Check,X } from "lucide-react";
import toast from "react-hot-toast";
import { apiFetch } from "@/lib/api";

export default function ManageTicketsPage(){const[tickets,setTickets]=useState([]);
    const[loading,setLoading]=useState(true);
    const load=()=>apiFetch("/admin/tickets").then(setTickets).catch(e=>toast.error(e.message)).finally(()=>setLoading(false));useEffect(()=>{load()},[]);async function decide(id,status){try{await apiFetch(`/admin/tickets/${id}/status`,{method:"PATCH",body:JSON.stringify({status})});toast.success(`Ticket ${status}`);load()}catch(e){toast.error(e.message)}}return <><div className="dash-head"><div><span className="eyebrow">Platform quality</span><h1 className="display">Manage tickets</h1><p className="muted">Approve trustworthy listings before they reach travellers.</p></div></div>{loading?<div className="spinner"/>:<div className="table-wrap"><table><thead><tr><th>Ticket</th><th>Route</th><th>Vendor</th><th>Price</th><th>Status</th><th>Moderation</th></tr></thead><tbody>{tickets.map(t=><tr key={t._id}><td><b>{t.title}</b><br/><small>{t.transportType}</small></td><td>{t.from} → {t.to}</td><td>{t.vendorName}<br/><small>{t.vendorEmail}</small></td><td>৳{Number(t.price).toLocaleString("en-BD")}</td><td><span className="status">{t.verificationStatus}</span></td><td><div className="table-actions"><button disabled={t.verificationStatus==="approved"} onClick={()=>decide(t._id,"approved")}><Check/> Approve</button><button className="reject" disabled={t.verificationStatus==="rejected"} onClick={()=>decide(t._id,"rejected")}><X/> Reject</button></div></td></tr>)}</tbody></table></div>}</>}
