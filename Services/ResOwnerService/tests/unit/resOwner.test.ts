import {describe, expect, test} from '@jest/globals';
import { ResOwnerActions } from '../../src/controllers/ResOwnerActions'
import { ResidenceOwners } from '../../src/models/ResidenceOwners';
import { genNewDate } from '../../src/helpers/DateFormat';

describe("ResOwnersActions class", () => {

    const resActions = new ResOwnerActions()

    const resOwner = new ResidenceOwners(1, 0, 1, 1, 125, true, genNewDate(), "1000-01-01 00:00:00", 0, false, "document.pdf")

    test("Create new Residence Owner", async () => {

        const result = await resActions.create(resOwner)
        expect(result).not.toBeFalsy()
    })

    test("Check if Residence Owner Exists, in case of YES", async () => {

        const result = await resActions.exists(1)
        expect(result).toBe(true)
    })

    test("Check if Residence Owner Exists, in case of NO", async () => {
        const result = await resActions.exists(999)
        expect(result).toBe(false)

    })

    test("Get all Residence Owners", async () => {
        const result = await resActions.getResOwners()
        expect(result.length).toBeGreaterThan(0)

    })

    test("Update Residence Owner approval state", async () => {
        const result = await resActions.update(1, {state: 1, userName: "teste de teste", userId: 27, userType: "Admin", userEmail: "teste@teste.pt"})

        expect(result).toBeUndefined()
    })

    test("Get all Available for rent Residences by city", async () => {
        const result = await resActions.getByCity("Fradelos")
        expect(result.length).toBeGreaterThan(0)
    })

})
