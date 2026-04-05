import "./globals.css";
import ClientLayout from "./components/ClientLayout";

export const metadata = {
  title: "RoastRoom – Real-Time Debate & Roast Arena",
  description:
    "Join real-time debate and roast battles. Outsmart your opponents, get scored by AI in real-time, and climb the global leaderboard. The ultimate competitive arena for wits and words.",
  keywords: ["debate", "roast", "battle", "AI", "competitive", "arena", "gaming"],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#0e0e10" />
      </head>
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
