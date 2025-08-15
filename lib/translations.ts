export type Language = "en" | "es" | "fr"

export const translations = {
  en: {
    // Existing translations...
    smartCalculator: "Smart Calculator",
    smartTipCalculatorTitle: "Smart Tip Calculator",
    calculateTipsDesc: "Calculate tips with precision and split bills easily",
    billAmount: "Bill Amount",
    tax: "Tax",
    taxPercentage: "Tax Percentage",
    taxAmount: "Tax Amount",
    serviceQuality: "Service Quality",
    poor: "Poor",
    good: "Good",
    excellent: "Excellent",
    customTip: "Custom Tip",
    customAmount: "Custom Amount",
    splitBetween: "Split Between",
    subtotal: "Subtotal",
    tipAmountLabel: "Tip Amount",
    total: "Total",
    perPerson: "Per Person",
    roundUpTotal: "Round Up Total",
    resetCalculator: "Reset Calculator",
  },
  es: {
    // Spanish translations...
    smartCalculator: "Calculadora Inteligente",
    smartTipCalculatorTitle: "Calculadora de Propinas Inteligente",
    calculateTipsDesc: "Calcula propinas con precisión y divide cuentas fácilmente",
    billAmount: "Monto de la Cuenta",
    tax: "Impuesto",
    taxPercentage: "Porcentaje de Impuesto",
    taxAmount: "Monto del Impuesto",
    serviceQuality: "Calidad del Servicio",
    poor: "Malo",
    good: "Bueno",
    excellent: "Excelente",
    customTip: "Propina Personalizada",
    customAmount: "Monto Personalizado",
    splitBetween: "Dividir Entre",
    subtotal: "Subtotal",
    tipAmountLabel: "Monto de Propina",
    total: "Total",
    perPerson: "Por Persona",
    roundUpTotal: "Redondear Total",
    resetCalculator: "Reiniciar Calculadora",
  },
  fr: {
    // French translations...
    smartCalculator: "Calculatrice Intelligente",
    smartTipCalculatorTitle: "Calculatrice de Pourboire Intelligente",
    calculateTipsDesc: "Calculez les pourboires avec précision et divisez les factures facilement",
    billAmount: "Montant de la Facture",
    tax: "Taxe",
    taxPercentage: "Pourcentage de Taxe",
    taxAmount: "Montant de la Taxe",
    serviceQuality: "Qualité du Service",
    poor: "Mauvais",
    good: "Bon",
    excellent: "Excellent",
    customTip: "Pourboire Personnalisé",
    customAmount: "Montant Personnalisé",
    splitBetween: "Diviser Entre",
    subtotal: "Sous-total",
    tipAmountLabel: "Montant du Pourboire",
    total: "Total",
    perPerson: "Par Personne",
    roundUpTotal: "Arrondir le Total",
    resetCalculator: "Réinitialiser la Calculatrice",
  },
}

export const getTranslation = (
  language: Language,
  key: keyof typeof translations.en,
  params?: Record<string, string>,
): string => {
  let translation = translations[language][key] || translations.en[key] || key

  if (params) {
    Object.entries(params).forEach(([param, value]) => {
      translation = translation.replace(`{${param}}`, value)
    })
  }

  return translation
}
