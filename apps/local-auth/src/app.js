var express = require("express");
var { rateLimit } = require("express-rate-limit");
var http = require("http");

var db = require("./db");

var signupRouter = require("./controllers/signup");
var signinRouter = require("./controllers/signin");

db.init().then(() => {
  var app = express();

  app.use(limiter);

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  app.use("/", signinRouter);
  app.use("/", signupRouter);

  const port = 3002;
  app.set("port", port);

  var server = http.createServer(app);

  server.listen(port);
  server.on("error", onError);
  server.on("listening", () => {
    var addr = server.address();
    var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
    console.log("Listening on " + bind);
  });
});

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
    default:
      throw error;
  }
}

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 20, // Limit each IP to 20 requests per `window` (here, per 15 minutes) -> allow 80 request per hour
  standardHeaders: "draft-8", // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  ipv6Subnet: 56, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
  // store: ... , // Redis, Memcached, etc.
});
