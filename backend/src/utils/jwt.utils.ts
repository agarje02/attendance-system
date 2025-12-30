import jwt from "jsonwebtoken";

const verifyJWT = (token: string) => {
  const secret = process.env.JWT_SECRET ?? "";
  const decode = jwt.verify(token, secret);
  return decode;
};

const signJWT = (payload: any) => {
  const secret = process.env.JWT_SECRET ?? "";
  const token = jwt.sign(payload, secret, { expiresIn: "30d" });
  return token;
};

const signRefreshJWT = (payload: any) => {
  const secret = process.env.JWT_REFRESH_SECRET ?? process.env.JWT_SECRET ?? "";
  const refreshToken = jwt.sign(payload, secret, { expiresIn: "90d" });
  return refreshToken;
};

const verifyRefreshJWT = (token: string) => {
  const secret = process.env.JWT_REFRESH_SECRET ?? process.env.JWT_SECRET ?? "";
  const decode = jwt.verify(token, secret);
  return decode;
};

export { verifyJWT, signJWT, signRefreshJWT, verifyRefreshJWT };
