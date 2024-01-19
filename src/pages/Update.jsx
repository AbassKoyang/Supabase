import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import supabase from "../config/supabse";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";


const Update = () => {

    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const postId = useParams();
    const [postTitle, setPostTitle] = useState(null);
    const [postContent, setPostContent] = useState(null);
    const [updateError, setUpdateError] = useState(null);

    const { data: post, isLoading, isError, error } = useQuery({queryKey: ['post'], queryFn: async () => {
        const { data, error } = await supabase.from('posts').select().eq('id', postId.id).single();
        if (error) {
          throw new Error('Error fetching posts');
        }
        console.log(data)
        return data}
    });

    const updatePost = async (updatedPost) => {
        const { data, error } = await supabase.from('posts').update(updatedPost).eq('id', updatedPost.id);
        if (error) {
            setUpdateError('Failed to update post, please try again.')
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

    
    useEffect(() => {
      if(post){
        setPostTitle(post.title)
        setPostContent(post.content)
      }
      if(error)(
        navigate('/', {replace: true})
      )
    }, [postId, navigate, error, post])

      const updatePostMutation = useMutation({
        mutationFn:updatePost, 
        onError: () => {
            setUpdateError("Failed to update the Post");
        },
        onSuccess: () => {
          queryClient.invalidateQueries('posts');
        },
      });

      const handleUpdatePostMutation = () => {
        const existingPost = post;
        const updatedPost = {...existingPost, title: postTitle, content: postContent }
        updatePostMutation.mutate(updatedPost)
        console.log(updatedPost)
        // navigate('/')
      }

      const handleSubmit = (e) => {
        e.preventDefault() ;
        handleUpdatePostMutation() 
      }
    
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
        {isLoading ? (<p>Loading...</p>) :
            isError ? (<p>{error.message}</p>) :
                post ? (
                        <form onSubmit={handleSubmit}>
                            <label htmlFor="title">
                                <span>Title</span>
                                <input name="title" value={postTitle} type="text" onChange={(e) => setPostTitle(e.target.value)} />
                            </label>
                            <label htmlFor="content">
                                <span>Content</span>
                                <textarea value={postContent} name="content" type="text" rows='10' onChange={(e) => setPostContent(e.target.value)}></textarea>
                            </label>
                            <button type="button" disabled={!isTrue} onClick={handleSubmit}>Update</button>
                            <button onClick={() => handleDelete(postId.id)}>Delete</button>
                        </form>
            ) : null
        }
        {updateError && <p>{updateError}</p>}
    </section>
  )
}

export default Update