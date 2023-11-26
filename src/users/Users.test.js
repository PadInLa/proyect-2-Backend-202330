import supertest from "supertest";
import app from "../../app.js";

describe("User Endpoints", () => {
  let token;

  // POST - Create User
  describe("Create User", () => {
    test("Successfully creates a user", async () => {
      const userData = {
        name: "Pedro",
        password: "aa1234",
        email: "pedro@example.com",
        address: "123 Main St",
        phone: "555-1234",
        mode:"cliente"
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

  // GET - Retrieve User by ID
  describe("Retrieve User by ID", () => {
    test("Successfully retrieves a user", async () => {
      const userId = "someUserId"; // Replace with a valid user ID
      const response = await supertest(app).get(`/users/${userId}`);
      expect(response.status).toBe(200);
    });

    test("Fails to retrieve a non-existent user", async () => {
      const nonExistentUserId = "nonExistentUserId";
      const response = await supertest(app).get(`/users/${nonExistentUserId}`);
      expect(response.status).toBe(404);
    });
  });

  // PATCH - Update User
  describe("Update User", () => {
    test("Successfully updates a user", async () => {
      // Obtain a valid token first
      const updateData = {
        address: "Updated Address",
      };

      const response = await supertest(app)
        .patch(`/users/someUserId`)
        .send(updateData)
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(200);
    });

    test("Fails to update a user with invalid token", async () => {
      const updateData = {
        address: "Updated Address",
      };

      const response = await supertest(app)
        .patch(`/users/someUserId`)
        .send(updateData)
        .set("Authorization", "Bearer invalidToken");
      expect(response.status).toBe(401);
    });
  });

  // DELETE - Delete User
  describe("Delete User", () => {
    test("Successfully deletes a user", async () => {
      // Obtain a valid token first
      const response = await supertest(app)
        .delete(`/users/someUserId`)
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(200);
    });

    test("Fails to delete a user with invalid token", async () => {
      const response = await supertest(app)
        .delete(`/users/someUserId`)
        .set("Authorization", "Bearer invalidToken");
      expect(response.status).toBe(401);
    });
  });
});
