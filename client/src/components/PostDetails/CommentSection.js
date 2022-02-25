import React,{useState,useRef} from 'react'
import { Typography, Button,TextField } from '@material-ui/core'
import { useDispatch} from 'react-redux';
import {commentPost} from '../../actions/posts'
import useStyles from './styles';

const  CommentSection = ({ post }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [comments, setComments] = useState(post?.comments);
  const [comment, setComment] = useState('');
  const user = JSON.parse(localStorage.getItem('profile'));
  const commentRef = useRef();

  const handleClick = async () =>{
    const finalComment = `${user.result.name} : ${comment}`;
    setComment('');
    const newComment = await dispatch(commentPost(finalComment,post._id));
    setComments(newComment);

    commentRef.current.scrollIntoView({ behavior:'smooth'});
  }

  return (
    <div className={classes.commentsOuterContainer}> 
        <div className={classes.commentsInnerContainer}>
          <Typography variant='h5' gutterBottom>Comments:</Typography>
          {comments.map((c,i)=>(
            <Typography key={i} gutterBottom variant='subtitle1'>
              <strong>{c.split(': ')[0]} </strong>
              {c.split(': ')[1]}
            </Typography>
          ))}
          <div ref={commentRef} />
        </div>
        {
        
        user?.result?.name && (

          <div style={{width:'70%'}}>
            <Typography variant='h6' gutterBottom>Write a Comment</Typography>
            <TextField 
            fullWidth 
            rows={4} 
            variant="outlined" 
            label="Comment" 
            multiline 
            value={comment} 
            onChange={(e)=>setComment(e.target.value)} />
            <Button style={{marginTop:'10px'}} color="primary" fullWidth disabled={!comment} variant='contained' onClick={handleClick} >
              Comment
            </Button>
          </div>
        )}
    </div>
  )
}

export default CommentSection