"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const supertest_1 = __importDefault(require("supertest"));
const baseUrl = `http://localhost:8002`;
const email = "daniel.silva.prg@gmail.com";
(0, globals_1.describe)("POST /sub", function () {
    (0, globals_1.it)("returns 200 with non existing email", function (done) {
        (0, supertest_1.default)(baseUrl)
            .post("/notification/v1/sub")
            .set("Content-type", "application/json")
            .send({ email: email })
            .expect(200)
            .expect({ "msg": "row created, thanks!" }, done);
    });
    /*it("returns 400, already existing email", function(done){
        request(baseUrl)
          .post("/notification/v1/sub")
          .set("Content-type", "application/json")
          .send({email: email})
          .expect(400)
          .expect({"msg":"Email already existing!"}, done)
    })*/
});
