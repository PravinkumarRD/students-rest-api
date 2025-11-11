const express = require("express");
require("dotenv").config();
const morgan = require("morgan");
const cors = require("cors");

const {
  authorizationMiddleware,
} = require("./src/middleware/authorization-middleware");
const userRoutes = require("./src/routes/user-routes");
const eventRoutes = require("./src/routes/event-routes");
const employeeRoutes = require("./src/routes/employee-routes");

const PORT = process.env.PORT || 8080;

const app = express();
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

app.use(
  cors({
    origin: ["http://localhost:4200", "capacitor://localhost", "file://"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.options('*', cors()); // Handle preflight

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("combined"));

app.use("/api/users", userRoutes);
app.use("/api/events", authorizationMiddleware, eventRoutes);
app.use("/api/employees", authorizationMiddleware, employeeRoutes);

app.listen(PORT, () =>
  console.log(`Students Events Service is running on PORT ${PORT}`)
);
