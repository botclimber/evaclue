import {describe, expect, test} from "@jest/globals";
import {ReviewValidator} from "../../src/middlewares/ReviewValidator"

describe("Tests on review validator class", () => {
    const reviewValidator: ReviewValidator = new ReviewValidator()

    test("Check multiple reviews on same Address, in case of YES", async () => {
        const res = await reviewValidator.reviewLimit(1, 1)
        expect(res).toBe(true)
    })

    test("Check multiple reviews on same Address, in case of NO", async () => {
        const res = await reviewValidator.reviewLimit(1, -1)
        expect(res).toBe(false)
    })

})


