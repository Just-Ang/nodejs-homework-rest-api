import mongoose from "mongoose";
import "dotenv/config";
import app from "../../app.js";
import request from "supertest";

const { DB_HOST_TEST } = process.env;

describe("test login route", () => {
    let server = null;
  beforeAll(async () => {
    
    await mongoose.connect(DB_HOST_TEST);
    server = app.listen(3000);
  });

  afterAll(async () => {
    await mongoose.connection.close();
   server.close();
  });

  test("status code = 200", async () => {
  

    const loginData =     {
        password: "1234566",
        email: "dui.iin@egetlacus.ca"
        };
    const {statusCode, body} = await request(app).post("/api/users/login").send(loginData);
    console.log(body);

    expect(statusCode).toBe(200);
  });

  test(" return token", async () => {
    

    const loginData =     {
        password: "1234566",
        email: "dui.iin@egetlacus.ca"
        };
    const {statusCode, body} = await request(app).post("/api/users/login").send(loginData);
    console.log(body);

    expect(body.token).toBeDefined();
  });


  test("return info about user", async () => {
    

    const loginData =     {
        password: "1234566",
        email: "dui.iin@egetlacus.ca"
        };
    const {statusCode, body} = await request(app).post("/api/users/login").send(loginData);
    console.log(body);
   console.log(body.user.email);

    expect(body.user).toBeDefined();
    
    expect(body.user.email).toBeDefined();
    expect(body.user.subscription).toBeDefined();
    expect(typeof (body.user.subscription)).toBe('string');
    expect(typeof (body.user.email)).toBe('string');
   
  });
});