import "./globals.css";
import { LanguageProvider } from "./context/LanguageContext";

export const metadata = {
  title: "الوكالة | El Wekalla",
  description: "سوق قطع غيار المستعمل - El Wekalla used car parts market",
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