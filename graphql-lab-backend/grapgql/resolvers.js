const Driver = require('../models/Driver');
const Car = require('../models/Car');

module.exports = {
  Query: {
    drivers: async () => await Driver.find().populate('cars'),
    cars: async () => await Car.find(),
  },
  Mutation: {
    addDriver: async (_, { name, age }) => {
      const driver = new Driver({ name, age });
      return await driver.save();
    },
    addCar: async (_, { name, model, driverId }) => {
      const car = new Car({ name, model });
      const savedCar = await car.save();
      await Driver.findByIdAndUpdate(driverId, {
        $push: { cars: savedCar._id },
      });
      return savedCar;
    },
  },
};
