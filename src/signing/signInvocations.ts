import { signTypedData, SignTypedDataVersion } from '@metamask/eth-sig-util';
import { createTypedMessage } from '../utils/createTypedMessage';
import { fromHexString } from '../utils/fromHexString';

import typedArrayToBuffer from 'typedarray-to-buffer';

export function signInvocations({
  invocations,
  privateKey,
  contractInfo,
}: {
  invocations: Invocations;
  privateKey: string;
  contractInfo: ContractInfo;
}): SignedInvocation {
  const { chainId, verifyingContract, name } = contractInfo;
  const typedMessage = createTypedMessage(
    verifyingContract,
    invocations,
    'Invocations',
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
    invocations: invocations,
  };

  return signedInvocations;
}
