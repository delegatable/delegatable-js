export const DelegatableTypes = {
  primaryType: 'Delegation',
  domain: {
    name: 'PhisherRegistery',
    version: '1',
    chainId: undefined,
    verifyingContract: undefined,
  },

  entries: {
    delegate: 'address',
    caveat: 'Caveat',
    authority: 'SignedDelegation',
  },

  types: {
    EIP712Domain: [
      { name: 'name', type: 'string' },
      { name: 'version', type: 'string' },
      { name: 'chainId', type: 'uint256' },
      { name: 'verifyingContract', type: 'address' },
    ],
    Invocation: [
      { name: 'transaction', type: 'Transaction' },
      { name: 'authority', type: 'SignedDelegation[]' },
    ],
    Invocations: [
      { name: 'batch', type: 'Invocation[]' },
      { name: 'replayProtection', type: 'ReplayProtection' },
    ],
    SignedInvocation: [
      { name: 'invocations', type: 'Invocations' },
      { name: 'signature', type: 'bytes' },
    ],
    Transaction: [
      { name: 'to', type: 'address' },
      { name: 'gasLimit', type: 'uint256' },
      { name: 'data', type: 'bytes' },
    ],
    ReplayProtection: [
      { name: 'nonce', type: 'uint' },
      { name: 'queue', type: 'uint' },
    ],
    Delegation: [
      { name: 'delegate', type: 'address' },
      { name: 'authority', type: 'bytes32' },
      { name: 'caveats', type: 'Caveat[]' },
    ],
    Caveat: [
      { name: 'enforcer', type: 'address' },
      { name: 'terms', type: 'bytes' },
    ],
    SignedDelegation: [
      { name: 'delegation', type: 'Delegation' },
      { name: 'signature', type: 'bytes' },
    ],
    IntentionToRevoke: [{ name: 'delegationHash', type: 'bytes32' }],
    SignedIntentionToRevoke: [
      { name: 'signature', type: 'bytes' },
      { name: 'intentionToRevoke', type: 'IntentionToRevoke' },
    ],
  },
};

export default DelegatableTypes;
