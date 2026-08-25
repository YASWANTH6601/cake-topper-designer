"use client";

import Link from "next/link";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { deleteDesign, duplicateDesign, listDesigns, type SavedDesign } from "@/lib/storage/saved-designs";

type DesignCard = { design: SavedDesign; thumbnailUrl: string | null };

function sizeLabel(design: SavedDesign) {
  if (design.shape === "circle") return `${design.width}\" Round`;
  return `${design.width} × ${design.height}\" ${design.shape === "square" ? "Square" : "Rectangle"}`;
}

function editedLabel(updatedAt: string) {
  const elapsed = Date.now() - new Date(updatedAt).getTime();
  const minutes = Math.max(0, Math.floor(elapsed / 60_000));
  if (minutes < 1) return "Edited just now";
  if (minutes < 60) return `Edited ${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Edited ${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `Edited ${days} day${days === 1 ? "" : "s"} ago`;
  return `Edited ${new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", year: "numeric" }).format(new Date(updatedAt))}`;
}

export default function MyDesignsPage() {
  const [cards, setCards] = useState<DesignCard[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "failed">("loading");
  const [busyId, setBusyId] = useState<string | null>(null);
  const thumbnailUrlsRef = useRef<Set<string>>(new Set());

  const refresh = useCallback(async () => {
    setStatus("loading");
    try {
      const designs = await listDesigns();
      thumbnailUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      thumbnailUrlsRef.current.clear();
      setCards(designs.map((design) => {
        const thumbnailUrl = design.thumbnail ? URL.createObjectURL(design.thumbnail) : null;
        if (thumbnailUrl) thumbnailUrlsRef.current.add(thumbnailUrl);
        return { design, thumbnailUrl };
      }));
      setStatus("ready");
    } catch {
      setStatus("failed");
    }
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => { void refresh(); }, 0);
    const urls = thumbnailUrlsRef.current;
    return () => { window.clearTimeout(timeout); urls.forEach((url) => URL.revokeObjectURL(url)); };
  }, [refresh]);

  async function handleDuplicate(design: SavedDesign) {
    setBusyId(design.id);
    try { await duplicateDesign(design); await refresh(); }
    catch { setStatus("failed"); }
    finally { setBusyId(null); }
  }

  async function handleDelete(design: SavedDesign) {
    if (!window.confirm(`Delete \"${design.name}\"?\n\nThis cannot be undone.`)) return;
    setBusyId(design.id);
    try { await deleteDesign(design.id); await refresh(); }
    catch { setStatus("failed"); }
    finally { setBusyId(null); }
  }

  return <main className="min-h-screen bg-[#fffdf9] text-[#281c2d]">
    <header className="border-b border-[#281c2d]/8 bg-[#fffdf9]/95 backdrop-blur-xl"><nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10" aria-label="My Designs navigation"><Link href="/" className="flex items-center gap-3 font-semibold"><span className="grid size-9 place-items-center rounded-full bg-[#f57558] text-lg text-white">♡</span><span>Cake Topper Designer</span></Link><Link href="/create" className="rounded-full bg-[#2d1d31] px-5 py-2.5 text-sm font-semibold text-white">Create Design</Link></nav></header>
    <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16 lg:px-10">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><span className="text-xs font-bold uppercase tracking-[0.2em] text-[#e16b50]">Saved on this device</span><h1 className="mt-3 text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">My Designs</h1><p className="mt-3 text-sm leading-6 text-[#766b78]">Continue editing cake toppers saved in this browser.</p></div>{cards.length > 0 && <p className="text-xs font-medium text-[#8d828f]">{cards.length} design{cards.length === 1 ? "" : "s"}</p>}</div>
      {status === "loading" && cards.length === 0 && <div className="grid min-h-72 place-items-center text-sm font-medium text-[#847887]">Loading your designs...</div>}
      {status === "failed" && <p role="alert" className="mt-8 rounded-2xl bg-[#fff0eb] px-5 py-4 text-sm font-medium text-[#a84734]">We couldn&apos;t load your designs on this device. Please try again.</p>}
      {status === "ready" && cards.length === 0 && <div className="mt-12 rounded-[2rem] border border-dashed border-[#dcd3da] bg-white px-6 py-16 text-center"><span className="mx-auto grid size-16 place-items-center rounded-3xl bg-[#f2ebfb] text-3xl text-[#6d489f]">◇</span><h2 className="mt-6 text-2xl font-semibold">No saved designs yet.</h2><p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#766b78]">Start creating a cake topper and it will appear here automatically.</p><Link href="/create" className="mt-7 inline-flex rounded-full bg-[#f57558] px-6 py-3 text-sm font-semibold text-white">Create Design</Link></div>}
      {cards.length > 0 && <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{cards.map(({ design, thumbnailUrl }) => <article key={design.id} className="overflow-hidden rounded-3xl border border-[#e5dde3] bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"><div className="relative grid aspect-square place-items-center overflow-hidden bg-[#f0ebf0]">{thumbnailUrl ? <Image src={thumbnailUrl} alt={`Preview of ${design.name}`} fill unoptimized className="object-contain" /> : <span className="text-4xl text-[#b19bac]">◇</span>}</div><div className="p-5"><p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#997f93]">{sizeLabel(design)}</p><h2 className="mt-2 truncate text-lg font-semibold">{design.name}</h2><p className="mt-1 text-xs text-[#8d828f]">{editedLabel(design.updatedAt)}</p><Link href={`/editor?design=${encodeURIComponent(design.id)}`} className="mt-5 block rounded-full bg-[#6d489f] px-4 py-2.5 text-center text-xs font-semibold text-white">Open</Link><div className="mt-2 grid grid-cols-2 gap-2"><button type="button" disabled={busyId !== null} onClick={() => void handleDuplicate(design)} className="rounded-full border border-[#ddd4dc] px-3 py-2 text-[11px] font-semibold text-[#675b69] disabled:opacity-45">Duplicate</button><button type="button" disabled={busyId !== null} onClick={() => void handleDelete(design)} className="rounded-full border border-[#f0cfc8] bg-[#fff6f3] px-3 py-2 text-[11px] font-semibold text-[#b94e38] disabled:opacity-45">Delete</button></div></div></article>)}</div>}
    </section>
  </main>;
}
