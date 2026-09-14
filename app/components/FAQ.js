"use client";
import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";

export default function FAQ() {
  const { t } = useLanguage();

  const questions = [
    { q: t.faqQ1, a: t.faqA1 },
    { q: t.faqQ2, a: t.faqA2 },
    { q: t.faqQ3, a: t.faqA3 },
    { q: t.faqQ4, a: t.faqA4 },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  function toggle(index) {
    if (openIndex === index) {
      setOpenIndex(null);
    } else {
      setOpenIndex(index);
    }
  }

  return (
    <section id="faq" className="bg-brand-bg text-brand-text px-6 py-20">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
        {t.faqTitle}
      </h2>
      <div className="max-w-2xl mx-auto flex flex-col gap-4">
        {questions.map((item, index) => (
          <div key={item.q} className="border border-zinc-700 rounded-xl p-4">
            <button
              onClick={() => toggle(index)}
              className="w-full text-left flex justify-between items-center font-semibold"
            >
              {item.q}
              <span>{openIndex === index ? "−" : "+"}</span>
            </button>
            {openIndex === index && (
              <p className="mt-3 text-brand-muted text-sm">{item.a}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}