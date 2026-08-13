import Link from "next/link";
import CakeCanvas from "@/components/editor/CakeCanvas";
import type { DesignShape } from "@/types/design";

type EditorSearchParams = {
  shape?: string | string[];
  width?: string | string[];
  height?: string | string[];
  name?: string | string[];
};

const validShapes: DesignShape[] = ["circle", "square", "rectangle"];
const toolItems = [
  { icon: "▦", label: "Templates" },
  { icon: "↑", label: "Uploads" },
  { icon: "T", label: "Text" },
  { icon: "◇", label: "Elements" },
  { icon: "✦", label: "AI Images" },
];

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function validDimension(value: string | undefined, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export default async function EditorPage({
  searchParams,
}: {
  searchParams: Promise<EditorSearchParams>;
}) {
  const query = await searchParams;
  const requestedShape = firstValue(query.shape);
  const shape: DesignShape = validShapes.includes(requestedShape as DesignShape)
    ? (requestedShape as DesignShape)
    : "circle";
  const requestedWidth = validDimension(firstValue(query.width), 8);
  const requestedHeight = validDimension(firstValue(query.height), 8);
  const width = shape === "rectangle" ? requestedWidth : requestedWidth;
  const height = shape === "rectangle" ? requestedHeight : requestedWidth;
  const name = firstValue(query.name)?.trim() || "Untitled Design";

  return (
    <main className="flex min-h-screen flex-col bg-[#f4f1f4] text-[#281c2d]">
      <header className="relative z-10 border-b border-[#ddd6dd] bg-white">
        <nav className="flex min-h-16 items-center justify-between gap-3 px-4 sm:px-5" aria-label="Editor toolbar">
          <div className="flex min-w-0 items-center gap-3 sm:gap-5">
            <Link href="/create" className="grid size-9 shrink-0 place-items-center rounded-full border border-[#ded6dc] text-[#665a69] transition hover:border-[#b9adb6] hover:text-[#281c2d]" aria-label="Back to design settings">
              ←
            </Link>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold sm:text-base">{name}</p>
              <p className="text-[10px] font-medium text-[#918694] sm:text-xs">{width} × {height} inches · <span className="capitalize">{shape}</span></p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {[
              ["↶", "Undo"],
              ["↷", "Redo"],
            ].map(([icon, label]) => (
              <button key={label} type="button" disabled title={`${label} is not available yet`} className="hidden size-9 cursor-not-allowed place-items-center rounded-lg border border-[#e3dde2] text-[#b4aab5] sm:grid" aria-label={`${label} (coming soon)`}>
                {icon}
              </button>
            ))}
            <button type="button" disabled className="cursor-not-allowed rounded-full border border-[#ded6dc] px-3 py-2 text-xs font-semibold text-[#aaa0ab] sm:px-4" title="Saving is not available yet">Save</button>
            <button type="button" disabled className="cursor-not-allowed rounded-full bg-[#d8d0d9] px-3 py-2 text-xs font-semibold text-white sm:px-4" title="Export is not available yet">Export</button>
          </div>
        </nav>
      </header>

      <div className="grid flex-1 lg:grid-cols-[112px_minmax(0,1fr)_240px]">
        <aside className="order-2 border-t border-[#ddd6dd] bg-white lg:order-none lg:border-r lg:border-t-0" aria-label="Design tools">
          <div className="grid grid-cols-5 lg:flex lg:flex-col lg:gap-1 lg:p-3">
            {toolItems.map((tool) => (
              <button key={tool.label} type="button" disabled title={`${tool.label} is coming soon`} className="flex cursor-not-allowed flex-col items-center gap-1.5 px-1 py-3 text-[10px] font-semibold text-[#9c919e] lg:rounded-xl lg:py-3.5">
                <span className="grid size-7 place-items-center text-base text-[#766b78]">{tool.icon}</span>
                {tool.label}
              </button>
            ))}
          </div>
        </aside>

        <section className="order-1 flex min-w-0 flex-col lg:order-none" aria-label="Design canvas workspace">
          <div className="flex items-center justify-between border-b border-[#ddd6dd] bg-[#faf8fa] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8c818e]">
            <span>Canvas</span>
            <span>Safe area & center guides</span>
          </div>
          <div className="flex min-h-[430px] flex-1 items-center justify-center overflow-hidden bg-[#ece8ed] bg-[radial-gradient(#d3ccd4_0.7px,transparent_0.7px)] [background-size:18px_18px]">
            <CakeCanvas shape={shape} widthInches={width} heightInches={height} />
          </div>
        </section>

        <aside className="order-3 border-t border-[#ddd6dd] bg-white p-5 lg:border-l lg:border-t-0" aria-label="Design information">
          <h2 className="text-sm font-semibold">Design information</h2>
          <dl className="mt-5 space-y-4 text-xs">
            <div className="flex items-center justify-between gap-4">
              <dt className="text-[#8a7f8c]">Shape</dt>
              <dd className="font-semibold capitalize">{shape}</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-[#8a7f8c]">Dimensions</dt>
              <dd className="font-semibold">{width} × {height} in</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-[#8a7f8c]">Resolution</dt>
              <dd className="text-right font-semibold">{Math.round(width * 300)} × {Math.round(height * 300)} px</dd>
            </div>
          </dl>

          <div className="mt-7 border-t border-[#ebe5ea] pt-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold">Layers</h2>
              <span className="rounded-full bg-[#f3eef3] px-2 py-1 text-[9px] font-bold uppercase tracking-wide text-[#948997]">Coming soon</span>
            </div>
            <div className="mt-4 rounded-xl border border-dashed border-[#ddd4dc] bg-[#fbf9fb] px-3 py-5 text-center text-xs leading-5 text-[#9a8f9c]">Your design layers will appear here.</div>
          </div>

          <Link href="/create" className="mt-7 flex items-center justify-center rounded-full border border-[#ded6dc] px-4 py-2.5 text-xs font-semibold text-[#665a69] transition hover:border-[#b9adb6] hover:text-[#281c2d]">Change design settings</Link>
        </aside>
      </div>
    </main>
  );
}
