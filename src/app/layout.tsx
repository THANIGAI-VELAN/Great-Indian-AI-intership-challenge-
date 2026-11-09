import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Solli — Classroom Announcements to Urgent To-Do Boards",
  description:
    "Turn classroom voice notes, announcements, and WhatsApp forwards into a dated, structured to-do board. Powered by Gnani AI.",
  authors: [{ name: "Thanigai Velan" }],
};

export const viewport: Viewport = {
  themeColor: "#F6F1E7",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400..700;1,9..144,400..700&family=Instrument+Sans:ital,wght@0,400..700;1,400..700&family=JetBrains+Mono:wght@400..700&family=Noto+Sans+Tamil:wght@400;500;600;700&family=Noto+Serif+Tamil:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-paper font-sans text-ink antialiased selection:bg-highlight-date selection:text-ink">
        {children}
      </body>
    </html>
  );
}
