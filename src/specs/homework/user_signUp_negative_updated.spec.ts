

// tests/user/updateUser.spec.ts

import { faker } from "@faker-js/faker";
import { getUser, signUp, signUp2, login, deleteFunction } from "../../../helper/user";
import * as path from "path";
import { User } from "../../../helper/interface";
import { Response } from "superagent";

// Global request is assumed to be set up in jest.setup.ts
// (global.request is available)

describe("USER SIGN UP - NEGATIVE TESTING", () => {
  let userData: Partial<User>;

  // beforeEach hook creates a new user before each test,
  // ensuring each test starts with a fresh user record.
  beforeEach(async () => {
    // Generate a random user using our helper function
    userData = getUser("user");
    console.log("\n🔹 Generated User Data:", userData);

  });

 

  // --------------------------------------------------------------------------------
  // Negative Tests using .end() and done() callback
  // --------------------------------------------------------------------------------

  // 1. Test: All required fields missing
  it("should return 400 if required fields are missing (done callback)", (done) => {
    // Using signUp2 to access the .end() chain for callback style.
    signUp2({}).end((err: Error | null, res: Response) => {
      if (err) return done(err);

      try {
        // Assert status code and error message
        expect(res.statusCode).toBe(400);
        expect(res.body.status).toBe("fail");
        expect(res.body.message).toContain(
          "Missing required fields: name, email, password, passwordConfirm"
        );
        done();
      } catch (error) {
        done(error);
      }
    });
  });

  // 2. Test: Missing 'name' field
  it("should return 400 if the name field is missing (.end())", (done) => {
    signUp2({
      email: userData.email,
      password: userData.password,
      passwordConfirm: userData.passwordConfirm,
    }).end((err: Error | null, res: Response) => {
      if (err) return done(err);

      try {
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe("Missing required fields: name");
        done();
      } catch (error) {
        done(error);
      }
    });
  });

  // 3. Test: Missing 'email' field
  it("should return 400 if the email field is missing (.end())", (done) => {
    signUp2({
      name: userData.name,
      password: userData.password,
      passwordConfirm: userData.passwordConfirm,
    }).end((err: Error | null, res: Response) => {
      if (err) return done(err);

      try {
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe("Missing required fields: email");
        done();
      } catch (error) {
        done(error);
      }
    });
  });

  // 4. Test: Missing 'password' field
  it("should return 400 if the password field is missing (.end())", (done) => {
    signUp2({
      name: userData.name,
      email: userData.email,
      passwordConfirm: userData.passwordConfirm,
    }).end((err: Error | null, res: Response) => {
      if (err) return done(err);

      try {
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe("Missing required fields: password");
        done();
      } catch (error) {
        done(error);
      }
    });
  });

  // 5. Test: Missing 'passwordConfirm' field
  it("should return 400 if the passwordConfirm field is missing (.end())", (done) => {
    signUp2({
      name: userData.name,
      email: userData.email,
      password: userData.password,
    }).end((err: Error | null, res: Response) => {
      if (err) return done(err);

      try {
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe("Missing required fields: passwordConfirm");
        done();
      } catch (error) {
        done(error);
      }
    });
  });

  // 6. Test: Multiple Missing Fields (e.g., name, email, and passwordConfirm missing)
  it("should return 400 if multiple fields are missing (.end())", (done) => {
    signUp2({
      password: userData.password,
    }).end((err: Error | null, res: Response) => {
        console.log(err,'err');
        console.log(res,'response');
      if (err) return done(err);

      try {
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe("Missing required fields: name, email, passwordConfirm");
        done();
      } catch (error) {
        done(error);
      }
    });
  });

  // 7. Test: Duplicate email using .then() chain
  it("should not create a new user with an already used email (.then())", async() => {
    
    await signUp2(userData)
    // Since the user is already signed up in beforeEach,
    // attempt to sign up with the same data should trigger a duplicate error.
    return signUp2(userData)
      .then((res: Response) => {
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe("This email is already in use. Please use another email.");
      })
      .catch((error) => {
        throw error;
      });
  });

  // 8. Test: Password mismatch using done callback
  it("should return 400 if password and passwordConfirm do not match (done)", (done) => {
    signUp2({
      name: userData.name,
      email: userData.email,
      password: "Test@12345",
      passwordConfirm: "MismatchPassword",
    }).end((err: Error | null, res: Response) => {
      if (err) return done(err);

      try {
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe("User validation failed: passwordConfirm: Passwords are not the same!");
        done();
      } catch (error) {
        done(error);
      }
    });
  });

  // 9. Test: Invalid email format using done callback
  it("should return 400 if email is invalid (.end())", (done) => {
    signUp2({
      name: userData.name,
      email: "invalidEmailFormat",
      password: userData.password,
      passwordConfirm: userData.passwordConfirm,
    }).end((err: Error | null, res: Response) => {
      if (err) return done(err);

      try {
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe("User validation failed: email: Please provide a valid email");
        done();
      } catch (error) {
        done(error);
      }
    });
  });

  // 10. Test: Long password using .then() chain
  it("should return 400 if the password is too long (.then())", () => {
    const longPassword = "a".repeat(101); // Password longer than allowed
    return signUp2({
      name: userData.name,
      email: userData.email,
      password: longPassword,
      passwordConfirm: longPassword,
    }).then((res: Response) => {
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toContain("Password longer then 30 characters");
    });
  });
  // ✅ 1. Passing empty body
  it("should return 400 if required fields are missing", async () => {
    const res = await signUp({});
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toContain(
      "Missing required fields: name, email, password, passwordConfirm"
    );
  });

  // ✅ 2. Missing name field
  it("should return 400 if the name field is missing", async () => {
    const res = await signUp({ email: userData.email, password: userData.password, passwordConfirm: userData.passwordConfirm });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Missing required fields: name");
  });

  // ✅ 3. Missing email field
  it("should return 400 if the email field is missing", async () => {
    const res = await signUp({ name: userData.name, password: userData.password, passwordConfirm: userData.passwordConfirm });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Missing required fields: email");
  });

  // ✅ 4. Missing password field
  it("should return 400 if the password field is missing", async () => {
    const res = await signUp({ name: userData.name, email: userData.email, passwordConfirm: userData.passwordConfirm });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Missing required fields: password");
  });

  // ✅ 5. Missing passwordConfirm field
  it("should return 400 if the passwordConfirm field is missing", async () => {
    const res = await signUp({ name: userData.name, email: userData.email, password: userData.password });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Missing required fields: passwordConfirm");
  });

  // ✅ 6. Invalid email format
  it("should return 400 if the email format is invalid", async () => {
    const res = await signUp({ name: userData.name, email: "invalid-email", password: userData.password, passwordConfirm: userData.passwordConfirm });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toContain("Please provide a valid email");
  });

  // ✅ 7. Password and passwordConfirm mismatch
  it("should return 400 if password and passwordConfirm do not match", async () => {
    const res = await signUp({ name: userData.name, email: userData.email, password: "Test@12345", passwordConfirm: "MismatchPassword" });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("User validation failed: passwordConfirm: Passwords are not the same!");
  });

  // ✅ 8. Password too long
  it("should return 400 if the password is too long", async () => {
    const longPassword = "a".repeat(101);
    const res = await signUp({ name: userData.name, email: userData.email, password: longPassword, passwordConfirm: longPassword });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toContain("Password longer then 30 characters");
  });

  // ✅ 9. Attempting duplicate email registration
  it("should return 400 when trying to create a user with an already registered email", async () => {
    await signUp(userData); // First signup

    const duplicateRes = await signUp(userData); // Second signup attempt
    expect(duplicateRes.statusCode).toBe(400);
    expect(duplicateRes.body.message).toBe("This email is already in use. Please use another email.");
  });
});

