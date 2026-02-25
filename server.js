const express = require('express');
const app = express ();
app.use(express.json());

const newsRoutes = require("./routes/news");
const matchesRoutes = require("./routes/matches");
const playersRoutes = require("./routes/players");
const teamsRoutes = require("./routes/teams");
const searchRoutes = require("./routes/search");

app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    next();
});

app.use("/news", newsRoutes);
app.use("/matches", matchesRoutes);
app.use("/players", playersRoutes);
app.use("/teams", teamsRoutes);
app.use("/search", searchRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Server Listening on PORT:", PORT);
});

app.use((req, res) => {
    res.status(404).json({ error: "Route not found in the API" });
});