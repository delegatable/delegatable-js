import { signTypedData, SignTypedDataVersion } from '@metamask/eth-sig-util';
import { createTypedMessage } from './utils/createTypedMessage';

export function createInvitation(opts: {
  privateKey: string;
  contractInfo: ContractInfo;
  recipientAddress: string;
}) {
  const { contractInfo, privateKey, recipientAddress } = opts;
  const { chainId, verifyingContract, name } = contractInfo;

  if (recipientAddress) {
    return exports.createDelegatedInvitation(opts);
  }

  let delegate: Account = exports.generateAccount();

  // Prepare the delegation message.
  // This contract is also a revocation enforcer, so it can be used for caveats:
  const delegation = {
    delegate: exports.toHexString(delegate.address),
    authority:
      '0x0000000000000000000000000000000000000000000000000000000000000000',
    caveats: [
      {
        enforcer: verifyingContract,
        terms:
          '0x0000000000000000000000000000000000000000000000000000000000000000',
      },
    ],
  };

  const typedMessage = createTypedMessage(
    verifyingContract,
    delegation,
    'Delegation',
    name,
    chainId
  );
  const signature = signTypedData({
    privateKey: exports.fromHexString(
      privateKey.indexOf('0x') === 0 ? privateKey.substring(2) : privateKey
    ),
    data: typedMessage.data,
    version: SignTypedDataVersion.V4,
  });
  const signedDelegation = {
    signature,
    delegation,
  };
  const invitation = {
    signedDelegations: [signedDelegation],
    key: delegate.key,
  };
  return invitation;
}
