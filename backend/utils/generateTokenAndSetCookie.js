import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (res, userId) => {
  const token = jwt.sign({ userId }, "basptksohotsolovelyisgood", {
    expiresIn: "7d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: "development" !== "development",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return token;
};
