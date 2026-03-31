const express = require("express");
const app = express();
const sequelize = require("./config/db");
require("dotenv").config();
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");

const path = require("path");

const swaggerDoc = YAML.load(
  path.join(__dirname, "swagger", "swagger.yaml")
);
//  Middleware
app.use(express.json());


app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));

// Routes
const routes = require("./routes");
app.use("/api", routes);

//  Health check route
app.get("/", (req, res) => {
  res.send("API Running Successfully ");
});

//  Start server
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log(" DB Connected Successfully");

    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT || 5000}`);
    });

  } catch (err) {
    console.error("DB Connection Failed:", err);
    process.exit(1);
  }
};

startServer();