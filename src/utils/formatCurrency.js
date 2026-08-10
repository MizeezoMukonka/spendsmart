export const CURRENCIES = [
  { code: 'ZMW', symbol: 'K',  name: 'Zambian Kwacha' },
  { code: 'USD', symbol: '$',  name: 'US Dollar' },
  { code: 'GBP', symbol: '£',  name: 'British Pound' },
  { code: 'EUR', symbol: '€',  name: 'Euro' },
  { code: 'ZAR', symbol: 'R',  name: 'South African Rand' },
  { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling' },
  { code: 'NGN', symbol: '₦',  name: 'Nigerian Naira' },
  { code: 'GHS', symbol: 'GH₵', name: 'Ghanaian Cedi' },
  { code: 'TZS', symbol: 'TSh', name: 'Tanzanian Shilling' },
  { code: 'UGX', symbol: 'USh', name: 'Ugandan Shilling' },
  { code: 'MWK', symbol: 'MK',  name: 'Malawian Kwacha' },
  { code: 'BWP', symbol: 'P',  name: 'Botswana Pula' },
  { code: 'MZN', symbol: 'MT', name: 'Mozambican Metical' },
  { code: 'RWF', symbol: 'FRw', name: 'Rwandan Franc' },
  {code: 'ZWL', symbol: 'ZWL$', name: 'Zimbabwean Dollar' },
];

export const getCurrencySymbol = (code = 'ZMW') => {
  const found = CURRENCIES.find(c => c.code === code);
  return found ? found.symbol : 'K';
};

export const formatCurrency = (amount, currencyCode = 'ZMW') => {
  const symbol = getCurrencySymbol(currencyCode);
  return `${symbol} ${Number(amount).toLocaleString('en-ZM', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-ZM', { day: 'numeric', month: 'short', year: 'numeric' });
};