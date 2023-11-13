//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const homeStartingContent =
  "DailyReflect is a daily journal web app designed to help users capture the essence of their day and foster personal growth. It offers a streamlined interface, daily prompts, rich media integration, and secure privacy measures to ensure the confidentiality of personal thoughts and reflections. Users can set customizable reminders to journal at a time that suits their routine, and the built-in mood tracker allows users to visualize patterns over time. Search and tagging functionalities allow users to easily navigate through their journal, while cloud sync ensures access to entries anytime, anywhere. Progress insights provide a deeper understanding of personal growth by exploring trends and insights derived from journal entries. DailyReflect also features community features, allowing users to connect with like-minded individuals and share insights, tips, and encouragement, fostering a supportive journaling community. Overall, DailyReflect is a valuable tool for personal growth and self-discovery.";


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const connectDB = () => {
  const database = mongoose
    .connect(
      "mongodb+srv://williumtiwari123:vashu1234@cluster0.mbkzukv.mongodb.net/",
      {
        dbName: "Daily-journal",
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    )
    .then((c) => {
      console.log(`Data base connected with server`);
    })
    .catch((err) => {
      console.log(err);
    });
};
connectDB();
const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);
const post1 = new Post({
  title: "Day 1",
  content:
    "Today was a hectic Monday, with back-to-back meetings and deadlines looming. I woke up early to squeeze in a quick workout, which helped me stay energized throughout the day. In the evening, I had a lovely dinner with my family, and we shared stories and laughed together. I made a mental note to better manage my time tomorrow to avoid feeling overwhelmed.",
});
app.get("/", function(req, res){

  Post.find({}, function(err, posts){
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
      });
  });
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });


  post.save(function(err){
    if (!err){
        res.redirect("/");
    }
  });
});

app.get("/posts/:postId", function(req, res){

const requestedPostId = req.params.postId;

  Post.findOne({_id: requestedPostId}, function(err, post){
    res.render("post", {
      title: post.title,
      content: post.content
    });
  });

});

app.get("/about", function(req, res){
  res.render("about");
});

app.get("/contact", function(req, res){
  res.render("contact");
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
