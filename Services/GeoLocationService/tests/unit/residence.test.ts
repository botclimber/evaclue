import {describe, expect, test} from '@jest/globals';
import {ResidenceActions} from "../../src/controllers/ResidenceActions"
import { Residences } from '../../src/models/Residences';

/*describe('sum module', () => {
  test('adds 1 + 2 to equal 3', () => {
    expect(sum(1, 2)).toBe(3);
  }); 
});*/

describe("ResidenceActions Class", () => {

  const res = new ResidenceActions()

  const data: Residences = {addressId: 1, floor: "1", direction: "esq"}


  test("create new Residence", async () => {

    const result = await res.newResidence(data)
    expect(result).not.toBeFalsy()
  })

  test("Try to create already existing residence returns id from existing", async () => {

    const result = await res.newResidence(data)
    expect(result).not.toBeFalsy()
  })

  test("get Residences", async () => {
    const addresses: Residences[] = await res.getResidences()

    expect(addresses.length).toBeGreaterThan(0)
  })

})
