import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

if (process.env.NODE_ENV !== "test" && JWT_SECRET === "your-secret-key") {
  console.warn("WARNING: Using default JWT secret. Set JWT_SECRET in .env");
}

export const generateToken = (userId: string, role: string): string => {
  return jwt.sign({ id: userId, role }, JWT_SECRET, { expiresIn: "7d" });
};

export const verifyToken = (token: string): { id: string; role: string } => {
  return jwt.verify(token, JWT_SECRET) as { id: string; role: string };
};
