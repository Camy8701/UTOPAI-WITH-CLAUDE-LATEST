"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Minus, Plus, Calculator } from "lucide-react"
import { type Language, getTranslation } from "@/lib/translations"
import { formatCurrency, type Currency } from "@/lib/currency"

interface TipCalculatorProps {
  currentLanguage: Language
  currentCurrency: Currency
}

export function TipCalculator({ currentLanguage, currentCurrency }: TipCalculatorProps) {
  const [billAmount, setBillAmount] = useState<number>(0)
  const [taxAmount, setTaxAmount] = useState<number>(0)
  const [taxPercentage, setTaxPercentage] = useState<number>(8.5)
  const [tipPercentage, setTipPercentage] = useState<number>(18)
  const [customTipAmount, setCustomTipAmount] = useState<number>(0)
  const [peopleCount, setPeopleCount] = useState<number>(1)
  const [serviceQuality, setServiceQuality] = useState<"poor" | "good" | "excellent">("good")
  const [tipMode, setTipMode] = useState<"percentage" | "custom">("percentage")

  const t = (key: keyof typeof import("@/lib/translations").translations.en, params?: Record<string, string>) =>
    getTranslation(currentLanguage, key, params)

  // Calculate tax based on bill amount and tax percentage
  const calculatedTax = (billAmount * taxPercentage) / 100
  const finalTaxAmount = taxAmount > 0 ? taxAmount : calculatedTax

  // Calculate tip based on mode
  const tipAmount = tipMode === "percentage" ? (billAmount * tipPercentage) / 100 : customTipAmount
  const totalBill = billAmount + finalTaxAmount + tipAmount
  const perPerson = totalBill / peopleCount

  const serviceOptions = [
    { key: "poor", label: t("poor"), percentage: 10 },
    { key: "good", label: t("good"), percentage: 18 },
    { key: "excellent", label: t("excellent"), percentage: 22 },
  ]

  const handleServiceQualityChange = (quality: "poor" | "good" | "excellent") => {
    setServiceQuality(quality)
    const option = serviceOptions.find((opt) => opt.key === quality)
    if (option) {
      setTipPercentage(option.percentage)
      setTipMode("percentage")
    }
  }

  const adjustPeople = (change: number) => {
    const newCount = peopleCount + change
    if (newCount >= 1 && newCount <= 100) {
      setPeopleCount(newCount)
    }
  }

  const roundUpBill = () => {
    if (billAmount <= 0) return

    const roundedTotal = Math.ceil(totalBill)
    const newTipAmount = roundedTotal - billAmount - finalTaxAmount
    setCustomTipAmount(newTipAmount)
    setTipMode("custom")
  }

  const resetCalculator = () => {
    setBillAmount(0)
    setTaxAmount(0)
    setTaxPercentage(8.5)
    setTipPercentage(18)
    setCustomTipAmount(0)
    setPeopleCount(1)
    setServiceQuality("good")
    setTipMode("percentage")
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header with Teal Colors */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-600 to-teal-400 text-white rounded-full text-sm font-medium mb-4">
          <Calculator className="w-4 h-4" />
          {t("smartCalculator")}
        </div>
        <h1 className="text-4xl font-bold mb-4 text-slate-900 dark:text-white">{t("smartTipCalculatorTitle")}</h1>
        <p className="text-xl text-slate-600 dark:text-slate-300">{t("calculateTipsDesc")}</p>
      </div>

      <Card className="p-6 border-0 shadow-xl bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900">
        <CardContent className="p-0 space-y-8">
          {/* Bill Amount */}
          <div className="space-y-3">
            <label className="text-lg font-semibold text-slate-900 dark:text-white">{t("billAmount")}</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-xl font-semibold text-slate-500">
                {formatCurrency(0, currentCurrency).charAt(0)}
              </span>
              <Input
                type="number"
                placeholder="0.00"
                value={billAmount || ""}
                onChange={(e) => setBillAmount(Number.parseFloat(e.target.value) || 0)}
                className="pl-8 text-xl font-semibold h-14 border-slate-200 dark:border-slate-700 focus:border-teal-500 dark:focus:border-teal-500"
                step="0.01"
                min="0"
              />
            </div>
          </div>

          {/* Tax Section */}
          <div className="space-y-4">
            <label className="text-lg font-semibold text-slate-900 dark:text-white">{t("tax")}</label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t("taxPercentage")}</label>
                <div className="relative">
                  <Input
                    type="number"
                    value={taxPercentage}
                    onChange={(e) => setTaxPercentage(Number.parseFloat(e.target.value) || 0)}
                    className="pr-8 border-slate-200 dark:border-slate-700 focus:border-teal-500 dark:focus:border-teal-500"
                    step="0.1"
                    min="0"
                    max="50"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500">%</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t("taxAmount")}</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500">
                    {formatCurrency(0, currentCurrency).charAt(0)}
                  </span>
                  <Input
                    type="number"
                    placeholder={calculatedTax.toFixed(2)}
                    value={taxAmount || ""}
                    onChange={(e) => setTaxAmount(Number.parseFloat(e.target.value) || 0)}
                    className="pl-8 border-slate-200 dark:border-slate-700 focus:border-teal-500 dark:focus:border-teal-500"
                    step="0.01"
                    min="0"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Service Quality */}
          <div className="space-y-3">
            <label className="text-lg font-semibold text-slate-900 dark:text-white">{t("serviceQuality")}</label>
            <div className="grid grid-cols-3 gap-3">
              {serviceOptions.map((option) => (
                <Button
                  key={option.key}
                  variant={serviceQuality === option.key && tipMode === "percentage" ? "default" : "outline"}
                  onClick={() => handleServiceQualityChange(option.key as any)}
                  className={`h-16 flex flex-col ${
                    serviceQuality === option.key && tipMode === "percentage"
                      ? "bg-gradient-to-r from-teal-600 to-teal-400 hover:from-teal-700 hover:to-teal-500 text-white"
                      : "border-slate-200 dark:border-slate-700 hover:border-teal-500 dark:hover:border-teal-500"
                  }`}
                >
                  <span className="font-semibold">{option.label}</span>
                  <span className="text-sm opacity-70">{option.percentage}%</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Custom Tip Option */}
          <div className="space-y-3">
            <label className="text-lg font-semibold text-slate-900 dark:text-white">{t("customTip")}</label>
            <div className="flex items-center gap-4">
              <Button
                variant={tipMode === "custom" ? "default" : "outline"}
                onClick={() => setTipMode("custom")}
                className={`flex-1 h-12 ${
                  tipMode === "custom"
                    ? "bg-slate-700 hover:bg-slate-800"
                    : "border-slate-200 dark:border-slate-700 hover:border-slate-500 dark:hover:border-slate-400"
                }`}
              >
                {t("customAmount")}
              </Button>
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500">
                  {formatCurrency(0, currentCurrency).charAt(0)}
                </span>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={customTipAmount || ""}
                  onChange={(e) => {
                    setCustomTipAmount(Number.parseFloat(e.target.value) || 0)
                    setTipMode("custom")
                  }}
                  className="pl-8 h-12 border-slate-200 dark:border-slate-700 focus:border-slate-500 dark:focus:border-slate-400"
                  step="0.01"
                  min="0"
                />
              </div>
            </div>
          </div>

          {/* Split Between */}
          <div className="space-y-3">
            <label className="text-lg font-semibold text-slate-900 dark:text-white">{t("splitBetween")}</label>
            <div className="flex items-center justify-center gap-6 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
              <Button
                variant="outline"
                size="icon"
                onClick={() => adjustPeople(-1)}
                disabled={peopleCount <= 1}
                className="h-12 w-12 rounded-full border-slate-200 dark:border-slate-700 hover:border-teal-500 dark:hover:border-teal-500"
              >
                <Minus className="w-5 h-5" />
              </Button>
              <span className="text-3xl font-bold min-w-[60px] text-center text-teal-500">{peopleCount}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => adjustPeople(1)}
                disabled={peopleCount >= 100}
                className="h-12 w-12 rounded-full border-slate-200 dark:border-slate-700 hover:border-teal-500 dark:hover:border-teal-500"
              >
                <Plus className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Summary with Teal Colors */}
          <div className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-xl p-6 space-y-3 border border-slate-200 dark:border-slate-700">
            <div className="flex justify-between text-lg">
              <span className="text-slate-700 dark:text-slate-300">{t("subtotal")}:</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {formatCurrency(billAmount, currentCurrency)}
              </span>
            </div>
            <div className="flex justify-between text-lg">
              <span className="text-slate-700 dark:text-slate-300">{t("tax")}:</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {formatCurrency(finalTaxAmount, currentCurrency)}
              </span>
            </div>
            <div className="flex justify-between text-lg">
              <span className="text-slate-700 dark:text-slate-300">{t("tipAmountLabel")}:</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {formatCurrency(tipAmount, currentCurrency)}
              </span>
            </div>
            <div className="border-t border-slate-300 dark:border-slate-600 pt-3 flex justify-between text-xl font-bold">
              <span className="text-slate-900 dark:text-white">{t("total")}:</span>
              <span className="text-teal-500">{formatCurrency(totalBill, currentCurrency)}</span>
            </div>
            <div className="border-t border-slate-300 dark:border-slate-600 pt-3 flex justify-between text-xl font-bold">
              <span className="text-slate-900 dark:text-white">{t("perPerson")}:</span>
              <span className="text-slate-700 dark:text-slate-300">{formatCurrency(perPerson, currentCurrency)}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <Button
              onClick={roundUpBill}
              variant="outline"
              className="h-12 border-slate-200 dark:border-slate-700 hover:border-teal-500 dark:hover:border-teal-500"
              disabled={billAmount <= 0}
            >
              {t("roundUpTotal")}
            </Button>
            <Button
              onClick={resetCalculator}
              variant="outline"
              className="h-12 border-slate-200 dark:border-slate-700 hover:border-slate-500 dark:hover:border-slate-400"
            >
              {t("resetCalculator")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
