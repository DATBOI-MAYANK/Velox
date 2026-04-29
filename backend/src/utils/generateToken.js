import "dotenv/config";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const accessTokenExpiry = process.env.ACCESS_TOKEN_EXPIRY;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
const refreshTokenExpiry = process.env.REFRESH_TOKEN_EXPIRY;

function signAccessToken(payload) {
  try {
    return jwt.sign(
      {
        ...payload,
        type: "access",
      },
      accessTokenSecret,
      {
        expiresIn: accessTokenExpiry,
        issuer: "Velox",
        audience: "Velox-api",
        jwtid: crypto.randomUUID(),
      },
    );
  } catch (err) {
    throw new Error(`Error signing access token: ${err.message}`);
  }
}

function signRefreshToken(payload) {
  try {
    const refreshPayload = {
      userId: payload.userId || payload._id,
      email: payload.email,
      type: "refresh",
      tokenFamily: crypto.randomUUID(),
    };

    return jwt.sign(refreshPayload, refreshTokenSecret, {
      expiresIn: refreshTokenExpiry,
      issuer: "Velox",
      audience: "Velox-api",
      jwtid: crypto.randomUUID(),
    });
  } catch (err) {
    throw new Error(`Error signing refresh token: ${err.message}`);
  }
}

function verifyToken(token, type = "access") {
  try {
    const secret = type === "refresh" ? refreshTokenSecret : accessTokenSecret;

    const decoded = jwt.verify(token, secret, {
      issuer: "Velox",
      audience: "Velox-api",
    });

    if (decoded.type !== type) {
      throw new Error(
        `Invalid token type. Expected ${type}, got ${decoded.type}`,
      );
    }

    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error(
        `${type.charAt(0).toUpperCase() + type.slice(1)} token expired`,
      );
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error(`Invalid ${type} token`);
    }
    throw error;
  }
}

export { signAccessToken, signRefreshToken, verifyToken };
