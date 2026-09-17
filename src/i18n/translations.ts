import { SupportedLanguage } from '../types/property';

export interface TranslationDictionary {
  siteTitle: string;
  tagline: string;
  nav: {
    buy: string;
    rent: string;
    newLaunches: string;
    commercial: string;
    findAgent: string;
    newsGuides: string;
    savedAlerts: string;
    messages: string;
    login: string;
    logout: string;
    myShortlist: string;
    compare: string;
  };
  hero: {
    allResidential: string;
    buy: string;
    rent: string;
    commercial: string;
    searchPlaceholder: string;
    propertyType: string;
    allTypes: string;
    condo: string;
    hdb: string;
    landed: string;
    priceRange: string;
    anyPrice: string;
    bedrooms: string;
    anyBeds: string;
    searchBtn: string;
    moreFilters: string;
    resetFilters: string;
  };
  views: {
    splitView: string;
    listView: string;
    mapView: string;
    resultsFound: string;
    showingResults: string;
    sortBy: string;
    saveSearch: string;
  };
  results: {
    found: string;
    saveSearch: string;
    sortBy: string;
    sortRecommended: string;
    sortPriceLow: string;
    sortPriceHigh: string;
    sortPsf: string;
    sortSize: string;
    sortNewest: string;
  };
  property: {
    verified: string;
    virtualTour: string;
    contactAgent: string;
    chatNow: string;
    whatsapp: string;
    scheduleViewing: string;
    beds: string;
    baths: string;
    sqft: string;
    tenure: string;
    mrtWalk: string;
    psf: string;
    details: string;
    mortgageCalc: string;
    amenities: string;
    nearbySchools: string;
  };
  alerts: {
    savedSearches: string;
    newAlert: string;
    saveCurrentSearch: string;
    alertFrequency: string;
    instant: string;
    daily: string;
    weekly: string;
    alertTitle: string;
    saveBtn: string;
    testAlert: string;
    noSavedSearches: string;
  };
  chat: {
    directChat: string;
    agentResponseNotice: string;
    typeMessage: string;
    send: string;
    quickInquiries: string;
    inquiryAvailable: string;
    inquiryViewing: string;
    inquiryNegotiable: string;
    inquiryValuation: string;
    requestViewing: string;
    activeNow: string;
  };
  compare: {
    compareTitle: string;
    compareSubtitle: string;
    selectToCompare: string;
    addToCompare: string;
    inCompare: string;
    removeFromCompare: string;
    compareNow: string;
    clearAll: string;
    highlightDifferences: string;
    addProperty: string;
    maxReached: string;
    selectAtLeastTwo: string;
    keyPricing: string;
    spaceLayout: string;
    buildingLocation: string;
    amenitiesFacilities: string;
    agentDetails: string;
    bestValuePsf: string;
    largestArea: string;
    nearestMrt: string;
    estMortgage: string;
    monthlyMaintenance: string;
    printReport: string;
    noPropertiesSelected: string;
  };
  mortgage: {
    calculatorTitle: string;
    calculatorSubtitle: string;
    selectBankRate: string;
    customRate: string;
    propertyPrice: string;
    downpayment: string;
    loanTenure: string;
    interestRate: string;
    monthlyRepayment: string;
    principalAndInterest: string;
    principal: string;
    interest: string;
    totalInterest: string;
    totalLoanAmount: string;
    bankPackages: string;
    fixedRate: string;
    floatingRate: string;
    lockInPeriod: string;
    upfrontCosts: string;
    cashDownpayment: string;
    cpfDownpayment: string;
    buyersStampDuty: string;
    estLegalFees: string;
    totalUpfront: string;
    affordabilityCheck: string;
    minMonthlyIncome: string;
    tdsrNotice: string;
    applyPackage: string;
    getPreApproval: string;
    compareBankRates: string;
  };
}

