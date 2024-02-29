const express = require("express");
const connectDB = require("./db");
const app = express();
const cookieParser = require("cookie-parser");
const { adminAuth, userAuth } = require("/Users/kima/finalBack/middleware/auth.js");
const path = require("path");

const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");

connectDB();

app.use(express.json());
app.use(cookieParser());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/auth", require("./auth/route"));

app.get("/", (req, res) => res.render("home", { user: req.user }));
app.get("/register", (req, res) => res.render("register", { user: req.user }));
app.get("/login", (req, res) => res.render("login", { user: req.user }));
app.get("/logout", (req, res) => {
  res.cookie("jwt", "", { maxAge: "1" });
  res.redirect("/");
});

app.get("/admin", adminAuth, (req, res) => res.render("admin", { user: req.user }));
app.get("/basic", userAuth, (req, res) => res.render("user", { user: req.user }));

const server = app.listen(PORT, () =>
  console.log(`Server Connected to port ${PORT}`)
);

process.on("unhandledRejection", (err) => {
  console.log(`An error occurred: ${err.message}`);
  server.close(() => process.exit(1));
});
