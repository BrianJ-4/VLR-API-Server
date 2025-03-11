const express = require('express');
const app = express ();
app.use(express.json());

const newsRoutes = require("./routes/news");

app.use("/news", newsRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Server Listening on PORT:", PORT);
});

app.use((req, res) => {
    res.status(404).json({ error: "Route not found in the API" });
});