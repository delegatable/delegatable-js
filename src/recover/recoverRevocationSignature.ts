import {
  recoverTypedSignature,
  SignTypedDataVersion,
} from '@metamask/eth-sig-util';
import { createTypedMessage } from '../utils/createTypedMessage';

// TODO(@kames): Write tests for this function. Not sure it works.
export function recoverRevocationSignature(
  signedRevocation: SignedIntentionToRevoke,
  contractInfo: ContractInfo
) {
  const { chainId, verifyingContract, name } = contractInfo;
  const typedMessage = createTypedMessage(
    verifyingContract,
    signedRevocation.intentionToRevoke,
    'IntentionToRevoke',
    name,
    chainId
  );

  const signer = recoverTypedSignature({
    data: typedMessage.data,
    signature: signedRevocation.signature,
    version: SignTypedDataVersion.V4,
  });
  return signer;
}
