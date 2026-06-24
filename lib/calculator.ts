import type { Frequency, ChartPoint, SimulationResult } from './types';

function toDateStr(date: Date): string {
  return date.toISOString().split('T')[0];
}

function buildPriceMap(prices: [number, number][]): Map<string, number> {
  const map = new Map<string, number>();
  for (const [ts, price] of prices) {
    const d = toDateStr(new Date(ts));
    if (!map.has(d)) map.set(d, price);
  }
  return map;
}

function findNearestPrice(
  dateStr: string,
  sorted: string[],
  priceMap: Map<string, number>
): number | null {
  if (priceMap.has(dateStr)) return priceMap.get(dateStr)!;
  for (const d of sorted) {
    if (d >= dateStr) return priceMap.get(d)!;
  }
  for (let i = sorted.length - 1; i >= 0; i--) {
    if (sorted[i] <= dateStr) return priceMap.get(sorted[i])!;
  }
  return null;
}

function generateInvestmentDates(
  start: Date,
  end: Date,
  frequency: Frequency
): string[] {
  const dates: string[] = [];
  const current = new Date(start);
  const endStr = toDateStr(end);

  while (true) {
    const dateStr = toDateStr(current);
    if (dateStr > endStr) break;
    dates.push(dateStr);
    if (frequency === 'one-shot') break;
    if (frequency === 'daily') current.setDate(current.getDate() + 1);
    else if (frequency === 'weekly') current.setDate(current.getDate() + 7);
    else if (frequency === 'monthly') current.setMonth(current.getMonth() + 1);
  }

  return dates;
}

// Downsample chart data to at most maxPoints without losing first/last
function sample<T>(arr: T[], maxPoints: number): T[] {
  if (arr.length <= maxPoints) return arr;
  const result: T[] = [arr[0]];
  const step = (arr.length - 2) / (maxPoints - 2);
  for (let i = 1; i < maxPoints - 1; i++) {
    result.push(arr[Math.round(i * step)]);
  }
  result.push(arr[arr.length - 1]);
  return result;
}

export function calculateDCA(
  prices: [number, number][],
  amount: number,
  frequency: Frequency,
  startDate: Date,
  endDate: Date
): SimulationResult {
  const priceMap = buildPriceMap(prices);
  const sorted = Array.from(priceMap.keys()).sort();
  const startStr = toDateStr(startDate);
  const endStr = toDateStr(endDate);

  // Resolve investments
  const investmentDates = generateInvestmentDates(startDate, endDate, frequency);
  const investments: Array<{ date: string; coins: number; amount: number }> = [];

  for (const dateStr of investmentDates) {
    const price = findNearestPrice(dateStr, sorted, priceMap);
    if (price !== null && price > 0) {
      investments.push({ date: dateStr, coins: amount / price, amount });
    }
  }

  const totalInvested = investments.reduce((s, i) => s + i.amount, 0);
  const totalCoins = investments.reduce((s, i) => s + i.coins, 0);

  // Final price: nearest to endDate
  const finalPrice = findNearestPrice(endStr, sorted, priceMap) ?? 0;
  const finalValue = totalCoins * finalPrice;
  const gainLoss = finalValue - totalInvested;
  const gainLossPercent = totalInvested > 0 ? (gainLoss / totalInvested) * 100 : 0;

  // Build portfolio value time-series
  let invIdx = 0;
  let runningCoins = 0;
  let runningInvested = 0;
  const rawChart: ChartPoint[] = [];

  for (const dateStr of sorted) {
    if (dateStr < startStr || dateStr > endStr) continue;

    while (invIdx < investments.length && investments[invIdx].date <= dateStr) {
      runningCoins += investments[invIdx].coins;
      runningInvested += investments[invIdx].amount;
      invIdx++;
    }

    if (runningCoins === 0 && runningInvested === 0) continue;

    const price = priceMap.get(dateStr)!;
    rawChart.push({
      date: dateStr,
      portfolioValue: Math.round(runningCoins * price * 100) / 100,
      totalInvested: Math.round(runningInvested * 100) / 100,
    });
  }

  return {
    totalInvested: Math.round(totalInvested * 100) / 100,
    finalValue: Math.round(finalValue * 100) / 100,
    gainLoss: Math.round(gainLoss * 100) / 100,
    gainLossPercent: Math.round(gainLossPercent * 100) / 100,
    chartData: sample(rawChart, 200),
    totalPurchases: investments.length,
    avgPrice: totalCoins > 0 ? Math.round((totalInvested / totalCoins) * 100) / 100 : 0,
    totalQuantity: Math.round(totalCoins * 1e8) / 1e8,
  };
}
