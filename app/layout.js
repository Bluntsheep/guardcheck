import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/authContext";
import Menubar from "./components/menubar/menubar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "GuardCheck - Find Professional Security Guards & Upload CV",
    template: "%s | GuardCheck",
  },
  description:
    "Connect with qualified security guards for hire. Guards can upload CVs, employers can find vetted security personnel. Professional security staffing platform with background verification.",
  keywords: [
    "security guards",
    "hire security guards",
    "security personnel",
    "security jobs",
    "security guard CV",
    "security staffing",
    "professional security",
    "security recruitment",
    "guard services",
    "security employment",
    "vetted security guards",
    "background checked guards",
  ],
  authors: [{ name: "GuardCheck Team" }],
  creator: "GuardCheck",
  publisher: "GuardCheck",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  // openGraph: {
  //   type: "website",
  //   locale: "en_US",
  //   url: "https://yoursite.com", // Replace with your actual domain
  //   siteName: "GuardCheck",
  //   title: "GuardCheck - Professional Security Guard Platform",
  //   description: "Find qualified security guards for hire or upload your security guard CV. Professional platform connecting security personnel with employers.",
  //   images: [
  //     {
  //       url: "/og-image.jpg", // Add your Open Graph image
  //       width: 1200,
  //       height: 630,
  //       alt: "GuardCheck - Security Guard Platform",
  //     },
  //   ],
  // },

  category: "Employment",
  classification: "Security Services",
  alternates: {
    canonical: "https://guardcheck.co.za",
  },
  // manifest: "/manifest.json",
  // icons: {
  //   icon: [
  //     { url: "/favicon.ico" },
  //     { url: "/icon-16x16.png", sizes: "16x16", type: "image/png" },
  //     { url: "/icon-32x32.png", sizes: "32x32", type: "image/png" },
  //   ],
  //   apple: [
  //     { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
  //   ],
  //   shortcut: "/favicon.ico",
  // },
  metadataBase: new URL("https://guardcheck.co.za"), // Replace with your actual domain
  other: {
    "application-name": "GuardCheck",
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "GuardCheck",
    "format-detection": "telephone=no",
    "msapplication-TileColor": "#2563eb",
    "theme-color": "#2563eb",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Additional SEO meta tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="geo.region" content="ZA" />
        <meta name="geo.country" content="ZA" />
        <meta name="target_country" content="ZA" />
        <meta name="language" content="English" />
        <meta name="distribution" content="global" />
        <meta name="rating" content="general" />
        <meta name="revisit-after" content="7 days" />

        {/* Structured Data for Local Business */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "GuardCheck",
              description:
                "Professional security guard platform connecting qualified security personnel with employers",
              url: "https://guarcheck.co.za",
              applicationCategory: "BusinessApplication",
              operatingSystem: "Web",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "ZAR",
              },
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.5",
                reviewCount: "100",
              },
              provider: {
                "@type": "Organization",
                name: "GuardCheck",
                url: "https://guardcheck.co.za",
              },
            }),
          }}
        />
      </head>
      <AuthProvider>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <Menubar />
          {children}
        </body>
      </AuthProvider>
    </html>
  );
}
