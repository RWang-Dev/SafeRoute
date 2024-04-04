const { app } = require("@azure/functions");
const { ObjectId } = require("mongodb");
const mongoClient = require("mongodb").MongoClient;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

app.http("flipCoin", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "flipCoin",
  handler: async (request, context) => {
    let result = Math.round(Math.random());
    let d = true;
    let status = 200;
    if (result === 1) {
      d = false;
      status = 500;
    }

    await sleep(1000);
    return {
      jsonBody: { data: d },
      status: status,
    };
  },
});
