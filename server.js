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
                const validDate = /^\d{4}-\d{2}-\d{2}$/;
                const findEmail = await User.findAndCountAll({
                    where: {
                        email
                    }
                });

                if (findEmail.count > 0) {
                    return res.json({
                        "message": "email already used!"
                    });
                }

                if (validDate.test(birthday)) {
                    const user = await User.create({
                        birthday,
                        firstName,
                        lastName,
                        email,
                        location,
                    });
                    return res.json({
                        "message": "Created!",
                        "data": user
                    });
                } else {
                    return res.json({
                        "message": "Format birthday invalid!"
                    });
                }

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
            const user = await User.findAndCountAll({
                where: {
                    id
                }
            });

            if (user.count > 0) {
                await User.destroy({
                    where: {
                        id
                    }
                });
                return res.json({
                    "message": `Delete userId ${id}`
                });
            }

            return res.json({
                "message": `User not found`
            });
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
            const validDate = /^\d{4}-\d{2}-\d{2}$/;
            if (validDate.test(birthday)) {
                const user = await User.findByPk(id);
                user.firstName = firstName;
                user.lastName = lastName;
                user.birthday = birthday;
                user.location = location;
                user.email = email;
                await user.save();
                return res.json({
                    "message": "Updated!",
                    "data": user
                });
            } else {
                return res.json({
                    "message": "Format birthday invalid!"
                });
            }
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