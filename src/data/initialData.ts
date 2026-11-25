export interface Product {
  id: string;
  sku: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  unit: string;
  stockStatus: 'In Stock at Shop' | 'Available on Request' | 'Low Stock' | 'Out of Stock';
  stockCount?: number;
  isPublic: boolean;
  image: string;
  badgeLabel?: string;
  description: string;
  specDetails?: string;
  popularInHome?: boolean;
}

export interface Category {
  id: string;
  name: string;
  itemCountText: string;
  itemCount: number;
  icon: string;
  description: string;
  image?: string;
}

export interface PrintingRateCard {
  id: string;
  serviceId: string;
  title: string;
  category: 'xerox' | 'color' | 'finishing' | 'thesis';
  description: string;
  rate: number;
  rateUnit: string;
  rateDisplay?: string;
  turnaround: string;
  formatsSupported: string;
  paperStock: string;
  badges: string[];
  image: string;
  volumeNote: string;
  isCustomQuote?: boolean;
}

export interface EquipmentSpec {
  service: string;
  paperWeights: string;
  maxDimensions: string;
  turnaround: string;
  publishedRate: string;
  icon: string;
}

export interface CustomerInquiry {
  id: string;
  receivedTime: string;
  clientName: string;
  clientContact: string;
  itemOrService: string;
  skuOrCode: string;
  volume: string;
  status: 'PENDING REPLY' | 'ADDRESSED' | 'ARCHIVED';
  notes?: string;
}

export interface StoreConfig {
  storeName: string;
  subtitle: string;
  address: string;
  landmark: string;
  googleMapsQuery: string;
  openTime: string;
  closeTime: string;
  operationalDays: string;
  phone: string;
  whatsapp: string;
  email: string;
  isOpenNow: boolean;
  plotterStatus: string;
}

