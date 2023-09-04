"use strict";
/**
 * Tests:
 *  - token auth missing or incorrect
 *  - if some required parameter missing
 *  - if everything fine
 */
Object.defineProperty(exports, "__esModule", { value: true });
const baseUrl = `http://localhost:${process.env.PORT}`;
/*describe("POST /emToOwner", function(){
    const getTestToken = testToken(1, "superAdmin", "daniel.silva.prg@gmail.com")
    const getTestTokenEmail = testEmailToken("daniel.silva.prg@gmail.com")

    const dataToBeTested = {
        userId: 1,
        resOwnerId: 2,
        userName: "teste teste",
        resOwnerEmail: getTestTokenEmail,
        message: "testing comunication between user and residence owner!"
    }

    it("returns 200 if everything goes fine", function(done){
      request(baseUrl)
        .post("/notification/v1/emToOwner")
        .set("authorization", `baer ${getTestToken}`)
        .set("Content-type", "application/json")
        .send(dataToBeTested)
        .expect(200)
        .expect({msg: "Your message was sent!"}, done)
    })
})

describe("POST /emToOwner", function(){
    const getTestToken = testToken(1, "superAdmin", "daniel.silva.prg@gmail.com")
    const getTestTokenEmail = testEmailToken("daniel.silva.prg@gmail.com")

    const dataToBeTested = {
        userId: 1,
        //resOwnerId: 2,
        userName: "teste teste",
        resOwnerEmail: getTestTokenEmail,
        message: "testing comunication between user and residence owner!"
    }

    it("returns 400 in case missing required parameters", function(done){
      request(baseUrl)
        .post("/notification/v1/emToOwner")
        .set("authorization", `baer ${getTestToken}`)
        .set("Content-type", "application/json")
        .send(dataToBeTested)
        .expect(400)
        .expect({msg: "Missing some required parameters!"}, done)
    })
})

describe("POST /emToOwner", function(){
    it("returns 500 in case of non header authorization", function(done){
      request(baseUrl)
        .post("/notification/v1/emToOwner")
        .set("Content-type", "application/json")
        .expect(500)
        .expect({msg:"Some Internal Error"}, done)
    })
})

describe("POST /emToOwner", function(){
    const getTestToken = testToken(1, "superAdmin")

    it("returns 500 in case of missing parameter in token", function(done){
      request(baseUrl)
        .post("/notification/v1/emToOwner")
        .set("authorization", `baer ${getTestToken}`)
        .set("Content-type", "application/json")
        .expect(500)
        .expect({msg:"Some Internal Error"}, done)
    })
})*/
