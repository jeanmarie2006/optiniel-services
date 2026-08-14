import { Big_Shoulders_Display, Inter, IBM_Plex_Mono } from "next/font/google";
import "../styles/globals.css";

const display = Big_Shoulders_Display({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-display",
});

const body = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

export default function App({ Component, pageProps }) {
  return (
    <main className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <Component {...pageProps} />
    </main>
  );
}
