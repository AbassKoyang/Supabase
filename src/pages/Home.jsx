import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import supabase from "../config/supabse";

const fetchPosts = async () => {
  const { data, error } = await supabase.from('posts').select('*');
  if (error) {
    throw new Error('Error fetching posts');
  }
  return data;
};

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

const likePost = async (post) => {
  const { data, error } = await supabase.from('postshh').update({ likes: post.likes + 1 }).eq('id', post.id);
  if (error) {
    throw new Error('Error liking post');
  }
  return data;
};


const Home = () => {
    const queryClient = useQueryClient();
  
    const { data: posts, isLoading, isError } = useQuery({queryKey: ['posts'], queryFn: fetchPosts});
  
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
  
    const likePostMutation = useMutation({
    mutationFn: likePost,
    onMutate: async (updatedPost) => {
    await queryClient.cancelQueries({queryKey: ['posts', updatedPost.id]})
    const previousPost = queryClient.getQueryData({queryKey: ['posts', updatedPost.id]})
    queryClient.setQueryData(['posts', updatedPost.id], updatedPost)
    return {previousPost, updatedPost}
    },
    onError: (err, variables, context) => {
    // rollback changes
    queryClient.setQueryData(['posts', context.updatedPost.id], context.previousPost)
    },
    onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  });

  const handleLike = (post) => {
    // Optimistic update
    queryClient.setQueryData(['posts'], (prevData) => {
      if (prevData) {
        return prevData.map((p) =>
          p.id === post.id ? { ...p, likes: p.likes + 1 } : p
        );
      }
      return prevData;
    });

    likePostMutation.mutate({ ...post, likes: post.likes + 1 }, {
      optimisticId: post.id, // Custom option to identify optimistic updates
    });
  };
  
    const handleDelete = (postId) => {
     deletePostMutation.mutate(postId);
    };
  
    return (
      <div>
        {isLoading && <p>Loading...</p>}
        {isError && <p>Error fetching posts</p>}
        {posts &&
          posts.map((post) => (
            <div key={post.id}>
              <h2>{post.title}</h2>
              <p>{post.content}</p>
              <p>Likes: {post.likes}</p>
              <button onClick={() => handleLike(post)}>Like</button>
              <button onClick={() => updatePostMutation.mutate({ ...post, content: 'Updated Content' })}>
                Update
              </button>
              <button onClick={() => handleDelete(post.id)}>Delete</button>
            </div>
          ))}
      </div>
    );
  };

export default Home;
