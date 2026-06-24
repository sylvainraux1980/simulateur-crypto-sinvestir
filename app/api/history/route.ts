import { NextResponse } from 'next/server';

const LIMIT = 1000;
const MS_PER_DAY = 86_400_000;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol');
  const from = searchParams.get('from');
  const to = searchParams.get('to');

  if (!symbol || !from || !to) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  const fromMs = parseInt(from, 10);
  const toMs = parseInt(to, 10);

  try {
    const allPrices: [number, number][] = [];
    let cursor = fromMs;

    while (cursor <= toMs) {
      const res = await fetch(
        `https://api.binance.com/api/v3/klines?symbol=${encodeURIComponent(symbol)}&interval=1d&startTime=${cursor}&endTime=${toMs}&limit=${LIMIT}`,
        {
          headers: { Accept: 'application/json' },
          next: { revalidate: 3600 },
        }
      );

      if (!res.ok) {
        if (res.status === 429) {
          return NextResponse.json(
            { error: 'Limite de requêtes Binance atteinte. Réessayez dans quelques secondes.' },
            { status: 429 }
          );
        }
        const body = await res.json().catch(() => ({}));
        return NextResponse.json(
          { error: body.msg ?? `Binance error: ${res.status}` },
          { status: res.status }
        );
      }

      const data: unknown[][] = await res.json();
      if (data.length === 0) break;

      for (const kline of data) {
        allPrices.push([kline[0] as number, parseFloat(kline[4] as string)]);
      }

      if (data.length < LIMIT) break;

      // Advance cursor past the last returned candle's open time
      cursor = (data[data.length - 1][0] as number) + MS_PER_DAY;
    }

    return NextResponse.json({ prices: allPrices });
  } catch {
    return NextResponse.json({ error: 'Network error' }, { status: 500 });
  }
}
