import {FETCH_ALL,CREATE,UPDATE,DELETE,FETCH_BY_SEARCH,LIKE,START_LOADING,END_LOADING, FETCH_POST, COMMENT} from '../constants/actionTypes';

const PostReducer =  (state={isLoading:true, posts:[] },action) =>{

    switch (action.type) {
           case START_LOADING:
                 return { ...state, isLoading: true };
           case END_LOADING:
                return { ...state, isLoading: false };
            case FETCH_ALL:
                return {
                    ...state,
                    posts: action.payload.data,
                    currentPage: action.payload.currentPage,
                    numberOfPages: action.payload.numberOfPages,
                  };
            case FETCH_BY_SEARCH:
                return {...state,posts:action.payload };
            case FETCH_POST:
                return {post:action.payload };
            case LIKE:
                return {...state,posts:state.posts.map((post)=>(post._id === action.payload._id ? action.payload : post))};
            case COMMENT:

                return {
                    posts: state.posts.map((post) => {
                        if(post._id === action.payload._id) return action.payload;
                        return post;
                    }),
                    ...state,
                    }
            case CREATE:
                return { ...state, posts: [action.payload, ...state.posts] };
            case UPDATE: 
                return { ...state, posts: state.posts.map((post) => (post._id === action.payload._id ? action.payload : post)) }; 
            case DELETE:
                return state.filter( (post) => post._id !== action.payload )
        default:
            return state;
    }

}

export default PostReducer;