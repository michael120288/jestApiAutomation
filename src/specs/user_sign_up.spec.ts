// Import required libraries
import * as supertest from "supertest";
import { faker } from "@faker-js/faker";
import { Response } from "superagent";

// Set up the request instance with the base URL
const request = supertest("http://localhost:8001/api/v1");

// Define the structure of user data using TypeScript interface
interface UserData {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

// Main test suite
describe("USER SIGN UP", () => {
  let userData: UserData;

  // Positive testing using async/await
  describe("POSITIVE TESTING with async/await", () => {
    it("should create a new user using async/await", async () => {
      // Generate random user data using Faker.js
      userData = {
        name: faker.person.firstName(),
        email: faker.internet.email(),
        password: "Test@12345",
        passwordConfirm: "Test@12345",
      };
      console.log(userData);

      try {
        // Make the POST request
        const res: Response = await request
          .post("/users/signup")
          .send(userData)
          .expect(201);

        // Log the response body for debugging
        console.log("\n🔹 Response Body:", res.body);

        // Validate response properties
        expect(res.body.status).toBe("success");
        expect(res.body.data.user.name).toBe(userData.name);
        expect(typeof res.body.data.user.name).toBe("string");
        expect(res.body.data.user.email).toBe(userData.email.toLowerCase());
        expect(typeof res.body.data.user.email).toBe("string");
        expect(res.body.token).toBeDefined();
        expect(typeof res.body.token).toBe("string");

        // Additional checks for user object
        expect(res.body.data.user).toHaveProperty("_id");
        expect(res.body.data.user).not.toHaveProperty("password");
      } catch (error) {
        console.error("\n❌ Test Failed with Error:", error);
        throw error; // Re-throw to ensure the test fails
      }
    });
  });

  // Positive testing using .then()
  describe("POSITIVE TESTING with .then()", () => {
    it("should create a new user using .then()", () => {
      // Generate random user data using Faker.js
      userData = {
        name: faker.person.firstName(),
        email: faker.internet.email(),
        password: "Test@12345",
        passwordConfirm: "Test@12345",
      };
      console.log(userData);

      // Make the POST request using .then()
      return request
        .post("/users/signup")
        .send(userData)
        .expect(201)
        .then((res: Response) => {
          // Log response body
          console.log("\n🔹 Response Body:", res.body);

          // Validate response
          expect(res.body.status).toBe("success");
          expect(res.body.data.user.name).toBe(userData.name);
          expect(typeof res.body.data.user.name).toBe("string");
          expect(res.body.data.user.email).toBe(userData.email.toLowerCase());
          expect(typeof res.body.data.user.email).toBe("string");
          expect(res.body.token).toBeDefined();
          expect(typeof res.body.token).toBe("string");

          // Additional checks
          expect(res.body.data.user).toHaveProperty("_id");
          expect(res.body.data.user).not.toHaveProperty("password");
        })
        .catch((error) => {
          console.error("\n❌ Test Failed with Error:", error);
          throw error;
        });
    });
  });

  // Positive testing using .end() and done()
  describe("POSITIVE TESTING with .end() and done()", () => {
    it("should create a new user using .end() and done()", (done) => {
      // Generate random user data using Faker.js
      userData = {
        name: faker.person.firstName(),
        email: faker.internet.email(),
        password: "Test@12345",
        passwordConfirm: "Test@12345",
      };
      console.log(userData);

      // Make the POST request using .end()
      request
        .post("/users/signup")
        .send(userData)
        .expect(201)
        .end((err: Error | null, res: Response) => {
          if (err) {
            console.error("\n❌ Test Failed with Error:", err);
            return done(err); // Notify Jest that the test failed
          }

          try {
            // Log response body
            console.log("\n🔹 Response Body:", res.body);

            // Validate response
            expect(res.body.status).toBe("success");
            expect(res.body.data.user.name).toBe(userData.name);
            expect(typeof res.body.data.user.name).toBe("string");
            expect(res.body.data.user.email).toBe(userData.email.toLowerCase());
            expect(typeof res.body.data.user.email).toBe("string");
            expect(res.body.token).toBeDefined();
            expect(typeof res.body.token).toBe("string");

            // Additional checks
            expect(res.body.data.user).toHaveProperty("_id");
            expect(res.body.data.user).not.toHaveProperty("password");

            done(); // Notify Jest that the test finished successfully
          } catch (error) {
            console.error("\n❌ Test Failed with Error:", error);
            done(error); // Pass error to Jest
          }
        });
    });
  });
});
