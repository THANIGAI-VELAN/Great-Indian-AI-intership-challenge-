import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-paper text-ink flex flex-col items-center justify-center p-6 text-center">
      <span className="font-mono text-xs font-bold uppercase tracking-widest text-vermilion mb-3">
        404 · Page Not Found
      </span>
      <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-ink mb-4">
        Missing page in your notebook.
      </h1>
      <p className="text-sm text-ink-muted font-sans max-w-md mb-8">
        The page you are looking for doesn&apos;t exist, or has been moved to another section.
      </p>

      <div className="flex items-center gap-3">
        <Link href="/">
          <Button variant="secondary" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Button>
        </Link>
        <Link href="/board">
          <Button variant="primary">
            <span>Open Task Board</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}

