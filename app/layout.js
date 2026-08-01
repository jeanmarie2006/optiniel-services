import "./globals.css";

export const metadata = {
  title: "Optiniel Services",
  description: "Site d’Optiniel Services",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
