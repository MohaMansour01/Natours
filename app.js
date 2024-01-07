const path = require("path");
const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cookieParser = require("cookie-parser");
const compression = require("compression");
const cors = require("cors");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const tourRouter = require("./Routes/tourRoutes");
const userRouter = require("./Routes/userRoutes");
const errorController = require("./controllers/errorController");
const reviewRouter = require("./Routes/reviewRoutes");
const bookingRouter = require("./Routes/bookingRoutes");
const viewRouter = require("./Routes/viewRoutes");

const app = express();

app.enable('trust proxy')

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// 1) global MIDDLEWARES

// CORS
app.use(cors());

app.options('*', cors());

// serving static files
app.use(express.static(path.join(__dirname, "public")));

// security headers http
app.use(helmet());

// development login
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// limit requests from same IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour.",
});
app.use("api", limiter);

// body parse, read data from body into req.body
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

// Data sanitization against noSql query injection
app.use(mongoSanitize());

// Data sanitization against XXS
app.use(xss());

// prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      "duration",
      "ratingsQuantity",
      "ratingsAverage",
      "maxGroupSize",
      "difficulty",
      "price",
    ],
  })
);

app.use(compression());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3) ROUTES mounting

app.use("/", viewRouter);
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/bookings", bookingRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorController);

module.exports = app;
