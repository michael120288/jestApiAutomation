const { MongoClient,Db, ObjectId } = require("mongodb");
import { signUp } from "../../../helper/user";
import { getUser } from "../../../helper/user";

const dotenv = require("dotenv");
dotenv.config();

describe("MongoDB Connection and Operations", () => {
  let connection: typeof MongoClient
  let db: typeof Db

  beforeAll(async () => {
    // Connect to the database before running any tests
    try {
      // Connect to the database before running any tests
      connection = await MongoClient.connect(process.env.DATABASE_URL as string, {
        useNewUrlParser: true, // Enables new MongoDB URL parser
        useUnifiedTopology: true, // Enables new connection engine
      });
      db = await connection.db(); // Optionally specify database name
    } catch (error) {
      console.error("Error connecting to the database:", error);
    }
  });

  afterAll(async () => {
    // Close the connection after all tests have run
    await connection.close();
  });

  it('Connect to the collection and find user ', async () => {
    const users = db.collection("users");
    console.log(users, "users");
    // Retrieve the document
    const user = await users.findOne({ name: "Alexandro" });
    console.log(user, "user");

    // // // Assert that the retrieved document is the same
    expect(user.name).toEqual("Alexandro");
  });

  it("create new user with imported data", async () => {
    const userImport = getUser("admin");
    console.log(userImport, "getUser");

    try {
      const res = await signUp(userImport);
      expect(res.statusCode).toBe(201);
      console.log(res.body); // Adjust to log only the response body for readability
      const users = db.collection("users");
      const userData = await users.findOne({ name: userImport.name });
      console.log(userData, "===========userData=======");
      if (!userData) {
        throw new Error("User not found");
      }
      expect(userData.name).toBe(userImport.name);
      expect(userData.email).toBe(userImport.email);
      expect(userData.role).toBe("admin");
      expect(userData._id.toString()).toEqual(res.body.data.user._id);
      let deleteData = await users.deleteOne({
        _id: new ObjectId(userData._id),
      });
      console.log(deleteData, "===========deleteData=======");
      let findUser = await users.findOne({ _id: userData._id });
      console.log(findUser, "===========findUser=======");

      expect(findUser).toBeNull(); 
    } catch (error) {
      console.error("Error in user creation:", error);
      throw new Error(error);
    }
  });
});