export const INITIAL_STORE_CONFIG: StoreConfig = {
  storeName: 'S V COPIERS / XEROX',
  subtitle: 'Commercial Reprographics & Institutional Stationery',
  address: 'Shop 10, Siddhivinayak Height, Above Ratnaraj Green, Nana Chiloda, New Shahibaug, Ahmedabad, Gujarat 382330, India.',
  landmark: 'Above Ratnaraj Green commercial complex, Nana Chiloda road.',
  googleMapsQuery: 'Shop+10+Siddhivinayak+Height+Nana+Chiloda+Ahmedabad',
  openTime: '08:30 AM',
  closeTime: '08:00 PM',
  operationalDays: 'Monday – Saturday, 8:30 AM – 8:00 PM (Sunday, 8:30 AM – 1:00 PM)',
  phone: '+91 98254 31210',
  whatsapp: '919825431210',
  email: 'contact@svcopiers.in',
  isOpenNow: true,
  plotterStatus: 'ONLINE (HP DesignJet T830)',
};

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'pens',
    name: 'Pens & Pencils',
    itemCountText: '120+ Items',
    itemCount: 120,
    icon: 'edit',
    description: 'Reynolds, Pentel, Cello, Doms, Hauser, Pilot',
  },
  {
    id: 'notebooks',
    name: 'Notebooks & Registers',
    itemCountText: '85+ Items',
    itemCount: 85,
    icon: 'menu_book',
    description: 'Long books, spiral registers, graph & accounting pads',
  },
  {
    id: 'school',
    name: 'School & College Essentials',
    itemCountText: '95+ Items',
    itemCount: 95,
    icon: 'school',
    description: 'Geometry boxes, exam boards, chart covers, pouches',
  },
  {
    id: 'office',
    name: 'Office Stationery',
    itemCountText: '110+ Items',
    itemCount: 110,
    icon: 'corporate_fare',
    description: 'Staplers, punchers, desk trays, adhesive tapes, pins',
  },
  {
    id: 'files',
    name: 'Files & Folders',
    itemCountText: '60+ Items',
    itemCount: 60,
    icon: 'folder',
    description: 'Box files, cobra spring files, certificate display books',
  },
  {
    id: 'paper',
    name: 'Paper Products',
    itemCountText: '45+ Varieties',
    itemCount: 45,
    icon: 'content_copy',
    description: 'JK Copier 75/80 GSM, glossy photo sheets, ivory card',
  },
  {
    id: 'art',
    name: 'Art & Craft Supplies',
    itemCountText: '70+ Items',
    itemCount: 70,
    icon: 'palette',
    description: 'Poster colors, drawing pads, brushes, acrylic markers',
  },
  {
    id: 'services',
    name: 'Printing & Xerox Services',
    itemCountText: 'Full Reprographic Desk',
    itemCount: 18,
    icon: 'local_printshop',
    description: 'Laser photocopying, colour prints, lamination, binding',
  },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    sku: 'PEN-CEL-5PK',
    name: 'Ball Pen (Blue/Black Pack of 5)',
    brand: 'Cello',
    category: 'Pens',
    price: 50,
    unit: 'pack',
    stockStatus: 'In Stock at Shop',
    stockCount: 65,
    isPublic: true,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBOigkg9E5vmzQ0B5wDIML57b7O8uIr3X7mWyUUK9ZYr0UH1CRSJ2Lh_dPlrU8Bbz-l9DB_aFYHwI1_UMfEbBL7wYZ67W6uzLVoVNd7CN2IQC3IMMmxmECcs14Z-8_PthmfPdwzV_vhr15KcVNuEwgW7JgwR-AHlcvBT4elnbtJuxzdEsC7Gp0gnyls4wdK2KsmQwZzt9ZUHP9B35Qxpt3MmBRUClAGhuWp8sLxB4d999sxQsHyyGzt',
    badgeLabel: '5 Pcs Blue',
    description: 'Smudge-free fine tip ballpoint pens for exams and office daily ledger entries.',
    specDetails: 'Ultra-smooth low viscosity ink writing system with ergonomic comfort grip. Ideal for engineering documentation, examination desks, and everyday office registers.',
    popularInHome: true,
  },
  {
    id: 'prod-2',
    sku: 'REG-CLS-240H',
    name: 'Hardbound Ruled Register (200 pgs)',
    brand: 'Classmate',
    category: 'Notebooks',
    price: 85,
    unit: 'each',
    stockStatus: 'In Stock at Shop',
    stockCount: 42,
    isPublic: true,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBn3ixcAyblVz0hRtWt44_cnIMZs893f453mz_DnNjWUIl0wuUGo39BRNtQTKxs2-Pl-GYNjxBB9wfVpCbqgV7oPAp7iY5EL7aFtzuCkgz98kbaIV54jH1tryqefDmuxmFlXmvL16oCYkohLEMnGNVBnagoMHprRUOq_WwW1neQVWISesXo7xzNSvFLFMt_CRMkjcJTfSwbFPAp_jEZoaBQVIFluHuGiVAnEFEPW1ArchioIWB4X_ih',
    badgeLabel: '200 Pages',
    description: 'Extra-durable binding with high opacity 70 GSM ruled pages for long-term records.',
    specDetails: 'Hardbound binding with elemental chlorine-free high whiteness paper stock. Specially designed for university student lectures and corporate record maintenance.',
    popularInHome: true,
  },
  {
    id: 'prod-3',
    sku: 'PAP-JK-75A4',
    name: 'A4 Copier Paper 75 GSM (500 Sheets)',
    brand: 'JK Paper',
    category: 'Paper Products',
    price: 340,
    unit: 'ream',
    stockStatus: 'In Stock at Shop',
    stockCount: 48,
    isPublic: true,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBdTHQmRGxEQ5PzcdRlGXe5-4fJ5LarblqGcseshmhB6CjdMBdu3qMM6dxj0ETkmJ8KD1MqxRws5HJVuolw82FLeHrokfXoqveHXe_8DOX9_vzuHX6ktN6NDaY6WIe-bs0lCiArKMysfZx2XQ2UguUcpguPz8lBZfFuO5WV1etZLXkON0J1mKNdk47ptK8BAa1-9OWfMTsCXRi4C4o9qcaf2aYjTa7boXkiSf96nUv6mjbvfv8M34rG',
    badgeLabel: '75 GSM • 500 Pcs',
    description: 'High brightness multipurpose laser photocopy ream, jam-free high speed feeding.',
    specDetails: 'High-speed trouble-free photocopy paper. Exceptional opacity and brightness engineered specifically for double-sided Xerox copying and high volume laser printing.',
    popularInHome: true,
  },
  {
    id: 'prod-4',
    sku: 'OFF-KAN-STP10',
    name: 'Heavy Duty Stapler No. 10',
    brand: 'Kangaro',
    category: 'Office Supplies',
    price: 120,
    unit: 'unit',
    stockStatus: 'In Stock at Shop',
    stockCount: 30,
    isPublic: true,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDiv5OgFevdDFSAlPpMyJ5GKud79NDqIW8xbo5a-aL436Q5jIUoXvFOWHbew5i8DGFl96I1z2lOH8c2elMokPka0bTuCxx27lWeiCAOviOq-q__tzRC4pJjzWkObbCpr3nEFdxJAbQEOG7V72tOwsV3pnm1JCyyw3qkMysDF55HrSrHm4CYJYxAPjPXFpTLqwz_btj69xe-zCx9RhAjzKLXmOP49znZdgKnAun44LRxW8u93EfjrFN3',
    badgeLabel: 'Steel Chassis',
    description: 'All-metal mechanism with built-in staple remover and ergonomic grip pad.',
    specDetails: 'All-metal construction with integrated staple remover. Holds standard No. 10 staples with quick loading mechanism for heavy office and legal filing binding.',
    popularInHome: true,
  },
  {
    id: 'prod-5',
    sku: 'FIL-SOL-EXP12',
    name: 'Expanding File Folder 12 Pockets',
    brand: 'Solo',
    category: 'Files & Folders',
    price: 160,
    unit: 'each',
    stockStatus: 'In Stock at Shop',
    stockCount: 22,
    isPublic: true,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDI5SQnXzI-qXyMfHh1kVRwKYL-qbBQHIrb4pqJAsOrAO6K4agSjtYghIYXRkFe6bMngBKkc9Jjt0MakNcBbHp2_JR_EACx-pW792nVrxGOXIX0TiW9MSgmSAuhhvtdkBRuNJn3vlwGXTzGIUvaJAYoOWNMaYQ7SArnWGk8JMZQCTdDzpNLLkNi2qZ3xQI3Bl9N3dm3WB59RGFnqOVJqPYmjvms6VQt4j1t_zEsfwn8rH3uXyGfC2JS',
    badgeLabel: 'A4 • 12 Pockets',
    description: 'Polypropylene water-resistant organizer folder with index tabs for tax & bill sorting.',
    specDetails: 'Durable poly-sheet folder with 12 expandable compartments, colored classification inserts, and secure elastic closure cord.',
    popularInHome: true,
  },
  {
    id: 'prod-6',
    sku: 'NOT-LUX-B5SP',
    name: 'Spiral Notebook Premium B5',
    brand: 'Luxor',
    category: 'Notebooks',
    price: 95,
    unit: 'each',
    stockStatus: 'In Stock at Shop',
    stockCount: 38,
    isPublic: true,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCWppHKDxNfRYt-ZnND7CfHoosBzsLbO9u8ULcrONcY02TU5sDlUR-eo_FA8M_3IpqrZgeDe5BQtdozYOKO7vmJSMDMCsjL_QV_A-tpTvRM1gjC5tVEu78KhjMCrh-adZhx5FJJQNwkwsccP4Xty1dwI2G2wAXYvj5G0Pd1iT0cctj_tUvDw91uWee5tHFlet4ttrXmu3hC-gxzhLygeBqhpgWJn_7aCu0o2V1kswxcmSs2szsNRyzH',
    badgeLabel: '180 Pages • B5',
    description: 'Flexible polypropylene cover with sturdy wiro spiral, ideal for university lectures.',
    specDetails: 'Convenient 360-degree flat-fold spiral bound project notebook. Thick 70 GSM ruled leaves suitable for university assignments, project dissertations, and studio drafting logs.',
    popularInHome: true,
  },
  {
    id: 'prod-7',
    sku: 'ART-DOM-SKT12',
    name: 'Doms Art Stroke Sketch Set',
    brand: 'Doms',
    category: 'Art & Craft',
    price: 150,
    unit: 'kit',
    stockStatus: 'In Stock at Shop',
    stockCount: 25,
    isPublic: true,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD7mPmfgTs9F9UA2yxaNAwMvzeTUftZeHM2AmjeVZLiuQXKjPm9mPBQz2AYYI9MfRod7RBox1m9drDz4OvN5FG5LIlo2lqpeZoAIhH6qnon55OV4YJETyUEhEtx-oxx7viAf-HFYJK6jG7Ym6_Wz8Osr9FZgEkCxTFLDWvyNCPUdPraUHMgIX9DKkLe4O1vC75SS-vbdIWYUosuHQqXLLq9N4ECiNny5ioV1_mHZZZ_obPboLTfkE2m',
    badgeLabel: 'Graded 2B-8B',
    description: 'Complete graphite grading set for architectural sketches and fine art rendering.',
    specDetails: 'Includes premium graphite drawing pencils (HB to 8B), blending paper tortillon stumps, soft putty eraser, and metal sharpener in tin casing.',
    popularInHome: true,
  },
  {
    id: 'prod-8',
    sku: 'OFF-KOR-CORR',
    name: 'Correction Tape & Fluid Set',
    brand: 'Kores',
    category: 'Office Supplies',
    price: 45,
    unit: 'set',
    stockStatus: 'In Stock at Shop',
    stockCount: 50,
    isPublic: true,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBMvOtN1kwEzRBCbCv2_sfS0B_qjEr9LdXB_5VsaF_5h4LrWPmpOv39YC-Aen4M96mi2l4PFsAhzYrjS5VLvnPzI9NxsWYc7xOeGdv5QM4QrAeBGdSctpl4oa-tMaqszUFN41tXM4nzzIeeQZf_ikw62rpH5fSi4wyuIHfAsHm8lXPOmJZ3yfyM06eATFd-8deSyLd3NbIm0xdMQXlKBIViCEOk26oCrVZgDsEyiIF1eie1KgBOoYLf',
    badgeLabel: 'Instant Dry',
    description: 'Instant dry tape for mistake-free retyping and liquid white-out for handwritten corrections.',
    specDetails: 'Precision applicator nozzle with tear-resistant polymer film. Enables instant re-writing without waiting for liquid drying.',
    popularInHome: true,
  },
  {
    id: 'prod-9',
    sku: 'FIL-SOL-4RNG',
    name: 'Solo Deluxe 4–Ring Binder File',
    brand: 'Solo',
    category: 'Files & Folders',
    price: 175,
    unit: 'each',
    stockStatus: 'In Stock at Shop',
    stockCount: 28,
    isPublic: true,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAcvNFZGexheo5onTgs4yDywcd_a9Fe2jxmjuXVlzkP68WflBbb7UQP0w4k-30CVBKvhSYgJdaTjCdyDx19V8z91sylO6yBH3iORuFPBnsnioNxqcDYEt8orqzSK1XcY_N-f_mI21L97CNuoqK5o32ppUsbX5vQS8PqWJFeKPFH7TFW55NgqaWEa05rsk1TPhw1owWwFCk8sBR0IPol6LwOJLbmn2vW-LWnhCJYUIIbA9RQOk-fSVcg',
    badgeLabel: 'A4 • 250 Sheets',
    description: 'Durable poly-sheet binder equipped with chrome 4-ring O-ring architecture, spine label pocket for index classification, and anti-tear sheet guides.',
    specDetails: 'Heavy-duty 0.9mm polypropylene sheet with heavy spring-loaded rings. Withstands intense daily archival flipping in offices and chambers.',
    popularInHome: false,
  },
  {
    id: 'prod-10',
    sku: 'ART-DOM-SMART',
    name: 'Doms Smart Drawing Kit 12 Shades',
    brand: 'Doms',
    category: 'Art & Craft',
    price: 140,
    unit: 'kit',
    stockStatus: 'Available on Request',
    stockCount: 15,
    isPublic: true,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDmEFjwL2Fmw5xO4tqc2pHShXKl2soqObTs7SHf2wX8bxF5r90kad5sTjZLYV5hsf0U5ZNBk_RhKtLJh7EPKOPRSTpyoiUoqR8PSxdD9uOOFO32h1zol4ltE6A86f3lRdsY5IEmXhYlTtMXLRCkzNmy83xZU7WEi1r3FOvpZsun_eOGSEVsUBGxaLiZTOvzQXi0fjrEmVrBl_jYi8gw6j-BAnwJ8Ng107VFOtM4DyqsFD3SvJ_hMII1',
    badgeLabel: '12 Art Media',
    description: 'Comprehensive art kit for design trainees and school art coursework: includes non-toxic oil pastels, wax crayons, drawing pencils, and precision eraser.',
    specDetails: 'Vibrant child-safe pigments conforming to European EN 71 standards. Packed in reusable translucent carry kit.',
    popularInHome: false,
  },
  {
    id: 'prod-11',
    sku: 'PEN-REY-045BX',
    name: 'Reynolds 045 Fine Carbure Ball Pen Box of 20',
    brand: 'Reynolds',
    category: 'Pens',
    price: 180,
    unit: 'box',
    stockStatus: 'In Stock at Shop',
    stockCount: 40,
    isPublic: true,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDQY3kEeNNwA-mnEaCiUP6EkICARq-SMmLuuNd-lpg4SjvGXvARh5iaIunlG8qn2YqEFfEh9XfABtV9WWyqov3aPwpOkme5cBFAnaRPHKOeZquGh1YAyerNl2DKKIi5TFqxs5iEygdhxByX0435mXQ0Dx-B0gWGoJepHTfpA8z3qikfvYmCQ_5miZ_vhVSNbf6kv0KCyRjYOgfrkTxsgutMuRAz7HyJgHgoFYOFGwE6TA7O3C14BlEK',
    badgeLabel: '20 Pens • Fine Tip',
    description: 'Iconic 045 carbure ball pens featuring non-smudging laser tip fluidity. Preferred by academic institutions and accounting departments for sustained high-volume writing.',
    specDetails: 'Classic laser-tip 0.7mm tungsten carbide ball point with calibrated ink reservoir. Smooth non-leaking flow for Gujarat summers.',
    popularInHome: false,
  },
  {
    id: 'prod-12',
    sku: 'SCH-CAM-GEOM',
    name: 'Camlin Exam Mathematical Geometry Box',
    brand: 'Camlin',
    category: 'School Stationery',
    price: 125,
    unit: 'set',
    stockStatus: 'In Stock at Shop',
    stockCount: 35,
    isPublic: true,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAfMN86dWbNOpvGClbcF2Mz_Xr2_EY0fzkQatCKaWCu4x6Ca-Y3oD_fDELyTLhYvML4l7vTA6rZK4V4XcmDnJ2cOehh6hh4GsAGS5ifv8hdrC7rkWW6fO2_y7O7JpAlqhykb6rbl6JCiYTACRUzP0OgW-HHli3pa5Prv1WtEX-uiTQE-GJhxBvlaaVUi8vLBtxUWnfYHdcvb58Jvx7cYPfAmvwIkPLMpfY2iWQGySKk7U3H3sKODbm9',
    badgeLabel: 'Metal Instruments',
    description: 'Precision calibrated mathematical instruments in rigid metal case. Features rust-resistant compass, divider, protractor, set squares, and lead pencil.',
    specDetails: 'Die-cast self-centering zinc compass with gear-lock legs to eliminate needle wobble during engineering geometry exams.',
    popularInHome: false,
  },
  {
    id: 'prod-13',
    sku: 'PRN-DES-LAM100',
    name: 'A4 Thermal Lamination Pouches (100 micron, Pack of 50)',
    brand: 'Desmat',
    category: 'Printer Supplies',
    price: 290,
    unit: 'pack',
    stockStatus: 'In Stock at Shop',
    stockCount: 20,
    isPublic: true,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAvSMIUiOm7FNH4o3_fOAXxTZs8sa6VSQwP_2MttjZ5IKG2g4kQSOUsodgc2nV6CMHzIcgE44bMWjsKghkvKko_Kij8dRV49Pg2JI4TBCrf0zpy0B3Gn3YrDDRXSCsyeyeZk7Y4PzkOC5K9GjWPbjpLZbOkQNmiLwaiB5xuvuQcbqJubwnQfgkPmydexgETTz_2LvoqH4dAK5LfvYT-FyJl40v0BqweSdQcdbq2ufQLY6H0TXtgxDfd',
    badgeLabel: '100 Mic • 50 Pcs',
    description: 'Industrial grade crystal-clear polyester thermal lamination film. Ideal for protecting certificates, ID cards, legal agreements, and commercial price lists against water and tears.',
    specDetails: 'Super-gloss hot-seal pouch film suitable for all thermal pouch laminators up to 120°C operating temperature.',
    popularInHome: false,
  },
  {
    id: 'prod-14',
    sku: 'REG-NAV-PROJ',
    name: 'Navneet Spiral Bound Project Book 160 Pgs',
    brand: 'Navneet',
    category: 'Notebooks',
    price: 80,
    unit: 'each',
    stockStatus: 'In Stock at Shop',
    stockCount: 32,
    isPublic: true,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDhQvh9h7St6P4zGV5bTGJFX2D6VkpBRU22827I0xWgt9ENpQBsjqUMFtMNHklWE7FogR3yRBYHwONVaZySm_dAV1wIRjLTa34yg0luIbPC9NondUiIu_Fo2PFgyCIFoQejw77LFO-2tQCfZgGtG6BEqi9o-ZRexARfocObMXXFIDntDQwc2__NU3wWWswbs97i7WB7ewnrl6Jyl66iFa8FPkgVDA89-TfnURNoJo7xxsfRIIc-tVZ_',
    badgeLabel: '160 Pages • Spiral',
    description: 'Convenient 360-degree flat-fold spiral bound project notebook. Thick 70 GSM ruled leaves suitable for university assignments, project dissertations, and studio drafting logs.',
    specDetails: 'Micro-perforated tear-off margin with pre-printed student assignment index sheet.',
    popularInHome: false,
  },
  {
    id: 'prod-15',
    sku: 'OFF-KAN-DP52',
    name: 'Kangaro Perforator Two Hole Punch DP-52',
    brand: 'Kangaro',
    category: 'Office Supplies',
    price: 165,
    unit: 'unit',
    stockStatus: 'In Stock at Shop',
    stockCount: 22,
    isPublic: true,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDiLY2gwTgsXb7t6AzGoT2tfVJTOZTLoCilYlsR5s1hLTTsYVfPItm0xim8XjtC4mOqkdk1oVub6crYEbfZ2W53V7fL0czJIOZxr9TcCXasR5qA8RmzOsEmZfGN47p9Pw4qYqgd6TnTxePWcfx1_dRrl6T_MWjJp8QktAUkbbkhyqsxyb3UbO8oSzzBtMN4pO6EJIAidNkxhQeHODFjU1TI7rLo7L11n5REyyrjD99KAQZb4IJPsNH6',
    badgeLabel: '20 Sheet Cap',
    description: 'Medium duty two-hole paper punch with adjustable paper gauge guide and spill-proof waste collection tray. Punches up to 20 paper sheets cleanly in single stroke.',
    specDetails: 'Punches standard 80mm hole centers with 5.5mm diameter. Removable rubber base plate catches scrap discs cleanly.',
    popularInHome: false,
  },
  {
    id: 'prod-16',
    sku: 'FIL-SOL-CHQ',
    name: 'Solo Expanding Cheque & Document Organizer',
    brand: 'Solo',
    category: 'Files & Folders',
    price: 210,
    unit: 'each',
    stockStatus: 'Available on Request',
    stockCount: 12,
    isPublic: true,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBkCWnnqsSlUxhJAR4PNXQkrKpkdDHcK0YKM0HiExiKfq2jW-8goeRsWciEiJxUQaYtLbN-GNUypVgViTYWvkRpE5dq8LVw7Bm7um7IX4Lmz1ZdapVSbAU-0b8B7mLt37KJcq_ZVUSpykCRi5W7bgi7auCH8_0X_lV7UyK2gieeWsymNnm792ycBQWV8mRnHeIDNiu6xzjaGGyALZ4iy9okaJWil4kVSGOHSKwU1_2xReCFyJIxDn3O',
    badgeLabel: '12 Pockets',
    description: 'Compact 12-pocket expandable folio case with elastic cord closure. Features pre-printed monthly and alphabetical indicator tabs for tax receipts and vouchers.',
    specDetails: 'Durable charcoal textured polypropylene with colorful index dividers. Perfect for GST invoices and bank vouchers.',
    popularInHome: false,
  },
  {
    id: 'prod-17',
    sku: 'PAP-BLT-80A3',
    name: 'BILT Matrix A3 80 GSM Paper Ream',
    brand: 'BILT',
    category: 'Paper Products',
    price: 720,
    unit: 'ream',
    stockStatus: 'In Stock at Shop',
    stockCount: 18,
    isPublic: true,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuArFeXPV4hrPuWj4OPIiiovjsMF20-rLF-Yuzr94ObiAlKIv1GGrwOYO2e-npPw3LkdA26r-spNpc3Jo3sFydO7HkTbQX8SxtEJqKwvF8NEzM1I0WEFoHamJOc416DSxITquMy2aI8tFBZV3_4XcWRp9PduRBV9t1JjVHL1VPOmbhg8H_F5puzIq6DP_qzlqwVaFPrStQv6NmNoFffAER41GjpY7OVdZTryRRUrp1edrLabnx0Re7zl',
    badgeLabel: 'A3 • 80 GSM',
    description: 'Stacked reams of heavy 80 GSM large-format A3 reprographic paper packaged for architectural drafts and blueprint plotting on technical cutting table.',
    specDetails: 'Engineered for smooth feeding in high-volume production digital presses and engineering ledger copiers.',
    popularInHome: false,
  },
  {
    id: 'prod-18',
    sku: 'DRF-HP-80R36',
    name: 'CAD Plotter Bond Roll 36" x 50m',
    brand: 'HP',
    category: 'Drafting Media',
    price: 890,
    unit: 'roll',
    stockStatus: 'Low Stock',
    stockCount: 4,
    isPublic: true,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC27VTKYRioVmcn2XvycGRU2LtpZs7Rdsh6_9mWuegFxlwlCLqwcuN9LRVNrpdq5Sq-0J7wjG8idIH2HHNlwTBmtAuyKGsY05xA4djVapz-mbJLlgwkOKchSaHMIuIuCCuBiPAgtPwk9x6DY_iohE4j59S53QYwI5O4rbFu5sAtPAAIZEYkt4jKVInlZiy0Fy6kTuPHz16CJGnEUuhQ8AHgWcJodg79My5_ENn4F8LeYycI2doeuzs5',
    badgeLabel: '36" Roll • 80 GSM',
    description: 'Wide continuous architectural plotter paper roll on cardboard core, engineered drafting substrate for high-speed monochrome blueprint plans in Ahmedabad.',
    specDetails: 'Core diameter 2 inches, length 50 meters, ultra-white base for sharp vector linework and CAD blueprints.',
    popularInHome: false,
  },
  {
    id: 'prod-19',
    sku: 'BND-SPL-14MM',
    name: 'Spiral Plastic Binding Coils 14mm',
    brand: 'Solo',
    category: 'Binding Supplies',
    price: 280,
    unit: 'box',
    stockStatus: 'In Stock at Shop',
    stockCount: 22,
    isPublic: true,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB37XjjwXMJIWv4kkASRlEnu8-2kU9qenGcTCTtVYu4QTIH6Y-4UgEnvdfFrnjayKynPfL9NowAFPcZf9Jurzmk_cPK3k0XaCTnzNcFYYeAYTlzZwOVyVhzho_L-sgRx9igrgMUZuH_VU8WQICfR7ujS-D_tdI_S34il-Vqbg1neHxcm64VpaA22DE33IfA9-ec2W6OpVaDSTFiPH-ClEXk4F_-gm4Ak7o7PhxofZgQIMWy43WjmQae',
    badgeLabel: '100 Coils/Pack',
    description: 'Black plastic spiral binding coils laid neatly next to university dissertation book covers with matte protective sheets on dark wooden workbench.',
    specDetails: '14mm pitch accommodates up to 110 sheets of 75 GSM paper. Flexible and unbreakable PVC plastic construction.',
    popularInHome: false,
  },
  {
    id: 'prod-20',
    sku: 'FIN-LAM-120M',
    name: 'Thermal Lamination Pouch 125 Micron A4',
    brand: 'Desmat',
    category: 'Finishing Media',
    price: 460,
    unit: 'pack',
    stockStatus: 'Out of Stock',
    stockCount: 0,
    isPublic: false,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBEN7UbUx5JvRVX8l3NhyApfQULcR11QCM_1_6VYsmMhD9S8sQyUPx8StTiE8x0QWxMbdITqx9SaTU2CqtiuoflnjklRYClLOv1aGPXruSeUfWMiuEtTM4lq9PAV4LElJkOTXJxsL9v0Gx5lRAAeBUdwE8OMWWPeOlh3Gok9VcZZf1tBhAsThJ8EFMsIkRBF8W8H22rVAOcBWBJvCmtZDJnbKGdlTTNA0AvoWCivZQB1QeMRYp9Z0Ce',
    badgeLabel: '100 Pouches • 125 Mic',
    description: 'Heavy roll of glossy thermal lamination film reflecting light cleanly, mounted ready beside heated dual-roller lamination machine.',
    specDetails: 'Heavyweight rigid encapsulation film offering exceptional protection against moisture, chemicals, and UV fading.',
    popularInHome: false,
  },
];

