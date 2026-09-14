import "./globals.css";
import { LanguageProvider } from "./context/LanguageContext";

export const metadata = {
  title: "Bebo Cars",
  description: "Sell your car quickly and easily",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}