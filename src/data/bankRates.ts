export interface BankRatePackage {
  id: string;
  bankName: string;
  shortName: string;
  badgeColor: string;
  bgLight: string;
  borderLight: string;
  packageName: string;
  rateType: 'fixed' | 'floating' | 'concessionary';
  interestRate: number; // % p.a.
  benchmark: string;
  lockInYears: number;
  minLoanAmount: number;
  maxLTV: number; // e.g. 75 or 80
  legalSubsidy: string;
  features: string[];
  popular?: boolean;
}

export const SINGAPORE_BANK_PACKAGES: BankRatePackage[] = [
  {
    id: 'dbs-fixed-2yr',
    bankName: 'DBS / POSB',
    shortName: 'DBS',
    badgeColor: 'bg-red-600 text-white',
    bgLight: 'bg-red-50/70',
    borderLight: 'border-red-200',
    packageName: 'DBS 2-Year Fixed Rate Home Loan',
    rateType: 'fixed',
    interestRate: 2.75,
    benchmark: 'Fixed 2 Years, thereafter 3M SORA + 1.00%',
    lockInYears: 2,
    minLoanAmount: 100000,
    maxLTV: 75,
    legalSubsidy: 'Cash rebate up to S$2,500',
    features: ['No prepayment penalty during lock-in for sale of property', 'Waiver of conversion fee after 2 years', 'Free fire insurance 1st year'],
    popular: true,
  },
  {
    id: 'hsbc-smart-fixed',
    bankName: 'HSBC Singapore',
    shortName: 'HSBC',
    badgeColor: 'bg-red-700 text-white',
    bgLight: 'bg-red-50/50',
    borderLight: 'border-red-200',
    packageName: 'HSBC Smart Mortgage 2-Yr Fixed',
    rateType: 'fixed',
    interestRate: 2.70,
    benchmark: 'Fixed 2 Years, thereafter 3M SORA + 0.90%',
    lockInYears: 2,
    minLoanAmount: 200000,
    maxLTV: 75,
    legalSubsidy: 'Legal subsidy up to S$2,500',
    features: ['Lowest market fixed rate', 'Interest offset deposit linkage', 'Complimentary premier banking tier'],
    popular: true,
  },
  {
    id: 'ocbc-fixed-2yr',
    bankName: 'OCBC Bank',
    shortName: 'OCBC',
    badgeColor: 'bg-red-600 text-white',
    bgLight: 'bg-rose-50/60',
    borderLight: 'border-rose-200',
    packageName: 'OCBC Eco-Care 2-Year Fixed',
    rateType: 'fixed',
    interestRate: 2.80,
    benchmark: 'Fixed 2 Years, thereafter 1M SORA + 0.95%',
    lockInYears: 2,
    minLoanAmount: 100000,
    maxLTV: 75,
    legalSubsidy: 'Green loan perk: S$88 bill rebate',
    features: ['Eco-Care extra interest discounts for BCA Green Mark homes', '1 free loan re-pricing after lock-in', 'Digital instant IPA in 60 mins'],
  },
  {
    id: 'uob-fixed-2yr',
    bankName: 'UOB Bank',
    shortName: 'UOB',
    badgeColor: 'bg-blue-900 text-white',
    bgLight: 'bg-blue-50/60',
    borderLight: 'border-blue-200',
    packageName: 'UOB 2-Year Fixed Home Loan',
    rateType: 'fixed',
    interestRate: 2.85,
    benchmark: 'Fixed 2 Years, thereafter 3M SORA + 1.05%',
    lockInYears: 2,
    minLoanAmount: 150000,
    maxLTV: 75,
    legalSubsidy: 'Subsidies for legal & valuation fees',
    features: ['High valuation support across all districts', 'Up to 30 years loan tenure', 'Convenient CPF OA deduction support'],
  },
  {
    id: 'dbs-floating-sora',
    bankName: 'DBS Bank',
    shortName: 'DBS SORA',
    badgeColor: 'bg-slate-800 text-white',
    bgLight: 'bg-slate-50',
    borderLight: 'border-slate-200',
    packageName: 'DBS 3M SORA Floating Package',
    rateType: 'floating',
    interestRate: 3.15,
    benchmark: '3M Compounded SORA (2.50%) + 0.65% spread',
    lockInYears: 2,
    minLoanAmount: 100000,
    maxLTV: 75,
    legalSubsidy: 'Cash rebate for refinancing or new purchase',
    features: ['Pegged transparently to MAS daily SORA benchmark', 'No floor rate clause', 'Option to switch to fixed package without fee'],
  },
  {
    id: 'scb-mortgageone',
    bankName: 'Standard Chartered',
    shortName: 'StanChart',
    badgeColor: 'bg-sky-700 text-white',
    bgLight: 'bg-sky-50/50',
    borderLight: 'border-sky-200',
    packageName: 'StanChart MortgageOne Fixed',
    rateType: 'fixed',
    interestRate: 2.90,
    benchmark: 'Fixed 2 Years with 50% deposit interest offset',
    lockInYears: 2,
    minLoanAmount: 250000,
    maxLTV: 75,
    legalSubsidy: 'Up to S$2,000 legal subsidy',
    features: ['MortgageOne account offsets loan interest dollar-for-dollar with your savings', 'Flexible daily interest calculation', 'Shortens overall loan tenure faster'],
  },
  {
    id: 'hdb-concessionary',
    bankName: 'HDB Housing Board',
    shortName: 'HDB Loan',
    badgeColor: 'bg-emerald-700 text-white',
    bgLight: 'bg-emerald-50/60',
    borderLight: 'border-emerald-200',
    packageName: 'HDB Concessionary Housing Loan',
    rateType: 'concessionary',
    interestRate: 2.60,
    benchmark: 'CPF Ordinary Account (2.50%) + 0.10% spread',
    lockInYears: 0,
    minLoanAmount: 10000,
    maxLTV: 80,
    legalSubsidy: 'Subsidized HDB legal and conveyancing rates',
    features: ['No lock-in period (pay off early anytime with 0 penalty)', 'Higher 80% LTV ratio (lower 20% downpayment)', 'Exclusive to Singapore Citizens buying HDB'],
  },
];

