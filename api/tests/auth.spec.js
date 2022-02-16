process.env.ENVIRONMENT = "test";
const supertest = require("supertest");
const passportStub = require("passport-stub");
const connection = require("../db/psql/connection");
const app = require("../app");

const request = supertest(app);
passportStub.install(app);
const authUrlPath = "/auth";
const usersUrlPath = "/api/users";

describe("/", () => {
    beforeEach(() => connection.seed.run());
    afterEach(() => passportStub.logout());
    afterAll(() => connection.destroy());
    describe("/auth", () => {
        describe("DEFAULT BEHAVIOUR", () => {
            describe("GET", () => {
                it("status: 200, logout user", () => {
                    passportStub.login({
                        username: "testuserlogin",
                        password: "testuserpassword",
                    });
                    return request
                        .get(`${authUrlPath}/logout`)
                        .expect(200)
                        .then(res => {
                            expect(res.redirects).toHaveLength(0);
                            expect(res.status).toBe(200);
                            expect(res.type).toEqual("application/json");
                            expect(res.body.status).toEqual("success");
                        });
                });
            });
            describe("POST", () => {
                it("status: 201, register user", () =>
                    request
                        .post(`${authUrlPath}/register`)
                        .send({name: "test user", username: "test", password: "testpassword"})
                        .expect(201)
                        .then(res => {
                            expect(res.redirects).toHaveLength(0);
                            expect(res.status).toBe(201);
                            expect(res.type).toEqual("application/json");
                            expect(res.body.status).toEqual("success");
                        }));
                it("status: 200, login user", () =>
                    request
                        .post(`${authUrlPath}/login`)
                        .send({username: "testuserlogin", password: "testuserpassword"})
                        .expect(200)
                        .then(res => {
                            expect(res.redirects).toHaveLength(0);
                            expect(res.status).toBe(200);
                            expect(res.type).toEqual("application/json");
                            expect(res.body.status).toEqual("success");
                        }));
            });
        });
        describe("ERROR HANDLING", () => {
            describe("GET", () => {
                it("status: 200, should throw an error if a user is not logged in", () => {
                    request
                        .get(`${authUrlPath}/logout`)
                        .expect(401)
                        .then(res => {
                            expect(res.redirects).toHaveLength(0);
                            expect(res.status).toBe(401);
                            expect(res.type).toEqual("application/json");
                            expect(res.body.status).toEqual("Please log in");
                        });
                });
            });
            describe("POST", () => {
                it("status: 201, should not login with incorrect user / password", () =>
                    request
                        .post(`${authUrlPath}/login`)
                        .send({username: "testuserlogin", password: "wrongpassword"})
                        .expect(404)
                        .then(res => {
                            expect(res.redirects).toHaveLength(0);
                            expect(res.status).toBe(404);
                            expect(res.type).toEqual("application/json");
                            expect(res.body.status).toEqual("User not found");
                        }));
            });
        });
    });
    describe("/api", () => {
        describe("/users", () => {
            describe("DEFAULT BEHAVIOUR", () => {
                describe("GET", () => {
                    it("status: 200, should return users when user is logged in", () => {
                        passportStub.login({
                            username: "testuserlogin",
                            password: "testuserpassword",
                        });
                        return request
                            .get(usersUrlPath)
                            .expect(200)
                            .then(res => {
                                expect(res.redirects).toHaveLength(0);
                                expect(res.status).toBe(200);
                                expect(res.type).toEqual("application/json");
                            });
                    });
                });
            });
            describe("ERROR HANDLING", () => {
                describe("GET", () => {
                    it("status: 401, should throw an error if a user is not logged in", () => {
                        return request
                            .get(usersUrlPath)
                            .expect(401)
                            .then(res => {
                                expect(res.redirects).toHaveLength(0);
                                expect(res.status).toBe(401);
                                expect(res.type).toEqual("application/json");
                            });
                    });
                });
            });
        });
    });
});
