import { signTypedData, SignTypedDataVersion } from '@metamask/eth-sig-util';
import typedArrayToBuffer from 'typedarray-to-buffer';
import { createTypedMessage } from '../utils/createTypedMessage';
import { fromHexString } from '../utils/fromHexString';

export function signDelegation({
  delegation,
  privateKey,
  contractInfo,
}: {
  delegation: Delegation;
  privateKey: string;
  contractInfo: ContractInfo;
}): SignedDelegation {
  const { chainId, verifyingContract, name } = contractInfo;
  const typedMessage = createTypedMessage(
    verifyingContract,
    delegation,
    'Delegation',
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
    delegation: delegation,
  };

  return signedInvocations;
}
