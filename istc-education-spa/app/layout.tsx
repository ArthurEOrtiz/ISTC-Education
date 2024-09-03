import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/html/header";
import Footer from "@/components/html/footer";
import Main from "@/components/html/main";
import SessionWrapper from "@/components/auth/session-wrapper";
import ClientWrapper from "@/components/auth/client-wrapper";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ISTC Education",
  description: "ISTC Education",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`min-h-screen flex flex-col ${inter.className}`}>
        <Header />
        <Main>
          {/* <ClientWrapper> */}
            {children}
          {/* </ClientWrapper> */}
        </Main>
        <Footer />
      </body>
    </html>
  );
}
