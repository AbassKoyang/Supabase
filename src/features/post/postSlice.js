// src/redux/postsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import supabase from '../../config/supabse';


export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const { data, error } = await supabase.from('posts').select('*');
  if (error) {
    console.log(error)
    throw new Error('Error fetching posts');
  }
  return data;
});

export const updateLikes = createAsyncThunk('posts/updateLikes', async ({ postId, likes }) => {
  const { data, error } = await supabase.from('posts').update({ likes }).eq('id', postId);
  if (error) {
    throw new Error('Error updating likes');
  }
  return data;
});

const postsSlice = createSlice({
  name: 'posts',
  initialState: {
    status: 'idle',
    posts: [],
  },
  reducers: {
    likePost: (state, action) => {
      const { postId } = action.payload;
      const post = state.posts.find((p) => p.id === postId);
      if (post) {
        post.likes += 1;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state) => {
        state.status = 'failed';
      })
  },
});

export const { likePost } = postsSlice.actions;

export const selectAllPosts = (state) => state.posts.posts;
export const selectPostStatus = (state) => state.posts.status;

export default postsSlice.reducer;
