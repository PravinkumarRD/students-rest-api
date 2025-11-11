const express = require("express");
require("dotenv").config();
const morgan = require("morgan");
const cors = require("cors");

const { authorizationMiddleware } = require("./src/middleware/authorization-middleware");
const userRoutes = require("./src/routes/user-routes");
const eventRoutes = require("./src/routes/event-routes");
const employeeRoutes = require("./src/routes/employee-routes");

const PORT = process.env.PORT || 8080;

const app = express();

// ✅ Single, correct CORS setup — allows file://, web, and app
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || origin === "null") {
      // WebView / file:// access
      callback(null, true);
    } else {
      const allowedOrigins = [
        "https://students-events-service.up.railway.app",
        "https://students-rest-api-production.up.railway.app"
      ];
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("combined"));

app.use("/api/users", userRoutes);
app.use("/api/events", authorizationMiddleware, eventRoutes);
app.use("/api/employees", authorizationMiddleware, employeeRoutes);

app.listen(PORT, () => console.log(`✅ Students Events Service is running on PORT ${PORT}`));
