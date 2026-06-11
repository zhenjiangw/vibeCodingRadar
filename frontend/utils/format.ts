/**
 * 数字格式化：>= 10000 显示为 'Nk'（取整），>= 1000 显示为 'N.Nk'（一位小数），其他原样。
 * 例：172000 -> '172k'，1280 -> '1.3k'，185 -> '185'
 */
export const formatNumber = (num: number): string => {
  if (num >= 10000) return (num / 1000).toFixed(0) + 'k';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
  return num.toString();
};
