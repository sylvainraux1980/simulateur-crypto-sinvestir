import { NextResponse } from 'next/server';

const CRYPTOS = [
  { id: 'BTCEUR', symbol: 'btc', name: 'Bitcoin' },
  { id: 'ETHEUR', symbol: 'eth', name: 'Ethereum' },
  { id: 'BNBEUR', symbol: 'bnb', name: 'BNB' },
  { id: 'SOLEUR', symbol: 'sol', name: 'Solana' },
  { id: 'XRPEUR', symbol: 'xrp', name: 'XRP' },
  { id: 'ADAEUR', symbol: 'ada', name: 'Cardano' },
  { id: 'DOGEEUR', symbol: 'doge', name: 'Dogecoin' },
  { id: 'AVAXEUR', symbol: 'avax', name: 'Avalanche' },
  { id: 'DOTEUR', symbol: 'dot', name: 'Polkadot' },
  { id: 'LTCEUR', symbol: 'ltc', name: 'Litecoin' },
  { id: 'LINKEUR', symbol: 'link', name: 'Chainlink' },
  { id: 'MATICEUR', symbol: 'matic', name: 'Polygon' },
  { id: 'ATOMEUR', symbol: 'atom', name: 'Cosmos' },
  { id: 'UNIEUR', symbol: 'uni', name: 'Uniswap' },
  { id: 'XLMEUR', symbol: 'xlm', name: 'Stellar' },
];

export const revalidate = false;

export async function GET() {
  return NextResponse.json(CRYPTOS);
}
