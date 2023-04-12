const {
    Sequelize,
    Model,
    DataTypes
} = require('sequelize');

class User extends Model {}
class UnsentMessage extends Model {}

function database() {
    const db = {
        "name": "birthday_db",
        "username": "admin",
        "password": "ofqETK1PxX"
    };

    // Initialize the database
    const sequelize = new Sequelize(db.name, db.username, db.password, {
        dialect: 'sqlite',
        storage: 'database.sqlite',
    });

    // Define the User model
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
}

module.exports = {
    database,
    User,
    UnsentMessage
}