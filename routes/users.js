var express = require("express");
var router = express.Router();
var dbConn = require("../lib/db");

/* GET users listing. */
// display books page
router.get("/", function (req, res, next) {
  dbConn.query("SELECT * FROM aa_users ORDER BY id desc", function (err, rows) {
    if (err) {
      req.flash("error", err);
      console.log("rr", err);
      // render to views/books/index.ejs
      res.render("users/index", { data: "" });
    } else {
      // render to views/books/index.ejs
      console.log("rows", rows);
      res.render("users/index", { data: rows });
    }
  });
});
module.exports = router;
