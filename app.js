

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const _ = require("lodash");

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/blogDB")
  .then(() => console.log('Connected to mongoose database!'));

const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);





let posts = [];

app.get("/", function (req, res) {
  // res.render("home", 
  // { startingContent: homeStartingContent, 
  //   posts: posts 
  // });

  Post.find()
    .then(posts => {
      res.render("home", {
        startingContent: homeStartingContent,
        posts: posts
      });
    });
});

app.get("/about", function (req, res) {
  res.render("about", { aboutContent: aboutContent });
});

app.get("/contact", function (req, res) {
  res.render("contact", { contactContent: contactContent });
});

app.get("/compose", function (req, res) {
  res.render("compose")
})

app.post("/compose", function (req, res) {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });
  post.save()
    .then(() => {
      console.log("Post added to postDB");
      res.redirect("/");
    })
    .catch(err => {
      res.status(400).send("Unable to save post to postDB")
    })
  // console.log(post.content.length);
  // if (post.content.length > 95 ) {
  //   console.log("true")
  // } else {
  //   console.log("false")
  // };
});

app.get('/posts/:postId', function (req, res) {
  const requestedPostId = req.params.postId;

  Post.findOne({ _id: requestedPostId })
    .then(post => {
      res.render("post", {
        title: post.title,
        content: post.content
      })
      // .catch(err => {
      //   console.log(err);
      // });
    });

  // let requestedTitle = _.lowerCase(req.params.postName);
  // posts.forEach(function(post){
  //   const storedTitle = _.lowerCase(post.title);
  //   if ( requestedTitle === storedTitle) {
  //     res.render("post", {
  //       title: post.title,
  //       content: post.content
  //     });
  //   }
  // });

});

app.get("/update/:_id", function (req, res) {
  const updateId = req.params._id;
  Post.findOne({ _id: updateId })
    .then(Posts => {
      res.render("update",
        {
          updatedTitle: Posts.title,
          updatedContent: Posts.content,
          id: updateId
        });
    })
    .catch(err => {
      console.log(err);
    });
});

app.post("/update", function (req, res) {
  // const updateId = req.params.updateId;
  const updatedTitle = req.body.updatedTitle;
  const updatedContent = req.body.updatedContent;
  const updateId = req.body.id;

  post.findByIdAndUpdate({ _id: updateId },
    {
      title: updatedTitle,
      content: updatedContent
    })
    .then(() => res.redirect("/"));
});

app.post("/delete", function (req, res) {
  const foundid = req.body.delete - button;

  post.findByIdAndDelete(foundid)
    .then((err) => {
      if (!err) {
        console.log("successfully deleted");
      }
    });
})

// const editButton = document.getElementById('edit-button');
// editButton.addEventListener('click', () => {
//   fetch(`http://localhost:3000/update/${whatever-the-id}`)
//     .catch(error => console.log(error));
// })

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
