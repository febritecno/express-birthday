const moment = require('moment-timezone');
const axios = require('axios');
const {
    User,
    UnsentMessage,
} = require('./models.js');

module.exports = () => {
    console.log("Schedules ready!");
    const MAILER_SITE = 'https://email-service.digitalenvision.com.au/send-email';

    // Send birthday messages
    async function sendBirthdayMessages() {
        const users = await User.findAll();
        if (users) {
            for (const user of users) {
                const now = moment().tz(user.location);
                const birthday = moment(user.birthday).tz(user.location);
                if (now.date() === birthday.date() && now.month() === birthday.month()) {
                    const message = `Hey, ${user.firstName} ${user.lastName}, it's your birthday`;
                    try {
                        await axios.post(MAILER_SITE, {
                            email: user.email,
                            message
                        });
                    } catch (error) {
                        await UnsentMessage.create({
                            userId: user.id,
                            email: user.email,
                            message
                        });
                    }
                }
            }
        }
    }

    // Check for unsent messages and try to send them again
    async function sendUnsentMessages() {
        const unsentMessages = await UnsentMessage.findAll();
        if (unsentMessages) {
            for (const unsentMessage of unsentMessages) {
                const user = await User.findByPk(unsentMessage.userId);
                try {
                    await axios.post(MAILER_SITE, {
                        message: unsentMessage.message,
                        email: user.email,
                    });
                    await unsentMessage.destroy();
                } catch (error) {
                    console.error(`Failed to send message to user ${user.id}: ${error.message}`);
                }
            }
        }
    }

    // Schedule the script to run every day at 9 am in each user's local time zone
    setInterval(sendBirthdayMessages, 24 * 60 * 60 * 1000);
    setInterval(sendUnsentMessages, 60 * 60 * 1000);
}