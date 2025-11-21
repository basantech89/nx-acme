import { zoo } from './zoo.js';

describe('zoo', () => {
  it('should return a formatted animal message', () => {
    const result = zoo();
    expect(result).toMatch(/^\[ZOO\] (cow|dog|pig) says (moo|woof|oink)!$/);
  })
})
