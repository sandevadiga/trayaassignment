import { Imperial_Script, Inter } from "next/font/google";
import "./globals.css";
import Provider from "../components/Provider";
import Nav from '../components/Nav';
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Traya",
  description: "A Next gen Goal Tracker",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider> 
          <>
          <Nav/>
         {children} 
         </>
         </Provider>
          </body>
    </html>
  );
}
