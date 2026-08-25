import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans_Arabic, Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const arabic = IBM_Plex_Sans_Arabic({
  variable: "--font-arabic",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

const grotesk = Space_Grotesk({
  variable: "--font-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://abdulrahman-alanani.vercel.app",
  ),
  title: "Abdulrahman Alanani — AI Engineer",
  description:
    "AI Engineer in Riyadh building intelligent systems that connect AI models with real-world software, automation, data, and hardware.",
  keywords: [
    "Abdulrahman Alanani",
    "AI Engineer",
    "LLM",
    "RAG",
    "Computer Vision",
    "FastAPI",
    "Automation",
    "مهندس ذكاء اصطناعي",
  ],
  alternates: {
    canonical: "/",
    languages: { en: "/", ar: "/" },
  },
    openGraph: {
      title: "Abdulrahman Alanani — AI Engineer",
      description:
        "From model to production. From software to the physical world.",
      type: "website",
      locale: "en_US",
      alternateLocale: ["ar_SA"],
    },
    twitter: {
      card: "summary_large_image",
      title: "Abdulrahman Alanani — AI Engineer",
      description:
        "From model to production. From software to the physical world.",
    },
  };

export const viewport: Viewport = {
  themeColor: "#050d17",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      dir="ltr"
      className={`${inter.variable} ${arabic.variable} ${jetbrains.variable} ${grotesk.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var l=localStorage.getItem("aa-locale");if(l==="ar"){document.documentElement.lang="ar";document.documentElement.dir="rtl"}}catch(e){}`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-bg text-hi">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:start-3 focus:z-[100] focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
        >
          Skip to content
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Abdulrahman Alanani",
              jobTitle: "AI Engineer",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Riyadh",
                addressCountry: "SA",
              },
              email: "mailto:aalanani.2000@gmail.com",
              url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://abdulrahman-alanani.vercel.app",
              sameAs: [
                "https://www.linkedin.com/in/abdulrahman-alanani",
                "https://github.com/aalanani2000",
              ],
              alumniOf: {
                "@type": "CollegeOrUniversity",
                name: "Badr University in Cairo",
              },
              knowsAbout: [
                "Large Language Models",
                "Retrieval-Augmented Generation",
                "Computer Vision",
                "YOLOv8",
                "FastAPI",
                "Workflow Automation",
              ],
            }),
          }}
        />
        {children}
      </body>
    </html>
  );
}
