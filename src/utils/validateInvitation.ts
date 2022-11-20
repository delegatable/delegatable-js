import { recoverDelegationSigner } from '../recover';
import { createSignedDelegationHash } from './createDelegationHash';

export function validateInvitation({ contractInfo, invitation }: any) {
  const { chainId, verifyingContract, name } = contractInfo;

  if (!invitation) {
    throw new Error('Invitation is required');
  }

  const { signedDelegations, key } = invitation;

  if (signedDelegations.length === 0 && key && typeof key === 'string') {
    // we have to assume this is a root invitation, and cannot really validate it without trying things on chain.
    return true;
  }

  // Trying to follow the code from Delegatable.sol as closely as possible here
  // To ensure readable correctness.
  let intendedSender = recoverDelegationSigner(signedDelegations[0], {
    chainId,
    verifyingContract,
    name,
  }).toLowerCase();
  let canGrant = intendedSender.toLowerCase();
  let authHash;

  for (let d = 0; d < signedDelegations.length; d++) {
    const signedDelegation = signedDelegations[d];
    const delegationSigner = recoverDelegationSigner(signedDelegation, {
      chainId,
      verifyingContract,
      name,
    }).toLowerCase();

    if (d === 0) {
      intendedSender = delegationSigner;
      canGrant = intendedSender.toLowerCase();
    }

    const delegation = signedDelegation.delegation;
    if (delegationSigner !== canGrant) {
      throw new Error(
        `Delegation signer ${delegationSigner} of delegation ${d} does not match required signer ${canGrant}`
      );
    }

    const delegationHash = createSignedDelegationHash(signedDelegation);
    authHash = delegationHash;
    canGrant = delegation.delegate.toLowerCase();
  }

  // TODO: Also verify the final canGrant equals the key address.
  // Not adding yet b/c I want it well tested when I add it.

  return !!invitation;
}
