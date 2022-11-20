export function createFirstDelegatedInvitation({
  contractInfo,
  recipientAddress,
  key,
  delegation,
}: any): Invitation {
  const { verifyingContract } = contractInfo;

  let delegate: Account;
  if (!recipientAddress) {
    delegate = exports.generateAccount();
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

  const newSignedDelegation = exports.signDelegation({
    delegation,
    key,
    contractInfo,
  });
  const newInvite: Invitation = {
    signedDelegations: [newSignedDelegation],
    key: delegate?.key || undefined,
  };

  return newInvite;
}
