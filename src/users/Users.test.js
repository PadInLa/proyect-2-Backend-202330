import supertest from "supertest";
import app from "../../app.js";
import twofactor from "node-2fa";


jest.mock("node-2fa", () => ({
  generateSecret: jest.fn(() => ("ahoraganoyo")),
}));
jest.mock('node-2fa', () => ({
  generateToken: jest.fn(() => ({ token: 'ahoraganoyo' })),
  verifyToken: jest.fn(() => ({ delta: 0 })),
}));

describe("User Endpoints", () => {
  let token;

  // POST - Create User
  describe("Create User", () => {
    test("Successfully creates a user", async () => {
      const userData = {
        name: "Padinla",
        password: "1234321",
        email: "Padinla@example.com",
        address: "123 Main St",
        phone: "555-12345689",
        mode:"administrador de restaurante"
      };

      const response = await supertest(app).post("/users/").send(userData);
      expect(response.status).toBe(201);
    });

    test("Fails to create a user with incomplete data", async () => {
      const incompleteUserData = {
        name: "Pedro",
        password: "123",
      };

      const response = await supertest(app)
        .post("/users/")
        .send(incompleteUserData);
      expect(response.status).toBe(500);
    });
  });

  // GET - Retrieve User by getUserbyName_pass
  describe("Retrieve User by Name_pass", () => {
    test("Successfully retrieves a user", async () => {
      const email = "Padinla@example.com"; 
      const pass = "1234321";     
      const response = await supertest(app).get(`/users/${email}/${pass}`);
      token = response.body.token;
      console.log("hay dios mio ",token);
      expect(response.status).toBe(200);
    });
  });

  // GET - Retrieve User by ID
  describe("Retrieve User by ID", () => {
    test("Successfully retrieves a user", async () => {
      const userId = "656364b4213773deca7b04cf"; // Replace with a valid user ID
      const response = await supertest(app).get(`/users/${userId}`);
      expect(response.status).toBe(200);
    });

    test("Fails to retrieve a non-existent user", async () => {
      const nonExistentUserId = "656364b4213773deca7b04aa";
      const response = await supertest(app).get(`/users/${nonExistentUserId}`);
      expect(response.status).toBe(404);
    });
  });


  // PATCH - Update User
  describe("Update User", () => {
    test("Successfully updates a user", async () => {
      // Obtain a valid token first
      const updateData = {
        address: "calle 52",
      };

      const response = await supertest(app)
        .patch(`/users/`)
        .send(updateData)
        .set("Authorization", `${token}`);
      expect(response.status).toBe(200);
    });

    test("Fails to update a user with invalid token", async () => {
      const updateData = {
        address: "Updated Address",
      };

      const response = await supertest(app)
        .patch(`/users/`)
        .send(updateData)
        .set("Authorization", token);
      expect(response.status).toBe(401);
    });
  });

  // DELETE - Delete User
  describe("Delete User", () => {
    test("Successfully deletes a user", async () => {
      // Obtain a valid token first
      const response = await supertest(app)
        .delete(`/users/someUserId`)
        .set("Authorization", ` ${token}`);
      expect(response.status).toBe(200);
    });

    test("Fails to delete a user with invalid token", async () => {
      const response = await supertest(app)
        .delete(`/users/someUserId`)
        .set("Authorization", token);
      expect(response.status).toBe(401);
    });
  });
});
