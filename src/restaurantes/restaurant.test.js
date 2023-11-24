import supertest from "supertest";
import app from "../../app.js";

describe("Restaurant Endpoints", () => {
  let token;
  let adminToken; // Token for a user with 'administrador de restaurante' role

  beforeAll(async () => {
    // Logic to obtain a valid token for authenticated requests
    // Logic to obtain a valid admin token for 'administrador de restaurante' role
  });

  // POST - Create Restaurant
  describe("Create Restaurant", () => {
    test("Successfully creates a restaurant", async () => {
      const restaurantData = {
        // ...appropriate restaurant data...
      };

      const response = await supertest(app)
        .post("/restaurants/")
        .send(restaurantData)
        .set("Authorization", adminToken);
      expect(response.status).toBe(201);
    });

    test("Fails to create a restaurant without admin privileges", async () => {
      const restaurantData = {
        // ...appropriate restaurant data...
      };

      const response = await supertest(app)
        .post("/restaurants/")
        .send(restaurantData)
        .set("Authorization", token);
      expect(response.status).toBe(401);
    });
  });

  // GET - Retrieve Restaurants
  describe("Retrieve Restaurants", () => {
    test("Successfully retrieves a list of restaurants", async () => {
      const response = await supertest(app)
        .get("/restaurants/")
        .set("Authorization", token);
      expect(response.status).toBe(200);
    });
  });

  // PATCH - Update Restaurant
  describe("Update Restaurant", () => {
    test("Successfully updates a restaurant", async () => {
      const restaurantId = "someRestaurantId"; // Replace with a valid restaurant ID
      const updateData = {
        // ...appropriate update data...
      };

      const response = await supertest(app)
        .patch(`/restaurants/${restaurantId}`)
        .send(updateData)
        .set("Authorization", adminToken);
      expect(response.status).toBe(200);
    });

    test("Fails to update a restaurant without admin privileges", async () => {
      const restaurantId = "someRestaurantId";
      const updateData = {
        // ...appropriate update data...
      };

      const response = await supertest(app)
        .patch(`/restaurants/${restaurantId}`)
        .send(updateData)
        .set("Authorization", token);
      expect(response.status).toBe(401);
    });
  });

  // DELETE - Delete Restaurant
  describe("Delete Restaurant", () => {
    test("Successfully deletes a restaurant", async () => {
      const restaurantId = "someRestaurantId"; // Replace with a valid restaurant ID

      const response = await supertest(app)
        .delete(`/restaurants/${restaurantId}`)
        .set("Authorization", adminToken);
      expect(response.status).toBe(200);
    });

    test("Fails to delete a restaurant without admin privileges", async () => {
      const restaurantId = "someRestaurantId";

      const response = await supertest(app)
        .delete(`/restaurants/${restaurantId}`)
        .set("Authorization", token);
      expect(response.status).toBe(401);
    });
  });
});
