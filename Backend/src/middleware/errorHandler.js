/**
 * Central error-handling middleware.
 * Express recognises it by the 4-argument signature (err, req, res, next).
 * Every controller can just call next(err) and land here.
 */
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // ── Mongoose: bad ObjectId (e.g. /users/not-an-id) ──────────────────────
  if (err.name === "CastError") {
    statusCode = 404;
    message = `Resource not found`;
  }

  // ── Mongoose: duplicate key (e.g. duplicate email) ───────────────────────
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue)[0];
    message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
  }

  // ── Mongoose: validation errors ──────────────────────────────────────────
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
  }

  // ── JWT errors ───────────────────────────────────────────────────────────
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  }
  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired";
  }

  // Log full error in dev only
  // if (process.env.NODE_ENV === "development") {
    console.error("💥 Error:", err);
//}

  res.status(statusCode).json({
    success: false,
    message,
    // Only include stack trace in development
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

module.exports = errorHandler;
