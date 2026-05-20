import type { Metadata } from "next";
import "./globals.css";
import { ReactNode } from "react";
import { ProvidersWrapper } from "./ProvidersWrapper";
import Header from "../components/Header";

export const metadata: Metadata = {
  title: "TSender"
};

export default function RootLayout(props: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ProvidersWrapper>
          <Header />
          {props.children}
        </ProvidersWrapper>
      </body>
    </html>
  );
}