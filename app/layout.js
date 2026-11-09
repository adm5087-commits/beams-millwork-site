import "@fontsource/cormorant-garamond/300.css";
import "@fontsource/cormorant-garamond/400.css";
import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/jost/300.css";
import "@fontsource/jost/400.css";
import "@fontsource/jost/500.css";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { site } from "@/lib/site";
import { getLogos } from "@/lib/logo";

export const metadata = {
  metadataBase: new URL(site.url),
  title: { default: "Beam\u2019s Millwork | Architectural Millwork in Morgantown, PA", template: "%s | Beam\u2019s Millwork" },
  description: site.description,
  openGraph: { siteName: "Beam\u2019s Millwork", type: "website", locale: "en_US" },
  icons: { icon: "/favicon.png", apple: "/apple-touch-icon.png" },
};

export const viewport = { themeColor: "#1D1B19" };

export default function RootLayout({ children }) {
  const { logo, logoReverse, logoLight } = getLogos();
  return (
    <html lang="en">
      <body>
        <a href="#main" className="skip">Skip to content</a>
        <Header logo={logo} logoReverse={logoReverse} />
        <main id="main">{children}</main>
        <Footer logo={logoLight} />
      </body>
    </html>
  );
}
