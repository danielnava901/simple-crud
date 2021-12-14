var express = require("express");
var router = express.Router();
var dbConn = require("../lib/db");

// display books page
router.get("/", function (req, res, next) {
  dbConn.query(
    "SELECT id, title, created_at, active FROM books ORDER BY id desc",
    function (err, rows) {
      if (err) {
        req.flash("error", err);
        // render to views/books/index.ejs
        res.render("books", { data: "" });
      } else {
        // render to views/books/index.ejs
        res.render("books", { data: rows });
      }
    }
  );
});

// display add book page
router.get("/add", function (req, res, next) {
  // render to add.ejs
  res.render("books/add", {
    title: "",
  });
});

// add a new book
router.post("/add", function (req, res, next) {
  let title = req.body.title;
  let errors = false;

  if (title.length === 0) {
    errors = true;

    // set flash message
    req.flash("error", "Please enter name and author");
    // render to add.ejs with flash message
    res.render("books/add", {
      title: title,
    });
  }

  // if no error
  if (!errors) {
    // insert query
    dbConn.query(
      "INSERT INTO books(title, created_at) VALUES(?, utc_timestamp())",
      [title],
      function (err, result) {
        //if(err) throw err
        if (err) {
          req.flash("error", err);

          // render to add.ejs
          res.render("books/add", {
            title: title,
          });
        } else {
          req.flash("success", "Book successfully added");
          res.redirect("/books");
        }
      }
    );
  }
});

// display edit book page
router.get("/edit/(:id)", function (req, res, next) {
  let id = req.params.id;

  dbConn.query(`SELECT * FROM books WHERE id = ${id} `, function (
    err,
    rows,
    fields
  ) {
    if (err) throw err;

    // if user not found
    if (rows.length <= 0) {
      req.flash("error", "Book not found with id = " + id);
      res.redirect("/books");
    }
    // if book found
    else {
      // render to edit.ejs
      res.render("books/edit", {
        title: "Edit Book",
        id: rows[0].id,
        title: rows[0].title,
      });
    }
  });
});

// update book data
router.post("/update/:id", function (req, res, next) {
  let id = req.params.id;
  let title = req.body.title;
  let errors = false;

  if (title.length === 0) {
    errors = true;

    // set flash message
    req.flash("error", "Please enter name and title");
    // render to add.ejs with flash message
    res.render("books/edit", {
      id: req.params.id,
      title: title,
    });
  }

  // if no error
  if (!errors) {
    // update query
    dbConn.query(
      `UPDATE books SET title = ? WHERE id = ?`,
      [title, id],
      function (err, result) {
        //if(err) throw err
        if (err) {
          // set flash message
          req.flash("error", err);
          // render to edit.ejs
          res.render("books/edit", {
            id: id,
            title: title,
          });
        } else {
          req.flash("success", "Book successfully updated");
          res.redirect("/books");
        }
      }
    );
  }
});

// delete book
router.get("/delete/(:id)", function (req, res, next) {
  let id = req.params.id;

  dbConn.query(`DELETE FROM books WHERE id = ${id} `, function (err, result) {
    //if(err) throw err
    if (err) {
      // set flash message
      req.flash("error", err);
      // redirect to books page
      res.redirect("/books");
    } else {
      // set flash message
      req.flash("success", "Book successfully deleted! ID = " + id);
      // redirect to books page
      res.redirect("/books");
    }
  });
});

module.exports = router;
