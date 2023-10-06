import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';
import { ModalContextProvider } from '@/context/modal.context';
import { AppContextProvider } from '@/context/app.context';
import '@/styles/globals.css';
import type { Metadata } from 'next';
import { Nunito } from 'next/font/google';
import 'swiper/swiper-bundle.css';

const inter = Nunito({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ThunMov - Online Movies & TV Shows',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`bg-black/95 ${inter.className}`}>
        <AppContextProvider>
          <ModalContextProvider>
            <Navbar />
            {children}
            <Footer />
          </ModalContextProvider>
        </AppContextProvider>
      </body>
    </html>
  );
}
