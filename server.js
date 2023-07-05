const express = require("express");
const app = express();
const port = 3000;
const mysql2 = require("mysql2");
const bcrypt = require("bcrypt");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const conn = mysql2.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "restapi",
});

app.get("/users", async (req, res) => {
  let sql = "select * from users";

  await conn.execute(sql, (err, result) => {
    if (err) {
      res.status(500).json({ message: err.message });
      return;
    }
    res.status(200).json({
      message: "เรียกข้อมูลสำเร็จ",
      data: result,
    });
  });
});

app.post("/users", async (req, res) => {
  const { email, password } = req.body;
  let role = "member";
  await bcrypt.genSalt( async (err, salt) => {
   await bcrypt.hash(password, salt, async (err, hash) => {
      let sql = "insert into users (email, password, role) values (?, ?, ?)";
      await conn.execute(sql, [email, hash, role], (err, result) => {
        if (err) {
          res.status(500).json({ message: err.message });
          return;
        }
        res.status(200).json({
          message: "เพิ่มข้อมูลสำเร็จ",
          data: result,
        });
      });
    });
  });
});

app.get("/users/:id", async (req, res) => {
  const { id } = req.params;
  let sql = "select * from users where id = ?";
  await conn.execute(sql, [id], (err, result) => {
    if (err) {
      res.status(500).json({ message: err.message });
      return;
    }
    res.status(200).json({
      message: "เรียกข้อมูลสำเร็จ",
      data: result,
    });
  });
});

app.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { email, password } = req.body;

  await bcrypt.genSalt(async (err, salt) => {
    await bcrypt.hash(password, salt, async (err, hash) => {
      let sql = "update users set email =?, password =? where id =?";
      await conn.execute(sql, [email, hash, id], (err, result) => {
        if (err) {
          res.status(500).json({ message: err.message });
          return;
        }
        res.status(200).json({
          message: "แก้ไขข้อมูลสำเร็จ",
          data: result,
        });
      });
    });
  });
});

app.delete("/users/:id", async (req, res) => {
  const { id } = req.params;
  let sql = "delete from users where id =?";
  await conn.execute(sql, [id], (err, result) => {
    if (err) {
      res.status(500).json({ message: err.message });
      return;
    }
    res.status(200).json({
      message: "ลบข้อมูลสำเร็จ",
      data: result,
    });
  });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
