// src/components/CreatePost.js
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import supabase from '../config/supabse'; // Import the Supabase client
import { useNavigate } from 'react-router-dom';


  
const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const queryClient = useQueryClient();
  const navigate = useNavigate();


  const createPost = async () => {
    const { data, error } = await supabase.from('posts').insert([{ title, content, likes: 0 }]);
    if (error) {
      throw new Error('Error creating post');
    }
    return data;
  };

  const createPostMutation = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries('posts');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createPostMutation.mutate();
   setTimeout(() => {
    navigate('/')
   }, 3000);
  };

  return (
    <section className='form-con'>
    <form onSubmit={handleSubmit} className='form'>
      <h2>Create a New Post</h2>
      <label>
        <span>Title:</span>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
      </label>
      <br />
      <label>
        <span>Content:</span>
        <textarea value={content} onChange={(e) => setContent(e.target.value)} />
      </label>
      <br />
      <button type='button' className='create-button button' onClick={handleSubmit} disabled={createPostMutation.isLoading}>
        {createPostMutation.isPending ? <p>Creating Post...</p> : <p>Create Post</p>}
      </button>
    </form>
    </section>
  );
};

export default CreatePost;
