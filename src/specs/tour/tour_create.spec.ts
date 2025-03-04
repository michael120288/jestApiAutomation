import { getUser, signUp, login, deleteFunction } from "../../../helper/user";
import { Response } from "superagent";
import { generateTourData, tour, TourData } from "../../../helper/tour";

// ✅ Define global variables
let cookie: string;
let adminUser: any;
describe.skip("TOUR", () => {
  it("create Tour", async () => {
    const userImport = getUser("admin");
    console.log(userImport, "getUser");
    await signUp(userImport).then((res) => {
      expect(res.statusCode).toBe(201);
      expect(res.body.data.user.email).toBe(userImport.email.toLowerCase());
      cookie = res.header["set-cookie"];
      console.log(cookie);
    });
    await request
      .post("/tours")
      .set("Cookie", cookie)
      .send({
        name: "TourForn67",
        duration: 10,
        description: "Could be",
        maxGroupSize: 10,
        summary: "Test tour",
        difficulty: "easy",
        price: 100,
        rating: 4.8,
        imageCover: "tour-3-cover.jpg",
        ratingsAverage: 4.9,
        guides: [],
        startDates: ["2024-04-04"],
        startLocation: {
          type: "Point",
          coordinates: [-74.005974, 40.712776], // [longitude, latitude]
        },
        locations: {
          type: "Point",
          coordinates: [-74.005974, 40.712776], // [longitude, latitude]
        },
      })
      .then((res) => {
        console.log(res.body);
        expect(res.statusCode).toBe(201);
        expect(res.body.data.data.difficulty).toBe("easy");
      });
  });
});

// ✅ Test Suite for Tour Management
describe("TOUR MANAGEMENT - /tours", () => {
  beforeAll(async () => {
    adminUser = getUser("admin"); // Generate an admin user

    // ✅ Sign up the admin user
    const signUpRes: Response = await signUp(adminUser);
    expect(signUpRes.statusCode).toBe(201);
    expect(signUpRes.body.data.user.email).toBe(adminUser.email.toLowerCase());

    // ✅ Store authentication cookies
    cookie = signUpRes.headers["set-cookie"];
  });

  afterAll(async () => {
    await deleteFunction(cookie).then((res) => {
      expect(res.statusCode).toBe(200);
    });
  });

  // ✅ 1. Positive Test: Create a Tour
  it("should create a tour successfully", async () => {
    const tourData: TourData = generateTourData(); // Generate dynamic tour data
    console.log(tourData);
    console.log(cookie);
     //const res: Response = await request.post("/tours").set("Cookie", cookie).send(tourData);
    const res: Response = await tour(cookie,tourData)
    // ✅ Assertions
    expect(res.statusCode).toBe(201);
    expect(res.body.data.data.name).toBe(tourData.name);
    expect(res.body.data.data.price).toBe(tourData.price);
    expect(res.body.data.data.difficulty).toBe(tourData.difficulty);
    expect(res.body.data.data.startLocation.coordinates).toEqual(tourData.startLocation.coordinates);
  });

});
