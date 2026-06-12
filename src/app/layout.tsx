import type { Metadata } from "next";
import "./globals.css";
import { ReactNode } from "react";
import { ProvidersWrapper } from "./ProvidersWrapper";
import { Toaster } from 'sonner';
import Header from "../components/Header";

export const metadata: Metadata = {
  title: "On Chain ID Demo",
  description: "A demo app for On Chain ID",
};

export default function RootLayout(props: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ProvidersWrapper>
          <Toaster position="top-right" />
            <Header />
              {props.children}
        </ProvidersWrapper>
      </body>
    </html>
  );
}