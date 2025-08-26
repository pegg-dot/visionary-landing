import React, { useState } from "react";

// VISIONARY — Early Access Landing Page (single-file, JS/JSX)
// NOTE: Removed TypeScript-only syntax for compatibility (no generics or param types).
// - TailwindCSS styling; quick setup notes at bottom.
// - Swap SUBMIT_ENDPOINT with your Formspree/Tally/own API endpoint.
// - Accessible form, honeypot anti-bot, success/error states, basic analytics hooks via data-* attributes.

const SUBMIT_ENDPOINT = "https://formspree.io/f/xvgbooze"

// Small utilities
function validateEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v).toLowerCase());
}

export default function VisionaryEarlyAccess() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [agree, setAgree] = useState(true);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("idle"); // "idle" | "success" | "error"
  const [message, setMessage] = useState("");
  const [hp, setHp] = useState(""); // honeypot

  async function handleSubmit(e) {
    e.preventDefault();

    if (!validateEmail(email)) {
      setMessage("Please enter a valid email.");
      setStatus("error");
      return;
    }
    if (!agree) {
      setMessage("Please agree to be contacted about early access.");
      setStatus("error");
      return;
    }
    if (hp) {
      // bot caught
      setStatus("success");
      setMessage("Thanks!");
      return;
    }

    try {
      setLoading(true);
      setStatus("idle");
      setMessage("");

      // Formspree-compatible body; adjust keys to match your provider
      const res = await fetch(SUBMIT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, source: "visionary-early-access" })
      });

      if (res.ok) {
        setStatus("success");
        setMessage("You're on the list. We'll be in touch soon.");
        setEmail("");
        setName("");
        try { localStorage.setItem("visionary_waitlist", "1"); } catch (_) {}
      } else {
        throw new Error("Submission failed");
      }
    } catch (err) {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 selection:bg-white/20">
      {/* NAV */}
      <header className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-neutral-950/50">
        <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
          <div className="font-semibold tracking-widest text-lg">VISIONARY</div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-neutral-300">
            <a href="#how" className="hover:text-white">How it works</a>
            <a href="#benefits" className="hover:text-white">Benefits</a>
            <a href="#faq" className="hover:text-white">FAQ</a>
            <a href="#join" className="rounded-full border border-white/20 px-4 py-1.5 hover:bg-white hover:text-neutral-900 transition">Get early access</a>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 py-20 md:py-28 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="inline-block rounded-full border border-white/20 px-3 py-1 text-xs uppercase tracking-wider text-neutral-300 mb-5">
              Early Access • Crash‑Free Focus
            </p>
            <h1 className="text-4xl md:text-6xl font-semibold leading-tight">
              Focus, worn like <span className="italic">armor</span>.
            </h1>
            <p className="mt-5 text-neutral-300 md:text-lg max-w-prose">
              A transdermal caffeine patch engineered for smooth, calculated energy — move by move, hour by hour. Peel on for up to 8 hours of clarity; peel off to stop. No spikes. No crash.
            </p>

            {/* Signup Card */}
            <div id="join" className="mt-8 bg-white/5 border border-white/10 rounded-2xl p-4 md:p-6">
              {status === "success" ? (
                <div className="text-sm md:text-base">
                  <p className="font-medium">You're on the list ✅</p>
                  <p className="mt-1 text-neutral-300">We'll email you as soon as onboarding opens.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} data-analytics="waitlist-form" className="grid sm:grid-cols-[1fr_auto] gap-3">
                  <div className="grid gap-3 sm:col-span-2 sm:grid-cols-2">
                    <input
                      aria-label="Name"
                      type="text"
                      inputMode="text"
                      autoComplete="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name (optional)"
                      className="w-full rounded-xl bg-neutral-900 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-white/30"
                    />
                    <input
                      aria-label="Email"
                      type="email"
                      required
                      inputMode="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@domain.com"
                      className="w-full rounded-xl bg-neutral-900 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-white/30"
                    />
                    {/* honeypot */}
                    <input
                      tabIndex={-1}
                      autoComplete="off"
                      value={hp}
                      onChange={(e) => setHp(e.target.value)}
                      className="hidden"
                      aria-hidden="true"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="sm:row-span-2 inline-flex items-center justify-center rounded-xl bg-white text-neutral-900 font-medium px-5 py-3 hover:opacity-90 focus:ring-2 focus:ring-white/30 disabled:opacity-50"
                    data-analytics="waitlist-submit"
                  >
                    {loading ? "Joining…" : "Join Early Access"}
                  </button>
                  <label className="sm:col-span-2 flex items-start gap-2 text-xs text-neutral-300">
                    <input type="checkbox" checked={agree} onChange={() => setAgree(!agree)} className="mt-1" />
                    I agree to receive emails about early access and product updates.
                  </label>
                  {status === "error" && (
                    <p className="sm:col-span-2 text-pink-300 text-sm">{message}</p>
                  )}
                </form>
              )}
            </div>

            <p className="mt-4 text-xs text-neutral-400">No spam. Unsubscribe any time.</p>
          </div>

          {/* Right column — visual/USP stack */}
          <div className="relative">
            <div className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-transparent p-6">
              <div className="grid gap-4">
                <Feature title="Steady, crash‑free energy" desc="Transdermal caffeine + L‑theanine for smooth clarity." />
                <Feature title="On/Off control" desc="Peel on to start focus, peel off to stop — your timeline." />
                <Feature title="Up to 8 hours" desc="Designed for deep work sessions, meetings, and builds." />
                <Feature title="Invisible ritual" desc="No mugs, no cans — just discipline you can wear." />
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 hidden md:block">
              <Badge>Early Onboarding</Badge>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="mx-auto max-w-7xl px-4 py-16 md:py-20">
        <h2 className="text-2xl md:text-3xl font-semibold">How VISIONARY Works</h2>
        <p className="mt-3 text-neutral-300 max-w-prose">Instead of flooding your system like coffee, VISIONARY uses transdermal delivery to release caffeine steadily — balanced with L‑theanine and green tea extract for calm precision. The result: focus that feels smooth, not frantic.</p>
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <Step n={1} title="Peel & place" desc="Apply to clean, dry skin (upper arm/shoulder)." />
          <Step n={2} title="Set your session" desc="Clarity begins in minutes and lasts up to 8 hours." />
          <Step n={3} title="Peel to stop" desc="Remove when you want to rest — you’re in control." />
        </div>
      </section>

      {/* BENEFITS */}
      <section id="benefits" className="bg-white/5 border-y border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-16 md:py-20">
          <h2 className="text-2xl md:text-3xl font-semibold">Why builders choose VISIONARY</h2>
          <div className="mt-8 grid md:grid-cols-3 gap-6">
            <Card title="Crash‑free clarity" body="No more spike‑and‑crash rollercoaster. Just steady output." />
            <Card title="Calm, not jitters" body="L‑theanine smooths stimulation so you think clearly." />
            <Card title="Fits your identity" body="A modern ritual for people who take performance seriously." />
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF / QUOTES */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:py-20">
        <h2 className="text-2xl md:text-3xl font-semibold">What early users say</h2>
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <Quote name="Alex — Designer" text="Coffee made me anxious. With VISIONARY, I get five hours of clean focus and still sleep." />
          <Quote name="Jamie — Founder" text="It feels like discipline you can wear. No crash, just execution." />
          <Quote name="Ravi — Consultant" text="My afternoons used to collapse. Now they’re my strongest hours." />
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-7xl px-4 py-16 md:py-20">
        <h2 className="text-2xl md:text-3xl font-semibold">FAQ</h2>
        <div className="mt-6 space-y-4">
          <Faq q="Does a patch really work?" a="Transdermal delivery is widely used in medicine. VISIONARY meters caffeine steadily for smooth focus." />
          <Faq q="Will I feel jittery?" a="The formula pairs caffeine with L‑theanine to keep energy calm and clear." />
          <Faq q="How long does it last?" a="Up to 8 hours. You can remove the patch anytime to stop the session." />
          <Faq q="Is there a crash?" a="The steady release avoids the spike‑and‑crash common with coffee and energy drinks." />
          <Faq q="Can I still drink coffee?" a="Many users skip coffee. If you do combine, start low and assess tolerance." />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-10 text-sm text-neutral-400 grid md:grid-cols-2 gap-6">
          <div>
            <div className="font-semibold tracking-widest text-neutral-200">VISIONARY</div>
            <p className="mt-2 max-w-prose">Crash‑free clarity you control. A modern ritual for people building the next world.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-3">
            <ul className="space-y-2">
              <li><a href="#how" className="hover:text-white">How it works</a></li>
              <li><a href="#benefits" className="hover:text-white">Benefits</a></li>
              <li><a href="#faq" className="hover:text-white">FAQ</a></li>
            </ul>
            <ul className="space-y-2">
              <li><a href="#join" className="hover:text-white">Join Early Access</a></li>
              <li><a href="#" className="hover:text-white">Privacy</a></li>
              <li><a href="#" className="hover:text-white">Terms</a></li>
            </ul>
            <ul className="space-y-2">
              <li className="text-neutral-300">Contact</li>
              <li><a href="mailto:hello@visionary.example" className="hover:text-white">hello@visionary.example</a></li>
            </ul>
          </div>
        </div>
      </footer>
    </main>
  );
}

