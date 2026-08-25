const features = [
  {
    icon: "↔",
    title: "Exact Print Sizes",
    description:
      "Design with confidence using precise dimensions made for crisp, perfectly sized prints.",
    tone: "bg-[#fff0e8] text-[#e46d47]",
  },
  {
    icon: "✦",
    title: "Easy Design Editor",
    description:
      "Arrange text, artwork, and shapes with simple tools that keep creativity effortless.",
    tone: "bg-[#efe9ff] text-[#7957c8]",
  },
  {
    icon: "▦",
    title: "Templates & Assets",
    description:
      "Start faster with thoughtful layouts and a growing collection of celebration-ready assets.",
    tone: "bg-[#e8f6f0] text-[#2e8b6a]",
  },
  {
    icon: "✺",
    title: "AI Image Generation",
    description:
      "Turn a simple idea into one-of-a-kind artwork created especially for your celebration.",
    tone: "bg-[#fff4d9] text-[#bd7c18]",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#fffdf9] text-[#281c2d]">
      <header className="relative z-20 border-b border-[#281c2d]/8 bg-[#fffdf9]/90 backdrop-blur-xl">
        <nav
          aria-label="Main navigation"
          className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10"
        >
          <a href="#top" className="flex items-center gap-3 font-semibold tracking-[-0.02em]">
            <span className="grid size-9 place-items-center rounded-full bg-[#f57558] text-lg text-white shadow-[0_7px_20px_rgba(245,117,88,0.25)]">
              ♡
            </span>
            <span className="text-[15px] sm:text-base">Cake Topper Designer</span>
          </a>

          <div className="hidden items-center gap-8 text-sm font-medium text-[#655b68] lg:flex">
            <a className="transition-colors hover:text-[#281c2d]" href="#templates">
              Templates
            </a>
            <a className="transition-colors hover:text-[#281c2d]" href="#ai-images">
              AI Images
            </a>
            <a className="transition-colors hover:text-[#281c2d]" href="/designs">
              My Designs
            </a>
          </div>

          <div className="flex items-center gap-3 sm:gap-5">
            <a
              href="#sign-in"
              className="hidden text-sm font-semibold text-[#655b68] transition-colors hover:text-[#281c2d] sm:block"
            >
              Sign In
            </a>
            <a
              href="/create"
              className="rounded-full bg-[#2d1d31] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#422d47] sm:px-5 sm:text-sm"
            >
              Start Designing
            </a>
          </div>
        </nav>
      </header>

      <section id="top" className="relative">
        <div className="pointer-events-none absolute -left-24 top-12 size-64 rounded-full bg-[#fee5d9]/65 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-8 size-80 rounded-full bg-[#ece4ff]/70 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[0.88fr_1.12fr] lg:gap-16 lg:px-10 lg:py-24">
          <div className="max-w-xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#edcfc3] bg-white px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#a6543e] shadow-sm">
              <span className="text-[#f57558]">✦</span>
              Made for magical moments
            </div>
            <h1 className="text-balance text-5xl font-semibold leading-[1.02] tracking-[-0.055em] text-[#281c2d] sm:text-6xl lg:text-[4.5rem]">
              Design beautiful cake toppers in minutes
            </h1>
            <p className="mt-6 max-w-lg text-pretty text-base leading-7 text-[#6d626e] sm:text-lg sm:leading-8">
              Create print-ready cake topper designs, upload your own images, explore polished templates, or generate custom artwork with AI—all in one easy workspace.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="/create"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#f57558] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(245,117,88,0.28)] transition hover:-translate-y-0.5 hover:bg-[#e8694d]"
              >
                Start Designing <span aria-hidden="true">→</span>
              </a>
              <a
                href="#templates"
                className="inline-flex items-center justify-center rounded-full border border-[#dcd4d9] bg-white px-6 py-3.5 text-sm font-semibold text-[#382b3b] shadow-sm transition hover:-translate-y-0.5 hover:border-[#b9acb5]"
              >
                Explore Templates
              </a>
            </div>
            <div className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-[#847985]">
              <span>✓ Print-ready exports</span>
              <span>✓ No design skills needed</span>
              <span>✓ Start for free</span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-2xl lg:mx-0">
            <div className="absolute -right-5 -top-5 size-24 rounded-3xl border border-[#d8cfee] bg-[#f2edff] max-sm:hidden" />
            <div className="absolute -bottom-7 -left-7 size-32 rounded-full border border-[#f4d4c7] bg-[#fff1eb] max-sm:hidden" />

            <div className="relative rounded-[1.75rem] border border-[#dcd4df] bg-white p-2.5 shadow-[0_35px_90px_rgba(63,38,66,0.16)]">
              <div className="flex items-center justify-between border-b border-[#e8e2e9] px-3 py-2.5 sm:px-5">
                <div className="flex gap-1.5" aria-hidden="true">
                  <span className="size-2.5 rounded-full bg-[#f39a82]" />
                  <span className="size-2.5 rounded-full bg-[#f0c66e]" />
                  <span className="size-2.5 rounded-full bg-[#74c5a7]" />
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9a909d] sm:text-xs">
                  Birthday Topper · 6 inch
                </span>
                <span className="rounded-md bg-[#f2edf3] px-2 py-1 text-[10px] font-semibold text-[#6f6372]">
                  100%
                </span>
              </div>

              <div className="grid min-h-[380px] grid-cols-[50px_1fr] overflow-hidden rounded-b-[1.25rem] bg-[#f6f3f7] sm:min-h-[470px] sm:grid-cols-[72px_1fr]">
                <aside className="flex flex-col items-center gap-3 border-r border-[#e6dfe7] bg-white py-5" aria-label="Editor tools preview">
                  {['T', '□', '✦', '↑'].map((tool, index) => (
                    <span
                      key={tool}
                      className={`grid size-8 place-items-center rounded-lg text-xs font-semibold sm:size-9 ${index === 0 ? 'bg-[#2d1d31] text-white' : 'border border-[#e6dfe7] text-[#7d7180]'}`}
                    >
                      {tool}
                    </span>
                  ))}
                </aside>

                <div className="relative grid place-items-center p-5 sm:p-9">
                  <div className="absolute left-4 top-4 rounded-lg bg-white px-2.5 py-1.5 text-[9px] font-semibold text-[#8a7f8d] shadow-sm sm:left-6 sm:top-6 sm:text-[10px]">
                    Canvas
                  </div>
                  <div className="relative grid aspect-square w-full max-w-[330px] place-items-center rounded-full border-[10px] border-white bg-[#efe4f7] shadow-[0_18px_45px_rgba(72,44,80,0.17)] sm:border-[14px]">
                    <span className="absolute left-[17%] top-[18%] text-2xl text-[#f0ae62] sm:text-3xl">✦</span>
                    <span className="absolute right-[16%] top-[24%] size-5 rounded-full bg-[#f68b72] sm:size-7" />
                    <span className="absolute bottom-[21%] left-[18%] size-4 rotate-12 rounded-sm bg-[#7fc6a6] sm:size-6" />
                    <span className="absolute bottom-[15%] right-[20%] text-xl text-[#8d6dc7] sm:text-2xl">♡</span>
                    <div className="relative z-10 -rotate-2 text-center">
                      <span className="block text-[11px] font-bold uppercase tracking-[0.35em] text-[#8d6dc7] sm:text-sm">
                        Happy
                      </span>
                      <span className="mt-1 block font-serif text-3xl font-semibold italic tracking-[-0.04em] text-[#3d2944] sm:text-5xl">
                        Birthday
                      </span>
                      <span className="mx-auto mt-3 block h-px w-16 bg-[#c3a9cc]" />
                      <span className="mt-2 block text-[10px] font-bold uppercase tracking-[0.28em] text-[#a66a58] sm:text-xs">
                        Olivia
                      </span>
                    </div>
                  </div>
                  <div className="absolute bottom-4 right-4 flex items-center gap-2 rounded-xl border border-[#e5dfe7] bg-white px-3 py-2 text-[9px] font-semibold text-[#7a6f7d] shadow-md sm:bottom-6 sm:right-6 sm:text-[10px]">
                    <span className="size-2 rounded-full bg-[#70bf9f]" /> Ready to print
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="templates" className="border-y border-[#281c2d]/7 bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#e16b50]">Made for makers</span>
            <h2 className="mt-4 text-balance text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
              Everything you need to create the perfect topper
            </h2>
            <p className="mt-4 text-base leading-7 text-[#766b78]">
              From the first idea to the final print, every tool is designed to keep your process simple and your result beautiful.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <article
                key={feature.title}
                className="group rounded-3xl border border-[#e9e2e6] bg-[#fffdfb] p-6 transition duration-300 hover:-translate-y-1 hover:border-[#d9cdd5] hover:shadow-[0_18px_45px_rgba(52,34,54,0.08)]"
              >
                <span className={`grid size-11 place-items-center rounded-2xl text-lg font-semibold ${feature.tone}`}>
                  {feature.icon}
                </span>
                <h3 className="mt-6 text-lg font-semibold tracking-[-0.02em]">{feature.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#786e7a]">{feature.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="start" className="bg-[#fffaf5] py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#7957c8]">Choose your creative path</span>
            <h2 className="mt-4 text-balance text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
              Start from scratch or start with AI
            </h2>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2">
            <article className="relative overflow-hidden rounded-[2rem] border border-[#eaded8] bg-white p-7 sm:p-9">
              <span className="grid size-12 place-items-center rounded-2xl bg-[#fff0e9] text-xl text-[#dc674d]">✎</span>
              <h3 className="mt-7 text-2xl font-semibold tracking-[-0.03em]">Manual Design</h3>
              <p className="mt-3 max-w-md text-sm leading-6 text-[#766c77] sm:text-base sm:leading-7">
                Build your topper your way. Add text, upload photos, arrange shapes, and refine every detail on a precision canvas.
              </p>
              <a href="#top" className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-[#cc5d45]">
                Open a blank canvas <span aria-hidden="true">→</span>
              </a>
              <div className="absolute -bottom-12 -right-8 size-36 rounded-full border-[22px] border-[#fff0e9]" />
            </article>

            <article id="ai-images" className="relative overflow-hidden rounded-[2rem] bg-[#322238] p-7 text-white shadow-[0_18px_50px_rgba(50,34,56,0.16)] sm:p-9">
              <span className="grid size-12 place-items-center rounded-2xl bg-white/10 text-xl text-[#d8c2ff]">✦</span>
              <h3 className="mt-7 text-2xl font-semibold tracking-[-0.03em]">Generate Artwork with AI</h3>
              <p className="mt-3 max-w-md text-sm leading-6 text-[#d8cedb] sm:text-base sm:leading-7">
                Describe the theme you imagine and create original artwork ready to personalize for your special occasion.
              </p>
              <a href="#top" className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-[#e0ccff]">
                Imagine something new <span aria-hidden="true">→</span>
              </a>
              <div className="absolute -bottom-16 -right-12 size-44 rounded-full bg-[#7657a0]/35 blur-sm" />
            </article>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#281c2d]/8 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-5 py-8 text-center sm:flex-row sm:px-8 sm:text-left lg:px-10">
          <a href="#top" className="flex items-center gap-2.5 text-sm font-semibold">
            <span className="grid size-7 place-items-center rounded-full bg-[#f57558] text-xs text-white">♡</span>
            Cake Topper Designer
          </a>
          <p className="text-xs text-[#8a808c]">Beautiful celebrations, designed by you.</p>
          <div className="flex gap-5 text-xs font-medium text-[#766b78]">
            <a href="#templates" className="hover:text-[#281c2d]">Templates</a>
            <a id="my-designs" href="#top" className="hover:text-[#281c2d]">My Designs</a>
            <a id="sign-in" href="#top" className="hover:text-[#281c2d]">Sign In</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
