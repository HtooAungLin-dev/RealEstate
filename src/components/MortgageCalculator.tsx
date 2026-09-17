import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  Landmark, 
  Percent, 
  ShieldCheck, 
  Info, 
  TrendingUp, 
  CheckCircle2, 
  ArrowRight, 
  Building2, 
  Coins, 
  FileText, 
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { Property, SupportedLanguage } from '../types/property';
import { 
  SINGAPORE_BANK_PACKAGES, 
  BankRatePackage, 
  calculateMonthlyPayment, 
  calculateSingaporeBSD 
} from '../data/bankRates';
import { translations } from '../i18n/translations';

interface MortgageCalculatorProps {
  property: Property;
  currentLang: SupportedLanguage;
  onContactAgentForLoan?: (bankPackage: BankRatePackage, monthlyRepayment: number) => void;
}

export const MortgageCalculator: React.FC<MortgageCalculatorProps> = ({
  property,
  currentLang,
  onContactAgentForLoan,
}) => {
  const t = translations[currentLang];
  const isHdb = property.category === 'hdb';

  // State
  const [purchasePrice, setPurchasePrice] = useState<number>(property.price);
  const [selectedPackageId, setSelectedPackageId] = useState<string>(
    isHdb ? 'hdb-concessionary' : 'dbs-fixed-2yr'
  );
  const [isCustomRate, setIsCustomRate] = useState<boolean>(false);
  const [customInterestRate, setCustomInterestRate] = useState<number>(2.8);
  const [downpaymentPercent, setDownpaymentPercent] = useState<number>(isHdb ? 20 : 25);
  const [loanTenureYears, setLoanTenureYears] = useState<number>(isHdb ? 25 : 30);
  const [activeTab, setActiveTab] = useState<'calculator' | 'bankComparison' | 'upfront'>('calculator');
  const [ipaSuccessMessage, setIpaSuccessMessage] = useState<string | null>(null);

  // Selected Bank Package
  const selectedPackage = useMemo(() => {
    return (
      SINGAPORE_BANK_PACKAGES.find((p) => p.id === selectedPackageId) ||
      SINGAPORE_BANK_PACKAGES[0]
    );
  }, [selectedPackageId]);

  // Active Interest Rate
  const effectiveInterestRate = isCustomRate ? customInterestRate : selectedPackage.interestRate;

  // Calculation Math
  const downpaymentAmount = Math.round(purchasePrice * (downpaymentPercent / 100));
  const loanAmount = Math.max(0, purchasePrice - downpaymentAmount);
  
  const monthlyRepayment = useMemo(() => {
    return calculateMonthlyPayment(loanAmount, effectiveInterestRate, loanTenureYears);
  }, [loanAmount, effectiveInterestRate, loanTenureYears]);

  // First month split
  const monthlyRateDecimal = effectiveInterestRate / 100 / 12;
  const firstMonthInterest = Math.round(loanAmount * monthlyRateDecimal);
  const firstMonthPrincipal = Math.max(0, monthlyRepayment - firstMonthInterest);

  const totalRepayment = monthlyRepayment * loanTenureYears * 12;
  const totalInterestPayable = Math.max(0, totalRepayment - loanAmount);

  // Upfront Capital & Singapore IRAS BSD
  const isConcessionary = selectedPackage.rateType === 'concessionary';
  const minCashPercent = isConcessionary ? 0 : 5;
  const minCashAmount = Math.round(purchasePrice * (minCashPercent / 100));
  const cpfOrCashAmount = Math.max(0, downpaymentAmount - minCashAmount);
  const buyersStampDuty = useMemo(() => calculateSingaporeBSD(purchasePrice), [purchasePrice]);
  const estimatedLegalFees = isConcessionary ? 1200 : 2500;
  const totalUpfrontCapital = downpaymentAmount + buyersStampDuty + estimatedLegalFees;

  // MAS TDSR Affordability Assessment (Stress test at 4.0% p.a., 55% cap)
  const stressTestMonthlyPayment = useMemo(() => {
    return calculateMonthlyPayment(loanAmount, 4.0, loanTenureYears);
  }, [loanAmount, loanTenureYears]);
  const minRequiredHouseholdIncome = Math.round(stressTestMonthlyPayment / 0.55);

  const handleSelectPackage = (pkg: BankRatePackage) => {
    setSelectedPackageId(pkg.id);
    setIsCustomRate(false);
    if (pkg.rateType === 'concessionary' && downpaymentPercent > 20) {
      setDownpaymentPercent(20);
    }
  };

  const handleApplyIPA = () => {
    if (onContactAgentForLoan) {
      onContactAgentForLoan(selectedPackage, monthlyRepayment);
    }
    setIpaSuccessMessage(
      `In-Principle Approval (IPA) request submitted for ${selectedPackage.bankName} (${effectiveInterestRate}% p.a.). A mortgage specialist will reach out shortly.`
    );
    setTimeout(() => {
      setIpaSuccessMessage(null);
    }, 6000);
  };

  return (
    <div className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden">
      {/* Header Section */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-[#E00000] text-white flex items-center justify-center shrink-0 shadow-md">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-sm sm:text-base font-black text-white">
                {t.mortgage?.calculatorTitle || 'Singapore Mortgage Calculator'}
              </h3>
              <span className="text-[10px] font-bold bg-white/20 text-white px-2 py-0.5 rounded-full backdrop-blur-xs">
                MAS 75% LTV
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              {t.mortgage?.calculatorSubtitle || 'Estimate repayments with live bank packages & MAS TDSR rules'}
            </p>
          </div>
        </div>

        {/* View Mode Navigation Tabs */}
        <div className="flex items-center bg-slate-800/90 p-1 rounded-xl border border-slate-700 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('calculator')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'calculator'
                ? 'bg-[#E00000] text-white shadow-xs'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            {t.mortgage?.monthlyRepayment ? 'Calculator' : 'Calculator'}
          </button>
          <button
            onClick={() => setActiveTab('bankComparison')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center space-x-1 ${
              activeTab === 'bankComparison'
                ? 'bg-[#E00000] text-white shadow-xs'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Landmark className="w-3.5 h-3.5 mr-1" />
            <span>Bank Rates ({SINGAPORE_BANK_PACKAGES.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('upfront')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'upfront'
                ? 'bg-[#E00000] text-white shadow-xs'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <span>Upfront & BSD</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-4 sm:p-5 space-y-5">
        {/* Success Alert */}
        {ipaSuccessMessage && (
          <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-4 py-3 rounded-xl text-xs flex items-center space-x-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">{ipaSuccessMessage}</span>
          </div>
        )}

        {/* TAB 1: CORE CALCULATOR & SLIDERS */}
        {activeTab === 'calculator' && (
          <div className="space-y-5">
            {/* Quick Bank Packages Selector Slider */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700 flex items-center">
                  <Landmark className="w-3.5 h-3.5 mr-1 text-[#E00000]" />
                  {t.mortgage?.selectBankRate || 'Current Singapore Bank Packages'}
                </span>
                <button
                  onClick={() => setIsCustomRate(!isCustomRate)}
                  className="text-xs font-semibold text-[#E00000] hover:underline cursor-pointer"
                >
                  {isCustomRate ? 'Use Bank Packages' : 'Enter Custom Rate'}
                </button>
              </div>

              {!isCustomRate ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {SINGAPORE_BANK_PACKAGES.slice(0, 4).map((pkg) => {
                    const isSelected = selectedPackageId === pkg.id && !isCustomRate;
                    return (
                      <button
                        key={pkg.id}
                        onClick={() => handleSelectPackage(pkg)}
                        className={`text-left p-2.5 rounded-xl border transition-all cursor-pointer relative ${
                          isSelected
                            ? 'bg-red-50/80 border-red-500 shadow-xs ring-1 ring-red-500'
                            : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                        }`}
                      >
                        {pkg.popular && (
                          <span className="absolute top-1 right-1 bg-amber-500 text-white text-[9px] font-black px-1.5 py-0.2 rounded">
                            Popular
                          </span>
                        )}
                        <div className="flex items-center space-x-1.5 mb-1">
                          <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${pkg.badgeColor}`}>
                            {pkg.shortName}
                          </span>
                          <span className="text-[11px] font-bold text-slate-800 truncate">
                            {pkg.rateType === 'fixed' ? 'Fixed' : pkg.rateType === 'concessionary' ? 'HDB' : 'SORA'}
                          </span>
                        </div>
                        <div className="text-base font-black text-[#E00000]">
                          {pkg.interestRate}% <span className="text-[10px] font-medium text-slate-500">p.a.</span>
                        </div>
                        <p className="text-[10px] text-slate-400 truncate mt-0.5">
                          {pkg.lockInYears > 0 ? `${pkg.lockInYears}-Yr Lock-in` : 'No Lock-in'}
                        </p>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-white p-3 rounded-xl border border-red-300 flex items-center justify-between gap-3">
                  <div className="flex items-center space-x-2">
                    <Percent className="w-4 h-4 text-[#E00000]" />
                    <span className="text-xs font-bold text-slate-800">
                      {t.mortgage?.customRate || 'Custom Annual Interest Rate'}:
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="range"
                      min="1.5"
                      max="6.0"
                      step="0.05"
                      value={customInterestRate}
                      onChange={(e) => setCustomInterestRate(parseFloat(e.target.value))}
                      className="w-28 sm:w-44 accent-[#E00000] cursor-pointer"
                    />
                    <span className="text-sm font-black text-[#E00000] min-w-[50px]">
                      {customInterestRate.toFixed(2)}%
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Repayment Hero Banner */}
            <div className="bg-gradient-to-br from-white to-red-50/40 p-4 sm:p-5 rounded-2xl border-2 border-red-200/80 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-slate-200/80">
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    {t.mortgage?.monthlyRepayment || 'Estimated Monthly Repayment'}
                  </span>
                  <div className="flex items-baseline space-x-2 mt-0.5">
                    <span className="text-2xl sm:text-3xl font-black text-[#E00000]">
                      S$ {monthlyRepayment.toLocaleString()}
                    </span>
                    <span className="text-xs font-bold text-slate-500">/ month</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 flex items-center">
                    <span className="font-semibold text-slate-800">
                      {isCustomRate ? 'Custom Rate' : selectedPackage.bankName}
                    </span>
                    <span className="mx-1.5">•</span>
                    <span>{effectiveInterestRate}% p.a.</span>
                    <span className="mx-1.5">•</span>
                    <span>{loanTenureYears} Years Tenure</span>
                  </p>
                </div>

                {/* Apply / Inquire CTA */}
                <div className="flex flex-col sm:items-end">
                  <button
                    id="mortgage-apply-ipa-btn"
                    onClick={handleApplyIPA}
                    className="bg-[#E00000] hover:bg-[#C00000] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition-all cursor-pointer flex items-center space-x-1.5 active:scale-98"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{t.mortgage?.getPreApproval || 'Get Pre-Approval (IPA)'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[10px] text-slate-400 mt-1">
                    Free instant banker consultation
                  </span>
                </div>
              </div>

              {/* Principal vs Interest Visual Bar */}
              <div className="pt-3.5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700 flex items-center">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-800 mr-1.5 inline-block"></span>
                    Principal: <strong className="ml-1">S$ {firstMonthPrincipal.toLocaleString()}</strong>
                  </span>
                  <span className="font-semibold text-slate-700 flex items-center">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#E00000] mr-1.5 inline-block"></span>
                    Interest: <strong className="ml-1 text-[#E00000]">S$ {firstMonthInterest.toLocaleString()}</strong>
                  </span>
                </div>

                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden flex">
                  <div
                    className="bg-slate-800 h-full transition-all duration-300"
                    style={{
                      width: `${monthlyRepayment > 0 ? (firstMonthPrincipal / monthlyRepayment) * 100 : 50}%`,
                    }}
                    title="Principal"
                  />
                  <div
                    className="bg-[#E00000] h-full transition-all duration-300"
                    style={{
                      width: `${monthlyRepayment > 0 ? (firstMonthInterest / monthlyRepayment) * 100 : 50}%`,
                    }}
                    title="Interest"
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span>Loan Amount: <strong>S$ {loanAmount.toLocaleString()}</strong></span>
                  <span>Total Interest (over {loanTenureYears} yrs): <strong>S$ {totalInterestPayable.toLocaleString()}</strong></span>
                </div>
              </div>
            </div>

            {/* Interactive Form Controls: Price, Downpayment, Tenure */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
              {/* Purchase Price Input */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    {t.mortgage?.propertyPrice || 'Purchase Price'}
                  </label>
                  <span className="text-[11px] font-semibold text-slate-400">SGD</span>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                    S$
                  </span>
                  <input
                    type="number"
                    step="10000"
                    value={purchasePrice}
                    onChange={(e) => setPurchasePrice(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-8 pr-3 py-1.5 text-sm font-bold text-slate-800 focus:bg-white focus:border-red-500 focus:outline-hidden"
                  />
                </div>
                <div className="flex justify-between items-center mt-2 text-[10px] text-slate-500">
                  <span>Listing price</span>
                  <button
                    onClick={() => setPurchasePrice(property.price)}
                    className="text-[#E00000] hover:underline cursor-pointer font-semibold"
                  >
                    Reset to S$ {property.price.toLocaleString()}
                  </button>
                </div>
              </div>

              {/* Downpayment Selector */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    {t.mortgage?.downpayment || 'Downpayment'} ({downpaymentPercent}%)
                  </label>
                  <span className="text-xs font-bold text-[#E00000]">
                    S$ {downpaymentAmount.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min={isHdb && selectedPackage.rateType === 'concessionary' ? 20 : 25}
                  max="60"
                  step="5"
                  value={downpaymentPercent}
                  onChange={(e) => setDownpaymentPercent(parseInt(e.target.value))}
                  className="w-full accent-[#E00000] cursor-pointer"
                />
                <div className="flex items-center space-x-1 mt-2">
                  {[20, 25, 30, 40].map((pct) => (
                    <button
                      key={pct}
                      disabled={pct === 20 && !isHdb}
                      onClick={() => setDownpaymentPercent(pct)}
                      className={`flex-1 py-1 rounded text-[10px] font-bold transition-colors cursor-pointer ${
                        downpaymentPercent === pct
                          ? 'bg-[#E00000] text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed'
                      }`}
                    >
                      {pct}%{pct === 20 ? ' (HDB)' : pct === 25 ? ' (Min)' : ''}
                    </button>
                  ))}
                </div>
              </div>

              {/* Loan Tenure Selector */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    {t.mortgage?.loanTenure || 'Loan Tenure'} ({loanTenureYears} Yrs)
                  </label>
                  <span className="text-xs font-semibold text-slate-500">
                    {loanTenureYears * 12} months
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max={isHdb ? 25 : 30}
                  step="5"
                  value={loanTenureYears}
                  onChange={(e) => setLoanTenureYears(parseInt(e.target.value))}
                  className="w-full accent-[#E00000] cursor-pointer"
                />
                <div className="flex items-center space-x-1 mt-2">
                  {[15, 20, 25, 30].map((yr) => (
                    <button
                      key={yr}
                      disabled={yr === 30 && isHdb && selectedPackage.rateType === 'concessionary'}
                      onClick={() => setLoanTenureYears(yr)}
                      className={`flex-1 py-1 rounded text-[10px] font-bold transition-colors cursor-pointer ${
                        loanTenureYears === yr
                          ? 'bg-[#E00000] text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed'
                      }`}
                    >
                      {yr}Y
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* MAS TDSR Affordability Box */}
            <div className="p-3.5 bg-sky-50/70 rounded-xl border border-sky-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4 text-sky-700" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-sky-950">
                    {t.mortgage?.affordabilityCheck || 'MAS TDSR Prudence Benchmark'}
                  </h4>
                  <p className="text-[11px] text-sky-800">
                    {t.mortgage?.tdsrNotice || 'Based on MAS 55% Total Debt Servicing Ratio limit & 4.0% stress rate.'}
                  </p>
                </div>
              </div>
              <div className="sm:text-right shrink-0 bg-white px-3 py-1.5 rounded-lg border border-sky-200">
                <span className="text-[10px] text-slate-500 block">
                  {t.mortgage?.minMonthlyIncome || 'Min. Gross Household Income'}:
                </span>
                <span className="text-xs sm:text-sm font-extrabold text-sky-900">
                  S$ {minRequiredHouseholdIncome.toLocaleString()} /mo
                </span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: BANK RATES COMPARISON MATRIX */}
        {activeTab === 'bankComparison' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                  {t.mortgage?.bankPackages || 'Singapore Bank Mortgage Packages'}
                </h4>
                <p className="text-xs text-slate-500">
                  Compare current interest rates, lock-in periods, and perks for S$ {purchasePrice.toLocaleString()} property
                </p>
              </div>
              <span className="text-xs font-bold text-[#E00000] bg-red-50 px-2.5 py-1 rounded-full border border-red-200">
                Live Rates (2025/2026)
              </span>
            </div>

            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {SINGAPORE_BANK_PACKAGES.map((pkg) => {
                const pkgMonthly = calculateMonthlyPayment(loanAmount, pkg.interestRate, loanTenureYears);
                const isSelected = selectedPackageId === pkg.id && !isCustomRate;

                return (
                  <div
                    key={pkg.id}
                    className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-red-50/90 border-red-500 ring-1 ring-red-500 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs font-black px-2 py-0.5 rounded ${pkg.badgeColor}`}>
                          {pkg.bankName}
                        </span>
                        <span className="text-xs font-bold text-slate-900">
                          {pkg.packageName}
                        </span>
                        {pkg.popular && (
                          <span className="text-[10px] font-black bg-amber-500 text-white px-1.5 py-0.2 rounded">
                            Popular
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600">
                        {pkg.benchmark}
                      </p>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500">
                        <span>Lock-in: <strong>{pkg.lockInYears > 0 ? `${pkg.lockInYears} Years` : 'None'}</strong></span>
                        <span>•</span>
                        <span>Max LTV: <strong>{pkg.maxLTV}%</strong></span>
                        <span>•</span>
                        <span className="text-emerald-700 font-semibold">{pkg.legalSubsidy}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end space-x-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                      <div className="text-right">
                        <div className="text-base font-black text-[#E00000]">
                          {pkg.interestRate}% <span className="text-xs text-slate-500 font-normal">p.a.</span>
                        </div>
                        <div className="text-xs font-bold text-slate-800">
                          S$ {pkgMonthly.toLocaleString()} <span className="text-[10px] font-normal text-slate-500">/mo</span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          handleSelectPackage(pkg);
                          setActiveTab('calculator');
                        }}
                        className={`text-xs font-bold px-3.5 py-2 rounded-lg transition-colors cursor-pointer flex items-center space-x-1 ${
                          isSelected
                            ? 'bg-[#E00000] text-white'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                        }`}
                      >
                        <span>{isSelected ? 'Active' : 'Select'}</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: UPFRONT CAPITAL & SINGAPORE IRAS BSD */}
        {activeTab === 'upfront' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                  {t.mortgage?.upfrontCosts || 'Upfront Capital & Statutory Fees'}
                </h4>
                <p className="text-xs text-slate-500">
                  Detailed breakdown of cash, CPF Ordinary Account, and IRAS stamp duties
                </p>
              </div>
              <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
                Purchase: S$ {purchasePrice.toLocaleString()}
              </span>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 text-xs">
              {/* Cash Downpayment */}
              <div className="p-3.5 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800 block">
                    {t.mortgage?.cashDownpayment || 'Minimum Cash Downpayment (5%)'}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Mandatory minimum cash component under MAS regulations
                  </span>
                </div>
                <span className="text-sm font-extrabold text-slate-900">
                  S$ {minCashAmount.toLocaleString()}
                </span>
              </div>

              {/* CPF OA or Cash */}
              <div className="p-3.5 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800 block">
                    {t.mortgage?.cpfDownpayment || 'CPF Ordinary Account (OA) / Cash'}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Can be funded entirely from CPF OA savings or cash savings
                  </span>
                </div>
                <span className="text-sm font-extrabold text-slate-900">
                  S$ {cpfOrCashAmount.toLocaleString()}
                </span>
              </div>

              {/* Buyer's Stamp Duty (BSD) */}
              <div className="p-3.5 flex items-center justify-between bg-red-50/30">
                <div>
                  <span className="font-bold text-[#E00000] block flex items-center">
                    <FileText className="w-3.5 h-3.5 mr-1" />
                    {t.mortgage?.buyersStampDuty || "Buyer's Stamp Duty (IRAS BSD)"}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Statutory progressive duty payable within 14 days of Option exercise (payable via CPF)
                  </span>
                </div>
                <span className="text-sm font-black text-[#E00000]">
                  S$ {buyersStampDuty.toLocaleString()}
                </span>
              </div>

              {/* Legal & Conveyancing */}
              <div className="p-3.5 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800 block">
                    {t.mortgage?.estLegalFees || 'Estimated Legal & Conveyancing Fees'}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Law firm conveyancing & mortgage registration (some banks offer subsidies)
                  </span>
                </div>
                <span className="text-sm font-extrabold text-slate-900">
                  S$ {estimatedLegalFees.toLocaleString()}
                </span>
              </div>

              {/* Total Estimated Upfront */}
              <div className="p-4 bg-slate-900 text-white rounded-b-xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                    {t.mortgage?.totalUpfront || 'Estimated Total Upfront Capital Required'}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Downpayment + IRAS BSD + Legal Fees
                  </span>
                </div>
                <span className="text-xl font-black text-amber-400">
                  S$ {totalUpfrontCapital.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
