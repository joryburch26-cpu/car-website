"use client";
import { useLanguage } from "../context/LanguageContext";

export default function Benefits() {
  const { t } = useLanguage();

  const benefits = [t.benefit1, t.benefit2, t.benefit3, t.benefit4, t.benefit5];

  return (
    <section className="bg-brand-bg-dark text-brand-text px-6 py-20">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
        {t.whySellWithUs}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {benefits.map((item) => (
          <div key={item} className="bg-brand-card rounded-xl p-6 text-center">
            <p className="text-brand-muted">{item}</p>
          </div>
        ))}
      </div>
    </section>
  );
}