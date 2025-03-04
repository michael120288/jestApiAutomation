import { faker } from "@faker-js/faker";

// ✅ Define Tour Interface
export interface TourData {
  name: string;
  duration: number;
  description: string;
  maxGroupSize: number;
  summary: string;
  difficulty: "easy" | "medium" | "difficult";
  price: number;
  ratingsAverage: number;
  imageCover: string;
  guides: string[];
  startDates: string[];
  startLocation: {
    type: "Point";
    coordinates: [number, number];
  };
  locations: {
    type: "Point";
    coordinates: [number, number];
  };
}

// ✅ Function to Generate Fake Tour Data
export function generateTourData(): TourData {
  return {
    name: faker.lorem.words(3),
    duration: faker.number.int({ min: 3, max: 20 }),
    description: faker.lorem.paragraph(),
    maxGroupSize: faker.number.int({ min: 5, max: 30 }),
    summary: faker.lorem.sentence(),
    difficulty: faker.helpers.arrayElement(["easy", "medium", "difficult"]),
    price: faker.number.int({ min: 100, max: 5000 }),
    ratingsAverage: faker.number.float({ min: 1, max: 5, fractionDigits: 1 }),
    imageCover: faker.image.urlPicsumPhotos(),
    guides: [],
    startDates: [faker.date.future().toISOString()],
    startLocation: {
      type: "Point",
      coordinates: [faker.location.longitude({ max: 90, min: -90, precision: 5 }), faker.location.latitude({ max: 90, min: -90, precision: 5 })],
    },
    locations: {
        type: "Point",
        coordinates: [faker.location.longitude({ max: 90, min: -90, precision: 5 }), faker.location.latitude({ max: 90, min: -90, precision: 5 })],
      },
  };
}

// ✅ Generate INVALID Tour Data
export function generateInvalidTourData(): Partial<TourData> {
    return {
      name: faker.string.alpha(5), // ❌ Too short (minlength: 10)
      duration: faker.helpers.arrayElement(["short", "long"]) as any, // ❌ Invalid type (should be number)
      maxGroupSize: faker.helpers.arrayElement(["big", "small"]) as any, // ❌ Invalid type (should be number)
      price: -50, // ❌ Negative price
      difficulty: "hardcore" as any, // ❌ Invalid enum value
      ratingsAverage: 10, // ❌ Out of valid range (1-5)
      summary: "", // ❌ Required field missing
      imageCover: "", // ❌ Required field missing
      startLocation: {
        type: "Point",
        coordinates: [] as any, // ❌ Empty coordinates
      },
    };
  }

  export function tour(cookie:string,tourData: object): Promise<any> {
    return new Promise((resolve, reject) => {
      request
      .post("/tours")
        .set("Cookie", cookie)
        .send(tourData)
        .end((err, res) => {
          if (err) reject(err);
          else resolve(res);
        });
    });
  }
  export function tour2(cookie: string,tourData:object):Promise<any> {
      return request
      .post("/tours")
      .set("Cookie", cookie)
      .send(tourData)
  }
  