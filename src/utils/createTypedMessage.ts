import { MessageTypeProperty } from '@metamask/eth-sig-util';
import DelegatableTypes from '../DelegatableTypes';

export function createTypedMessage(
  verifyingContract: string,
  message: Record<string, unknown> | MessageTypeProperty[],
  primaryType: string,
  contractName: string,
  chainId: number
): any {
  return {
    data: {
      types: DelegatableTypes,
      primaryType,
      domain: {
        name: contractName,
        version: '1',
        chainId,
        verifyingContract,
      },
      message,
    },
  };
}
