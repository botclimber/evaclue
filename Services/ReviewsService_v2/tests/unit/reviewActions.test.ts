import {describe, expect, test} from '@jest/globals';
import { genNewDate } from "../../../CommonUtils/src/helpers/DateFormat";
import { Reviews} from "../../../CommonUtils/src/models/Reviews";
import { ReviewActions } from "../../src/controllers/ReviewActions";

describe( "Testing ReviewActions class methods", () => {

    const rev = new ReviewActions()

    test("Create new Review", async () => {

        const review: Reviews = new Reviews(1, 0, 1, "Testing reviews functionality!", 5, genNewDate(), "1000-01-01 00:00:00", false, 0)

        const res = await rev.create(review);
        expect(res).not.toBeFalsy()

    })

    test("getAll Reviews", async () => {
        const res = await rev.getReviews();
        expect(res.length).toBeGreaterThan(0)

    })
    
    test("Update Review state", async () => {
        const res = await rev.update(1, 1, 1);
        expect(res).toBeUndefined()
    })
})


