import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata = {
    title: "Mirpur Bazaar - Community Marketplace",
    description:
        "Online marketplace for Mirpur society - Buy and sell quality products from your community",
};

export default function RootLayout({ children }) {
    return (
        <html
            lang="en"
            className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
        >
            <body className="min-h-full flex flex-col">
                <AuthProvider>
                    <CartProvider>
                        <Navbar />
                        {children}
                    </CartProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
