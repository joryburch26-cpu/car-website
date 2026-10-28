import "./globals.css";
import { LanguageProvider } from "./context/LanguageContext";
import VisitCounter from "./components/VisitCounter";
import BottomTabs from "./components/BottomTabs";

export const metadata = {
  title: "الوكالة | El Wekalla",
  description: "سوق قطع غيار المستعمل - El Wekalla used car parts market",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <VisitCounter />
        <LanguageProvider>
          {children}
          <BottomTabs />
        </LanguageProvider>
      </body>
    </html>
  );
}