import {describe, expect, test} from '@jest/globals';
import {LocationHandler} from "../../src/controllers/LocationHandler"

/*describe('sum module', () => {
  test('adds 1 + 2 to equal 3', () => {
    expect(sum(1, 2)).toBe(3);
  }); 
});*/

describe("LocationHandler Class", () => {

    const address = {city: "Fradelos", street: "Rua do Louseiro", nr: "162"}
    const geo = new LocationHandler(address)

    test("Search for correct existing address", async () => {

        const result = await geo.getLatLng()
        expect(result).toMatchObject({lat: 41.389492, lng: -8.599199})
    })
})
