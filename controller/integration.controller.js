const mysqlpool = require("../config/db");

const integrationController = {
  getAllintegration: async (req, res) => {
    try {
      const data = await mysqlpool.query(` SELECT * FROM integrations`);
      if (!data) {
        return res.status(404).send({
          success: false,
          message: "Record Not Found",
        });
      }
      res.status(200).send({
        success: true,
        message: "All Integrations",
        totalData: data[0].length,
        data: data[0],
      });
    } catch (error) {
      console.error("Error in integration:", error);
      return res.status(500).json({
        success: false,
        message: "Error in Get All Integration (backend)",
        error,
      });
    }
  },
  getIntegrationByUserID: async (req, res) => {
    try {
      const user_id = req.params.user_id;
      if (!user_id) {
        return res.status(404).send({
          success: false,
          message: "Invalid Provided user id",
        });
      }
      const data = await mysqlpool.query(
        ` SELECT * FROM integrations WHERE user_id=?`,
        [user_id],
      );
      if (data[0].length === 0) {
        return res.status(404).send({
          success: false,
          message: `user not exist with userID = ${user_id}`,
        });
      }
      res.status(200).send({
        success: true,
        message: "All Integrations",
        totalData: data[0].length,
        data: data[0],
      });
    } catch (error) {
      console.error("Error in integration:", error);
      return res.status(500).json({
        success: false,
        message: "Error in Get Integration By userID (backend)",
        error,
      });
    }
  },
  createIntegration: async (req, res) => {
    try {
      const { user_id, appId, type, acitive_connection } = req.body;
      if (!user_id || !appId || !type || acitive_connection === undefined) {
        return res.status(404).send({
          success: false,
          message: "please Provid All Fields",
        });
      }

      const data = await mysqlpool.query(
        `INSERT INTO integrations (user_id, appId, type, acitive_connection)  VALUES (?, ?, ?, ?)`,
        [user_id, appId, type, acitive_connection],
      );

      if (!data) {
        return res.status(404).send({
          success: false,
          message: "Error in Insert Query",
        });
      }

      res.status(201).send({
        success: true,
        message: "Integration created successfully",
        data: data[0],
      });
    } catch (error) {
      console.error("Error in integration:", error);
      return res.status(500).json({
        success: false,
        message: "Error in Create Integration (backend)",
        error,
      });
    }
  },
  updateIntegrationByID: async (req, res) => {
    try {
      const id = req.params.id;
      if (!id) {
        return res.status(404).send({
          success: false,
          message: `Invalid id id = ${id}`,
        });
      }
      const userdata = await mysqlpool.query(
        "SELECT id FROM integrations WHERE id = ?",
        [id],
      );

      if (userdata[0].length === 0) {
        return res.status(404).send({
          success: false,
          message: `Integration not found with id = ${id}`,
        });
      }

      const { user_id, appId, type, acitive_connection } = req.body;
      if (!user_id || !appId || !type || acitive_connection === undefined) {
        return res.status(400).send({
          success: false,
          message: "Please provide all fields",
        });
      }

      const updatedData = await mysqlpool.query(
        `UPDATE integrations
       SET user_id = ?, appId = ?, type = ?, acitive_connection = ?
       WHERE id = ?`,
        [user_id, appId, type, acitive_connection, id],
      );

      res.status(200).send({
        success: true,
        message: "Integration updated successfully",
        affectedRows: updatedData,
      });
    } catch (error) {
      console.error("Error in integration:", error);
      return res.status(500).json({
        success: false,
        message: "Error in Update Integration (backend)",
        error,
      });
    }
  },
  deleteIntegration: async (req, res) => {
    try {
      const id = req.params.id;
      if (!id) {
        return res.status(404).send({
          success: false,
          message: `Invalid id id = ${id}`,
        });
      }

      const userdata = await mysqlpool.query(
        "SELECT id FROM integrations WHERE id = ?",
        [id],
      );
      if (userdata[0].length === 0) {
        return res.status(404).send({
          success: false,
          message: `Integration not found with id = ${id}`,
        });
      }

      const data = await mysqlpool.query(
        "DELETE FROM integrations WHERE id = ?",
        [id],
      );

      res.status(200).send({
        success: true,
        message: "Integration deleted successfully",
        affectedRows: data,
      });
    } catch (error) {
      console.error("Error in integration:", error);
      return res.status(500).json({
        success: false,
        message: "Error in Delete Integration (backend)",
        error,
      });
    }
  },
};

module.exports = integrationController;
