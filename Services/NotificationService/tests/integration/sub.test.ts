import { describe, it } from "@jest/globals";
import request from "supertest"
import dotenv from 'dotenv';
dotenv.config()

const baseUrl: string = `http://localhost:${process.env.PORT}`
const email = "superTest12@test.com"

describe("POST /sub", function(){
    /*it("returns 200 with non existing email", function(done){
      request(baseUrl)
        .post("/notification/v1/sub")
        .set("Content-type", "application/json")
        .send({email: email})
        .expect(200)
        .expect({"msg":"row created, thanks!"}, done)
    })*/

    it("returns 400, already existing email", function(done){
        request(baseUrl)
          .post("/notification/v1/sub")
          .set("Content-type", "application/json")
          .send({email: email})
          .expect(400)
          .expect({"msg":"Email already existing!"}, done)
    })
})