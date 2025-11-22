
const express = require("express");
const cors = require("cors");
const convertRoutes = require("./routes/convertRoutes");

const app = express();

// Middleware
app.use(cors());

// Routes
app.use("/convert", convertRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Node server running on http://localhost:${PORT}`));
