import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {title:"Trellis — See what is holding everything up.",description:"See what is holding everything up. Open-source tools by Rishit Pradhan.",icons:{icon:"/favicon.svg"}};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="en"><body>{children}</body></html>}
