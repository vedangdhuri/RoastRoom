import './globals.css';
import ClientLayout from './components/ClientLayout';

export const metadata = {
    title: 'RoastRoom – Real-Time Debate & Roast Arena',
    description: 'Join live debate and roast battles. Compete for XP and climb the leaderboard.',
    icons: {
        icon: '/favicon.svg',
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" className="dark">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body>
                <ClientLayout>{children}</ClientLayout>
            </body>
        </html>
    );
}
