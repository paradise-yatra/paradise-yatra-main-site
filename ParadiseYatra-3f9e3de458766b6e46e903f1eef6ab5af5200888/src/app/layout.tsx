import type { Metadata, Viewport } from "next";
import { Playfair_Display, Nunito } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import { BlogProvider } from "@/context/BlogContext";
import Script from "next/script";

const playfairDisplay = Playfair_Display({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-playfair-display",
  display: "swap",
});

const nunito = Nunito({
  weight: ["300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  // Only include global metadata that should apply to all pages
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  // Google Search Console verification
  verification: {
    google: "BdQBvIBq9neLnNKB-UbBDMkLm47f_BupmJrmVr37QFE",
  },
  // Preload critical resources
  other: {
    'theme-color': '#1e40af',
    'sitemap': '/sitemap.xml',
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://www.youtube-nocookie.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: blob:; media-src 'self' https://www.youtube-nocookie.com; frame-src 'self' https://www.youtube-nocookie.com; connect-src 'self' https://www.youtube-nocookie.com;",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
         <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-99JYJS0FSF"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {` 
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-99JYJS0FSF');
          `}
        </Script>
        <Script id="smooth-scroll" strategy="afterInteractive">
          {`
            // Enhanced smooth scrolling for better cross-browser compatibility
            document.addEventListener('DOMContentLoaded', function() {
              // Handle anchor links with smooth scrolling
              document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                  e.preventDefault();
                  const target = document.querySelector(this.getAttribute('href'));
                  if (target) {
                    const headerHeight = 80; // Adjust based on your header height
                    const targetPosition = target.offsetTop - headerHeight;
                    
                    window.scrollTo({
                      top: targetPosition,
                      behavior: 'smooth'
                    });
                  }
                });
              });
              
              // Enhanced scroll behavior for programmatic scrolling
              window.smoothScrollTo = function(element, offset = 80) {
                const targetPosition = element.offsetTop - offset;
                window.scrollTo({
                  top: targetPosition,
                  behavior: 'smooth'
                });
              };
              
              // Add smooth scrolling to all scrollable containers
              document.querySelectorAll('.smooth-scroll').forEach(container => {
                container.style.scrollBehavior = 'smooth';
                container.style.webkitOverflowScrolling = 'touch';
              });
            });
          `}
        </Script>
      </head>
      <body
        className={`${playfairDisplay.variable} ${nunito.variable} antialiased`}
      >
        <BlogProvider>
          {children}
          <Footer />
        </BlogProvider>
      </body>
    </html>
  );
}
