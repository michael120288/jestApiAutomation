import { faker } from '@faker-js/faker';

import * as supertest from "supertest";
import { User } from './interface';
const request = supertest("localhost:8001/api/v1");
// 1. Login Function (Promise with async/await)
export function login(user: object): Promise<any> {
  return new Promise((resolve, reject) => {
    request
      .post("/users/login")
      .send(user)
      .end((err, res) => {
        if (err) reject(err);
        else resolve(res);
      });
  });
}


// 2. Signup Function (Promise with async/await)
export function signUp(user: object): Promise<any> {
  return new Promise((resolve, reject) => {
    request
      .post("/users/signup")
      .send(user)
      .end((err, res) => {
        if (err) reject(err);
        else resolve(res);
      });
  });
}


// 3. Signup2 Function (Simplified for chaining)
export function signUp2(user: string | object | undefined) {
  return request.post("/users/signup").send(user);
}
export function login2(user: {
    email: string;
    password: string;
  }) {
    return request
    .post("/users/login")
    .send({ email: user.email, password: user.password })
}

export function deleteFunction2(cookie: string) {
    return request
    .delete("/users/deleteMe")
    .set("Cookie", cookie)
}

// 4. Delete Function
export function deleteFunction(cookie: string): Promise<any> {
  return new Promise((resolve, reject) => {
    request
      .delete("/users/deleteMe")
      .set("Cookie", cookie)
      .end((err, res) => {
        console.log(err,'err');
        console.log(res.body,'res');
        if (err) reject(err);
        else resolve(res);
      });
  });
}


export function getUser(role:string):User {
    const randomUser = createRandomUser();
    const password = 'test1234'; 
  
    return {
        name: randomUser.username!,
        email: randomUser.email.toLowerCase(),
        password: password,
        passwordConfirm: password,
        role:role
    };
  }


export function createRandomUser(){
    return {
      userId: faker.string.uuid(),
      username: faker.internet.username(),
      email: faker.internet.email(),
      avatar: faker.image.avatar(),
      password: faker.internet.password(),
      birthdate: faker.date.birthdate(),
      registeredAt: faker.date.past(),
    };
  }

  // ✅ Helper Function - Update User Details
export async function updateUser(updateData: Partial<User>,token:string) {
  const res = await request
    .patch("/users/updateMe")
    .set("Authorization", `Bearer ${token}`)
    .send(updateData);

  expect(res.statusCode).toBe(200);
  expect(res.body.data.user).toBeDefined();
  return res.body.data.user;
}

// ✅ Helper Function - Upload User Photo
export async function uploadUserPhoto(filePath: string,token:string) {
  const res = await request
    .patch("/users/updateMe")
    .set("Authorization", `Bearer ${token}`)
    .attach("photo", filePath);

  expect(res.statusCode).toBe(200);
  expect(res.body.data.user.photo).toBeDefined();
  expect(typeof res.body.data.user.photo).toBe("string");

  return res.body.data.user.photo;
}