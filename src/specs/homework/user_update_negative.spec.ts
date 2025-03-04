// tests/user/updateUser.spec.ts
import { getUser } from "../../../helper/user"; // Reuse your user generation function
import { login, signUp, deleteFunction } from "../../../helper/user"; // User helper functions
import * as path from "path";

describe("USER UPDATE - /users/updateMe", () => {
  let token: string;
  let cookie: string;
  let user;

  beforeAll(async () => {
    user = getUser("user");

    const signUpRes = await request.post("/users/signup").send(user);
    expect(signUpRes.statusCode).toBe(201);

    const loginRes = await request.post("/users/login").send({
      email: user.email,
      password: user.password,
    });
    console.log(loginRes);
    expect(loginRes.statusCode).toBe(200);
    token = loginRes.body.token;
    cookie = loginRes.headers["set-cookie"][0].split(";")[0].split("=")[1];
    console.log(cookie,'cookie');
  });

  afterAll(async () => {
    await deleteFunction(cookie);
  });

  

  // ✅ 1. Negative Test - Attempt to update password using this route
  it("should return 400 when trying to update password", async () => {
    const res = await request
      .patch("/users/updateMe")
      .set("Authorization", `Bearer ${token}`)
      .send({
        password: "newpassword123",
        passwordConfirm: "newpassword123",
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe(
      "This route is not for password updates. Please use /updateMyPassword."
    );
  });

  // ✅ 4. Negative Test - Update without token
  it("should return 401 if user is not logged in", async () => {
    const res = await request.patch("/users/updateMe").send({
      name: "Anonymous",
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe(
      "You are not logged in! Please log in to get access."
    );
  });

  // ✅ 5. Negative Test - Invalid email format
  it("should return 400 when email format is invalid", async () => {
    const res = await request
      .patch("/users/updateMe")
      .set("Authorization", `Bearer ${token}`)
      .send({
        email: "invalid-email",
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toContain("Please provide a valid email");
  });

  // ✅ 6. Negative Test - Empty request body
  it("should return 400 when no data is provided", async () => {
    const res = await request
      .patch("/users/updateMe")
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("No data provided for update.");
  });

  // ✅ 7. Negative Test - Trying to update unauthorized fields
  it("should ignore unauthorized fields", async () => {
    const res = await request
      .patch("/users/updateMe")
      .set("Authorization", `Bearer ${token}`)
      .send({
        role: "admin", // Should be ignored
        passwordResetToken: "hacked",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.user.role).toBe("user"); // Role should not be updated
  });

  // ✅ 8. Negative Test - Invalid token
  it("should return 401 when using an invalid token", async () => {
    const res = await request
      .patch("/users/updateMe")
      .set("Authorization", "Bearer invalidToken123")
      .send({
        name: "Invalid Token",
      });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Invalid token. Please log in again.");
  });
});
