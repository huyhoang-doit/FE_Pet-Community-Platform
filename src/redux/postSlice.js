import { createSlice } from "@reduxjs/toolkit";
const postSlice = createSlice({
    name: 'post',
    initialState: {
        posts: [],
        selectedPost: null,
        page: 1
    },
    reducers: {
        //actions
        setPosts: (state, action) => {
            state.posts = action.payload;
        },
        setSelectedPost: (state, action) => {
            state.selectedPost = action.payload;
        },
        setPostPage: (state, action) => {
            state.page = action.payload;
        }
    }
});
export const { setPosts, setSelectedPost, setPostPage } = postSlice.actions;
export default postSlice.reducer;