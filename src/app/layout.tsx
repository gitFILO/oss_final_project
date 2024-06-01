import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import Footer from "@/components/footer";
import Header from "@/components//header";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css"
import { Suspense } from "react";
const notoSansKr = Noto_Sans_KR({ subsets: ["latin-ext"] });

export const metadata: Metadata = {
  title: "digest",
  description: "youtube summarizer",
};

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <html lang="en">
      
      <body className={`${notoSansKr.className} antialiased`}>
        <div className="bg-[#fbe2e3] absolute top-[-6rem] -z-10 right-[11rem] h-[31.25rem] w-[31.25rem] rounded-full blur-[10rem] sm:w-[68.75rem] dark:bg-[#946263]"></div>
        <div className="bg-[#dbd7fb] absolute top-[-1rem] -z-10 left-[-35rem] h-[31.25rem] w-[50rem] rounded-full blur-[10rem] sm:w-[68.75rem] md:left-[-33rem] lg:left-[-28rem] xl:left-[-15rem] 2xl:left-[-5rem] dark:bg-[#676394]"></div>

        <div className="flex flex-col justify-between w-full h-full min-h-screen">
          <Header />
          <main className="">
            {children}
          </main>
          <Toaster />
          <Footer />
        </div>
      </body>
    </html>
  );
}