/**
 * Calculates monthly mortgage repayment using standard amortization formula.
 */
export function calculateMonthlyPayment(
  principal: number,
  annualInterestRatePercent: number,
  tenureYears: number
): number {
  if (principal <= 0 || tenureYears <= 0) return 0;
  if (annualInterestRatePercent <= 0) {
    return Math.round(principal / (tenureYears * 12));
  }

  const monthlyRate = annualInterestRatePercent / 100 / 12;
  const numberOfPayments = tenureYears * 12;
  const factor = Math.pow(1 + monthlyRate, numberOfPayments);

  return Math.round((principal * monthlyRate * factor) / (factor - 1));
}

/**
 * Calculates progressive IRAS Singapore Buyer's Stamp Duty (BSD) for residential properties.
 */
export function calculateSingaporeBSD(price: number): number {
  if (price <= 0) return 0;

  let bsd = 0;

  // 1st tier: First $180,000 @ 1%
  const tier1 = Math.min(price, 180000);
  bsd += tier1 * 0.01;

  // 2nd tier: Next $180,000 ($180k to $360k) @ 2%
  if (price > 180000) {
    const tier2 = Math.min(price - 180000, 180000);
    bsd += tier2 * 0.02;
  }

  // 3rd tier: Next $640,000 ($360k to $1,000,000) @ 3%
  if (price > 360000) {
    const tier3 = Math.min(price - 360000, 640000);
    bsd += tier3 * 0.03;
  }

  // 4th tier: Next $500,000 ($1,000,000 to $1,500,000) @ 4%
  if (price > 1000000) {
    const tier4 = Math.min(price - 1000000, 500000);
    bsd += tier4 * 0.04;
  }

  // 5th tier: Next $1,500,000 ($1,500,000 to $3,000,000) @ 5%
  if (price > 1500000) {
    const tier5 = Math.min(price - 1500000, 1500000);
    bsd += tier5 * 0.05;
  }

  // 6th tier: Amount exceeding $3,000,000 @ 6%
  if (price > 3000000) {
    const tier6 = price - 3000000;
    bsd += tier6 * 0.06;
  }

  return Math.round(bsd);
}
