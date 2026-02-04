const mysqlpool = require("../config/db");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/jwt");

const authController = {
  register: async (req, res) => {
    try {
      const { firstname, lastname, email, phone, password } = req.body;

      if (!firstname || !lastname || !email || !phone || !password) {
        return res.status(400).json({
          success: false,
          message: "All fields are required",
        });
      }

      const [existingUser] = await mysqlpool.query(
        "SELECT id FROM users WHERE email = ?",
        [email],
      );

      if (existingUser.length > 0) {
        return res.status(409).json({
          success: false,
          message: "Email already registered",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const [result] = await mysqlpool.query(
        `INSERT INTO users 
        (firstname, lastname, email, phone, password) 
        VALUES (?, ?, ?, ?, ?)`,
        [firstname, lastname, email, phone, hashedPassword],
      );

      const token = generateToken({ id: result.insertId, email });

      res.status(201).json({
        success: true,
        message: "User registered successfully",
        token,
        result,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Register error",
        error,
      });
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Email and password required",
        });
      }

      const [users] = await mysqlpool.query(
        "SELECT * FROM users WHERE email = ?",
        [email],
      );

      if (users.length === 0) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials email",
        });
      }

      const user = users[0];

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials password",
        });
      }

      const token = generateToken(user);
      res.status(200).json({
        success: true,
        message: "Login successful",
        token,
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Login error",
        error,
      });
    }
  },
  getAllusers: async (req, res) => {
    try {
      const data = await mysqlpool.query(` SELECT * FROM users`);
      if (!data) {
        return res.status(404).send({
          success: false,
          message: "Record Not Found",
        });
      }
      res.status(200).send({
        success: true,
        message: "All Users",
        totalData: data[0].length,
        data: data[0],
      });
    } catch (error) {
      console.error("Error in Users:", error);
      return res.status(500).json({
        success: false,
        message: "Error in Get All Users (backend)",
        error,
      });
    }
  },
};

module.exports = authController;