export const INITIAL_RATE_CARDS: PrintingRateCard[] = [
  {
    id: 'rate-1',
    serviceId: 'PRN-BW-01',
    title: 'Black & White Xerox / Photocopying',
    category: 'xerox',
    description: 'Single side & double side automated high-speed copying. High contrast, sharp text reproduction on premium 75 GSM paper with automated sorters for multi-page collated jobs.',
    rate: 1.5,
    rateUnit: '/ page',
    turnaround: 'Instant Walk-In (90 PPM)',
    formatsSupported: 'Hardcopy, PDF, DOCX, Images',
    paperStock: '70 GSM – 100 GSM Bond',
    badges: ['Legal Size', 'Standard A4', 'A3 Large Copy', 'Book Mode Spread'],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDX95o-P6GehNNSNxYhkamwnZQzwIwL7I2S941VRn_MybVWkQHok9SUPSBgGa4FcnD-KtlhYD6S2BUM6sU6-mbkvoSLgcWDN9whqtWTYIb2XMCqSetzcg--lxOJsVrf-ORXyHIvNlAsw8ZHww1zZFB7MX7yjwMniUOUe-MNGK1j3KQPt8_8uQpBbF9jAHCTLUgE9MaLGObVyTPe8t7DzNlaPtUugqaGQPp8LaalzwyPzBf5GmQqh8XH',
    volumeNote: 'Volume discounts applied for university/court bulk reams',
  },
  {
    id: 'rate-2',
    serviceId: 'PRN-CLR-02',
    title: 'High-Resolution Colour Printing',
    category: 'color',
    description: 'Laser vibrant color prints on standard 80 GSM to 300 GSM cardstock. Perfect for college project reports, corporate presentations, pamphlets, certificates, and portfolio binders.',
    rate: 10.0,
    rateUnit: '/ page',
    turnaround: 'Same Hour (Walk-In)',
    formatsSupported: 'PDF, DOCX, PPTX, TIFF, JPG',
    paperStock: '80 GSM – 300 GSM Board',
    badges: ['Full Bleed Borderless', 'Glossy & Matte Finishes', 'Executive Reports', 'Certificates'],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAI9IfU4deosWYwp6XUehvL5XoCk2mjz1IVhvD7B0R6sogsg2em5FMAtPFGsmXjgSGo8xe4BmmngTbXMvGxZbYLN0lW1_Ude_aqbGgM4SFWK3WEk40xrtAKefmSOq8ZDnEjoKpLtAId3DfBZQERNU_e9uIkb0Ch-B27WQGSjDTchCoZOZQhy2TYzGw8hmIBnIluXjK4BY4jQNEHpCs4nWWRgT11nyxjQWmClsGjgZJSMMDpW77670t6',
    volumeNote: 'Rich toner fusing with high smudge resistance',
  },
  {
    id: 'rate-3',
    serviceId: 'FIN-LAM-03',
    title: 'Document Thermal Lamination',
    category: 'finishing',
    description: 'Military-grade thermal hot pouch lamination (80 to 250 microns). Water-resistant, tear-proof archival protection for A4, A3 documents, student IDs, Driving Licenses, and Degree certificates.',
    rate: 20.0,
    rateUnit: '/ sheet',
    turnaround: 'While You Wait (2 mins)',
    formatsSupported: 'Card size up to A3',
    paperStock: '80 to 250 Micron Film',
    badges: ['Water Resistant', 'Marksheet Grade', 'ID Pocket Format', 'Tear Proof'],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC3r6M5z-pux7n4RSaksAoxkmZrMzW4OuUwxdwPkpj2CNXDJhYmwXHB1wRd8JZ-NxBAoiQzcTGBJn_cdYA-ntf9_PYqcbi9z9-1CgDboZ8dx35M8O5OfjJElsvWG6K_XsO3frGySPQJ0o8OpAa3-5Tp6ejXHHputwbh80A6tkLlUtnxHJTr-SZNNwJe4VuMPior8XyIzoYpxD8A-OH2wGquh5raZhuu56DBX-zqa93Y1lGtGi_wDVZB',
    volumeNote: 'Immediate walk-in processing within 2 minutes',
  },
  {
    id: 'rate-4',
    serviceId: 'BND-SPL-04',
    title: 'Spiral & Wire Binding',
    category: 'finishing',
    description: 'Durable PVC plastic spiral coils and premium double-loop wire-o binding. Includes crystal clear transparent protective front sheet plus textured dark leatherette backing cover.',
    rate: 35.0,
    rateUnit: '/ book',
    turnaround: '10 - 15 Mins',
    formatsSupported: 'Standard A4 / Legal',
    paperStock: 'Up to 300 Sheet Depth',
    badges: ['Clear Front Poly', 'Leatherette Back', 'Double Loop Wire', 'Flat Opening'],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCYodLnkwyU93ZCF7uuTFgMsplxJm3YXiuI5CM8S-apjKyDI4dmTUl2_6ny50PDEfMrnHLzNw88mXElQSoznRQ4gVNTQAJ7UY3GZtPSekhAf1x5N_SQrr7IUZHK3egRSE0VHzhMMqtzr-nrLUrcle63Zg7PgHZ6lZXQtgDHKT-dLOzLFupg7crdQOc-YwHAo7gv5jyRC0G-p08dq92Ue1sQrhAgjYLDNMI3IxfKUxZ0EEi-7qeUu2Dz',
    volumeNote: 'Standard volume rate up to 150 leaves',
  },
  {
    id: 'rate-5',
    serviceId: 'PRN-PHT-05',
    title: 'Studio Quality Photo Printing',
    category: 'color',
    description: 'High-gloss Kodak/Fujifilm photo paper, vivid dye ink, and fade-resistant optical density. Immediate sets for international visas, job portals, passport photos, and gallery prints.',
    rate: 30.0,
    rateUnit: '/ set',
    turnaround: '5 Mins Instant',
    formatsSupported: 'Passport, 4x6, 5x7, A4',
    paperStock: '240 GSM Kodak RC Paper',
    badges: ['Passport (8/16/32 pcs)', '4x6 & 5x7 Inches', 'A4 Full Sheet', 'White Background Specs'],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCu4tCQmQVWZHYo33f537kc9L56gDIjHk1TIFCrp9ipfQFYMVaodRXr_fwOJzLMLFF4vOZ-FQsJLVzaf0cuaHYAzsg1QupAD57IVqwAvs4iegPX8fXCv4fhujg7ToE7CQWcd3cfG8cB1pwmISeiH-WYfLLkf5VUUZigkqHtPuCyj2UWnEKzETQAW9ZMZvXyNND9QEifR-Wv4YqClP5ynkYLyjTgxuQnBT9FmI8TuBOB7XnI7aBu7X6s',
    volumeNote: 'Immediate computer crop and background cleaning',
  },
  {
    id: 'rate-6',
    serviceId: 'BND-THS-06',
    title: 'Thesis, Project & Hardbound Book Binding',
    category: 'thesis',
    description: 'Golden embossing on premium black, navy, or maroon hard cover for university degree submissions (GTU, Gujarat University, Nirma, PDPU). Section sewn with cloth backing.',
    rate: 250.0,
    rateUnit: '/ book',
    rateDisplay: 'Inquire at Shop',
    turnaround: 'Express Same-Day / 24h',
    formatsSupported: 'Standard University A4',
    paperStock: '90 - 100 GSM Bond Core',
    badges: ['Golden Embossed Spine', 'Black / Maroon Leatherette', 'Ribbon Bookmark', 'Archival Grade'],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC2gM1WjLehQNSnZ7s3tSiROf-B7ua9_69fO-PljS_L1gYC2-Usc02wMPcqVsRlU4NqyQCODGZkg3Kw8j3nqrh5rRo23VBkgbWeL3qfpkXY-jpZc6PG-_Lz3JZ_Wt4MgOGtawyYIoBnznB8qm7N2h6rhuguNIgAozzVc5yjwNlFKoUc9XJW2gT87b-1kao-1G8VvyVqEJj2shK95GD06NPKiYi4VKpC67u7ZfIF-ZmiMxy8VUorBgMp',
    volumeNote: 'Fast express turnarounds during academic submission weeks',
    isCustomQuote: true,
  },
];

