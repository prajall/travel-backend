import request from "supertest";
import app from "./app.ts"; // Add .js extension when importing in ES modules

describe("GET /", () => {
  it("should respond with a 200 status code", async () => {
    const response = await request(app).get("/");
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Server is working!");
  });
});
