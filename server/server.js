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
    // const results = await db.query(
    //   "SELECT * FROM restaurants LEFT JOIN (SELECT restaurant_id, COUNT(*), TRUNC(AVG(rating), 1) as average_rating FROM reviews GROUP BY restaurant_id) reviews ON restaurants.id = reviews.restaurant_id"
    // );
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

app.post("/api/v1/createUser", async (req, res) => {
  const { username, password } = req.body;
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

app.put("/api/v1/geometries/:username", async (req, res) => {
  console.log("submit geometriess attempted serverside");
  const username = req.params.username;
  const geometries = req.body.geometries;
  geometries.map(async (item) => {
    try {
      const { id, geometry } = item;
      console.log(id, geometry, username);
      const results = await db.query(
        "UPDATE geometries SET geom = ST_GeomFromGeoJSON($1), geometry_id = $2  WHERE user = '$3' returning * ",
        [geometry, id, username]
      );

      res.status(200).json({
        status: "success",
        results: results.rows[0],
      });
    } catch (err) {
      console.log(err);
    }
  });
});

// app.put("/api/v1/restaurants/:id", async (req, res) => {
//   const { name, location, price_range } = req.body;
//   const id = req.params.id;

//   try {
//     const results = await db.query(
//       "UPDATE restaurants SET name = $1, location = $2, price_range = $3  WHERE id= $4 returning *",
//       [name, location, price_range, id]
//     );

//     res.status(200).json({
//       status: "success",
//       data: {
//         restaurant: [results.rows[0]],
//       },
//     });
//   } catch (err) {
//     console.log(err);
//   }
// });

// app.delete("/api/v1/restaurants/:id", async (req, res) => {
//   const id = req.params.id;
//   try {
//     const results = await db.query("DELETE FROM restaurants WHERE id = $1", [
//       id,
//     ]);
//     res.status(204).json({
//       status: "success",
//     });
//   } catch (err) {
//     console.log(err);
//   }

//   res.status(204).json({
//     status: "success",
//   });
// });

// app.post("/api/v1/restaurants/:id/addReview", async (req, res) => {
//   const restaurantId = req.params.id;
//   const { name, review, rating } = req.body;
//   debugger;
//   try {
//     const newReview = await db.query(
//       "INSERT INTO reviews (restaurant_id, name, review, rating) values ($1, $2, $3, $4) returning *",
//       [restaurantId, name, review, rating]
//     );
//     res.status(201).json({
//       status: "success",
//       data: {
//         review: newReview.rows[0],
//       },
//     });
//   } catch (err) {
//     console.log(err);
//   }
// });

app.listen(port, () =>
  console.log(`server is up and listening on server ${port}`)
);
