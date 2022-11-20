import { signDelegation } from './signing';
import { generateAccount } from './utils';

export function createFirstDelegatedInvitation({
  contractInfo,
  recipientAddress,
  key,
  delegation,
}: any): Invitation {
  const { verifyingContract } = contractInfo;

  let delegate: Account;
  if (!recipientAddress) {
    delegate = generateAccount();
    recipientAddress = delegate.address;
  } else {
    delegate = {
      address: recipientAddress,
    };
  }

  if (!delegation) {
    delegation = {
      delegate: recipientAddress,
      authority:
        '0x0000000000000000000000000000000000000000000000000000000000000000',

      // defer to parent contract as caveat by default:
      caveats: [
        {
          enforcer: verifyingContract,
          terms:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
        },
      ],
    };
  } else {
    if (!delegation.authority) {
      delegation.authority =
        '0x0000000000000000000000000000000000000000000000000000000000000000';
    }
  }

  const newSignedDelegation = signDelegation({
    delegation,
    privateKey: key,
    contractInfo,
  });
  const newInvite: Invitation = {
    signedDelegations: [newSignedDelegation],
    key: delegate?.key || undefined,
  };

  return newInvite;
}
