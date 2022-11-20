import { TypedDataUtils, SignTypedDataVersion } from '@metamask/eth-sig-util';
import DelegatableTypes from './DelegatableTypes';

export function createMembership(opts: MembershipOpts): Membership {
  let invitation: any, key: string | undefined, contractInfo: any;

  if ('invitation' in opts) {
    invitation = opts.invitation;
  }

  if ('key' in opts) {
    key = opts.key;
  }

  if ('contractInfo' in opts) {
    contractInfo = opts.contractInfo;
  }

  if (!invitation && !key) {
    throw new Error(
      'Either an invitation or a key is required to initialize membership.'
    );
  }

  if (!key && invitation) {
    key = invitation.key;

    if (!contractInfo && invitation.contractInfo) {
      contractInfo = invitation.contractInfo;
    }
  }

  if (invitation) {
    exports.validateInvitation({ invitation, contractInfo });
  }

  if (!contractInfo || !contractInfo.verifyingContract) {
    throw new Error('Contract info must be provided to initialize membership.');
  }

  return {
    createInvitation({ recipientAddress, delegation } = {}): Invitation {
      if (!invitation) {
        return exports.createFirstDelegatedInvitation({
          contractInfo,
          recipientAddress,
          delegation,
          key,
        });
      }

      // Having an invitation means there may be signedDelegations to chain from:
      if (invitation?.signedDelegations?.length === 0) {
        const newInvitation = exports.createFirstDelegatedInvitation({
          contractInfo,
          recipientAddress,
          delegation,
          key,
        });
        exports.validateInvitation({ invitation: newInvitation, contractInfo });
        return newInvitation;
      } else {
        const newInvitation = exports.createDelegatedInvitation({
          contractInfo,
          invitation,
          delegation,
          key,
        });
        exports.validateInvitation({ invitation: newInvitation, contractInfo });
        return newInvitation;
      }
    },

    createMembershipFromDelegation(delegation: Partial<Delegation>) {
      if (invitation) {
        if (invitation) {
          const { signedDelegations } = invitation;
          const lastSignedDelegation =
            signedDelegations[signedDelegations.length - 1];
          const delegationHash =
            exports.createSignedDelegationHash(lastSignedDelegation);
          const hexHash = '0x' + delegationHash.toString('hex');
          delegation.authority = hexHash;
        } else {
          delegation.authority =
            '0x0000000000000000000000000000000000000000000000000000000000000000';
        }

        const newInvitation = exports.createDelegatedInvitation({
          contractInfo,
          recipientAddress: delegation.delegate,
          invitation,
          delegation,
        });

        if (!newInvitation.key) {
          // We can allow instantiating with a local delegate key later,
          // but for now it seems like a less common use case so I'm not prioritizing it.
          throw new Error(
            'Cannot create a membership object without a signing key.'
          );
        }
        return exports.createMembership({
          invitation: newInvitation,
          contractInfo,
        });
      }

      delegation.authority =
        '0x0000000000000000000000000000000000000000000000000000000000000000';
      const firstInvitation = exports.createFirstDelegatedInvitation({
        contractInfo,
        recipientAddress: delegation.delegate,
        delegation,
        key,
      });

      return exports.createMembership({
        invitation: firstInvitation,
        contractInfo,
      });
    },

    signDelegation(delegation: Delegation) {
      if (invitation) {
        const { signedDelegations } = invitation;
        const lastSignedDelegation =
          signedDelegations[signedDelegations.length - 1];
        const delegationHash =
          exports.createSignedDelegationHash(lastSignedDelegation);
        const hexHash = '0x' + delegationHash.toString('hex');
        delegation.authority = hexHash;
      } else {
        delegation.authority =
          '0x0000000000000000000000000000000000000000000000000000000000000000';
      }

      // function signDelegation ({ delegation, key, contractInfo }):
      return exports.signDelegation({ contractInfo, delegation, key });
    },

    signInvocations(invocations: Invocations) {
      invocations.batch.forEach((invocation) => {
        if (
          invitation &&
          invitation.signedDelegations &&
          invitation.signedDelegations.length > 0
        ) {
          if (!('authority' in invocation)) {
            // @ts-ignore
            invocation.authority = invitation.signedDelegations;
          }
        } else {
          invocation.authority = [];
        }
      });
      return exports.signInvocations({
        invocations,
        privateKey: key,
        contractInfo,
      });
    },

    signRevocationMessage(invitation: Invitation): SignedIntentionToRevoke {
      const { signedDelegations } = invitation;
      const lastDelegation = signedDelegations[signedDelegations.length - 1];

      // Owner revokes outstanding delegation
      const intentionToRevoke = {
        delegationHash: TypedDataUtils.hashStruct(
          'SignedDelegation',
          lastDelegation,
          DelegatableTypes.types,
          SignTypedDataVersion.V4
        ),
      };
      return exports.signRevocation(intentionToRevoke, key);
    },
  };
}
