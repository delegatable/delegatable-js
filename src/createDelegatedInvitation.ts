export function createDelegatedInvitation({
  contractInfo,
  recipientAddress,
  invitation,
  delegation,
  key,
}: any): Invitation {
  const { verifyingContract } = contractInfo;
  const { signedDelegations } = invitation;
  const delegatorKey = key || invitation.key;

  const signedDelegation = signedDelegations[signedDelegations.length - 1];
  const delegationHash = exports.createSignedDelegationHash(signedDelegation);
  const hexHash = '0x' + delegationHash.toString('hex');

  if (delegation && delegation.delegate) {
    recipientAddress = delegation.delegate;
  }

  let delegate: Account;
  if (!recipientAddress) {
    delegate = exports.generateAccount();
  } else {
    delegate = {
      address: recipientAddress || delegation.delegate,
    };
  }

  if (!delegation) {
    delegation = {
      delegate: delegate.address,
      authority: hexHash,

      // defer to parent contract as caveat by default:
      caveats: [
        {
          enforcer: verifyingContract,
          terms:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
        },
      ],
    };
  }

  if (!delegation.authority) {
    delegation.authority = hexHash;
  }

  const newSignedDelegation = exports.signDelegation({
    key: delegatorKey,
    contractInfo,
    delegation,
  });

  const newInvite: Invitation = {
    signedDelegations: [...signedDelegations, newSignedDelegation],
    key: delegate?.key || undefined,
  };

  return newInvite;
}
