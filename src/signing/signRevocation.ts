import { signTypedData, SignTypedDataVersion } from '@metamask/eth-sig-util';
import typedArrayToBuffer from 'typedarray-to-buffer';
import { createTypedMessage } from '../utils/createTypedMessage';
import { fromHexString } from '../utils/fromHexString';

export function signRevocation({
  revocation,
  privateKey,
  contractInfo,
}: {
  revocation: IntentionToRevoke;
  privateKey: string;
  contractInfo: ContractInfo;
}): SignedIntentionToRevoke {
  const { chainId, verifyingContract, name } = contractInfo;
  const typedMessage = createTypedMessage(
    verifyingContract,
    revocation,
    'IntentionToRevoke',
    name,
    chainId
  );

  const signature = signTypedData({
    privateKey: typedArrayToBuffer(
      fromHexString(
        privateKey.indexOf('0x') === 0 ? privateKey.substring(2) : privateKey
      )
    ),
    data: typedMessage.data,
    version: SignTypedDataVersion.V4,
  });

  const signedInvocations = {
    signature,
    intentionToRevoke: revocation,
  };

  return signedInvocations;
}
