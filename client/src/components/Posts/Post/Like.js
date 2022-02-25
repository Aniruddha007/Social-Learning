import React, { useState } from 'react'
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";
import ThumbUpAltOutlined from "@material-ui/icons/ThumbUpAltOutlined";
import DeleteIcon from "@material-ui/icons/Delete";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import {
    Card,
    CardMedia,
    Button,
    Typography,
    CardContent,
    CardActions,
    ButtonBase
  } from "@material-ui/core";
import {useDispatch } from 'react-redux';
import {likePost } from "../../../actions/posts";





const Like = ({post})=>{

  const dispatch = useDispatch();
  const [likes,setLikes] = useState(post?.likes);
  const user = JSON.parse(localStorage.getItem("profile"));
  const userId = (user?.result?.googleId || user?.result?._id);
  const hasLikedPost =  post.likes.find((like) => like === userId);


const  handleLike  = async () => {
       dispatch(likePost(post._id));
        if(hasLikedPost){
          setLikes(post.likes.filter((id) =>id !== (userId)))
        }else{
          setLikes([...post.likes,userId]);
        }
      }

  const LikesCount = () => {
        if (likes.length > 0) {
          return hasLikedPost
            ? (
              <><ThumbUpAltIcon fontSize="small" />&nbsp;{likes.length > 2 ? `You and ${likes.length - 1} others` : `${likes.length} like${likes.length > 1 ? 's' : ''}` }</>
            ) : (
              <><ThumbUpAltOutlined fontSize="small" />&nbsp;{likes.length} {likes.length === 1 ? 'Like' : 'Likes'}</>
            );
        }
    
        return <><ThumbUpAltOutlined fontSize="small" />&nbsp;Like</>;
      };
    return (
    <Button size="small" color="primary" disabled={!user?.result} onClick={() => handleLike()}>
        <LikesCount />
      </Button>
    )
}

export default Like;