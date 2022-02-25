import React from 'react'
import Post from './Post/post';
import useStyles from './styles';
//Selectors
import { useSelector } from 'react-redux';
import { Grid,CircularProgress  } from '@material-ui/core';

const Posts = ({setCurrentId}) => {

    const classes = useStyles();
    const { posts, isLoading } = useSelector((state) => state.posts);

    if(!posts?.length && !isLoading) return 'No posts';

    return (
        <>
            { isLoading ? <CircularProgress />: (
                <Grid className={classes.container} container alignItems="stretch" spacing={3}>
               
                    {posts.map((post) => (
                        <Grid key={post._id} xs={12} sm={12} md={6} lg={4} item>
                            {/* Here passing Props deeper and deeper called Props Drilling  */}
                            <Post post={post} setCurrentId={setCurrentId}/>
                        </Grid>
                    ))}
                </Grid>
            )}            
        </>
    )
}
export default Posts;