export const translations: Record<SupportedLanguage, TranslationDictionary> = {
  en: {
    siteTitle: 'PropertyGuru Singapore',
    tagline: "Singapore's Leading Real Estate & Property Portal",
    nav: {
      buy: 'Buy',
      rent: 'Rent',
      newLaunches: 'New Launches',
      commercial: 'Commercial',
      findAgent: 'Find Agent',
      newsGuides: 'News & Guides',
      savedAlerts: 'Saved Alerts',
      messages: 'Messages',
      login: 'Sign In / Register',
      logout: 'Sign Out',
      myShortlist: 'Shortlist',
      compare: 'Compare',
    },
    hero: {
      allResidential: 'All Residential',
      buy: 'Buy',
      rent: 'Rent',
      commercial: 'Commercial',
      searchPlaceholder: 'Location, MRT station, project name, district (e.g. Orchard, D09, Marina Bay)',
      propertyType: 'Property Type',
      allTypes: 'All Property Types',
      condo: 'Condo / Apartment',
      hdb: 'HDB Flat',
      landed: 'Landed House',
      priceRange: 'Price Range',
      anyPrice: 'Any Price',
      bedrooms: 'Bedrooms',
      anyBeds: 'Any Beds',
      searchBtn: 'Search Properties',
      moreFilters: 'More Filters',
      resetFilters: 'Reset',
    },
    views: {
      splitView: 'Split View',
      listView: 'List View',
      mapView: 'Map View',
      resultsFound: 'properties found in Singapore',
      showingResults: 'Showing',
      sortBy: 'Sort By',
      saveSearch: 'Save Search Alert',
    },
    results: {
      found: 'properties found in Singapore',
      saveSearch: 'Save Search Alert',
      sortBy: 'Sort By',
      sortRecommended: 'Recommended',
      sortPriceLow: 'Price: Low to High',
      sortPriceHigh: 'Price: High to Low',
      sortPsf: 'PSF: Low to High',
      sortSize: 'Floor Area: Largest',
      sortNewest: 'Newest Listed',
    },
    property: {
      verified: 'Verified Listing',
      virtualTour: '360° Virtual Tour',
      contactAgent: 'Contact Agent',
      chatNow: 'Chat with Agent',
      whatsapp: 'WhatsApp',
      scheduleViewing: 'Schedule Viewing',
      beds: 'Beds',
      baths: 'Baths',
      sqft: 'sqft',
      tenure: 'Tenure',
      mrtWalk: 'mins to MRT',
      psf: 'psf',
      details: 'Property Details',
      mortgageCalc: 'Estimated Mortgage Calculator',
      amenities: 'Key Amenities',
      nearbySchools: 'Nearby Schools',
    },
    alerts: {
      savedSearches: 'Saved Searches & Alerts',
      newAlert: 'Create New Alert',
      saveCurrentSearch: 'Save This Search Alert',
      alertFrequency: 'Notification Frequency',
      instant: 'Instant Push Alert',
      daily: 'Daily Digest',
      weekly: 'Weekly Summary',
      alertTitle: 'Alert Name',
      saveBtn: 'Save Alert',
      testAlert: 'Simulate New Match Alert',
      noSavedSearches: 'No saved search alerts yet. Filter properties and click "Save Search Alert" to receive instant updates.',
    },
    chat: {
      directChat: 'Direct Agent Messaging',
      agentResponseNotice: 'CEA Licensed Agent • Typically replies in 5 minutes',
      typeMessage: 'Type your inquiry message here...',
      send: 'Send',
      quickInquiries: 'Quick Inquiries:',
      inquiryAvailable: 'Is this unit still available for purchase/rent?',
      inquiryViewing: 'Can I schedule an in-person viewing this weekend?',
      inquiryNegotiable: 'Is the asking price negotiable?',
      inquiryValuation: 'What is the recent bank indicative valuation?',
      requestViewing: 'Request Viewing Slot',
      activeNow: 'Active now',
    },
    compare: {
      compareTitle: 'Compare Properties',
      compareSubtitle: 'Side-by-side comparison across pricing, floor plans, MRT proximity, and amenities',
      selectToCompare: 'Select to compare',
      addToCompare: 'Add to Compare',
      inCompare: 'In Comparison',
      removeFromCompare: 'Remove from comparison',
      compareNow: 'Compare Now',
      clearAll: 'Clear All',
      highlightDifferences: 'Highlight Differences',
      addProperty: 'Add Property',
      maxReached: 'Maximum 4 properties can be compared simultaneously',
      selectAtLeastTwo: 'Select at least 2 properties to view side-by-side comparison',
      keyPricing: 'Pricing & Financials',
      spaceLayout: 'Space & Layout',
      buildingLocation: 'Location & Connectivity',
      amenitiesFacilities: 'Key Amenities & Facilities',
      agentDetails: 'CEA Estate Agent & Contact',
      bestValuePsf: 'Lowest PSF',
      largestArea: 'Largest Area',
      nearestMrt: 'Closest to MRT',
      estMortgage: 'Est. Monthly Mortgage',
      monthlyMaintenance: 'Monthly Maintenance Fee',
      printReport: 'Print Comparison Report',
      noPropertiesSelected: 'No properties selected for comparison. Click "Compare" on any listing to begin.',
    },
    mortgage: {
      calculatorTitle: 'Singapore Mortgage Calculator',
      calculatorSubtitle: 'Estimate monthly loan repayments with live Singapore bank packages & MAS TDSR rules',
      selectBankRate: 'Current Bank Packages',
      customRate: 'Custom Interest Rate',
      propertyPrice: 'Purchase Price',
      downpayment: 'Downpayment',
      loanTenure: 'Loan Tenure',
      interestRate: 'Interest Rate',
      monthlyRepayment: 'Estimated Monthly Repayment',
      principalAndInterest: 'Principal & Interest Breakdown',
      principal: 'Principal',
      interest: 'Interest',
      totalInterest: 'Total Interest Payable',
      totalLoanAmount: 'Total Loan Amount',
      bankPackages: 'Singapore Bank Mortgage Packages',
      fixedRate: 'Fixed Rate',
      floatingRate: 'Floating Rate',
      lockInPeriod: 'Lock-in Period',
      upfrontCosts: 'Upfront Capital Required',
      cashDownpayment: 'Min. Cash Downpayment (5%)',
      cpfDownpayment: 'CPF OA / Cash (20%)',
      buyersStampDuty: "Buyer's Stamp Duty (IRAS BSD)",
      estLegalFees: 'Estimated Legal & Valuation Fees',
      totalUpfront: 'Estimated Total Upfront',
      affordabilityCheck: 'MAS TDSR Affordability Benchmark',
      minMonthlyIncome: 'Min. Gross Household Income Needed',
      tdsrNotice: 'Based on MAS 55% Total Debt Servicing Ratio (TDSR) limit and 4.0% stress-test interest rate.',
      applyPackage: 'Inquire Package',
      getPreApproval: 'Get Pre-Approval (IPA)',
      compareBankRates: 'Compare All Bank Packages',
    },
  },

  zh: {
    siteTitle: 'PropertyGuru 新加坡',
    tagline: '新加坡首屈一指的房地产买卖与租赁门户',
    nav: {
      buy: '买房',
      rent: '租房',
      newLaunches: '新开盘项目',
      commercial: '商业地产',
      findAgent: '寻找中介',
      newsGuides: '房产资讯',
      savedAlerts: '保存的预警',
      messages: '即时消息',
      login: '登录 / 注册',
      logout: '退出登录',
      myShortlist: '心仪房源',
      compare: '房源对比',
    },
    hero: {
      allResidential: '全部住宅',
      buy: '买房',
      rent: '租房',
      commercial: '商业房产',
      searchPlaceholder: '输入地段、地铁站、公寓项目名或邮区（如：乌节路、滨海湾、D09）',
      propertyType: '房产类型',
      allTypes: '所有房产类型',
      condo: '公寓 / 私宅',
      hdb: '政府组屋 (HDB)',
      landed: '有地住宅 / 别墅',
      priceRange: '价格范围',
      anyPrice: '不限价格',
      bedrooms: '卧室数量',
      anyBeds: '不限卧房',
      searchBtn: '搜索房源',
      moreFilters: '更多筛选',
      resetFilters: '重置条件',
    },
    views: {
      splitView: '分屏地图',
      listView: '列表视图',
      mapView: '全屏地图',
      resultsFound: '套新加坡在售/在租房源',
      showingResults: '显示',
      sortBy: '排序方式',
      saveSearch: '保存搜索预警',
    },
    results: {
      found: '套新加坡在售/在租房源',
      saveSearch: '保存搜索预警',
      sortBy: '排序方式',
      sortRecommended: '系统推荐',
      sortPriceLow: '价格：从低到高',
      sortPriceHigh: '价格：从高到低',
      sortPsf: '每平方英尺价：低到高',
      sortSize: '面积：最大',
      sortNewest: '最新发布',
    },
    property: {
      verified: '官方认证真实房源',
      virtualTour: '360° 全景看房',
      contactAgent: '联系经纪人',
      chatNow: '在线咨询经纪人',
      whatsapp: 'WhatsApp联系',
      scheduleViewing: '预约看房',
      beds: '房',
      baths: '卫',
      sqft: '平方英尺',
      tenure: '地契产权',
      mrtWalk: '分钟至地铁站',
      psf: '每平方英尺',
      details: '房产详情',
      mortgageCalc: '房贷月供计算器',
      amenities: '配套设施',
      nearbySchools: '周边学区名校',
    },
    alerts: {
      savedSearches: '已保存搜索与房源预警',
      newAlert: '创建新预警',
      saveCurrentSearch: '保存当前搜索条件',
      alertFrequency: '提醒频率',
      instant: '实时推送',
      daily: '每日早报',
      weekly: '每周汇总',
      alertTitle: '预警名称',
      saveBtn: '保存预警',
      testAlert: '模拟新房源匹配通知',
      noSavedSearches: '暂无保存的搜索预警。筛选您感兴趣的房源并点击“保存搜索预警”，有新单位上市即可第一时间收到通知。',
    },
    chat: {
      directChat: '与房产经纪人实时沟通',
      agentResponseNotice: 'CEA注册合规持牌中介 • 通常5分钟内回复',
      typeMessage: '输入您想了解的问题...',
      send: '发送',
      quickInquiries: '快捷提问：',
      inquiryAvailable: '请问该单位目前仍可看房购买/租赁吗？',
      inquiryViewing: '请问本周末是否方便安排实地看房？',
      inquiryNegotiable: '请问房东要价是否有议价空间？',
      inquiryValuation: '请问该房产近期的银行预估价值是多少？',
      requestViewing: '预约看房时间',
      activeNow: '在线',
    },
    compare: {
      compareTitle: '房源对比',
      compareSubtitle: '全方位并排比对价格、户型面积、地铁接驳及配套设施',
      selectToCompare: '勾选对比',
      addToCompare: '加入对比',
      inCompare: '已在对比中',
      removeFromCompare: '从对比中移除',
      compareNow: '立即对比',
      clearAll: '清空对比',
      highlightDifferences: '仅高亮差异项',
      addProperty: '添加房源',
      maxReached: '最多可同时比对 4 套房源',
      selectAtLeastTwo: '请至少选择 2 套房源以进行并排对比',
      keyPricing: '价格与财务估算',
      spaceLayout: '户型与空间规格',
      buildingLocation: '地段与地铁交通',
      amenitiesFacilities: '核心配套设施清单',
      agentDetails: 'CEA持牌中介与即时联系',
      bestValuePsf: '最低单价 (PSF)',
      largestArea: '最大建筑面积',
      nearestMrt: '离地铁站最近',
      estMortgage: '预估每月房贷供款',
      monthlyMaintenance: '每月物业管理费',
      printReport: '打印对比报告',
      noPropertiesSelected: '暂无选中的对比房源。在任意房源卡片上点击“对比”即可开始。',
    },
    mortgage: {
      calculatorTitle: '新加坡房贷计算器',
      calculatorSubtitle: '基于新加坡主流银行最新利率与金管局 (MAS) TDSR 房贷准则估算月供',
      selectBankRate: '新加坡银行精选方案',
      customRate: '自定义年利率',
      propertyPrice: '房产买入价格',
      downpayment: '购房首付款',
      loanTenure: '贷款年限',
      interestRate: '年化利率',
      monthlyRepayment: '预估每月还款额',
      principalAndInterest: '本金与利息拆解',
      principal: '每月本金',
      interest: '每月利息',
      totalInterest: '贷款期总利息支出',
      totalLoanAmount: '总贷款本金额',
      bankPackages: '新加坡主流银行房贷方案',
      fixedRate: '固定利率',
      floatingRate: '浮动利率',
      lockInPeriod: '锁定期限',
      upfrontCosts: '初始购房总现金/公积金预算',
      cashDownpayment: '最低现金首付款 (5%)',
      cpfDownpayment: '公积金/现金 (20%)',
      buyersStampDuty: '买方印花税 (IRAS BSD)',
      estLegalFees: '预估律师与估价服务费',
      totalUpfront: '预估总首付款及前期费用',
      affordabilityCheck: 'MAS TDSR 偿债比率合规参考',
      minMonthlyIncome: '建议家庭最低税前月收入',
      tdsrNotice: '依据新加坡金管局 (MAS) 55% 总偿债率 (TDSR) 上限及 4.0% 压力测试年利率测算。',
      applyPackage: '咨询此贷款方案',
      getPreApproval: '申请原则性批准 (IPA)',
      compareBankRates: '全银行方案并排对比',
    },
  },

  ms: {
    siteTitle: 'PropertyGuru Singapura',
    tagline: 'Portal Hartanah Terunggul di Singapura',
    nav: {
      buy: 'Beli',
      rent: 'Sewa',
      newLaunches: 'Pelancaran Baru',
      commercial: 'Komersial',
      findAgent: 'Cari Ejen',
      newsGuides: 'Berita & Panduan',
      savedAlerts: 'Pemberitahuan Disimpan',
      messages: 'Mesej',
      login: 'Log Masuk / Daftar',
      logout: 'Log Keluar',
      myShortlist: 'Senarai Pilihan',
      compare: 'Bandingkan',
    },
    hero: {
      allResidential: 'Semua Kediaman',
      buy: 'Beli',
      rent: 'Sewa',
      commercial: 'Komersial',
      searchPlaceholder: 'Lokasi, stesen MRT, nama projek, poskod (cth: Orchard, Marina Bay, Tampines)',
      propertyType: 'Jenis Hartanah',
      allTypes: 'Semua Jenis',
      condo: 'Kondo / Pangsapuri',
      hdb: 'Flat HDB',
      landed: 'Rumah Bertanah',
      priceRange: 'Julat Harga',
      anyPrice: 'Sebarang Harga',
      bedrooms: 'Bilik Tidur',
      anyBeds: 'Sebarang Bilik',
      searchBtn: 'Cari Hartanah',
      moreFilters: 'Penapis Lanjut',
      resetFilters: 'Tetapkan Semula',
    },
    views: {
      splitView: 'Paparan Terbahagi',
      listView: 'Paparan Senarai',
      mapView: 'Paparan Peta',
      resultsFound: 'hartanah dijumpai di Singapura',
      showingResults: 'Menunjukkan',
      sortBy: 'Susun Mengikut',
      saveSearch: 'Simpan Makluman Carian',
    },
    results: {
      found: 'hartanah dijumpai di Singapura',
      saveSearch: 'Simpan Makluman Carian',
      sortBy: 'Susun Mengikut',
      sortRecommended: 'Disyorkan',
      sortPriceLow: 'Harga: Rendah ke Tinggi',
      sortPriceHigh: 'Harga: Tinggi ke Rendah',
      sortPsf: 'Harga Setiap Kaki Persegi',
      sortSize: 'Keluasan Lantai: Terbesar',
      sortNewest: 'Paling Baru',
    },
    property: {
      verified: 'Senarai Disahkan',
      virtualTour: 'Lawatan Maya 360°',
      contactAgent: 'Hubungi Ejen',
      chatNow: 'Sembang dengan Ejen',
      whatsapp: 'WhatsApp',
      scheduleViewing: 'Jadualkan Lawatan',
      beds: 'Bilik',
      baths: 'Bilik Air',
      sqft: 'kaki persegi',
      tenure: 'Pegangan',
      mrtWalk: 'min ke MRT',
      psf: 'psf',
      details: 'Maklumat Hartanah',
      mortgageCalc: 'Kalkulator Gadai Janji',
      amenities: 'Kemudahan Utama',
      nearbySchools: 'Sekolah Berdekatan',
    },
    alerts: {
      savedSearches: 'Carian & Makluman Disimpan',
      newAlert: 'Cipta Makluman Baru',
      saveCurrentSearch: 'Simpan Carian Ini',
      alertFrequency: 'Kekerapan Makluman',
      instant: 'Pemberitahuan Segera',
      daily: 'Ringkasan Harian',
      weekly: 'Ringkasan Mingguan',
      alertTitle: 'Tajuk Makluman',
      saveBtn: 'Simpan Makluman',
      testAlert: 'Uji Makluman Padanan Baru',
      noSavedSearches: 'Tiada makluman carian disimpan. Tetapkan penapis dan klik "Simpan Makluman Carian".',
    },
    chat: {
      directChat: 'Mesej Langsung Ejen',
      agentResponseNotice: 'Ejen Berlesen CEA • Kebiasaannya membalas dalam 5 minit',
      typeMessage: 'Taip pertanyaan anda di sini...',
      send: 'Hantar',
      quickInquiries: 'Pertanyaan Pantas:',
      inquiryAvailable: 'Adakah unit ini masih ada untuk dijual/sewa?',
      inquiryViewing: 'Bolehkah saya jadualkan lawatan unit hujung minggu ini?',
      inquiryNegotiable: 'Adakah harga masih boleh dirunding?',
      inquiryValuation: 'Berapakah penilaian bank terkini untuk unit ini?',
      requestViewing: 'Minta Slot Lawatan',
      activeNow: 'Aktif sekarang',
    },
    compare: {
      compareTitle: 'Bandingkan Hartanah',
      compareSubtitle: 'Perbandingan bersebelahan merangkumi harga, keluasan lantai, dan kemudahan',
      selectToCompare: 'Pilih untuk banding',
      addToCompare: 'Tambah ke Perbandingan',
      inCompare: 'Dalam Perbandingan',
      removeFromCompare: 'Keluarkan dari perbandingan',
      compareNow: 'Banding Sekarang',
      clearAll: 'Kosongkan Semua',
      highlightDifferences: 'Serlahkan Perbezaan',
      addProperty: 'Tambah Hartanah',
      maxReached: 'Maksimum 4 hartanah boleh dibandingkan serentak',
      selectAtLeastTwo: 'Pilih sekurang-kurangnya 2 hartanah untuk membuat perbandingan',
      keyPricing: 'Harga & Kewangan',
      spaceLayout: 'Ruang & Pelan Lantai',
      buildingLocation: 'Lokasi & Kesalinghubungan',
      amenitiesFacilities: 'Kemudahan & Fasiliti Utama',
      agentDetails: 'Ejen Hartanah CEA & Hubungi',
      bestValuePsf: 'PSF Terendah',
      largestArea: 'Keluasan Terbesar',
      nearestMrt: 'Paling Dekat MRT',
      estMortgage: 'Anggaran Ansuran Bulanan',
      monthlyMaintenance: 'Yuran Penyelenggaraan Bulanan',
      printReport: 'Cetak Laporan Perbandingan',
      noPropertiesSelected: 'Tiada hartanah dipilih untuk perbandingan. Klik "Bandingkan" pada mana-mana senarai untuk bermula.',
    },
    mortgage: {
      calculatorTitle: 'Kalkulator Gadai Janji Singapura',
      calculatorSubtitle: 'Anggarkan ansuran bulanan dengan kadar faedah bank semasa & garis panduan MAS TDSR',
      selectBankRate: 'Pakej Bank Semasa',
      customRate: 'Kadar Faedah Tersuai',
      propertyPrice: 'Harga Pembelian',
      downpayment: 'Bayaran Pendahuluan',
      loanTenure: 'Tempoh Pinjaman',
      interestRate: 'Kadar Faedah',
      monthlyRepayment: 'Anggaran Ansuran Bulanan',
      principalAndInterest: 'Pecahan Prinsipal & Faedah',
      principal: 'Prinsipal',
      interest: 'Faedah',
      totalInterest: 'Jumlah Faedah Perlu Dibayar',
      totalLoanAmount: 'Jumlah Pinjaman',
      bankPackages: 'Pakej Pinjaman Bank Singapura',
      fixedRate: 'Kadar Tetap',
      floatingRate: 'Kadar Terapung',
      lockInPeriod: 'Tempoh Terkunci',
      upfrontCosts: 'Modal Awal Diperlukan',
      cashDownpayment: 'Tunai Minimum (5%)',
      cpfDownpayment: 'CPF OA / Tunai (20%)',
      buyersStampDuty: 'Duti Setem Pembeli (IRAS BSD)',
      estLegalFees: 'Anggaran Yuran Guaman & Penilaian',
      totalUpfront: 'Jumlah Modal Awal Anggaran',
      affordabilityCheck: 'Panduan Kemampuan MAS TDSR',
      minMonthlyIncome: 'Pendapatan Isi Rumah Bulanan Min. Diperlukan',
      tdsrNotice: 'Berdasarkan had Nisbah Khidmat Hutang (TDSR) MAS 55% & ujian stres 4.0%.',
      applyPackage: 'Tanya Pakej Ini',
      getPreApproval: 'Dapatkan Kelulusan Prinsip (IPA)',
      compareBankRates: 'Bandingkan Semua Pakej Bank',
    },
  },

  ta: {
    siteTitle: 'PropertyGuru சிங்கப்பூர்',
    tagline: 'சிங்கப்பூரின் முன்னணி ரியல் எஸ்டேட் போர்ட்டல்',
    nav: {
      buy: 'வாங்கு',
      rent: 'வாடகை',
      newLaunches: 'புதிய திட்டங்கள்',
      commercial: 'வணிக சொத்து',
      findAgent: 'முகவரைத் தேடு',
      newsGuides: 'செய்திகள் & வழிகாட்டிகள்',
      savedAlerts: 'சேமிக்கப்பட்ட விழிப்பூட்டல்கள்',
      messages: 'செய்திகள்',
      login: 'உள்நுழை / பதிவு',
      logout: 'வெளியேறு',
      myShortlist: 'விருப்பப்பட்டியல்',
      compare: 'ஒப்பீடு',
    },
    hero: {
      allResidential: 'அனைத்து குடியிருப்புகள்',
      buy: 'வாங்கு',
      rent: 'வாடகை',
      commercial: 'வணிக சொத்து',
      searchPlaceholder: 'இருப்பிடம், MRT நிலையம், திட்டத்தின் பெயர் (எ.கா. Orchard, D09, Marina Bay)',
      propertyType: 'சொத்து வகை',
      allTypes: 'அனைத்து வகைகள்',
      condo: 'காண்டோ / அபார்ட்மெண்ட்',
      hdb: 'HDB பிளாட்',
      landed: 'நிலம் உள்ள வீடு',
      priceRange: 'விலை வரம்பு',
      anyPrice: 'எந்த விலையும்',
      bedrooms: 'படுக்கையறைகள்',
      anyBeds: 'எந்த படுக்கையறையும்',
      searchBtn: 'சொத்துகளைத் தேடு',
      moreFilters: 'கூடுதல் வடிகட்டிகள்',
      resetFilters: 'மீட்டமைக்க',
    },
    views: {
      splitView: 'பிரிவு பார்வை',
      listView: 'பட்டியல் பார்வை',
      mapView: 'வரைபடப் பார்வை',
      resultsFound: 'சிங்கப்பூரில் உள்ள சொத்துகள்',
      showingResults: 'காட்டுகிறது',
      sortBy: 'வரிசைப்படுத்து',
      saveSearch: 'தேடலை சேமிக்கவும்',
    },
    results: {
      found: 'சிங்கப்பூரில் உள்ள சொத்துகள்',
      saveSearch: 'தேடலை சேமிக்கவும்',
      sortBy: 'வரிசைப்படுத்து',
      sortRecommended: 'பரிந்துரைக்கப்பட்டவை',
      sortPriceLow: 'விலை: குறைந்ததிலிருந்து அதிகம்',
      sortPriceHigh: 'விலை: அதிகத்திலிருந்து குறைவு',
      sortPsf: 'சதுர அடி விலை: குறைந்ததிலிருந்து',
      sortSize: 'அளவு: மிகப்பெரியது',
      sortNewest: 'சமீபத்தியவை',
    },
    property: {
      verified: 'சரிபார்க்கப்பட்ட பட்டியல்',
      virtualTour: '360° மெய்நிகர் சுற்றுப்பயணம்',
      contactAgent: 'முகவரைத் தொடர்பு கொள்ளவும்',
      chatNow: 'உடனடி அரட்டை',
      whatsapp: 'WhatsApp',
      scheduleViewing: 'பார்வையிட முன்பதிவு',
      beds: 'அறைகள்',
      baths: 'குளியலறைகள்',
      sqft: 'சதுர அடி',
      tenure: 'உரிமைக்காலம்',
      mrtWalk: 'நிமிடம் MRT தூரம்',
      psf: 'சதுர அடிக்கு விலை',
      details: 'சொத்து விவரங்கள்',
      mortgageCalc: 'கடன் கால்குலேட்டர்',
      amenities: 'முக்கிய வசதிகள்',
      nearbySchools: 'அருகிலுள்ள பள்ளிகள்',
    },
    alerts: {
      savedSearches: 'சேமிக்கப்பட்ட தேடல்கள் & விழிப்பூட்டல்கள்',
      newAlert: 'புதிய விழிப்பூட்டல்',
      saveCurrentSearch: 'இந்த தேடலைச் சேமிக்கவும்',
      alertFrequency: 'அறிவிப்பு இடைவெளி',
      instant: 'உடனடி அறிவிப்பு',
      daily: 'தினசரி தகவல்',
      weekly: 'வாராந்திர சுருக்கம்',
      alertTitle: 'விழிப்பூட்டல் பெயர்',
      saveBtn: 'சேமிக்கவும்',
      testAlert: 'புதிய பொருந்தும் விழிப்பூட்டலை சோதிக்க',
      noSavedSearches: 'இன்னும் சேமிக்கப்பட்ட தேடல்கள் இல்லை.',
    },
    chat: {
      directChat: 'முகவருடன் நேரடி அரட்டை',
      agentResponseNotice: 'CEA பதிவு பெற்ற முகவர் • வழக்கமாக 5 நிமிடங்களில் பதிலளிக்கிறார்',
      typeMessage: 'உங்கள் கேள்வியை இங்கே தட்டச்சு செய்க...',
      send: 'அனுப்புக',
      quickInquiries: 'விரைவான கேள்விகள்:',
      inquiryAvailable: 'இந்த வீடு இன்னும் விற்பனைக்கு/வாடகைக்கு உள்ளதா?',
      inquiryViewing: 'இந்த வார இறுதியில் நேரில் பார்க்கலாமா?',
      inquiryNegotiable: 'விலை பேசக்கூடியதா?',
      inquiryValuation: 'சமீபத்திய வங்கி மதிப்பீடு என்ன?',
      requestViewing: 'பார்வைக்கான நேரத்தை கோரவும்',
      activeNow: 'இப்போது ஆன்லைனில்',
    },
    compare: {
      compareTitle: 'சொத்துகளை ஒப்பிடுக',
      compareSubtitle: 'விலை, தரைப்பரப்பு, MRT தூரம் மற்றும் வசதிகளின் விரிவான ஒப்பீடு',
      selectToCompare: 'ஒப்பிட தேர்ந்தெடுக்கவும்',
      addToCompare: 'ஒப்பீட்டில் சேர்க்க',
      inCompare: 'ஒப்பீட்டில் உள்ளது',
      removeFromCompare: 'ஒப்பீட்டிலிருந்து நீக்குக',
      compareNow: 'இப்போது ஒப்பிடு',
      clearAll: 'அனைத்தையும் அழிக்க',
      highlightDifferences: 'வேறுபாடுகளை சிறப்பித்துக் காட்டு',
      addProperty: 'சொத்து சேர்க்க',
      maxReached: 'ஒரே நேரத்தில் அதிகபட்சம் 4 சொத்துகளை ஒப்பிடலாம்',
      selectAtLeastTwo: 'ஒப்பிட குறைந்தது 2 சொத்துகளை தேர்ந்தெடுக்கவும்',
      keyPricing: 'விலை & நிதி விவரங்கள்',
      spaceLayout: 'இட அளவு & தளவமைப்பு',
      buildingLocation: 'இருப்பிடம் & இணைப்பு வசதிகள்',
      amenitiesFacilities: 'முக்கிய வசதிகள்',
      agentDetails: 'CEA முகவர் & தொடர்பு',
      bestValuePsf: 'குறைந்த PSF',
      largestArea: 'மிகப்பெரிய பரப்பளவு',
      nearestMrt: 'MRT-க்கு மிக அருகில்',
      estMortgage: 'மாத தவணை மதிப்பீடு',
      monthlyMaintenance: 'மாத பராமரிப்பு கட்டணம்',
      printReport: 'அறிக்கையை அச்சிடுக',
      noPropertiesSelected: 'ஒப்பீட்டிற்கு எந்த சொத்தும் தேர்ந்தெடுக்கப்படவில்லை. தொடங்க ஏதேனும் சொத்தில் "ஒப்பீடு" என்பதைக் கிளிக் செய்க.',
    },
    mortgage: {
      calculatorTitle: 'சிங்கப்பூர் வீட்டுக்கடன் கால்குலேட்டர்',
      calculatorSubtitle: 'வங்கி வட்டி விகிதங்கள் மற்றும் MAS TDSR விதிகளுடன் மாதத் தவணையை மதிப்பிடுக',
      selectBankRate: 'தற்போதைய வங்கி திட்டங்கள்',
      customRate: 'விருப்ப வட்டி விகிதம்',
      propertyPrice: 'சொத்து வாங்கும் விலை',
      downpayment: 'முன்பணம்',
      loanTenure: 'கடன் காலம்',
      interestRate: 'வட்டி விகிதம்',
      monthlyRepayment: 'மதிப்பிடப்பட்ட மாதத் தவணை',
      principalAndInterest: 'அசல் & வட்டி விவரம்',
      principal: 'அசல்',
      interest: 'வட்டி',
      totalInterest: 'மொத்த வட்டித் தொகை',
      totalLoanAmount: 'மொத்தக் கடன் தொகை',
      bankPackages: 'சிங்கப்பூர் வங்கி கடன் திட்டங்கள்',
      fixedRate: 'நிலையான வட்டி',
      floatingRate: 'மிதக்கும் வட்டி',
      lockInPeriod: 'லாக்-இன் காலம்',
      upfrontCosts: 'தேவைப்படும் ஆரம்ப நிதி',
      cashDownpayment: 'குறைந்தபட்ச ரொக்கம் (5%)',
      cpfDownpayment: 'CPF OA / ரொக்கம் (20%)',
      buyersStampDuty: 'வாங்குபவர் முத்திரை வரி (IRAS BSD)',
      estLegalFees: 'மதிப்பிடப்பட்ட சட்டக் கட்டணங்கள்',
      totalUpfront: 'மதிப்பிடப்பட்ட மொத்த முன்பணம்',
      affordabilityCheck: 'MAS TDSR தகுதி மதிப்பீடு',
      minMonthlyIncome: 'குறைந்தபட்ச மாத குடும்ப வருமானம்',
      tdsrNotice: 'MAS 55% TDSR வரம்பு மற்றும் 4.0% அழுத்த சோதனை வட்டி அடிப்படையில் கணக்கிடப்பட்டது.',
      applyPackage: 'இத்திட்டம் குறித்து விசாரிக்க',
      getPreApproval: 'முன் ஒப்புதல் பெறுக (IPA)',
      compareBankRates: 'அனைத்து வங்கி திட்டங்களையும் ஒப்பிட',
    },
  },
};
