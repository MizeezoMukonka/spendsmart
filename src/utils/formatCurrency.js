export const formatCurrency = (amount) => {
  return `K ${Number(amount).toLocaleString('en-ZM', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-ZM', { day: 'numeric', month: 'short', year: 'numeric' });
};