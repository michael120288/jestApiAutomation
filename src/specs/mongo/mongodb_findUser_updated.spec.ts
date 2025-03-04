import * as supertest from "supertest";
import { Response } from "superagent";
import { connectDB, closeDB, findUserByName, deleteUserById } from "../../../helper/mongoHelper";
import { signUp,getUser } from "../../../helper/user";
const dotenv = require("dotenv");

dotenv.config();

const request = supertest(process.env.API_URL || "http://localhost:8001/api/v1");

let cookie: string;
let db: any;

describe("MongoDB Connection and User Operations", () => {
  beforeAll(async () => {
    const { db: database } = await connectDB();
    db = database;
  });

  afterAll(async () => {
    await closeDB();
  });

  // ✅ Test MongoDB Connection
  it("should verify MongoDB connection and fetch a user", async () => {
    const users = db.collection("users");
    console.log(users, "users");

    const user = await findUserByName("Alexandro");
    console.log(user, "user");

    expect(user).not.toBeNull();
    expect(user?.name).toEqual("Alexandro");
  });

  // ✅ Test Creating a User
  it("should create a new user and validate from MongoDB", async () => {
    const userImport = getUser('admin');
    console.log(userImport, "getUser");

    try {
      const res: Response = await signUp(userImport);
      expect(res.statusCode).toBe(201);
      console.log(res.body); // Log response body

      const userData = await findUserByName(userImport.name);
      console.log(userData, "===========userData=======");

      if (!userData) throw new Error("User not found");

      // ✅ Assertions
      expect(userData.name).toBe(userImport.name);
      expect(userData.email).toBe(userImport.email);
      expect(userData.role).toBe("admin");
      expect(userData._id.toString()).toEqual(res.body.data.user._id);

      // ✅ Delete User and Verify Deletion
      let deleteData = await deleteUserById(userData._id.toString());
      console.log(deleteData, "===========deleteData=======");

      let findDeletedUser = await findUserByName(userImport.name);
      console.log(findDeletedUser, "===========findDeletedUser=======");

      expect(findDeletedUser).toBeNull(); // Ensure user was deleted

    } catch (error) {
      console.error("❌ Test failed due to:", error);
      throw error;
    }
  });
});
