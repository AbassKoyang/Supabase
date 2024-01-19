import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
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

    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const postId = useParams();

    const { data: post, isLoading, isError, error } = useQuery({queryKey: ['post'], queryFn: async () => {
        const { data, error } = await supabase.from('posts').select().eq('id', postId.id);
        if (error) {
          throw new Error('Error fetching posts');
        }
        console.log(data)
        return data}
    });

    const [postTitle, setPostTitle] = useState(post ? post[0].title : '');
    const [postContent, setPostContent] = useState(post ? post[0].content : '');
    
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

      const handleUpdatePostMutation = () => {
        const existingPost = post[0]
        updatePostMutation.mutate({ ...existingPost, postTitle: postTitle, content: postContent })
        console.log({ ...existingPost, title: postTitle, content: postContent })
        // navigate('/')
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
                        <form>
                            <label htmlFor="title">
                                <span>Title</span>
                                <input name="title" value={postTitle} type="text" onChange={(e) => setPostTitle(e.target.value)} />
                            </label>
                            <label htmlFor="content">
                                <span>Content</span>
                                <textarea value={postContent} name="content" type="text" rows='10' onChange={(e) => setPostContent(e.target.value)}></textarea>
                            </label>
                            <button type="button" disabled={!isTrue} onClick={handleUpdatePostMutation}>Update</button>
                            <button onClick={() => handleDelete(postId.id)}>Delete</button>
                        </form>
            ) : null
        }
    </section>
  )
}

export default Update