function Feature({ title, desc }) {
  return (
    <div className="rounded-xl border border-white/10 bg-neutral-900/40 p-4">
      <p className="font-medium">{title}</p>
      <p className="text-neutral-300 text-sm mt-1">{desc}</p>
    </div>
  );
}

function Badge({ children }) {
  return (
    <div className="rounded-full bg-white text-neutral-900 px-4 py-2 text-xs font-semibold shadow-xl">
      {children}
    </div>
  );
}

function Step({ n, title, desc }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-neutral-900/40 p-5">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-full bg-white text-neutral-900 grid place-items-center font-bold">{n}</div>
        <p className="font-medium">{title}</p>
      </div>
      <p className="mt-2 text-neutral-300 text-sm">{desc}</p>
    </div>
  );
}

function Card({ title, body }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-neutral-900/40 p-5">
      <p className="font-medium">{title}</p>
      <p className="mt-2 text-neutral-300 text-sm">{body}</p>
    </div>
  );
}

function Quote({ name, text }) {
  return (
    <blockquote className="rounded-2xl border border-white/10 bg-neutral-900/40 p-5">
      <p className="text-neutral-200">“{text}”</p>
      <cite className="mt-3 block text-neutral-400 text-sm">— {name}</cite>
    </blockquote>
  );
}

function Faq({ q, a }) {
  return (
    <details className="group rounded-2xl border border-white/10 bg-neutral-900/40 p-5">
      <summary className="cursor-pointer list-none font-medium flex items-center justify-between">
        <span>{q}</span>
        <span className="ml-4 text-neutral-400 group-open:rotate-45 transition">+</span>
      </summary>
      <p className="mt-3 text-neutral-300 text-sm">{a}</p>
    </details>
  );
}




// --- Lightweight runtime tests (executed in browser console) ---
try {
  console.groupCollapsed("VISIONARY: basic tests");
  console.assert(validateEmail("a@b.com"), "valid should pass");
  console.assert(!validateEmail("foo"), "missing domain should fail");
  console.assert(!validateEmail("@bar.com"), "missing local should fail");
  console.assert(!validateEmail("a@b"), "missing TLD should fail");
  console.groupEnd();
} catch (_) {}
