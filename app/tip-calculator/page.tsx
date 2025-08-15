"use client"

import { useState } from "react"
import { TipCalculator } from "@/components/tip-calculator"
import Header from "@/components/header"
import type { Language } from "@/lib/translations"
import type { Currency } from "@/lib/currency"

export default function TipCalculatorPage() {
  const [currentLanguage] = useState<Language>("en")
  const [currentCurrency] = useState<Currency>("USD")

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <Header />

      <main className="container mx-auto px-4 py-12">
        <TipCalculator currentLanguage={currentLanguage} currentCurrency={currentCurrency} />
      </main>
    </div>
  )
}
