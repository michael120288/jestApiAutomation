import { faker } from "@faker-js/faker";
import { getUser, uploadUserPhoto } from "../../helper/user";
import { login, signUp, deleteFunction, updateUser } from "../../helper/user";
import * as path from "path";
import { User } from "../../helper/interface";


// ✅ Define Global Variables
let token: string;
let cookie: string;
let user: User;

// ✅ Describe Test Suite
describe("USER UPDATE - /users/updateMe", () => {
  const newName = faker.person.firstName();
  const newEmail = faker.internet.email();
  beforeAll(async () => {
    // 🔹 Generate a test user with Faker
    user = getUser("user");

    // 🔹 Sign up user
    const signUpRes = await signUp(user);
    expect(signUpRes.statusCode).toBe(201);

    // 🔹 Log in to get token & cookies
    const loginRes = await login({
      email: user.email,
      password: user.password,
    });
    expect(loginRes.statusCode).toBe(200);

    token = loginRes.body.token;
    cookie = loginRes.headers["set-cookie"][0]; // Extract first cookie
  });

  afterAll(async () => {
    // ✅ Ensure user deletion
    await deleteFunction(cookie).then((res) => {
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("User deleted successfully");
    });
  });

  // ✅ 1. Update User Name & Email
  it("should update user name and email", async () => {
    const updatedUser = await updateUser(
      { name: newName, email: newEmail },
      token
    );

    // ✅ Assertions for updated values
    expect(updatedUser.name).toBe(newName);
    expect(updatedUser.email.toLowerCase()).toBe(newEmail.toLowerCase());
  });

  // ✅ 2. Upload User Profile Picture
  it("should update user photo", async () => {
    const filePath = path.join(__dirname, "../../data/pasv.png");
    const photo = await uploadUserPhoto(filePath, token);

    // ✅ Ensure photo update was successful
    expect(photo).toBeDefined();
  });

  // ✅ 3. Ensure Login Still Works After Updates
  it("should allow user to log in after updating details", async () => {
    const loginResponse = await request.post("/users/login").send({
      email: newEmail,
      password: user.password,
    });

    expect(loginResponse.statusCode).toBe(200);
    expect(loginResponse.body.token).toBeDefined();

    cookie = loginResponse.headers["set-cookie"][0];
  });
});
