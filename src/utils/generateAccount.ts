import { Wallet } from 'ethers';

export function generateAccount(): Account {
  const wallet = Wallet.createRandom();
  const address = wallet.address;
  const key = wallet.privateKey;
  const account = {
    address,
    key: key,
  };
  return account;
}
