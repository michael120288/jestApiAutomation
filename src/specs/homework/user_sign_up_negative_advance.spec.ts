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
describe("USER SIGN UP - NEGATIVE TESTING (Combined Missing Fields)", () => {
  let userData: UserData;

  // Generate random user data before each test
  beforeEach(() => {
    userData = {
      name: faker.person.firstName(),
      email: faker.internet.email(),
      password: "Test@12345",
      passwordConfirm: "Test@12345",
    };
    console.log("\n🔹 Generated User Data:", userData);
  });

  // ✅ Combined Test Using Loop
  it("should return 400 for missing required fields (.end())", (done) => {
    const requiredFields = ["name", "email", "password", "passwordConfirm"];

    // Use Promise.all to test all missing fields in parallel
    Promise.all(
      requiredFields.map((field) => {
        const requestData = { ...userData };
        delete requestData[field as keyof UserData]; // Remove the current field

        return new Promise<void>((resolve, reject) => {
          request
            .post("/users/signup")
            .send(requestData)
            .expect(400)
            .end((err: Error | null, res: Response) => {
              if (err) return reject(err);

              try {
                // Validate error response
                expect(res.body.message).toBe(`Missing required fields: ${field}`);
                resolve();
              } catch (error) {
                reject(error);
              }
            });
        });
      })
    )
      .then(() => done())
      .catch((error) => done(error));
  });

  // ✅ Test Multiple Missing Fields
  it("should return 400 if multiple fields are missing (.end())", (done) => {
    const missingCombinations = [
      ["name", "email"],
      ["password", "passwordConfirm"],
      ["name", "email", "password"],
    ];

    // Use Promise.all to test all missing combinations in parallel
    Promise.all(
      missingCombinations.map((fields) => {
        const requestData = { ...userData };
        fields.forEach((field) => delete requestData[field as keyof UserData]);

        return new Promise<void>((resolve, reject) => {
          request
            .post("/users/signup")
            .send(requestData)
            .expect(400)
            .end((err: Error | null, res: Response) => {
              if (err) return reject(err);

              try {
                // Validate error response
                expect(res.body.message).toBe(
                  `Missing required fields: ${fields.join(", ")}`
                );
                resolve();
              } catch (error) {
                reject(error);
              }
            });
        });
      })
    )
      .then(() => done())
      .catch((error) => done(error));
  });
});
