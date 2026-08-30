import Link from "next/link";
import { ArrowUpRight, BusFront, Plane, Ship, TrainFront } from "lucide-react";
import SectionTitle from "./SectionTitle";

const modes = [
  { slug: "bus", title: "Bus", kicker: "Road", copy: "Verified coaches for city-to-city travel, from quick day trips to overnight routes.", icon: BusFront, image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=84" },
  { slug: "plane", title: "Plane", kicker: "Air", copy: "Domestic flights for when the destination matters more than the distance.", icon: Plane, image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=84" },
  { slug: "cruise", title: "Cruise", kicker: "River", copy: "Launch and cruise journeys with cabin-friendly routes across Bangladesh's waterways.", icon: Ship, image: "https://images.unsplash.com/photo-1540946485063-a40da27545f8?auto=format&fit=crop&w=1200&q=84" },
  { slug: "train", title: "Train", kicker: "Rail", copy: "Relaxed rail travel with route details, departure times and ticket availability together.", icon: TrainFront, image: "https://images.unsplash.com/photo-1473445361085-b9a07f55608b?auto=format&fit=crop&w=1200&q=84" },
];

export default function ModeExplorer() {
  return <section className="section mode-explorer-section"><div className="container"><SectionTitle eyebrow="Four ways to go" title="Pick the journey that fits your day" text="Bus, plane, cruise or train — each mode has its own dedicated page and live approved tickets." /><div className="mode-bento">{modes.map(({ slug, title, kicker, copy, icon: Icon, image }, index) => <Link className={`mode-bento-card mode-card-${index + 1}`} href={`/${slug}`} key={slug} style={{ backgroundImage: `url(${image})` }}><span className="mode-bento-scrim" /><div className="mode-bento-top"><span><Icon /></span><small>{kicker}</small></div><div className="mode-bento-copy"><p>Travel by</p><h3 className="display">{title}</h3><span>{copy}</span></div><div className="mode-bento-link">Browse {title} tickets <ArrowUpRight size={18} /></div></Link>)}</div></div></section>;
}