export const EQUIPMENT_SPECS: EquipmentSpec[] = [
  {
    service: 'B&W Automated Xerox',
    paperWeights: '70 GSM – 100 GSM Bond',
    maxDimensions: 'Up to A3 (297 x 420 mm)',
    turnaround: 'Immediate / 90 PPM',
    publishedRate: 'From ₹1.50 / page',
    icon: 'filter_none',
  },
  {
    service: 'Digital Colour Laser',
    paperWeights: '80 GSM – 300 GSM Board',
    maxDimensions: '12 x 18 inches / SRA3',
    turnaround: 'Same Hour',
    publishedRate: 'From ₹10.00 / page',
    icon: 'palette',
  },
  {
    service: 'Thermal Heat Lamination',
    paperWeights: '80 to 250 Micron Film',
    maxDimensions: 'Up to A3 Large Sheet',
    turnaround: 'While You Wait',
    publishedRate: 'From ₹20.00 / sheet',
    icon: 'layers',
  },
  {
    service: 'Plastic Spiral & Wiro',
    paperWeights: 'Up to 300 Sheet Depth',
    maxDimensions: 'Standard A4 / Legal',
    turnaround: '10 - 15 Mins',
    publishedRate: 'From ₹35.00 / book',
    icon: 'menu_book',
  },
  {
    service: 'Studio Gloss Photo Prints',
    paperWeights: '240 GSM Kodak RC Paper',
    maxDimensions: 'Passport to A4 Photo',
    turnaround: '5 Mins Instant',
    publishedRate: 'From ₹30.00 / set',
    icon: 'photo_camera',
  },
  {
    service: 'Thesis Hard Cover Emboss',
    paperWeights: '90 - 100 GSM Bond Core',
    maxDimensions: 'Standard University A4',
    turnaround: 'Express Same-Day / 24h',
    publishedRate: 'Custom Quotation',
    icon: 'workspace_premium',
  },
];

