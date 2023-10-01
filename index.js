import express from "express"
import axios from "axios"

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const API_key = '7d360c0fba208f8d158e736f1d211971';

app.get("/", (req, res) => {
    res.render("index.ejs");
})

app.post("/location", async (req, res) => {
    const lat = req.body.lat;
    const lon = req.body.lon;
    try {
        const response = await axios.get(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=metric&appid=${API_key}`);
        res.json({
            location: response.data.timezone,
            latitude: lat,
            longitude: lon,
            current: response.data.current,
            hourly: response.data.hourly,
            daily: response.data.daily
        });
    } catch (error) {
        console.log(error.response.message);
        res.status(500)
    }
});

app.listen(port, () => {
    console.log("Server is running on port " + port);
})