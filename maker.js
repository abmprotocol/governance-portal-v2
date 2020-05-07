import Maker from '@makerdao/dai';
import McdPlugin from '@makerdao/dai-plugin-mcd';
import GovernancePlugin from '@makerdao/dai-plugin-governance';

export const ETH = Maker.ETH;
export const USD = Maker.USD;

function networkToRpc(network) {
  switch (network) {
    case 'mainnet':
      return `https://mainnet.infura.io/v3/${process.env.INFURA_KEY}`;
    case 'kovan':
      return `https://kovan.infura.io/v3/${process.env.INFURA_KEY}`;
  }
}

let network = 'mainnet';
let _maker = Maker.create('http', {
  plugins: [
    [McdPlugin, { prefetch: false }],
    [GovernancePlugin, { network }],
  ],
  provider: {
    url: networkToRpc(network),
    type: 'HTTP',
  },
  web3: {
    pollingInterval: network === 'testnet' ? 100 : null,
  },
  log: false,
  multicall: true,
});

if (typeof window !== 'undefined' && window.location.search.includes('kovan')) {
  _maker = Maker.create('http', {
    plugins: [[McdPlugin, { prefetch: false }]],
    provider: {
      url: networkToRpc('kovan'),
      type: 'HTTP',
    },
    web3: {
      pollingInterval: network === 'testnet' ? 100 : null,
    },
    log: false,
    multicall: true,
  });
}
export default _maker;

export async function instantiateMaker(network) {
  const rpcUrl = networkToRpc(network);
  const maker = await Maker.create('http', {
    provider: {
      url: rpcUrl,
      type: 'HTTP',
    },
    web3: {
      pollingInterval: network === 'testnet' ? 100 : null,
    },
    multicall: true,
  });
  window.maker = maker; // for debugging
  return maker;
}
