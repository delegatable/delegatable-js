
type SignedDelegation = {
    signature: string,
    delegation: SignedDelegation,
  }
  
  type Delegation = {
    delegate: string,
    authority: string,
    caveats: Array<Caveat>,
  }
  
  type Caveat = {
    enforcer: string,
    terms: string,
  }
  
  type Invitation = KeylessInvitation | KeyedInvitation;
  
  type KeylessInvitation = {
    signedDelegations: Array<SignedDelegation>,
    contractInfo?: ContractInfo,
  }
  
  type KeyedInvitation = KeylessInvitation &{
    key: string,
  }
  
  type InvokableTransaction = {
    to: string,
    gasLimit: string,
    data: string,
  }
  
  type Invocation = {
    transaction: InvokableTransaction,
    authority: SignedDelegation[],
  }
  
  type Invocations = {
    batch: Invocation[],
    replayProtection: ReplayProtection,
  }
  
  type SignedInvocation = {
    invocations: Invocations,
    signature: string,
  }
  
  type ReplayProtection = {
    nonce: string,
    queue: string,
  }
  
  type ContractInfo = {
    verifyingContract: string,
    name: string,
    chainId: number,
  }
  
  type OwnerMembershipOpts = {
    contractInfo: ContractInfo,
    key: string,
  }
  
  type KeyInviteMembershipOpts = {
    invitation: Invitation,
    key: string,
  }
  
  type KeylessInviteMembershipOpts = {
    invitation: Invitation,
  }
  
  type MembershipOpts = OwnerMembershipOpts | KeyInviteMembershipOpts | KeylessInviteMembershipOpts;
  
  type IntentionToRevoke = {
    delegationHash: string,
  };
  type SignedIntentionToRevoke = {
    signature: string,
    intentionToRevoke: IntentionToRevoke,
  }
  
  type Membership = {
    createInvitation (opts?: { recipientAddress?: string, delegation?: Delegation }): Invitation,
    createMembershipFromDelegation (delegation: Delegation): Membership,
    signDelegation (delegation: Delegation): SignedDelegation,
    signInvocations (invocations: Invocations): SignedInvocation,
    signRevocationMessage (invitation: Invitation): SignedIntentionToRevoke 
  }