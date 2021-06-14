const { stringify } = require("@angular/compiler/src/util");
const Post = require("../models/post");

exports.createPost = (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  // let imageObjectArray = [];
  // if (req.body.images) {
    //   for (let image of req.body.images) {
      //     imageObjectArray = image;
      //   }
      // }
  let accessoryArray = [];
  for (let access of req.body.accessories) {
    accessoryArray.push(access);
  }
  let dateNow = new Date();
  const post = new Post({
    title: req.body.title,
    regNo: req.body.regNo,
    make: req.body.make,
    model: req.body.model,
    modelYear: req.body.modelYear,
    kms: req.body.kms,
    colour: req.body.colour,
    vin: req.body.vin,
    retailPrice: req.body.retailPrice,
    costPrice: req.body.costPrice,
    accessories: accessoryArray,
    imagePath: url + "/images/" + req.body.title,
    creator: req.userData.userId,
    dtCreated: dateNow.toISOString()
  });
  post.save()
    .then(createdPost => {
      res.status(201).json({
        message: "Post added successfully",
        post: {
          ...createdPost,
          id: createdPost._id
        }
      });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: "Creating a post failed!"
      });
    });
}

exports.updatePost = (req, res, next) => {
  let dateNow = new Date();
  const url = req.protocol + "://" + req.get("host");
  let imagePath = url + "/images/" + req.body.title;
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    regNo: req.body.regNo,
    make: req.body.make,
    model: req.body.model,
    modelYear: req.body.modelYear,
    kms: req.body.kms,
    colour: req.body.colour,
    vin: req.body.vin,
    retailPrice: req.body.retailPrice,
    costPrice: req.body.costPrice,
    accessories: req.body.accessories,
    imagePath: imagePath,
    creator: req.userData.userId,
    dtUpdated: dateNow.toISOString()
  });
  Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post).then(result => {
    if (result.nModified > 0) {
      res.status(200).json({ message: "Update successful!" });
    } else {
      res.status(401).json({ message: "Not authorized!" });
    }
  })
  .catch(error => {
    res.status(500).json({
      message: "Couldn't update post!"
    });
  });
}

exports.getPosts = (req, res, next) => {
  const postSearch = stringify(req.query.searchtext);
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  let postQuery = Post.find();
  let fetchedPosts;
  if (postSearch)
  {
    postQuery = Post.find({
      'title': { $regex: postSearch, $options: 'i' }
    });
  }
  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  postQuery
    .then(documents => {
      fetchedPosts = documents;
      return Post.count();
    })
    .then(count => {
      res.status(200).json({
        message: "Posts fetched successfully!",
        posts: fetchedPosts,
        maxPosts: count
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching a posts failed!"
      });
    });
}

exports.getPost = (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "Post not found!" });
    }
  }).catch(error => {
    res.status(500).json({
      message: "Fetching a post failed!"
    });
  });
}

exports.deleteRequest = (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then(result => {
    if (result.n > 0) {
      res.status(200).json({ message: "Deletion successful!" });
    } else {
      res.status(401).json({ message: "Not authorized!" });
    }
  }).catch(error => {
    res.status(500).json({
      message: "Deleting a post failed!"
    });
  });
}
