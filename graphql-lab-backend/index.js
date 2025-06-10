const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const mongoose = require('mongoose');
const cors = require('cors');

///////////////////////mongoose setup

const CarSchema = new mongoose.Schema({
  name: String,
  model: String,
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver',
  },
});

const DriverSchema = new mongoose.Schema({
  name: String,
  age: Number,
});

const Driver = mongoose.model('Driver', DriverSchema);
const Car = mongoose.model('Car', CarSchema);

////////////////// graaphql setup
const typeDefs = gql`
  type Car {
    id: ID!
    name: String!
    model: String!
  }

  type Driver {
    id: ID!
    name: String!
    age: Int!
    cars: [Car]
  }

  type Query {
    drivers: [Driver]
    cars: [Car]
  }

  type Mutation {
    addDriver(name: String!, age: Int!): Driver
    addCar(driverId: ID!, name: String!, model: String!): Car
  }
`;

const resolvers = {
  Query: {
    drivers: async () => await Driver.find(),
    cars: async () => await Car.find(),
  },

  Driver: {
    cars: async (parent) => await Car.find({ driverId: parent.id }),
  },

  Mutation: {
    addDriver: async (_, { name, age }) => {
      return await new Driver({ name, age }).save();
    },

    addCar: async (_, { driverId, name, model }) => {
      return await new Car({ name, model, driverId }).save();
    },
  },
};

async function startServer() {
  const app = express();
  app.use(cors());

  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();
  server.applyMiddleware({ app });

  mongoose.connect('mongodb://127.0.0.1:27017/graphql_lab');

  app.listen(4000, () => {
    console.log('Server running at http://localhost:4000/graphql');
  });
}

startServer();
