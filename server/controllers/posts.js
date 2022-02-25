import PostMessage from "../models/postMessage.js";
import mongoose from "mongoose";

export const getPosts = async (req, res) => {
  const { page} = req.query;
  try {
    
    const LIMIT =9;
    const startIndex = (Number(page)-1) * LIMIT; //get start index of every page
    const total = await PostMessage.countDocuments({})

    const posts = await PostMessage.find().sort({_id:-1}).limit(LIMIT).skip(startIndex);
    res.status(200).json({
      data:posts,
      currentPage:Number(page),
      numberOfPages:Math.ceil(total/LIMIT)});
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};


export const getPost = async (req, res) => {
  const { id} = req.params;
  try {
    const post = await PostMessage.findById(id);
    res.status(200).json(post);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};


export const getPostsBySearch = async (req, res) => {
  const { searchQuery, tags} = req.query;
  try {
    //ignore case for I flag
    const title = new RegExp(searchQuery, "i");
    const post = await PostMessage.find( {$or:[{title},{tags:{ $in: tags.split(',')}}] })
    res.json({ data:post });
  } catch (error) {
    res.status(404).json({ message: error.message})
  }
}

export const createPost = async (req, res) => {
  const post = req.body;
  const newPost = new PostMessage({
    ...post,
    creator: req.userId,
    createdAt: new Date().toISOString(),
  });
  try {
    await newPost.save();
    res.status(200).json(newPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updatePost = async (req, res) => {
  const { id: _id } = req.params;

  const post = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send("No post id found");

  const updatedPost = await PostMessage.findByIdAndUpdate(
    _id,
    { ...post, _id },
    { new: true }
  );

  res.json(updatePost);
};

export const deletePost = async (req, res) => {
  const { id: _id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send("No post id found");

  await PostMessage.findByIdAndDelete(_id);

  res.status(200).json({ message: "Post has been deleted" });
};

export const likePost = async (req, res) => {
  const { id: _id } = req.params;

  if (!req.userId) return res.json({ message: "Unauthenticated" });

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status().json("No Post found for ID");

  const post = await PostMessage.findById(_id);

  const index = post.likes.findIndex((id) => id === String(req.userId));

  if (index === -1) {
    //Like the Post
    post.likes.push(req.userId);
  } else {
    //dislike a post
    post.likes = post.likes.filter((id) => id != String(req.userId));
  }

  const updatedPost = await PostMessage.findByIdAndUpdate(_id, post, {
    new: true,
  });

  res.json(updatedPost);
};

export  const commentPost = async (req,res) =>{
  try {

    const {id:_id} = req.params;
    const { value } = req.body;
    const post = await PostMessage.findById(_id);
    post.comments.push(value);
    const updatedPost = await PostMessage.findByIdAndUpdate(_id , post, { new:true });
    res.json(updatedPost).status(200);

  } catch (error) {
    res.json(error.message).status(500);    
  }



}
