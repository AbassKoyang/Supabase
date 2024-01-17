// src/components/CreatePost.js
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { fetchPosts } from '../features/post/postSlice';
import supabase from '../config/supabse'; // Import the Supabase client

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const createPostMutation = useMutation(
    {
       mutationFn: async () => {
            const { data, error } = await supabase.from('posts').insert([{ title, content, likes: 0 }]);
            if (error) {
              throw new Error('Error creating post');
            }
            return data;
          },
      onSuccess: () => {
        // Refetch posts after successful creation
        queryClient.invalidateQueries('posts');
        dispatch(fetchPosts()); // Optionally, you can dispatch the RTK action as well
      },
    }
  );

  const handleCreatePost = () => {
    createPostMutation.mutate();
  };

  return (
    <div>
      <h2>Create a New Post</h2>
      <label>
        Title:
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
      </label>
      <br />
      <label>
        Content:
        <textarea value={content} onChange={(e) => setContent(e.target.value)} />
      </label>
      <br />
      <button onClick={handleCreatePost} disabled={createPostMutation.isLoading}>
        Create Post
      </button>
    </div>
  );
};

export default CreatePost;
