import { deleteFunction2, getUser } from "../../helper/user";
import { User } from "../../helper/interface";
import { deleteFunction, login, signUp, signUp2,login2 } from "../../helper/user";
import * as supertest from "supertest";
const request = supertest("http://localhost:8001/api/v1");

describe("USER SIGNUP AND LOGIN", () => {
  let cookie: string;
  const user: User = getUser("admin");

  // ✅ POSITIVE TESTING
  describe("POSITIVE TESTING", () => {
    // 1. Async/Await + Try/Catch
    it("should signup, login, and delete a user (async/await)", async () => {
      try {
        const res = await signUp(user);

        expect(res.statusCode).toBe(201);
        expect(res.body.data.user.email).toEqual(user.email);
        expect(res.body.status).toBe("success");

        const loginRes = await login(user);
        expect(loginRes.statusCode).toBe(200);
        expect(loginRes.body.status).toBe("success");
        cookie = loginRes.header["set-cookie"][0];

        const deleteRes = await deleteFunction(cookie);
        expect(deleteRes.statusCode).toBe(200);
        expect(deleteRes.body.message).toBe("User deleted successfully");

        const loginAfterDeletion = await login(user);
        expect(loginAfterDeletion.statusCode).toBe(401);
        expect(loginAfterDeletion.body.message).toBe(
          "Incorrect email or password"
        );
      } catch (error) {
        console.error("Error during positive test:", error);
        throw error;
      }
    });

    // 2. Using .then() Chaining
    it("should signup, login, and delete a user (.then() chain)", () => {
      return signUp(user)
        .then((res) => {
          expect(res.statusCode).toBe(201);
          expect(res.body.data.user.email).toEqual(user.email);
          expect(res.body.status).toBe("success");
          return login(user);
        })
        .then((loginRes) => {
          expect(loginRes.statusCode).toBe(200);
          expect(loginRes.body.status).toBe("success");
          cookie = loginRes.header["set-cookie"][0];
          return deleteFunction(cookie);
        })
        .then((deleteRes) => {
          expect(deleteRes.statusCode).toBe(200);
          expect(deleteRes.body.message).toBe("User deleted successfully");

          return login(user);
        })
        .then((loginAfterDeletion) => {
          expect(loginAfterDeletion.statusCode).toBe(401);
          expect(loginAfterDeletion.body.message).toBe(
            "Incorrect email or password"
          );
        });
    });

    // 3. Using done() with .end()
    it("should signup, login, and delete a user (done callback)", (done) => {
        signUp2(user)
        .end((err, res) => {
          if (err) return done(err);

          expect(res.statusCode).toBe(201);
          expect(res.body.data.user.email).toEqual(user.email);

          login2(user)
            .end((err, loginRes) => {
              if (err) return done(err);

              expect(loginRes.statusCode).toBe(200);
              expect(res.body.status).toBe("success");
              const cookie = loginRes.header["set-cookie"][0];

              return deleteFunction2(cookie)
                .end((err, deleteRes) => {
                  if (err) return done(err);

                  expect(deleteRes.statusCode).toBe(200);
                  expect(deleteRes.body.message).toBe("User deleted successfully");

                  login2(user)
                    .end((err, loginAfterDeletion) => {
                      if (err) return done(err);

                      expect(loginAfterDeletion.statusCode).toBe(401);
                      expect(loginAfterDeletion.body.message).toBe(
                        "Incorrect email or password"
                      );
                      done();
                    });
                });
            });
        });
    });
  });
});
