import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { ApolloWrapper } from '../components/ApolloWrapper';
import { AuthProvider } from '../contexts/AuthContext';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Caro Game - Tic Tac Toe Online',
  description:
    'Play Caro (Tic Tac Toe) online with friends. Challenge yourself in this classic strategy game.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ApolloWrapper>
          <AuthProvider>{children}</AuthProvider>
        </ApolloWrapper>
      </body>
    </html>
  );
}
