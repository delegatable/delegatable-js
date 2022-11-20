import { generateAccount } from '../src/utils/generateAccount';

describe('generateAccount', () => {
  it('Generate Account using Random Generation', () => {
    expect(generateAccount().address).toBeTruthy();
  });
});
