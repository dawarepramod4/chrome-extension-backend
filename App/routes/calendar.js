const express = require("express");
const { google } = require("googleapis");
const router = express.Router();
const moment = require("moment");
const now = moment();
var beginning = now.clone().startOf("day");
var end = now.clone().endOf("day");
router.get("/events", async (req, res) => {
    try {
        const userToken = req.query.token;
        const filter = req.query.loadFor ?? "";

        switch (filter.toUpperCase()) {
            case "TODAY":
                beginning = now.clone().startOf("day");
                end = now.clone().endOf("day");
                break;
            case "TOMORROW":
                beginning = now.clone().add(1, "days").startOf("day");
                end = now.clone().add(1, "days").endOf("day");
                break;
            case "THIS WEEK":
                beginning = now.clone().startOf("week");
                end = now.clone().endOf("week");
                break;
            case "NEXT WEEK":
                beginning = now.clone().add(1, "weeks").startOf("week");
                end = now.clone().add(1, "weeks").endOf("week");
                break;
            default:
        }
        // ["Today", "Tomorrow", "This week", "Next Week"];
        // Assuming the token is in the query parameter
        console.log(userToken);
        const oauth2Client = new google.auth.OAuth2();
        oauth2Client.setCredentials({ access_token: userToken });
        const calendar = google.calendar({ version: "v3", auth: oauth2Client });

        const events = await calendar.events.list({
            calendarId: "primary", // Use 'primary' for the user's primary calendar
            timeMin: formatDate(beginning),
            timeMax: formatDate(end),
            maxResults: 50, // Maximum number of events to fetch
            singleEvents: true,
            orderBy: "startTime",
        });
        console.log(events.data.items.length);
        res.json(events.data.items);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An error occurred" });
    }
});

const formatDate = (date) => {
    return date.toISOString();
};

module.exports = router;
