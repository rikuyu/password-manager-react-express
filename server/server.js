const express = require("express");
const mysql = require("mysql");
const app = express();
const cors = require("cors");

require("dotenv").config();

const { encrypt, decrypt } = require("./cryptography");

const PORT = 3001;

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: process.env.MYSQL_KEY,
  database: "PasswordManager",
});

app.post("/register", (req, res) => {
  const { password, title } = req.body;
  const hashedPassword = encrypt(password);
  const INSERT_STATEMENT =
    "INSERT INTO passwords (password, title, iv) VALUES (?, ?, ?)";

  db.query(
    INSERT_STATEMENT,
    [hashedPassword.password, title, hashedPassword.iv],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("SUCCESS");
      }
    }
  );
});

app.post("/decrypt", (req, res) => {
  res.send(decrypt(req.body));
});

app.get("/show", (req, res) => {
  const SELECT_STATEMENT = "SELECT * FROM passwords";

  db.query(SELECT_STATEMENT, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
