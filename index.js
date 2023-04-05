const express = require('express');
const bodyParser = require('body-parser');
const {
  Sequelize,
  Model,
  DataTypes,
  where
} = require('sequelize');
const schedules = require('./schedules.js');

// Initialize the app
const app = express();
const database = {
  "name": "birthday_db",
  "username": "admin",
  "password": "ofqETK1PxX"
};

// Register Middleware
app.use(bodyParser.json());

// Initialize the database
const sequelize = new Sequelize(database.name, database.username, database.password, {
  dialect: 'sqlite',
  storage: 'database.sqlite',
});

// Define the User model
class User extends Model {}
User.init({
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: true
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: true
  },
  birthday: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: true
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: true
  },
}, {
  sequelize,
  modelName: 'user'
});

// Define the UnsentMessage model
class UnsentMessage extends Model {}
UnsentMessage.init({
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: true
  },
  message: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: true
  },
}, {
  sequelize,
  modelName: 'unsentMessage'
});

// Create the tables in the database
sequelize.sync();

// Create a new user
app.post('/user',
  async (req, res) => {
    const {
      firstName,
      lastName,
      email,
      birthday,
      location
    } = req.body;
    try {
      const user = await User.create({
        birthday: new Date(birthday),
        firstName,
        lastName,
        email,
        location,
      });
      res.json(user);
    } catch (error) {
      return res.status(400).json({
        error
      });
    }
  });

// Delete a user
app.delete('/user/:id', async (req, res) => {
  try {
    const {
      id
    } = req.params;
    await User.destroy({
      where: {
        id
      }
    });
    res.sendStatus(204);
  } catch (error) {
    return res.status(400).json({
      error
    });
  }
});

// Update a user
app.put('/user/:id', async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const {
      firstName,
      lastName,
      email,
      birthday,
      location
    } = req.body;
    const user = await User.findByPk(id);
    user.firstName = firstName;
    user.lastName = lastName;
    user.birthday = new Date(birthday);
    user.location = location;
    user.email = email;
    await user.save();
    res.json(user);
  } catch (error) {
    return res.status(400).json({
      error
    });
  }
});

// run the schedule
schedules();

// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});