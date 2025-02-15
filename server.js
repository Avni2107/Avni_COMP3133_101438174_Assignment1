const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const connectDB = require("./config/db");
const typeDefs = require("./schemas/typeDefs");
const resolvers = require("./resolvers/resolvers");

require("dotenv").config();

const app = express();
connectDB();

const server = new ApolloServer({ typeDefs, resolvers });
server.start().then(() => {
    server.applyMiddleware({ app });

    app.listen(4000, () => {
        console.log("Server running at http://localhost:4000" + server.graphqlPath);
    });
});
