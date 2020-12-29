require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const app = express();
const db = require("./db");
const cors = require("cors");

const port = process.env.PORT || 1337;

app.use(express.json());
app.use(cors());
app.use(helmet());

// get all restaurants
// curl http://localhost:3001/api/v1/restaurants

app.get("/api/v1/users", async (req, res) => {
  try {
    const results = await db.query("SELECT * FROM users");

    res.status(200).json({
      status: "success",
      results: results.rows.length,

      users: results.rows,
    });
  } catch (err) {
    console.log(err);
  }
});

// //get individual user
app.get("/api/v1/user/:username", async (req, res) => {
  /// may be issues here
  /// on login, username is a string - if the state 'user' is used, it is an object
  console.log("login attempt reached server.js");
  try {
    const results = await db.query("SELECT * FROM users WHERE username = $1", [
      req.params.username,
    ]);
    res.status(200).json({
      status: "success",
      results: results.rows[0],
    });
  } catch (err) {
    console.log(err);
  }
});

app.get("/api/v1/geometries/:user_id", async (req, res) => {
  try {
    const results = await db.query(
      "SELECT geometry_id::INTEGER, ST_AsGeoJSON(geom) as geom FROM geometries WHERE user_id = $1",
      [req.params.user_id]
    );
    res.status(200).json({
      status: "success",
      results: results.rows,
    });
  } catch (err) {
    console.log(err);
  }
});

app.post("/api/v1/createUser", async (req, res) => {
  const { uiUsername: username, uiPassword: password } = req.body;
  console.log(username, password);
  try {
    const results = await db.query(
      "INSERT INTO users (username, password) values ($1, $2) returning *",
      [username, password]
    );
    res.status(201).json({
      status: "success",
      results: results.rows[0],
    });
  } catch (err) {
    console.log(err);
  }
});

app.put("/api/v1/geometries/:user_id", async (req, res) => {
  console.log("submit geometriess attempted serverside");

  const { user_id } = req.params;
  const { geometries } = req.body;

  let temp = [];
  geometries.forEach((geom) => {
    const { geometry_id, geometry } = geom;
    /// formatting away double quotes. PSQL seems to only accept single quotes around the geojson
    const formattedGeometry = "'" + geometry + "'";
    temp.push(
      `(${geometry_id}, ${user_id}, ST_GeomFromGeoJSON(${formattedGeometry}))`
    );
  });
  const values = temp.join(",");

  try {
    const deleteResults = db.query(
      "DELETE FROM geometries WHERE user_id = $1",
      [user_id]
    );

    const text =
      "INSERT INTO geometries (geometry_id, user_id, geom) VALUES " + values;
    console.log(text);

    const results = await db.query(text);

    res.status(200).json({
      status: "success",
      results: results.rows[0],
    });
  } catch (err) {
    console.log(err);
  }
});

app.listen(port, () =>
  console.log(`server is up and listening on server ${port}`)
);
