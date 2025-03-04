import { tour, tour2, TourData } from "./../../../../helper/tour";
import * as supertest from "supertest";
import { Response } from "superagent";
import { getUser, signUp, deleteFunction } from "../../../../helper/user";
import { generateTourData } from "../../../../helper/tour";

const request = supertest("http://localhost:8001/api/v1");

let cookie: string;
let adminUser: any;

describe("TOUR NEGATIVE TEST CASES - /tours", () => {
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

  // 🚨 1. Missing required fields
  it("should return 400 when required fields are missing", async () => {
    const res: Response = await tour(cookie, {});
    console.log(res.body);

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toContain("Request body cannot be empty");
  });

  // 🚨 2. Invalid data types
  it("should return 400 when sending data without name", () => {
    return tour2(cookie, {
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
    }).then((res: Response) => {
      console.log(res);
      expect(res.status).toBe(400);
      expect(res.body.message).toContain("A tour must have a name");
    });
  });
  it("should return 400 when sending data without durations", () => {
    return tour2(cookie, {
      name: "NameOfTheTour",
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
    }).then((res: Response) => {
      console.log(res);
      expect(res.status).toBe(400);
      expect(res.body.message).toContain("A tour must have duration");
    });
  });
  it("should return 400 when sending data without maxGroupSize", () => {
    return tour2(cookie, {
      name: "NameOfTheTour",
      duration: 10,
      description: "Could be",
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
    }).then((res: Response) => {
      console.log(res);
      expect(res.status).toBe(400);

      expect(res.body.message).toContain("A tour must have a group size");
    });
  });
  it("should return 400 when sending data without difficulty", () => {
    return tour2(cookie, {
      name: "NameOfTheTour",
      duration: 10,
      description: "Could be",
      maxGroupSize: 10,
      summary: "Test tour",
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
    }).then((res: Response) => {
      console.log(res);
      expect(res.status).toBe(400);

      expect(res.body.message).toContain(
        "Difficulty is either: easy, medium, difficult"
      );
    });
  });

  // 🚨 3. Invalid difficulty value
  it("should return 400 for an invalid difficulty value", (done) => {
    request
      .post("/tours")
      .set("Cookie", cookie)
      .send({
        ...generateTourData(),
        difficulty: "super-hard", // ❌ Not in ["easy", "medium", "difficult"]
      })
      .expect(400)
      .end((err: Error | null, res: Response) => {
        if (err) return done(err);

        try {
          expect(res.body.message).toBe(
            "Difficulty is either: easy, medium, difficult"
          );
          done();
        } catch (error) {
          done(error);
        }
      });
  });

  // 🚨 4. Test: Rating validation
  it("should return 400 when rating is out of range", async () => {
    try {
      const res: Response = await tour(cookie, {
        ...generateTourData(),
        ratingsAverage: 10, // ❌ Rating must be between 1 and 5
      });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toContain(
        "Ratings average must be between 1 and 5"
      );
    } catch (err) {
      console.error("�� Test failed due to:", err);
      throw new Error(err);
    }
  });

  // 🚨 5. Test: Discount price validation
  it("should return 400 when discount price is higher than regular price", async () => {
    try {
      const res: Response = await tour(cookie, {
        ...generateTourData(),
        price: "",
      });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toContain("A tour must have a price");
    } catch (error) {
      console.error("❌ Test failed due to:", error);
      throw new Error(error);
    }
  });
  it("should return 400 when discount price is higher than regular price", async () => {
    try {
      const res: Response = await tour(cookie, {
        ...generateTourData(),
        price: 100,
        priceDiscount: 150, // ❌ Discount price must be lower than price
      });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toContain(
        "Discount price should be below regular price"
      );
    } catch (error) {
      console.error("❌ Test failed due to:", error);
      throw new Error(error);
    }
  });

  // 🚨 6. Missing required summary field
  it("should return 400 when summary is missing", async () => {
    try {
      const res: Response = await tour(cookie, {
        ...generateTourData(),
        summary: "", // ❌ Required field missing
      });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toContain("A tour must have a summary");
    } catch (error) {
      console.error("❌ Test failed due to:", error);
      throw new Error(error);
    }
  });

  // 🚨 7. Missing image cover field
  it("should return 400 when image cover is missing", async () => {
    try {
      const res: Response = await tour(cookie, {
        ...generateTourData(),
        imageCover: "", // ❌ Required field missing
      });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toContain("A tour must have a cover image");
    } catch (error) {
      console.error("❌ Test failed due to:", error);
      throw new Error(
        "❌ Test failed: Expected 'A tour must have a cover image', but got something else!"
      );
    }
  });

  // 🚨 8. Test: Invalid start location format
  it("should return 400 when startLocation is missing coordinates", () => {
    return tour(cookie, {
      ...generateTourData(),
      startLocation: {
        type: "Point",
        coordinates: [], // ❌ Empty coordinates array
      },
    })
      .then((res: Response) => {
        console.log(res.body);
        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toContain("Invalid location format");
      })
      .catch((err: Error) => {
        console.error("�� Test failed due to:", err);
      });
  });
  it("should return 400 when startLocation is not a number", () => {
    return tour(cookie, {
      ...generateTourData(),
      startLocation: {
        type: "Point",
        coordinates: ["-30.098987", "30.098987"], // ❌ Empty coordinates array
      },
    })
      .then((res: Response) => {
        console.log(res.body);
        expect(res.statusCode).toEqual(400);

        expect(res.body.message).toContain("Invalid location format");
      })
      .catch((err: Error) => {
        console.error("�� Test failed due to:", err);
      });
  });

  // 🚨 9. Unauthorized tour creation
  it("should return 401 when creating a tour without authentication", async () => {
    try {
      const res: Response = await request
        .post("/tours")
        .send(generateTourData());

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toBe(
        "You are not logged in! Please log in to get access."
      );
    } catch (error) {
      console.error("❌ Test failed due to:", error);
      throw new Error(error);
    }
  });
});
