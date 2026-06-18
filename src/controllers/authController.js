import User from "../models/User.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

// REGISTER
export const register =
  async (req, res) => {
    try {
      const {
        name,
        email,
        password,
        role,
        department,
      } = req.body;

      const exists =
        await User.findOne({
          email,
        });

      if (exists) {
        return res.status(400).json({
          message:
            "User already exists",
        });
      }

      const hashedPassword =
        await bcrypt.hash(
          password,
          10
        );

      const user =
        await User.create({
          name,
          email,
          password:
            hashedPassword,
          role,
          department,
        });

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token:
          generateToken(
            user._id
          ),
      });
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };

// LOGIN
export const login =
  async (req, res) => {
    try {
      const {
        email,
        password,
      } = req.body;

      const user =
        await User.findOne({
          email,
        });

      if (
        !user ||
        !(await bcrypt.compare(
          password,
          user.password
        ))
      ) {
        return res.status(401).json({
          message:
            "Invalid email or password",
        });
      }

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token:
          generateToken(
            user._id
          ),
      });
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };