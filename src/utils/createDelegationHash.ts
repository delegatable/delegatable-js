import { SignTypedDataVersion, TypedDataUtils } from '@metamask/eth-sig-util';
import DelegatableTypes from '../DelegatableTypes';

export function createDelegationHash(signedDelegation: any) {
  return TypedDataUtils.hashStruct(
    'SignedDelegation',
    signedDelegation,
    DelegatableTypes.types,
    SignTypedDataVersion.V4
  );
}
