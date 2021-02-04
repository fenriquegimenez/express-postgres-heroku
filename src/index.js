const express = require("express");
const cors = require("cors");
const { pool, config } = require("./config/config");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const getBooks = (request, response) => {
  pool.query("SELECT * FROM books", (error, results) => {
    if (error) {
      response.status(500).json({
        status: "error",
        message: "Internal Server Error",
      });
    }
    response.status(200).json(results.rows);
  });
};

const addBook = (request, response) => {
  const { author, title } = request.body;
  pool.query(
    "INSERT INTO books (author, title) VALUES ($1, $2)",
    [author, title],
    error => {
      if (error) {
        response.status(500).json({
          status: "error",
          message: "Internal Server Error",
        });
      }
      response.status(201).json({
        status: "success",
        message: `${title} added.`,
      });
    }
  );
};
app.route("/books").get(getBooks).post(addBook);

const port = config.port;

app.listen(port, () => {
  console.log(`[Server] Server listening at port ${port}.`);
});
