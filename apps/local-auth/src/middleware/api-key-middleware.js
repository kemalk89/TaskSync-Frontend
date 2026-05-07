function apiKeyMiddleware(req, res, next) {
  var apiKey = req.headers["x-api-key"];

  if (!apiKey) {
    return res.status(401).send({ error: "Header X-API-Key is required" });
  }

  if (apiKey !== process.env.API_KEY) {
    return res.status(401).send({ error: "Invalid X-API-Key" });
  }

  next();
}

module.exports = apiKeyMiddleware;
