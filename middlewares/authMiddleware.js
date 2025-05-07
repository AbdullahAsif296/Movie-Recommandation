// import  jwt from "jsonwebtoken";

// export const auth = (req, res, next) => {
//   try {
//     const token = req.header("Authorization")?.replace("Bearer ", "");

//     if (!token) {
//       return res
//         .status(401)
//         .json({ message: "No authentication token, access denied" });
//     }

//     const verified = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = verified;
//     next();
//   } catch (err) {
//     res
//       .status(401)
//       .json({ message: "Token verification failed, authorization denied" });
//   }
// };

// authMiddleware.js
import jwt from "jsonwebtoken";
import { UnauthorizedError } from "../utils/errors.js";
export const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Authentication token is missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach the user data to the request object

    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const isAdmin = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      throw new UnauthorizedError("Admin access required");
    }
    next();
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};
