const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2
});

const percentFormatter = new Intl.NumberFormat("en-US", {
  style: "percent",
  maximumFractionDigits: 2,
  signDisplay: "exceptZero"
});

const quantityFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 6
});

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short"
});

export function formatCurrency(value: number) {
  return currencyFormatter.format(value);
}

export function formatPercent(value: number) {
  return percentFormatter.format(value / 100);
}

export function formatQuantity(value: number) {
  return quantityFormatter.format(value);
}

export function formatDate(value: string) {
  return dateFormatter.format(new Date(value));
}

