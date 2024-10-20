import type { Metadata } from "next";
//import localFont from "next/font/local";
import "./globals.css";
import { ConvexClientProvider } from "./ConvexClientProvider";
import Header from "./Header";
import { Toaster } from "@/components/ui/toaster";
import { Footer } from "./Footer";



/* const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
}); */

export const metadata: Metadata = {
  title: "File Garage",
  description: "Store your files in the cloud",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={` antialiased`}>
        <ConvexClientProvider>
          <Header />
          {children}
          <Footer />
          <Toaster />
        </ConvexClientProvider>
      </body>
    </html>
  );
}
