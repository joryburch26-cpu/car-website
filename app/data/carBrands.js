// Countries of cars and the brands of each country (the lists you gave me, cleaned).
// "key" is what is saved in the database. "ar" is the Arabic name shown on the website.
const carBrands = [
  { key: "Japan", ar: "اليابان", brands: ["Toyota", "Lexus", "Honda", "Acura", "Nissan", "Infiniti", "Mazda", "Suzuki", "Subaru", "Mitsubishi", "Isuzu", "Daihatsu", "Mitsuoka", "Hino", "Datsun"] },
  { key: "Germany", ar: "ألمانيا", brands: ["Mercedes-Benz", "BMW", "Audi", "Volkswagen", "Porsche", "Opel", "Smart", "Maybach", "Alpina", "Wiesmann", "RUF", "Brabus", "Apollo", "Gumpert", "Isdera", "MAN"] },
  { key: "South Korea", ar: "كوريا الجنوبية", brands: ["Hyundai", "Kia", "Genesis", "KG Mobility (SsangYong)", "Renault Korea", "Daewoo", "Samsung Motors"] },
  { key: "China", ar: "الصين", brands: ["BYD", "Denza", "Yangwang", "Fangchengbao", "Geely", "Geely Galaxy", "Lynk & Co", "Zeekr", "Chery", "Exeed", "Jetour", "Omoda", "Jaecoo", "iCAUR", "Lepas", "Changan", "Deepal", "Avatr", "Nevo", "GAC", "Aion", "Hyptec", "Trumpchi", "Hongqi", "Bestune", "FAW", "Dongfeng", "Voyah", "M-Hero", "Forthing", "DFSK", "Seres", "Aito", "BAIC", "Arcfox", "Beijing", "JAC", "JMC", "Great Wall Motors (GWM)", "Haval", "Tank", "Wey", "Ora", "Poer", "MG", "Roewe", "Maxus", "IM Motors", "Rising Auto", "Wuling", "Baojun", "Foton", "King Long", "Golden Dragon", "Soueast", "Kaiyi", "Livan", "NIO", "Onvo", "Firefly", "XPeng", "Li Auto", "Leapmotor", "Xiaomi", "Luxeed", "Maextro", "Skyworth", "Skywell", "Neta", "Zotye", "Lifan", "Hongyan", "Brilliance", "Jetta", "Karry", "iCar", "BAIC BJEV", "Haima", "Hafei", "Landwind", "Venucia", "Sinotruk"] },
  { key: "United States", ar: "الولايات المتحدة الأمريكية", brands: ["Ford", "Lincoln", "Chevrolet", "Cadillac", "GMC", "Buick", "Chrysler", "Dodge", "Jeep", "Ram", "Tesla", "Rivian", "Lucid", "Hummer", "Pontiac", "Oldsmobile", "Saturn", "Plymouth", "Mercury", "Fisker", "Karma", "Bollinger", "Faraday Future", "Scout Motors", "Saleen", "Shelby", "Hennessey", "Rezvani", "Czinger", "SSC", "De Tomaso", "Aptera", "Nikola", "Workhorse", "Acura", "Panoz", "Vector", "Packard", "Studebaker", "International"] },
  { key: "United Kingdom", ar: "المملكة المتحدة", brands: ["Jaguar", "Land Rover", "Range Rover", "Mini", "Bentley", "Rolls-Royce", "Aston Martin", "McLaren", "Lotus", "MG", "Vauxhall", "Morgan", "Caterham", "Ariel", "BAC", "Noble", "TVR", "Ginetta", "Ineos", "Radical", "Ultima", "Westfield", "LEVC", "Gordon Murray Automotive", "David Brown Automotive", "AC Cars", "Jensen", "Lister", "Bristol", "Lagonda", "Gordon-Keeble", "Triumph", "Rover", "Austin", "Morris", "Wolseley", "Sunbeam", "Hillman", "Riley", "Jowett", "Marcos", "Zenos"] },
  { key: "France", ar: "فرنسا", brands: ["Renault", "Peugeot", "Citroën", "DS Automobiles", "Alpine", "Bugatti", "Aixam", "Ligier", "PGO", "Venturi", "Delage", "Delahaye", "Facel Vega", "Panhard", "Simca", "Talbot", "Matra", "Hopium", "Microcar"] },
  { key: "Italy", ar: "إيطاليا", brands: ["Fiat", "Alfa Romeo", "Lancia", "Maserati", "Ferrari", "Lamborghini", "Pagani", "Abarth", "Iveco", "Italdesign", "Pininfarina", "Mazzanti", "Dallara", "De Tomaso", "Bizzarrini", "Iso", "Innocenti", "Autobianchi", "Cisitalia", "OSCA", "Touring Superleggera", "Zagato", "Bertone", "DR Automobiles", "XEV"] },
  { key: "Sweden", ar: "السويد", brands: ["Volvo Cars", "Polestar", "Koenigsegg", "Saab", "NEVS"] },
  { key: "Czech Republic", ar: "التشيك", brands: ["Škoda", "Tatra", "Praga", "Avia"] },
  { key: "Spain", ar: "إسبانيا", brands: ["SEAT", "Cupra", "Hispano-Suiza", "Santana Motors", "Spania GTA", "Tramontana", "Ebro", "Pegaso"] },
  { key: "Romania", ar: "رومانيا", brands: ["Dacia", "ARO", "Oltcit"] },
  { key: "India", ar: "الهند", brands: ["Tata Motors", "Mahindra", "Mahindra Electric", "Maruti Suzuki", "Force Motors", "Hindustan Motors", "Ashok Leyland", "Premier", "Eicher", "BharatBenz", "Pravaig", "Ola Electric"] },
  { key: "Turkey", ar: "تركيا", brands: ["TOGG", "Temsa", "Otokar", "Karsan", "BMC", "Anadolu Isuzu", "Tofaş"] },
  { key: "Malaysia", ar: "ماليزيا", brands: ["Proton", "Perodua", "Bufori"] },
  { key: "Thailand", ar: "تايلاند", brands: ["Thai Rung", "Energy Absolute (MINE Mobility)", "NEX Point"] },
  { key: "Vietnam", ar: "فيتنام", brands: ["VinFast", "THACO", "Vinaxuki"] },
  { key: "Russia", ar: "روسيا", brands: ["Lada", "UAZ", "GAZ", "Aurus", "Moskvich", "KamAZ", "ZIL", "Sollers", "Evolute", "Marussia"] },
  { key: "Egypt", ar: "مصر", brands: ["Nasr", "EGA"] },
];

export default carBrands;
