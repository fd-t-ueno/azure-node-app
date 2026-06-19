const { CosmosClient } = require("@azure/cosmos");
require('dotenv').config();

const client = new CosmosClient({
    endpoint: process.env.COSMOS_ENDPOINT,
    key: process.env.COSMOS_KEY,
});

const database = client.database(process.env.COSMOS_DB_NAME);

function getContainer(containerName) {
    return database.container(containerName);
}

module.exports = { getContainer };
