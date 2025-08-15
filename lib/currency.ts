export type Currency = "USD" | "EUR" | "GBP" | "JPY" | "AUD" | "CAD" | "CHF" | "CNY"

export const formatCurrency = (amount: number, currency: Currency): string => {
  const symbols = {
    USD: "$",
    EUR: "€",
    GBP: "£",
    JPY: "¥",
    AUD: "A$",
    CAD: "C$",
    CHF: "₣",
    CNY: "¥",
  }

  return `${symbols[currency]}${amount.toFixed(2)}`
}

export const convertCurrency = (amount: number, from: Currency, to: Currency): number => {
  // Simple conversion rates (in a real app, use live rates)
  const rates: Record<Currency, Record<Currency, number>> = {
    USD: { USD: 1, EUR: 0.85, GBP: 0.73, JPY: 110, AUD: 1.35, CAD: 1.25, CHF: 0.92, CNY: 6.45 },
    EUR: { USD: 1.18, EUR: 1, GBP: 0.86, JPY: 129, AUD: 1.59, CAD: 1.47, CHF: 1.08, CNY: 7.59 },
    GBP: { USD: 1.37, EUR: 1.16, GBP: 1, JPY: 151, AUD: 1.85, CAD: 1.71, CHF: 1.26, CNY: 8.84 },
    JPY: { USD: 0.009, EUR: 0.008, GBP: 0.007, JPY: 1, AUD: 0.012, CAD: 0.011, CHF: 0.008, CNY: 0.059 },
    AUD: { USD: 0.74, EUR: 0.63, GBP: 0.54, JPY: 81, AUD: 1, CAD: 0.93, CHF: 0.68, CNY: 4.78 },
    CAD: { USD: 0.8, EUR: 0.68, GBP: 0.58, JPY: 88, AUD: 1.08, CAD: 1, CHF: 0.74, CNY: 5.16 },
    CHF: { USD: 1.09, EUR: 0.92, GBP: 0.79, JPY: 120, AUD: 1.47, CAD: 1.36, CHF: 1, CNY: 7.03 },
    CNY: { USD: 0.15, EUR: 0.13, GBP: 0.11, JPY: 17, AUD: 0.21, CAD: 0.19, CHF: 0.14, CNY: 1 },
  }

  return amount * (rates[from]?.[to] || 1)
}
