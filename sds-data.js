"use strict";

const sdsLibraryData = {
  lastUpdated: "October 5, 2026",

  completePackage: {
    title: "Complete Ridge Rock SDS Package",
    description: "View the complete Ridge Rock SDS collection and chemical inventory in one document.",
    fileName: "SafetyDataSheet_RidgeRock_v2.pdf"
  },

  categories: [
    "Fuels & Fuel Products",
    "Asphalt & Paving",
    "Concrete & Aggregate",
    "Equipment & Maintenance",
    "Solvents & Adhesives",
    "Fire Safety"
  ],

  sheets: [
    {
      number: 1,
      title: "Diesel Fuel - No. 2",
      manufacturer: "Marathon Petroleum",
      category: "Fuels & Fuel Products",
      fileName: "01_Diesel_Fuel_No_2_Marathon.pdf",
      keywords: "diesel fuel no 2 ulsd marathon petroleum"
    },
    {
      number: 2,
      title: "Gasoline - All Grades",
      manufacturer: "Marathon Petroleum",
      category: "Fuels & Fuel Products",
      fileName: "02_Gasoline_All_Grades_Marathon.pdf",
      keywords: "gasoline gas fuel regular premium unleaded marathon petroleum"
    },
    {
      number: 3,
      title: "Inverted Marking Paint",
      manufacturer: "Rust-Oleum Professional",
      category: "Asphalt & Paving",
      fileName: "03_Inverted_Marking_Paint_Rust_Oleum.pdf",
      keywords: "marking paint spray paint striping rust oleum professional"
    },
    {
      number: 4,
      title: "ABC Dry Chemical Fire Extinguisher Agent",
      manufacturer: "Amerex",
      category: "Fire Safety",
      fileName: "04_ABC_Dry_Chemical_Fire_Extinguisher_Agent_Amerex.pdf",
      keywords: "abc dry chemical fire extinguisher agent amerex"
    },
    {
      number: 5,
      title: "Starplex EP Grease",
      manufacturer: "Chevron",
      category: "Equipment & Maintenance",
      fileName: "05_Starplex_EP_Grease_Chevron.pdf",
      keywords: "grease starplex ep chevron lubricant equipment maintenance"
    },
    {
      number: 6,
      title: "Odorless Mineral Spirits / Solvent",
      manufacturer: "Klean-Strip",
      category: "Solvents & Adhesives",
      fileName: "06_Odorless_Mineral_Spirits_Klean_Strip.pdf",
      keywords: "mineral spirits solvent klean strip cleaner"
    },
    {
      number: 7,
      title: "Natural Sand / Gravel / Aggregate",
      manufacturer: "CalPortland",
      category: "Concrete & Aggregate",
      fileName: "07_Natural_Sand_Gravel_Aggregate_CalPortland.pdf",
      keywords: "sand gravel aggregate rock dust silica calportland"
    },
    {
      number: 8,
      title: "Hot Mix Asphalt",
      manufacturer: "CalPortland",
      category: "Asphalt & Paving",
      fileName: "08_Hot_Mix_Asphalt_CalPortland.pdf",
      keywords: "hot mix asphalt hma paving calportland"
    },
    {
      number: 9,
      title: "Ready-Mix Concrete",
      manufacturer: "CalPortland",
      category: "Concrete & Aggregate",
      fileName: "09_Ready_Mix_Concrete_CalPortland.pdf",
      keywords: "ready mix concrete cement silica calportland"
    },
    {
      number: 10,
      title: "Concrete Mix No. 1101",
      manufacturer: "QUIKRETE",
      category: "Concrete & Aggregate",
      fileName: "10_Concrete_Mix_No_1101_QUIKRETE.pdf",
      keywords: "concrete mix 1101 quikrete cement silica bagged"
    },
    {
      number: 11,
      title: "Rando HD Hydraulic Oil",
      manufacturer: "Chevron",
      category: "Equipment & Maintenance",
      fileName: "11_Rando_HD_Hydraulic_Oil_Chevron.pdf",
      keywords: "hydraulic oil rando hd 150 220 320 chevron"
    },
    {
      number: 12,
      title: "Delo 400 XSP SAE 15W-40 Motor Oil",
      manufacturer: "Chevron",
      category: "Equipment & Maintenance",
      fileName: "12_Delo_400_XSP_15W40_Chevron.pdf",
      keywords: "motor oil delo 400 xsp 15w40 chevron engine oil"
    },
    {
      number: 13,
      title: "Final Charge Global 50/50 Antifreeze & Coolant",
      manufacturer: "Old World Industries",
      category: "Equipment & Maintenance",
      fileName: "13_Final_Charge_Global_50_50_Coolant.pdf",
      keywords: "antifreeze coolant final charge global 50 50 old world industries"
    },
    {
      number: 14,
      title: "BlueDEF Diesel Exhaust Fluid",
      manufacturer: "Old World Industries",
      category: "Fuels & Fuel Products",
      fileName: "14_BlueDEF_Diesel_Exhaust_Fluid.pdf",
      keywords: "def diesel exhaust fluid bluedef urea old world industries"
    },
    {
      number: 15,
      title: "Brakleen Brake Parts Cleaner",
      manufacturer: "CRC Industries",
      category: "Equipment & Maintenance",
      fileName: "15_Brakleen_Brake_Parts_Cleaner_CRC.pdf",
      keywords: "brakleen brake parts cleaner crc maintenance aerosol"
    },
    {
      number: 16,
      title: "WD-40 Multi-Use Product Aerosol",
      manufacturer: "WD-40 Company",
      category: "Equipment & Maintenance",
      fileName: "16_WD_40_Multi_Use_Product_Aerosol.pdf",
      keywords: "wd40 wd 40 multi use aerosol lubricant maintenance"
    },
    {
      number: 17,
      title: "Propane - UN1978",
      manufacturer: "Worthington Cylinder Corporation",
      category: "Fuels & Fuel Products",
      fileName: "17_Propane_UN1978_Worthington.pdf",
      keywords: "propane lp gas un1978 worthington cylinder fuel heater torch"
    },
    {
      number: 18,
      title: "Acrylic Concrete Cure & Seal - Satin Finish No. 8730",
      manufacturer: "QUIKRETE",
      category: "Concrete & Aggregate",
      fileName: "18_Acrylic_Concrete_Cure_and_Seal_QUIKRETE.pdf",
      keywords: "acrylic concrete cure seal satin 8730 quikrete"
    },
    {
      number: 19,
      title: "CSS-1h Asphalt Emulsion / Tack Coat",
      manufacturer: "BCI Materials",
      category: "Asphalt & Paving",
      fileName: "19_CSS_1h_Asphalt_Emulsion_Tack_Coat_BCI.pdf",
      keywords: "css 1h asphalt emulsion tack coat bci materials paving"
    },
    {
      number: 20,
      title: "PL Premium Max Construction Adhesive",
      manufacturer: "Loctite / Henkel",
      category: "Solvents & Adhesives",
      fileName: "20_PL_Premium_Max_Construction_Adhesive_Loctite.pdf",
      keywords: "pl premium max construction adhesive loctite henkel glue"
    },
    {
      number: 21,
      title: "De-Icer Windshield Washer Fluid",
      manufacturer: "Prestone Products Corporation",
      category: "Equipment & Maintenance",
      fileName: "SDS546-DeIcer-Washer-Fluid(1).pdf",
      keywords: "prestone deicer de-icer windshield washer fluid washer fluid windshield cleaner vehicle winter"
    },
    {
      number: 22,
      title: "Jump Start Starting Fluid",
      manufacturer: "CRC Industries",
      category: "Equipment & Maintenance",
      fileName: "sds-1003843(1).pdf",
      keywords: "crc jump start starting fluid engine starting aerosol diesel gasoline equipment maintenance"
    },
    {
      number: 23,
      title: "QD Electronic Cleaner",
      manufacturer: "CRC Industries",
      category: "Equipment & Maintenance",
      fileName: "sds-1003719(1).pdf",
      keywords: "crc qd electronic cleaner electrical cleaner contact cleaner electronics aerosol maintenance"
    },
    {
      number: 24,
      title: "133K Anti-Seize Lubricant",
      manufacturer: "ITW Permatex, Inc.",
      category: "Equipment & Maintenance",
      fileName: "80078(1).pdf",
      keywords: "permatex 133k anti seize anti-seize lubricant bolts threads fasteners maintenance"
    },
    {
      number: 25,
      title: "Medium Strength Threadlocker Blue",
      manufacturer: "ITW Permatex, Inc.",
      category: "Solvents & Adhesives",
      fileName: "24200(1).pdf",
      keywords: "permatex medium strength threadlocker thread locker blue adhesive bolts threads fasteners"
    }
  ]
};
