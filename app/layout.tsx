import type {Metadata} from "next";
import "./globals.css";
export const metadata:Metadata={title:"ClaimLens — cross-channel recovery audit",description:"A fictional-data prototype for marketplace payout reconciliation."};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
