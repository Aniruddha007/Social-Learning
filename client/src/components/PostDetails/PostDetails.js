import React, { useEffect, useState } from 'react';
import { Paper, Typography, CircularProgress, Divider } from '@material-ui/core/';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { useParams, useNavigate } from 'react-router-dom';

import { getPost, getPostBySearch } from '../../actions/posts';
import useStyles from './styles';
import CommentSection from './CommentSection';
import Like from '../Posts/Post/Like';

const Post = () => {
  const { post, posts, isLoading } = useSelector((state) => state.posts);
  const dispatch = useDispatch();
  const history = useNavigate();
  const classes = useStyles();
  const [recommendedPosts,setRecommendedPosts] = useState([]);
  const { id } = useParams();
  
  useEffect(() => {
    dispatch(getPost(id));
  },[id]);
  
  useEffect(() => {
    if (post) {
      dispatch(getPostBySearch({ search: 'none', tags: post?.tags.join(',') }));
    }
  }, [post]);
  
  useEffect(()=>{
    if(posts !== undefined && post){
      const recPosts = posts.filter(({ _id }) => _id !== post._id);
      setRecommendedPosts(recPosts)
    }
  },[posts])
  
  
  
  const openPost = (_id) => history.push(`/posts/${_id}`);
  
  if (!post || posts==undefined) return null;
  if (isLoading) {
    return (
      <Paper elevation={6} className={classes.loadingPaper}>
        <CircularProgress size="7em" />
      </Paper>
    );
  }

  return (
    <Paper style={{ padding: '20px', borderRadius: '15px' }} elevation={6}>
     <div className={classes.card}>
        <div className={classes.section}>
          <Typography variant="h3" component="h2">{post.title}</Typography>
          <Typography gutterBottom variant="h6" color="textSecondary" component="h2">{post.tags.map((tag) => `#${tag} `)}</Typography>
          <Typography gutterBottom variant="body1" component="p">{post.message}</Typography>
          <Typography variant="h6">Created by: {post.name}</Typography>
          <Typography variant="body1">{moment(post.createdAt).fromNow()}</Typography>
          <Like post={post} />
          <Divider style={{ margin: '20px 0' }} />
          <Typography variant="body1"><strong>Realtime Chat - coming soon!</strong></Typography>
          <Divider style={{ margin: '20px 0' }} />
            <CommentSection post={post} />
          <Divider style={{ margin: '20px 0' }} />
        </div>
        <div className={classes.imageSection}>
          <img className={classes.media} src={post.selectedFile || 'https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png'} alt={post.title} />
        </div>
      </div>
      {recommendedPosts.length &&  (
    <div>
        <Typography gutterBottom variant='h5'>You  Might Also Like:</Typography>
        <Divider />
        <div className={classes.recommendedPosts}>
        {recommendedPosts.map((post)=>(
    
            <div style={{margin:'20px',cursor:"pointer"}}  onClick={() => openPost( post._id )} key={post._id}> 
            <Typography variant='h6' gutterBottom>{post.title}</Typography>
            <Typography variant='subtitle2' gutterBottom>{post.name}</Typography>
            <Typography variant='subtitle2' gutterBottom>{post.message}</Typography>
            <Typography variant='subtitle2' gutterBottom>   <Like post={post} /></Typography>
            <img  src={post.selectedFile} width="200px" />
            </div>
      
        ))}
          </div>
    </div>
    )}
    </Paper>
  );
};

export default Post;