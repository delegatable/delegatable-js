import {
  recoverTypedSignature,
  SignTypedDataVersion,
} from '@metamask/eth-sig-util';
import { createTypedMessage } from '../utils/createTypedMessage';

export function recoverDelegationSigner(
  signedDelegation: SignedDelegation,
  contractInfo: ContractInfo
) {
  const { chainId, verifyingContract, name } = contractInfo;
  const typedMessage = createTypedMessage(
    verifyingContract,
    signedDelegation.delegation,
    'Delegation',
    name,
    chainId
  );

  const signer = recoverTypedSignature({
    data: typedMessage.data,
    signature: signedDelegation.signature,
    version: SignTypedDataVersion.V4,
  });

  return signer;
}
