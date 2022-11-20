import { createMembership } from '../src/createMembership';

const PRIV_KEY =
  'acc9d5cfcfa55e0e333e7eeed12ef4157627ec7de87ab7944ed97fcd481d8b51';

describe('createMembership', () => {
  const contractInfo = {
    chainId: 1337,
    verifyingContract: '0x0000000000000000000000000000000000000000',
    name: 'BlackHole',
  };

  it('should SUCCEED to CREATE a new Membership object', () => {
    const membership = createMembership({ key: PRIV_KEY, contractInfo });
    expect(membership).toBeDefined();
  });

  it('should SUCCEED to CREATE a new Invitation from Member', () => {
    const membership = createMembership({ key: PRIV_KEY, contractInfo });
    const invitation = membership.createInvitation();
    expect(invitation.signedDelegations).toHaveLength(1);
  });
});
