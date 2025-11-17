export const formatCurrency = (value) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(value);
