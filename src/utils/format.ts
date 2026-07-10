export function formatNumber(n: number): string {
  if (n >= 100000000) return (n / 100000000).toFixed(1) + '亿';
  if (n >= 10000) return (n / 10000).toFixed(1) + '万';
  return n.toLocaleString('zh-CN');
}

export function formatCurrency(n: number): string {
  if (n >= 100000000) return '¥' + (n / 100000000).toFixed(2) + '亿';
  if (n >= 10000) return '¥' + (n / 10000).toFixed(1) + '万';
  return '¥' + n.toLocaleString('zh-CN');
}

export function formatPercent(n: number, decimals: number = 1): string {
  return (n * 100).toFixed(decimals) + '%';
}

export function formatChange(n: number): string {
  const sign = n >= 0 ? '+' : '';
  return sign + n.toFixed(1) + '%';
}
