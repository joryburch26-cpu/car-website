"use client";
import { useLanguage } from "../context/LanguageContext";

export default function HowItWorks() {
  const { t } = useLanguage();

  const steps = [
    { number: "1", title: t.step1Title, desc: t.step1Desc },
    { number: "2", title: t.step2Title, desc: t.step2Desc },
    { number: "3", title: t.step3Title, desc: t.step3Desc },
    { number: "4", title: t.step4Title, desc: t.step4Desc },
  ];

  return (
    <section id="how-it-works" className="bg-brand-bg text-brand-text px-6 py-20">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
        {t.howItWorksTitle}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
        {steps.map((step) => (
          <div key={step.number} className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-brand-accent text-black font-bold flex items-center justify-center text-lg">
              {step.number}
            </div>
            <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
            <p className="text-brand-muted text-sm">{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}