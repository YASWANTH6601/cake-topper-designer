"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import type { DesignDimensions, DesignShape } from "@/types/design";

type SizeOption = DesignDimensions & {
  label: string;
  value: string;
};

const shapes: { value: DesignShape; label: string }[] = [
  { value: "circle", label: "Circle" },
  { value: "square", label: "Square" },
  { value: "rectangle", label: "Rectangle" },
];

const sizeOptions: Record<DesignShape, SizeOption[]> = {
  circle: [6, 7, 8, 10].map((size) => ({
    label: `${size} inch`,
    value: String(size),
    width: size,
    height: size,
  })),
  square: [6, 8, 10].map((size) => ({
    label: `${size} × ${size} inches`,
    value: String(size),
    width: size,
    height: size,
  })),
  rectangle: [
    { label: "8 × 10 inches", value: "8x10", width: 8, height: 10 },
    { label: "10 × 14 inches", value: "10x14", width: 10, height: 14 },
  ],
};

const defaultSize: Record<DesignShape, string> = {
  circle: "8",
  square: "8",
  rectangle: "8x10",
};

export default function CreateDesignPage() {
  const router = useRouter();
  const [shape, setShape] = useState<DesignShape>("circle");
  const [selectedSize, setSelectedSize] = useState("8");
  const [customWidth, setCustomWidth] = useState("");
  const [customHeight, setCustomHeight] = useState("");
  const [designName, setDesignName] = useState("");
  const [error, setError] = useState("");

  function selectShape(nextShape: DesignShape) {
    setShape(nextShape);
    setSelectedSize(defaultSize[nextShape]);
    setCustomWidth("");
    setCustomHeight("");
    setError("");
  }

  function updateCustomDimension(field: "width" | "height", value: string) {
    setError("");

    if (shape === "rectangle") {
      if (field === "width") setCustomWidth(value);
      else setCustomHeight(value);
      return;
    }

    setCustomWidth(value);
    setCustomHeight(value);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    let dimensions: DesignDimensions;

    if (selectedSize === "custom") {
      const width = Number(customWidth);
      const height = Number(customHeight);

      if (!customWidth || !customHeight) {
        setError("Enter both a width and height to continue.");
        return;
      }

      if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
        setError("Width and height must be valid numbers greater than 0.");
        return;
      }

      dimensions = { width, height };
    } else {
      const option = sizeOptions[shape].find((size) => size.value === selectedSize);

      if (!option) {
        setError("Choose a size to continue.");
        return;
      }

      dimensions = { width: option.width, height: option.height };
    }

    const params = new URLSearchParams({
      shape,
      width: String(dimensions.width),
      height: String(dimensions.height),
    });

    const trimmedName = designName.trim();
    if (trimmedName) params.set("name", trimmedName);

    router.push(`/editor?${params.toString()}`);
  }

  return (
    <main className="min-h-screen bg-[#fffdf9] text-[#281c2d]">
      <header className="border-b border-[#281c2d]/8 bg-[#fffdf9]/90 backdrop-blur-xl">
        <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10" aria-label="Create design navigation">
          <Link href="/" className="flex items-center gap-3 font-semibold tracking-[-0.02em]">
            <span className="grid size-9 place-items-center rounded-full bg-[#f57558] text-lg text-white shadow-[0_7px_20px_rgba(245,117,88,0.25)]">♡</span>
            <span className="text-[15px] sm:text-base">Cake Topper Designer</span>
          </Link>
          <Link href="/" className="text-sm font-semibold text-[#766b78] transition-colors hover:text-[#281c2d]">
            <span aria-hidden="true">←</span> Back to home
          </Link>
        </nav>
      </header>

      <section className="relative px-5 py-12 sm:px-8 sm:py-16">
        <div className="pointer-events-none absolute left-1/2 top-0 size-80 -translate-x-1/2 rounded-full bg-[#efe7ff]/60 blur-3xl" />
        <div className="relative mx-auto max-w-3xl">
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#e16b50]">New canvas</span>
            <h1 className="mt-4 text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">Create a New Design</h1>
            <p className="mt-4 text-base leading-7 text-[#766b78] sm:text-lg">Choose the shape and physical print size for your cake topper.</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-10 rounded-[2rem] border border-[#e4dce2] bg-white p-5 shadow-[0_28px_70px_rgba(53,34,57,0.1)] sm:p-8">
            <fieldset>
              <legend className="text-sm font-semibold">Choose a shape</legend>
              <div className="mt-4 grid grid-cols-3 gap-3">
                {shapes.map((option) => {
                  const selected = option.value === shape;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => selectShape(option.value)}
                      className={`flex min-h-32 flex-col items-center justify-center gap-4 rounded-2xl border px-3 py-5 transition sm:min-h-36 ${selected ? "border-[#f57558] bg-[#fff6f2] shadow-[0_0_0_3px_rgba(245,117,88,0.12)]" : "border-[#e5dee3] bg-[#fffdfb] hover:border-[#cabec6]"}`}
                    >
                      <span
                        aria-hidden="true"
                        className={`${option.value === "circle" ? "size-11 rounded-full" : option.value === "square" ? "size-11 rounded-lg" : "h-9 w-14 rounded-lg"} border-2 ${selected ? "border-[#f57558] bg-[#ffdcd1]" : "border-[#988d99] bg-[#f3eef2]"}`}
                      />
                      <span className={`text-sm font-semibold ${selected ? "text-[#c6533a]" : "text-[#5f5362]"}`}>{option.label}</span>
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <fieldset className="mt-8 border-t border-[#eee8ec] pt-8">
              <legend className="text-sm font-semibold">Choose a print size</legend>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {[...sizeOptions[shape], { label: "Custom", value: "custom", width: 0, height: 0 }].map((option) => {
                  const selected = option.value === selectedSize;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => {
                        setSelectedSize(option.value);
                        setError("");
                      }}
                      className={`rounded-xl border px-3 py-3 text-sm font-semibold transition ${selected ? "border-[#6f4ba8] bg-[#f3edff] text-[#644197] shadow-[0_0_0_2px_rgba(111,75,168,0.1)]" : "border-[#e5dee3] text-[#6c616e] hover:border-[#c6b9c3]"}`}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            {selectedSize === "custom" && (
              <div className="mt-6 rounded-2xl bg-[#faf7fb] p-4 sm:p-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  {(["width", "height"] as const).map((field) => (
                    <label key={field} className="text-sm font-semibold capitalize text-[#514654]">
                      {field}
                      <span className="mt-2 flex items-center rounded-xl border border-[#dcd4db] bg-white focus-within:border-[#8c68bd] focus-within:ring-2 focus-within:ring-[#8c68bd]/10">
                        <input
                          type="number"
                          inputMode="decimal"
                          min="0"
                          step="any"
                          required
                          value={field === "width" ? customWidth : customHeight}
                          onChange={(event) => updateCustomDimension(field, event.target.value)}
                          className="min-w-0 flex-1 bg-transparent px-4 py-3 font-normal outline-none"
                          aria-describedby={error ? "dimension-error" : undefined}
                        />
                        <span className="pr-4 text-xs font-medium text-[#918694]">inches</span>
                      </span>
                    </label>
                  ))}
                </div>
                {shape !== "rectangle" && (
                  <p className="mt-3 text-xs text-[#857987]">Width and height stay equal for {shape} designs.</p>
                )}
              </div>
            )}

            <label className="mt-8 block border-t border-[#eee8ec] pt-8 text-sm font-semibold text-[#514654]">
              Design Name <span className="font-normal text-[#9a8f9c]">(optional)</span>
              <input
                type="text"
                value={designName}
                onChange={(event) => setDesignName(event.target.value)}
                placeholder="Yaswanth Birthday"
                className="mt-2 w-full rounded-xl border border-[#dcd4db] bg-white px-4 py-3.5 font-normal outline-none transition placeholder:text-[#afa5b0] focus:border-[#8c68bd] focus:ring-2 focus:ring-[#8c68bd]/10"
              />
            </label>

            {error && <p id="dimension-error" role="alert" className="mt-4 rounded-xl bg-[#fff0eb] px-4 py-3 text-sm font-medium text-[#b84f37]">{error}</p>}

            <button type="submit" className="mt-7 flex w-full items-center justify-center gap-2 rounded-full bg-[#f57558] px-6 py-4 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(245,117,88,0.28)] transition hover:-translate-y-0.5 hover:bg-[#e8694d]">
              Create Design <span aria-hidden="true">→</span>
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
