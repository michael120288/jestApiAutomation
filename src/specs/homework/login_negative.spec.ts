import { getUser } from "../../../helper/user";
import { User } from "../../../helper/interface";
import { deleteFunction, login, signUp, signUp2 } from "../../../helper/user";
import * as supertest from "supertest";
const request = supertest("http://localhost:8001/api/v1");

describe("USER SIGNUP AND LOGIN", () => {
  let cookie: string;
  const user: User = getUser("admin");

  // ✅ NEGATIVE TESTING
  describe("NEGATIVE TESTING", () => {
    beforeEach(async () => {
      try {
        const res = await signUp(user);
        expect(res.statusCode).toEqual(201);
        cookie = res.header["set-cookie"][0];
      } catch (error) {
        console.error("Error in beforeEach setup for NEGATIVE tests:", error);
      }
    });

    afterEach(async () => {
      try {
        const el = await deleteFunction(cookie);
        expect(el.statusCode).toBe(200);
      } catch (error) {
        console.error("Error in afterEach cleanup for NEGATIVE tests:", error);
      }
    });

    // Invalid login - async/await
    it("should not login with invalid credentials (async/await)", async () => {
      try {
        const loginAttempt = await login({
          email: user.email + "invalid",
          password: user.password + "invalid",
        });
        expect(loginAttempt.statusCode).toBe(401);
        expect(loginAttempt.body.message).toBe('Incorrect email or password')
        console.log(loginAttempt.body);
      } catch (error) {
        console.error("Error during invalid login test:", error);
      }
    });

    // Invalid login - .then()
    it("should not login with invalid credentials (.then())", () => {
      return login({
        email: user.email + "invalid",
        password: user.password + "invalid",
      }).then((loginAttempt) => {
        expect(loginAttempt.statusCode).toBe(401);
        expect(loginAttempt.body.message).toBe('Incorrect email or password')
      });
    });

    // Invalid login - done()
    it("should not login with invalid credentials (done callback)", (done) => {
      request
        .post("/users/login")
        .send({
          email: user.email + "invalid",
          password: user.password + "invalid",
        })
        .end((err, res) => {
          if (err) return done(err);
          expect(res.statusCode).toBe(401);
          expect(res.body.message).toBe('Incorrect email or password')
          done();
        });
    });
  });
});
