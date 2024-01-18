import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import supabase from "../config/supabse";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// const fetchPost = async (postId) => {
//     const { data, error } = await supabase.from('posts').select('id', postId);
//     if (error) {
//       throw new Error('Error fetching posts');
//     }
//     return data;
//   };

const updatePost = async (updatedPost) => {
    const { data, error } = await supabase.from('posts').update(updatedPost).eq('id', updatedPost.id);
    if (error) {
      throw new Error('Error updating post');
    }
    return data;
  };
  
  const deletePost = async (postId) => {
    const { error } = await supabase.from('posts').delete().eq('id', postId);
    if (error) {
      throw new Error('Error deleting post');
    }
  };


const Update = () => {
    const queryClient = useQueryClient();
    const postId = useParams();
    const { data: post, isLoading, isError } = useQuery({queryKey: ['post'], queryFn: async () => {
        const { data, error } = await supabase.from('posts').select('id', postId);
        if (error) {
          throw new Error('Error fetching posts');
        }
        return data}});

    const [postTitle, setPostTitle] = useState(post?.title);
    const [postContent, setPostContent] = useState(post?.title);
    
    // useEffect(() => {
    //   if(post){

    //   }
    // }, [])

      const updatePostMutation = useMutation({
        mutationFn:updatePost, 
        onSuccess: () => {
          queryClient.invalidateQueries('posts');
        },
      });
    
      const deletePostMutation = useMutation({
        mutationFn:deletePost, 
        onSuccess: () => {
          queryClient.invalidateQueries('posts');
        },
      });

      const handleDelete = (postId) => {
        deletePostMutation.mutate(postId);
       };
    const isTrue = postTitle && postContent;
    
  return (
    <section className='update-page'>
        <form>
            <label htmlFor="title">
                <span>Title</span>
                <input name="title" value={postTitle} type="text" onChange={(e) => setPostTitle(e.target.value)} />
            </label>
            <label htmlFor="content">
                <span>Content</span>
                <textarea value={postContent} name="content" type="text" rows='10' onChange={(e) => setPostContent(e.target.value)}></textarea>
            </label>
            <button disabled={!isTrue} onClick={() => updatePostMutation.mutate({ ...post, postTitle: postTitle, content: postContent })}>Update</button>
            <button onClick={() => handleDelete(postId)}>Delete</button>
        </form>
    </section>
  )
}

export default Update