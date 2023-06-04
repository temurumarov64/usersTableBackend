const { Router } = require("express");
const AuthorizationService = require("../services/authorizationService");
const md5 = require("blueimp-md5");

const authorizationHandler = (db) => {
  const router = Router();

  const authService = new AuthorizationService(db);

  router.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;

    await authService.findUserByEmail(email, (error, results) => {
      if (error) {
        return res.status(400).json(error.message);
      }

      if (results.length > 0) {
        return res.status(409).json({ error: "User already exists" });
      }
    });

    const hashpassword = md5("notSecretKey", password);
    await authService.createUser(
      name,
      email,
      hashpassword,
      (error, results) => {
        if (error) {
          res.status(400).json(error.message);
          return;
        }

        res.status(201).json({ msg: "User has been created" });
      }
    );
  });

  router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    await authService.findUserByEmail(email, async (error, results) => {
      if (error) {
        return res.status(400).json(error.message);
      }

      if (results.length === 0) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      if (results[0].status === 0) {
        return res.status(423).json({ error: "User blocked" });
      }

      await authService.updateLastSeen(
        new Date(),
        email,
        (error, results) => {}
      );

      res.status(200).json(results);
    });
  });

  router.get("/users", async (req, res) => {
    await authService.getList((error, results) => {
      if (error) {
        res.status(400).json(error.message);
        return;
      }

      res.status(200).json(results);
    });
  });

  router.put("/users/:id", async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    console.log("id", id, status);
    await authService.updateUserStatus(id, status, (error, results) => {
      if (error) {
        res.status(400).json(error.message);
        return;
      }
      res.status(200).json(results);
    });
  });

  router.delete("/users/:id", async (req, res) => {
    const { id } = req.params;
    await authService.deleteUserApi(id, (error, results) => {
      if (error) {
        res.status(400).json(error.message);
        return;
      }
      res.status(200).json(results);
    });
  });

  return router;
};

module.exports = authorizationHandler;
