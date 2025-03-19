import Head from 'next/head';
import '@styles/globals.css';

import Navbar from '@components/NavBar/Navbar';
import Footer from '@components/Footer/Footer';

export default function Layout({ children }) {
    return (
        <html lang="nl">
            <Head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Lato:wght@100;300;400;700;900&display=swap" rel="stylesheet" />
            </Head>
            
            <body>

                <Navbar />
                <main>{children}</main>
                <Footer />
            </body>
        </html>
    );
}
