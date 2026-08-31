import Link from "next/link";
import { Compass } from "lucide-react";

export default function NotFound() {
  return <section className="error-page"><div><span><Compass /></span><p className="eyebrow">404 · Route not found</p><h1 className="display">This road ends here.</h1><p className="muted">The page may have moved, but your next journey is still waiting.</p><div><Link className="btn btn-primary" href="/">Back home</Link><Link className="btn btn-secondary" href="/tickets">Browse tickets</Link></div></div></section>;
}
