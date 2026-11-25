const categoryAliases: Record<string, string[]> = {
  'pens & pencils': ['pens'],
  pens: ['pens & pencils'],
  'notebooks & registers': ['notebooks'],
  notebooks: ['notebooks & registers'],
  'school & college essentials': ['school', 'school stationery'],
  school: ['school & college essentials'],
  'school stationery': ['school & college essentials'],
  'office stationery': ['office supplies'],
  'office supplies': ['office stationery'],
  'paper products': ['copier paper'],
  'copier paper': ['paper products'],
  'art & craft supplies': ['art & craft'],
  'art & craft': ['art & craft supplies'],
};

export function categoryMatches(productCategory: string, selectedCategory: string): boolean {
  const product = productCategory.toLowerCase();
  const selected = selectedCategory.toLowerCase();
  return product === selected || (categoryAliases[selected] || []).includes(product);
}
