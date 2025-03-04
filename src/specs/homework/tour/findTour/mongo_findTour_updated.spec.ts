const { MongoClient, Db, ObjectId } = require("mongodb");
import { generateTourData, tour, TourData } from "../../../../../helper/tour";
import { signUp } from "../../../../../helper/user";
import { getUser } from "../../../../../helper/user";
import {
  connectDB,
  closeDB,
  findTourByName,
  deleteTourById,
  findTourById,
} from "../../../../../helper/mongoHelper";

const dotenv = require("dotenv");
dotenv.config();

describe("MongoDB Connection and Operations", () => {
  let connection: typeof MongoClient;
  let db: typeof Db;

  beforeAll(async () => {
    const { db: database } = await connectDB();
    db = database;
  });

  afterAll(async () => {
    await closeDB();
  });

  it("Connect to the collection and find user ", async () => {
    // Retrieve the document
    const tour = await findTourByName("coniecto nostrum eos");
    // // // Assert that the retrieved document is the same
    expect(tour.name).toEqual("coniecto nostrum eos");
  });

  it("create new user with imported data", async () => {
    const userImport = getUser("admin");
    try {
      //create new user
      const userResponse = await signUp(userImport);
      //verify that user is  created successfully
      expect(userResponse.statusCode).toBe(201);
      //get user cookie
      const cookie = userResponse.headers["set-cookie"];
      const tourData: TourData = generateTourData(); // Generate dynamic tour data
      //create new tour
      const res = await tour(cookie, tourData);
      //find one tour
      const tourResponse = await findTourByName(tourData.name);
      if (!tourResponse) {
        throw new Error("Tour not found");
      }
      expect(tourResponse.name).toBe(res.body.data.name);
      expect(tourResponse._id.toString()).toEqual(res.body.data._id);
      let deleteData = await deleteTourById(res.body.data._id);
      let findTour = await findTourById(res.body.data._id);
      expect(findTour).toBeNull();
    } catch (error) {
      console.error("Error in user creation:", error);
      throw new Error(error);
    }
  });
});
