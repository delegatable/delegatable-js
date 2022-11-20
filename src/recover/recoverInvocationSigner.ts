import {
  MessageTypes,
  recoverTypedSignature,
  SignTypedDataVersion,
  TypedMessage,
} from '@metamask/eth-sig-util';
import { createTypedMessage } from '../utils/createTypedMessage';

export function recoverInvocationSigner({
  signedInvocation,
  contractInfo,
}: {
  signedInvocation: SignedInvocation;
  contractInfo: ContractInfo;
}) {
  const { chainId, verifyingContract, name } = contractInfo;
  const typedMessage = createTypedMessage(
    verifyingContract,
    signedInvocation.invocations,
    'Invocations',
    name,
    chainId
  );

  const signer = recoverTypedSignature({
    data: typedMessage.data as unknown as TypedMessage<MessageTypes>, // TODO: Better typing
    signature: signedInvocation.signature,
    version: SignTypedDataVersion.V4,
  });
  return signer;
}
