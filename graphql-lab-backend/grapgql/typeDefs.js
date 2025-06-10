const { gql } = require('apollo-server-express');

module.exports = gql`
  type Car {
    id: ID
    name: String
    model: String
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
    addCar(name: String!, model: String!, driverId: ID!): Car
  }
`;
