import Link from "next/link";
import type { DesignShape } from "@/types/design";

type EditorSearchParams = {
  shape?: string | string[];
  width?: string | string[];
  height?: string | string[];
  name?: string | string[];
};

const validShapes: DesignShape[] = ["circle", "square", "rectangle"];

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function validDimension(value: string | undefined, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export default async function EditorPreviewPage({ searchParams }: { searchParams: Promise<EditorSearchParams> }) {
  const query = await searchParams;
  const requestedShape = firstValue(query.shape);
  const shape: DesignShape = validShapes.includes(requestedShape as DesignShape) ? (requestedShape as DesignShape) : "circle";
  const rawWidth = validDimension(firstValue(query.width), 8);
  const rawHeight = validDimension(firstValue(query.height), 8);
  const width = shape === "rectangle" ? rawWidth : rawWidth;
  const height = shape === "rectangle" ? rawHeight : rawWidth;
  const name = firstValue(query.name)?.trim();

  const previewRatio = shape === "rectangle" ? width / height : 1;
  const maxWidth = 420;
  const maxHeight = 360;
  const displayWidth = previewRatio >= maxWidth / maxHeight ? maxWidth : maxHeight * previewRatio;
  const displayHeight = previewRatio >= maxWidth / maxHeight ? maxWidth / previewRatio : maxHeight;

  return (
    <main className="flex min-h-screen flex-col bg-[#f8f5f8] text-[#281c2d]">
      <header className="border-b border-[#281c2d]/8 bg-white">
        <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10" aria-label="Editor preview navigation">
          <Link href="/" className="flex items-center gap-3 font-semibold tracking-[-0.02em]">
            <span className="grid size-9 place-items-center rounded-full bg-[#f57558] text-lg text-white">♡</span>
            <span className="hidden sm:inline">Cake Topper Designer</span>
          </Link>
          <Link href="/create" className="rounded-full border border-[#ded6dc] bg-white px-4 py-2.5 text-sm font-semibold text-[#655a68] transition hover:border-[#b9adb6] hover:text-[#281c2d]">
            <span aria-hidden="true">←</span> Change settings
          </Link>
        </nav>
      </header>

      <section className="flex flex-1 flex-col px-5 py-8 sm:px-8 sm:py-12">
        <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#7957c8]">Editor preview</span>
              <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">{name || "Untitled Design"}</h1>
            </div>
            <div className="flex flex-wrap gap-2 text-xs font-semibold text-[#6f6472]">
              <span className="rounded-full border border-[#ded6df] bg-white px-3 py-2 capitalize">{shape}</span>
              <span className="rounded-full border border-[#ded6df] bg-white px-3 py-2">{width} × {height} inches</span>
            </div>
          </div>

          <div className="mt-8 flex min-h-[480px] flex-1 items-center justify-center overflow-hidden rounded-[2rem] border border-[#ded7df] bg-white p-6 shadow-[0_25px_65px_rgba(53,34,57,0.08)] sm:p-10">
            <div className="relative flex min-h-[380px] w-full items-center justify-center overflow-hidden rounded-2xl bg-[#f1edf3] p-5 sm:p-8">
              <div className="absolute left-5 top-5 rounded-lg bg-white px-3 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#8b808e] shadow-sm">Canvas</div>
              <div
                className={`grid max-w-full place-items-center border-[10px] border-white bg-[#efe4f7] p-4 text-center shadow-[0_18px_45px_rgba(72,44,80,0.17)] sm:border-[14px] ${shape === "circle" ? "rounded-full" : shape === "square" ? "rounded-2xl" : "rounded-xl"}`}
                style={{ width: displayWidth, height: displayHeight }}
              >
                <p className="max-w-52 text-sm font-semibold leading-6 text-[#756679] sm:text-base">Your design canvas will appear here</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
