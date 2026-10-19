import "@fontsource/spectral/500.css";
import "@fontsource/spectral/600.css";
import "@fontsource/public-sans/400.css";
import "@fontsource/public-sans/600.css";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { site } from "@/lib/site";

export const metadata = {
  metadataBase: new URL(site.url),
  title: { default: "Beam\u2019s Millwork | Architectural Millwork in Morgantown, PA", template: "%s | Beam\u2019s Millwork" },
  description: site.description,
  openGraph: { siteName: "Beam\u2019s Millwork", type: "website", locale: "en_US" },
  icons: { icon: "/favicon.svg" },
};

export const viewport = { themeColor: "#4A2F1E" };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <a href="#main" className="skip">Skip to content</a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