export const INITIAL_INQUIRIES: CustomerInquiry[] = [
  {
    id: 'inq-1',
    receivedTime: 'Today, 2:15 PM',
    clientName: 'Nirav Mehta',
    clientContact: '+91 98250 44120',
    itemOrService: 'CAD Plotter Bond Roll 36"',
    skuOrCode: 'DRF-HP-80R36',
    volume: '6 Rolls (Architectural Studio)',
    status: 'PENDING REPLY',
    notes: 'Urgent site delivery quotation for Shahibaug metro design office.',
  },
  {
    id: 'inq-2',
    receivedTime: 'Today, 11:30 AM',
    clientName: 'V.G.E.C. Student Guild',
    clientContact: '+91 94281 98112',
    itemOrService: 'Thesis Hard Binding (Maroon/Gold)',
    skuOrCode: 'BND-THS-06',
    volume: '14 Thesis Copies (Final Year Project)',
    status: 'PENDING REPLY',
    notes: 'Mechanical department submission batch, gold foil GTU formatting.',
  },
  {
    id: 'inq-3',
    receivedTime: 'Yesterday, 5:45 PM',
    clientName: 'Patel Chartered Accountants',
    clientContact: '+91 79 2755 8900',
    itemOrService: 'JK Copier Paper 75 GSM A4 Ream',
    skuOrCode: 'PAP-JK-75A4',
    volume: '20 Reams (Quarterly Office Stock)',
    status: 'ADDRESSED',
    notes: 'Invoiced under GST, counter pickup completed.',
  },
];
