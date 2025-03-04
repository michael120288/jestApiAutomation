const { MongoClient, Db, ObjectId } = require("mongodb");
import { generateTourData, tour, TourData } from "../../../../../helper/tour";
import { signUp } from "../../../../../helper/user";
import { getUser } from "../../../../../helper/user";

const dotenv = require("dotenv");
dotenv.config();

describe("MongoDB Connection and Operations", () => {
  let connection: typeof MongoClient;
  let db: typeof Db;

  beforeAll(async () => {
    // Connect to the database before running any tests
    try {
      // Connect to the database before running any tests
      connection = await MongoClient.connect(
        process.env.DATABASE_URL as string,
        {
          useNewUrlParser: true, // Enables new MongoDB URL parser
          useUnifiedTopology: true, // Enables new connection engine
        }
      );
      db = await connection.db(); // Optionally specify database name
    } catch (error) {
      console.error("Error connecting to the database:", error);
      throw new Error("Failed to connect to MongoDB");
    }
  });

  afterAll(async () => {
    // Close the connection after all tests have run
    await connection.close();
  });

  it("Connect to the collection and find user ", async () => {
    const tours = db.collection("tours");
    console.log(tours, "tours");
    // Retrieve the document
    const tour = await tours.findOne({ name: "coniecto nostrum eos" });
    console.log(tour, "user");

    // // // Assert that the retrieved document is the same
    expect(tour.name).toEqual("coniecto nostrum eos");
  });

  it("create new user with imported data", async () => {
    const userImport = getUser("admin");
    console.log(userImport, "getUser");

    try {
      //create new user
      const userResponse = await signUp(userImport);
      //verify that user is  created successfully
      expect(userResponse.statusCode).toBe(201);
      //get user cookie
      const cookie = userResponse.headers["set-cookie"];
      console.log(userResponse.body); // Adjust to log only the response body for readability
      const tourData: TourData = generateTourData(); // Generate dynamic tour data
      console.log(tourData);
      console.log(cookie);
      //create new tour
      const res = await tour(cookie, tourData);
      //connect to Tour collection
      const tourCollection = db.collection("tours");
      //find one tour
      const tourResponse = await tourCollection.findOne({
        name: tourData.name,
      });
      console.log(tourResponse, "===========tourResponse=======");
      console.log(res.body, "===========resBody=======");
      if (!tourResponse) {
        throw new Error("Tour not found");
      }
      expect(tourResponse.name).toBe(res.body.data.name);
      expect(tourResponse._id.toString()).toEqual(res.body.data._id);
      let deleteData = await tourCollection.deleteOne({
        _id: new ObjectId(tourResponse._id),
      });
      console.log(deleteData, "===========deleteData=======");
      let findTour = await tourCollection.findOne({ _id: res.body.data._id });
      console.log(findTour, "===========findUser=======");

      expect(findTour).toBeNull();
    } catch (error) {
      console.error("Error in user creation:", error);
      throw new Error(error);
    }
  });
});
