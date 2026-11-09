import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Mic,
  FileText,
  Sparkles,
  Zap,
  Volume2,
  Lock,
  Database,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { InteractiveHeroPreview } from "@/components/marketing/InteractiveHeroPreview";
import { WorkflowShowcase } from "@/components/marketing/WorkflowShowcase";

export default function MarketingPage() {
  return (
    <div className="min-h-screen bg-paper text-ink dark:bg-paper-dark dark:text-ink-dark flex flex-col relative overflow-hidden transition-colors duration-300">
      {/* Background Ambient Glows */}
      <div className="ambient-glow w-[500px] h-[500px] -top-40 -left-40 bg-amber-200/50 dark:bg-amber-800/10" />
      <div className="ambient-glow w-[600px] h-[600px] top-60 -right-40 bg-orange-200/40 dark:bg-orange-800/10" />
      <div className="ambient-glow w-[500px] h-[500px] bottom-80 left-1/3 bg-blue-200/40 dark:bg-blue-900/10" />

      {/* 1. Glassmorphic Navigation Header */}
      <header className="sticky top-0 z-50 glass-panel border-b border-rule/60 dark:border-rule-dark/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="w-8 h-8 rounded-xl bg-ink text-card dark:bg-card-dark dark:text-ink-dark flex items-center justify-center font-display font-bold text-base shadow-paper group-hover:scale-105 transition-transform border border-rule/50 dark:border-white/10">
              S
            </span>
            <div className="flex flex-col">
              <span className="font-display font-bold text-xl tracking-tight text-ink dark:text-ink-dark leading-none">
                Solli
              </span>
              <span className="text-[10px] font-mono text-ink-muted dark:text-ink-muted-dark tracking-wider uppercase">
                சொல்லி
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-ink-muted dark:text-ink-muted-dark">
            <Link
              href="#how-it-works"
              className="hover:text-ink dark:hover:text-ink-dark transition-colors"
            >
              How it works
            </Link>
            <Link
              href="#why-solli"
              className="hover:text-ink dark:hover:text-ink-dark transition-colors"
            >
              Why Solli
            </Link>
            <Link
              href="#comparison"
              className="hover:text-ink dark:hover:text-ink-dark transition-colors"
            >
              Comparison
            </Link>
            <Link
              href="#privacy"
              className="hover:text-ink dark:hover:text-ink-dark transition-colors"
            >
              Privacy &amp; BYOK
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/board">
              <Button
                size="sm"
                variant="primary"
                className="gap-1.5 rounded-full px-4 shadow-md hover:shadow-lg transition-all"
              >
                <span>Launch Board</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 px-4 sm:px-6 border-b border-rule/50 dark:border-rule-dark/50">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          <div className="lg:col-span-6 space-y-6">
            {/* Challenge & AI Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-pill text-xs font-mono font-medium text-ink dark:text-ink-dark shadow-sm">
              <span className="w-2 h-2 rounded-full bg-vermilion animate-pulse" />
              <span>Great Indian AI Challenge 2026</span>
              <span className="text-ink-muted dark:text-ink-muted-dark">·</span>
              <span className="text-ink-muted dark:text-ink-muted-dark">Gnani AI Speech</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-ink dark:text-ink-dark leading-[1.08]">
              Don&apos;t listen twice. <br />
              <span className="italic font-normal text-vermilion">Get things done.</span>
            </h1>

            <p className="text-base sm:text-lg text-ink-muted dark:text-ink-muted-dark leading-relaxed max-w-xl font-sans">
              Your professor said something important. Your client sent a long voice note. Your WhatsApp is full of things to remember. Solli extracts structured tasks, subjects, and deadlines from Tamil, Tanglish, Hinglish, and English onto an urgency-sorted board.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link href="/board">
                <Button
                  size="lg"
                  variant="primary"
                  className="rounded-full px-7 shadow-lg hover:shadow-xl transition-all gap-2"
                >
                  <span>Explore Your Board</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button
                  size="lg"
                  variant="secondary"
                  className="rounded-full px-6 glass-pill border-rule/70 dark:border-rule-dark"
                >
                  See how it works
                </Button>
              </Link>
            </div>

            {/* Trust badges */}
            <div className="pt-4 border-t border-rule/60 dark:border-rule-dark/60 text-xs font-mono text-ink-muted dark:text-ink-muted-dark flex flex-wrap items-center gap-x-4 gap-y-1.5">
              <span className="flex items-center gap-1.5 text-done font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" /> Free for students
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5 text-ink dark:text-ink-dark">
                <ShieldCheck className="w-3.5 h-3.5 text-info" /> Bring your own keys
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" /> 100% on-device data
              </span>
            </div>
          </div>

          {/* Right Side: Interactive Soundwave & Extraction Preview */}
          <div className="lg:col-span-6">
            <InteractiveHeroPreview />
          </div>
        </div>
      </section>

      {/* 3. Problem Story with Glassmorphic Scenario Cards */}
      <section
        id="why-solli"
        className="py-20 md:py-28 px-4 sm:px-6 border-b border-rule/50 dark:border-rule-dark/50 relative"
      >
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="space-y-3">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-vermilion">
              THE UNWRITTEN DEADLINE PROBLEM
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-ink dark:text-ink-dark max-w-3xl leading-tight">
              Ever forgotten something important because you didn&apos;t write it down?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-panel p-6 sm:p-7 rounded-3xl space-y-4 hover:scale-[1.02] transition-transform duration-300">
              <span className="text-xs font-mono font-bold tracking-wider px-2.5 py-1 rounded-full bg-vermilion/10 text-vermilion border border-vermilion/30">
                A · COLLEGE
              </span>
              <h3 className="font-display text-lg font-bold text-ink dark:text-ink-dark">
                Professor Announcements
              </h3>
              <p className="text-sm leading-relaxed text-ink-muted dark:text-ink-muted-dark font-sans">
                Sir announced the lab record submission deadline in Tamil &amp; English at the end of class. Nothing was written down, and you thought you&apos;d remember it.
              </p>
            </div>

            <div className="glass-panel p-6 sm:p-7 rounded-3xl space-y-4 hover:scale-[1.02] transition-transform duration-300">
              <span className="text-xs font-mono font-bold tracking-wider px-2.5 py-1 rounded-full bg-info/10 text-info border border-info/30">
                B · WHATSAPP
              </span>
              <h3 className="font-display text-lg font-bold text-ink dark:text-ink-dark">
                Group Voice Messages
              </h3>
              <p className="text-sm leading-relaxed text-ink-muted dark:text-ink-muted-dark font-sans">
                Your class representative sent a 3-minute voice note covering five separate requirements, assignment formats, and dates you have to replay five times.
              </p>
            </div>

            <div className="glass-panel p-6 sm:p-7 rounded-3xl space-y-4 hover:scale-[1.02] transition-transform duration-300">
              <span className="text-xs font-mono font-bold tracking-wider px-2.5 py-1 rounded-full bg-done/10 text-done border border-done/30">
                C · FREELANCING
              </span>
              <h3 className="font-display text-lg font-bold text-ink dark:text-ink-dark">
                Client Voice Memos
              </h3>
              <p className="text-sm leading-relaxed text-ink-muted dark:text-ink-muted-dark font-sans">
                Your client described ten changing project requirements in one casual voice message while walking. Critical specifications were lost in speech.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl glass-panel border-l-4 border-l-vermilion flex items-center justify-between flex-wrap gap-4">
            <p className="font-display text-lg sm:text-xl font-bold text-ink dark:text-ink-dark">
              Important information shouldn&apos;t disappear inside conversations.
            </p>
            <Link href="/board">
              <Button size="sm" variant="vermilion" className="gap-1.5 rounded-full">
                <span>Start Organising</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 4. How It Works (Interactive Workflow Slider) */}
      <section
        id="how-it-works"
        className="py-20 md:py-28 px-4 sm:px-6 border-b border-rule/50 dark:border-rule-dark/50"
      >
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="space-y-3">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-vermilion">
              INTELLIGENT PIPELINE
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-ink dark:text-ink-dark">
              From spoken words to organised work.
            </h2>
            <p className="text-sm sm:text-base text-ink-muted dark:text-ink-muted-dark max-w-2xl">
              Solli bridges Indian multilingual speech recognition and structured task planning in four deliberate steps.
            </p>
          </div>

          <WorkflowShowcase />
        </div>
      </section>

      {/* 5. Honest Competitor / Category Comparison */}
      <section
        id="comparison"
        className="py-20 md:py-28 px-4 sm:px-6 border-b border-rule/50 dark:border-rule-dark/50"
      >
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="space-y-3">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-vermilion">
              HONEST EVALUATION
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-ink dark:text-ink-dark">
              Transcription is only the beginning.
            </h2>
            <p className="text-sm sm:text-base text-ink-muted dark:text-ink-muted-dark max-w-xl">
              Most tools help you understand what was said. Solli focuses strictly on what you need to do next.
            </p>
          </div>

          {/* Frosted Glass Comparison Table */}
          <div className="overflow-x-auto rounded-3xl glass-panel shadow-xl">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-rule/60 dark:border-rule-dark/60 bg-black/5 dark:bg-white/5 text-xs font-mono uppercase tracking-wider text-ink-muted dark:text-ink-muted-dark">
                  <th className="py-4 px-6 font-semibold">Category</th>
                  <th className="py-4 px-6 font-semibold">Typical Focus</th>
                  <th className="py-4 px-6 font-semibold">The Gap for Students</th>
                  <th className="py-4 px-6 font-semibold text-vermilion">Solli&apos;s Approach</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rule/60 dark:divide-rule-dark/60 font-sans">
                <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                  <td className="py-4 px-6 font-semibold text-ink dark:text-ink-dark">
                    WhatsApp Transcripts
                  </td>
                  <td className="py-4 px-6 text-ink-muted dark:text-ink-muted-dark">
                    Transcribing received audio messages to raw on-device text
                  </td>
                  <td className="py-4 px-6 text-ink-muted dark:text-ink-muted-dark">
                    No structured tasks, no calendar dates, no links extracted
                  </td>
                  <td className="py-4 px-6 font-medium text-ink dark:text-ink-dark">
                    Extracts dated tasks &amp; resource chips
                  </td>
                </tr>

                <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                  <td className="py-4 px-6 font-semibold text-ink dark:text-ink-dark">
                    Meeting Notetakers (Otter, Fireflies)
                  </td>
                  <td className="py-4 px-6 text-ink-muted dark:text-ink-muted-dark">
                    Recording 60-minute corporate calls with meeting bots
                  </td>
                  <td className="py-4 px-6 text-ink-muted dark:text-ink-muted-dark">
                    Heavy meeting bots; weak Tamil/Tanglish codemix accuracy
                  </td>
                  <td className="py-4 px-6 font-medium text-ink dark:text-ink-dark">
                    Tuned for &ldquo;one student, one 30s announcement&rdquo;
                  </td>
                </tr>

                <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                  <td className="py-4 px-6 font-semibold text-ink dark:text-ink-dark">
                    General To-Do Voice Apps
                  </td>
                  <td className="py-4 px-6 text-ink-muted dark:text-ink-muted-dark">
                    Dictating a single known task in English
                  </td>
                  <td className="py-4 px-6 text-ink-muted dark:text-ink-muted-dark">
                    Cannot split a 40-second mixed-language note into multiple tasks
                  </td>
                  <td className="py-4 px-6 font-medium text-ink dark:text-ink-dark">
                    Splits multi-assignment audio into dated cards
                  </td>
                </tr>

                <tr className="bg-vermilion/5 dark:bg-vermilion/10 font-semibold border-t-2 border-vermilion/40">
                  <td className="py-4 px-6 text-ink dark:text-ink-dark flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-vermilion" />
                    Solli
                  </td>
                  <td className="py-4 px-6 text-ink dark:text-ink-dark" colSpan={3}>
                    Multilingual speech in (Tamil, Tanglish, Hinglish, English) &rarr; structured, dated, urgency-sorted cards out, with 100% verified source quotes.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-xs font-mono text-ink-muted dark:text-ink-muted-dark italic">
            Summary of typical focus only. Verify each product for its current features.
          </p>
        </div>
      </section>

      {/* 6. Privacy & BYOK Architecture */}
      <section
        id="privacy"
        className="py-20 md:py-28 px-4 sm:px-6 border-b border-rule/50 dark:border-rule-dark/50"
      >
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="space-y-3">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-vermilion">
              LOCAL-FIRST BY DESIGN
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-ink dark:text-ink-dark">
              Your notes. Your keys. Your control.
            </h2>
            <p className="text-sm sm:text-base text-ink-muted dark:text-ink-muted-dark">
              No cloud accounts, zero telemetry, and complete autonomy over your data.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-done/10 text-done flex items-center justify-center border border-done/30">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="font-display text-lg font-bold text-ink dark:text-ink-dark">
                Zero Server Database
              </h3>
              <p className="text-xs sm:text-sm leading-relaxed text-ink-muted dark:text-ink-muted-dark font-sans">
                No user accounts or centralized database in v1. All tasks, captures, and settings live directly in your browser&apos;s localStorage with full export &amp; import controls.
              </p>
            </div>

            <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-info/10 text-info flex items-center justify-center border border-info/30">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="font-display text-lg font-bold text-ink dark:text-ink-dark">
                Bring Your Own Keys
              </h3>
              <p className="text-xs sm:text-sm leading-relaxed text-ink-muted dark:text-ink-muted-dark font-sans">
                You provide your Gnani speech key and free LLM key (Gemini, Groq, Cerebras, or OpenRouter). Requests travel via a stateless proxy and are never saved or logged server-side.
              </p>
            </div>

            <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-vermilion/10 text-vermilion flex items-center justify-center border border-vermilion/30">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-display text-lg font-bold text-ink dark:text-ink-dark">
                Frugal with Credits
              </h3>
              <p className="text-xs sm:text-sm leading-relaxed text-ink-muted dark:text-ink-muted-dark font-sans">
                Text input uses 0 speech credits. Audio notes are trimmed of silence on your device, downsampled to mono 16kHz WAV, and cached by hash to avoid re-transcription costs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Pre-Footer Premium Dark Banner */}
      <section className="py-20 md:py-28 px-4 sm:px-6 bg-ink dark:bg-card-dark text-card dark:text-ink-dark relative overflow-hidden">
        <div className="ambient-glow w-96 h-96 -top-20 -right-20 bg-vermilion/30" />
        <div className="ambient-glow w-96 h-96 -bottom-20 -left-20 bg-info/30" />

        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-mono font-medium text-paper">
            <Sparkles className="w-3.5 h-3.5 text-vermilion" />
            <span>Try Sample Mode without API Keys</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-paper">
            Next time someone says something important, just Solli it.
          </h2>

          <p className="text-base text-ink-muted-dark font-sans max-w-lg mx-auto leading-relaxed">
            Stop scrubbing through 3-minute voice notes. Turn classroom chaos into an actionable, dated to-do board today.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <Link href="/board">
              <Button
                size="lg"
                className="bg-paper text-ink hover:bg-paper/90 rounded-full px-8 shadow-xl font-bold"
              >
                Launch Solli Board
              </Button>
            </Link>
            <Link href="/board">
              <Button
                size="lg"
                variant="outline"
                className="border-white/20 text-paper hover:bg-white/10 rounded-full px-7"
              >
                Try Sample Tasks
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 8. Footer */}
      <footer className="py-14 px-4 sm:px-6 bg-paper dark:bg-paper-dark border-t border-rule/60 dark:border-rule-dark/60 text-xs text-ink-muted dark:text-ink-muted-dark">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-6 space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-ink text-card dark:bg-card-dark dark:text-ink-dark flex items-center justify-center font-display font-bold text-sm">
                S
              </span>
              <span className="font-display font-bold text-lg text-ink dark:text-ink-dark">
                Solli · சொல்லி
              </span>
            </div>
            <p className="text-xs text-ink-muted dark:text-ink-muted-dark font-sans max-w-sm leading-relaxed">
              A student-built tool turning everyday classroom announcements and WhatsApp voice notes into structured, dated to-do boards.
            </p>
          </div>

          <div className="md:col-span-3 space-y-2">
            <p className="font-mono uppercase font-bold text-ink dark:text-ink-dark">
              Navigation
            </p>
            <ul className="space-y-1.5 font-sans">
              <li>
                <Link href="/board" className="hover:text-ink dark:hover:text-ink-dark">
                  Open Board &rarr;
                </Link>
              </li>
              <li>
                <Link href="#how-it-works" className="hover:text-ink dark:hover:text-ink-dark">
                  How it works
                </Link>
              </li>
              <li>
                <Link href="#why-solli" className="hover:text-ink dark:hover:text-ink-dark">
                  Why Solli
                </Link>
              </li>
              <li>
                <Link href="#privacy" className="hover:text-ink dark:hover:text-ink-dark">
                  Privacy policy
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3 space-y-2">
            <p className="font-mono uppercase font-bold text-ink dark:text-ink-dark">
              Credits &amp; Challenge
            </p>
            <div className="space-y-1 text-ink-muted dark:text-ink-muted-dark font-sans">
              <p>
                Designed &amp; built by <strong>Thanigai Velan</strong>.
              </p>
              <p>
                Speech intelligence by <strong>Gnani AI</strong> — Prisma &amp; Timbre.
              </p>
              <p>Built for The Great Indian AI Internship Challenge 2026.</p>
              <p className="pt-2 text-ink-muted/80">© 2026 Solli. Open source MIT.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
