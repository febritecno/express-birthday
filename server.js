const express = require('express');
const bodyParser = require('body-parser');
const schedules = require('./utils/schedules.js');
const {
    User,
    database
} = require('./utils/models.js');

module.exports = () => {
    // Initialize the app
    const app = express();

    // Register Middleware
    app.use(bodyParser.json());

    // Initialize database & models
    database();

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
                const date = new Date(birthday);
                const user = await User.create({
                    birthday: date,
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
            const date = new Date(birthday);
            const user = await User.findByPk(id);
            user.firstName = firstName;
            user.lastName = lastName;
            user.birthday = date;
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

    // Run the schedule
    schedules();

    // Start the server
    app.listen(3000, () => {
        console.log('Server started on port 3000');
    });
};