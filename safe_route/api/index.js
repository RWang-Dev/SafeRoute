const { app } = require("@azure/functions");
const { ObjectId } = require("mongodb");
const MongoClient = require("mongodb").MongoClient;

const MONGO_URI = process.env.AZURE_MONGO_DB;

app.http("checkDbConnection", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "checkDbConnection",
  handler: async (request, context) => {
    try {
      const client = await MongoClient.connect(MONGO_URI);

      await client.close();
      return {
        jsonBody: { message: "Successfully connected to the database" },
        status: 200,
      };
    } catch (error) {
      return {
        jsonBody: {
          error: "Failed to connect to the database",
          details: error.message,
        },
        status: 500,
      };
    }
  },
});

app.http("getLocation", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "getLocation",
  handler: async (request, context) => {
    const client = new MongoClient(MONGO_URI);
    try {
      await client.connect();
      const database = client.db("SafeRoute");
      const locations = database.collection("saved_locations");

      const loc_id = request.query.get("loc_id");
      // Fetch all todo items
      const location = await locations.find({ _id: loc_id }).toArray();

      return {
        jsonBody: location.reverse(),
        status: 200,
      };
    } catch (error) {
      console.error("Failed to retrieve todos:", error);
      return {
        jsonBody: { error: "Failed to retrieve todos" },
        status: 500,
      };
    } finally {
      await client.close();
    }
  },
});

app.http("getLocations", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "getLocations",
  handler: async (request, context) => {
    let responseMessage;
    let responseStatus = 200;

    const client = new MongoClient(MONGO_URI);

    try {
      await client.connect();
      const database = client.db("SafeRoute");
      const locations = database.collection("saved_locations");

      const userID = request.query.get("userID");
      console.log(userID);
      let user_locations = await locations.find({ userID: userID }).toArray();

      responseMessage = "location added successfully" + request.body;
      return {
        jsonBody: user_locations.reverse(),
        status: 200,
      };
    } catch (error) {
      console.error("Error getting location:", error);
      responseMessage = "Failed to get location";
      responseStatus = 500;
    } finally {
      await client.close();
    }

    return {
      jsonBody: { message: responseMessage },
      status: responseStatus,
    };
  },
});

app.http("addLocation", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "addLocation",
  handler: async (request, context) => {
    let responseMessage;
    let responseStatus = 200;

    const client = new MongoClient(MONGO_URI);

    try {
      await client.connect();
      const database = client.db("SafeRoute");
      const locations = database.collection("saved_locations");

      const { userID, location_name, location_address, place_id } =
        await request.json();
      await locations.insertOne({
        userID,
        location_name,
        location_address,
        place_id,
      });

      responseMessage = "location added successfully" + request.body;
    } catch (error) {
      console.error("Error adding location:", error);
      responseMessage = "Failed to add location";
      responseStatus = 500;
    } finally {
      await client.close();
    }

    return {
      jsonBody: { message: responseMessage },
      status: responseStatus,
    };
  },
});

app.http("deleteLocation", {
  methods: ["DELETE"],
  authLevel: "anonymous",
  route: "deleteLocation",
  handler: async (request, context) => {
    const client = new MongoClient(MONGO_URI);
    try {
      await client.connect();
      const location_id = request.query.get("loc_id");
      const result = await client
        .db("SafeRoute")
        .collection("saved_locations")
        .deleteOne({ _id: location_id });

      return {
        jsonBody: {
          message: "successfully deleted",
        },
        status: result.deletedCount === 1 ? 200 : 404,
      };
    } catch (error) {
      console.error("Error deleting location:", error);
      return {
        jsonBody: { message: "Failed to delete location" },
        status: 500,
      };
    } finally {
      await client.close();
    }
  },
});

app.http("editLocation", {
  methods: ["PUT"],
  authLevel: "anonymous",
  route: "editLocation",
  handler: async (request, context) => {
    const client = new MongoClient(MONGO_URI);
    try {
      await client.connect();
      const { location_id, location_name, location_address } =
        await request.json();
      const result = await client
        .db("SafeRoute")
        .collection("saved_locations")
        .updateOne(
          { _id: location_id },
          { $set: { location_name, location_address } }
        );

      return {
        jsonBody: { message: "successfully edited" },
        status: result.modifiedCount === 1 ? 200 : 404,
      };
    } catch (error) {
      console.error("Error updating location:", error);
      return {
        jsonBody: { message: "Failed to update location" },
        status: 500,
      };
    } finally {
      await client.close();
    }
  },
});
