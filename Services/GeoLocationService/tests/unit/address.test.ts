import {describe, expect, test} from '@jest/globals';
import {AddressActions} from "../../src/controllers/AddressActions"
import { Addresses } from '../../src/models/Addresses';

/*describe('sum module', () => {
  test('adds 1 + 2 to equal 3', () => {
    expect(sum(1, 2)).toBe(3);
  }); 
});*/

describe("AddressActions Class", () => {

  const addr = new AddressActions()

  const data: Addresses = {lat: 1, lng: 1, city: "Fradelos", street: "Rua do Louseiro", nr: "162", postalCode: "0000-000", country: "Portugal"}


  test("create new Address", async () => {

    const result = await addr.newAddress(data)
    expect(result).not.toBeFalsy()
  })

  test("Try to create already existing address returns id from existing", async () => {

    const result = await addr.newAddress(data)
    expect(result).not.toBeFalsy()
  })

  test("get Addresses", async () => {
    const addresses: Addresses[] = await addr.getAddresses()

    expect(addresses.length).toBeGreaterThan(0)
  })

})
