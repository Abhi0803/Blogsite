import express, { static } from "express";
import { urlencoded } from "body-parser";
import ejs from "ejs";
import { capitalize, truncate } from "lodash";
import { connect, model } from "mongoose";

const homeStartingContent =
  "This is a simple Blog website connected with MongoDB and if you want to compose a post jusr type a new name after the url /new_post_name";
const aboutContent =
  "wlijdalskdiakakjls dajdla sdjaskd aljdaj podwjp jdpaodjpoawjdas  aasd ada awjodijladklajsdad jdpaodjpoawjdasa dpoawujdauwodiaw a dadaswdasdasdasdsafsg fasfasdf sfs s fs df df sfasd fsfsadfdas sa";
const contactContent =
  "wlijdalskdiakakjls dajdla sdjaskd aljdaj podwjp jdpaodjpoawjdas  aasd ada awjodijladklajsdad jdpaodjpoawjdasa dpoawujdauwodiaw a dadaswdasdasdasdsafsg fasfasdf sfs s fs df df sfasd fsfsadfdas sa";

const app = express();

app.set("view engine", "ejs");

app.use(
  urlencoded({
    extended: true,
  })
);
app.use(static("public"));

mongoose.connect(
  "mongodb+srv://Red:8268@cluster0.sq4z9.mongodb.net/blogdb?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
  }
);

const documentSchema = {
  title: String,
  compose: String,
  truncated: String,
};

const Document = model("Document", documentSchema);

const post1 = new Document({
  title: "Day 1",
  compose: "Hello How are You??",
  truncated: "Hello How are You??",
});

const post2 = new Document({
  title: "Day 2",
  compose: "Hello are You??",
  truncated: "Hello How are You??",
});

app.get("/", function (req, res) {
  Document.find({}, function (err, results) {
    if (results.length === 0) {
      post1.save();
      post2.save();
      res.redirect("/");
    } else {
      res.render("home", {
        homeStartingContent: homeStartingContent,
        posts: results,
        truncated: results,
      });
    }
  });
});

app.get("/about", function (req, res) {
  res.render("about", {
    aboutContent: aboutContent,
  });
});

app.get("/contact", function (req, res) {
  res.render("contact", {
    contactContent: contactContent,
  });
});

app.get("/compose", function (req, res) {
  res.render("compose");
});

app.get("/delete", function (req, res) {
  Document.find({}, function (err, results) {
    res.render("delete", {
      homeStartingContent: homeStartingContent,
      posts: results,
      truncated: results,
    });
  });
});

app.post("/delete", function (req, res) {
  const titles = req.body.delete;

  Document.findOneAndRemove({ title: titles }, function (err, results) {
    if (!err) {
      res.redirect("/");
    }
  });
});

app.get("/posts/:post", function (req, res) {
  const requestedTitle = capitalize(req.params.post);
  Document.findOne(
    {
      title: requestedTitle,
    },
    function (err, results) {
      if (!err) {
        if (!results) {
          res.render("error");
        } else {
          res.render("post", {
            title: results.title,
            content: results.compose,
          });
        }
      }
    }
  );
});

app.post("/compose", function (req, res) {
  const title = capitalize(req.body.title);
  const compose = req.body.compose;
  const save = new Document({
    title: title,
    compose: compose,
    truncated: truncate(compose, {
      length: 150,
    }),
  });
  save.save();
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function () {
  console.log("server started at 3000");
});
