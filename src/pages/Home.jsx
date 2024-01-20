import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import supabase from "../config/supabse";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { RiEdit2Line, RiHeartFill, RiHeartLine } from "react-icons/ri";

const fetchPosts = async () => {
  const { data, error } = await supabase.from('posts').select('*').order('id', { ascending: false });
  if (error) {
    console.log(error)
    throw new Error('Error fetching posts');
  }
  return data;
};
const fetchLikedPosts = async () => {
  const { data: likedPosts, error: likedPostsError } = await supabase
  .from('user_likes')
  .select('post_id')
  .eq('user_id', 1);
  if (likedPostsError) {
    console.log(likedPostsError)
    throw new Error('Error fetching liked posts');
  }
  return likedPosts
};

const likePost = async (post) => {
  const updatedLikes = post.isLiked ? post.likes - 1 : post.likes + 1;
  const { data, error } = await supabase
    .from('posts')
    .update({ likes: updatedLikes })
    .eq('id', post.id);

  if (error) {
    throw new Error('Error liking post');
  }

  return data;
};



const Home = () => {
    const queryClient = useQueryClient();
    const [updatedPost, setUpdatedPost] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    const { data: likedPosts, isLoading:isLikedPostLoading, isError:isLikedPostError, error:likedPostsError } = useQuery({queryKey: ['likedPosts'], queryFn: fetchLikedPosts});
    const { data: posts, isLoading:isPostLoading, isError:isPostError, error:postsError} = useQuery({queryKey: ['posts'], queryFn: fetchPosts});
        const fetchPost = () => {
          if(isPostLoading || isLikedPostLoading ){
            setIsLoading(true)
          }else{
            setIsLoading(false)
          }

          if(isPostError || isLikedPostError ){
            setIsError(true)
            console.error('Error fetching posts:', postsError.message);
            return
          } else{
            setIsError(false)
          }
  
          if(isPostError){
            console.error('Error fetching posts:', postsError.message);
            return
          }
          if(likedPostsError ){
            console.error('Error fetching posts:', likedPostsError.message);
            return
          }
        if(likedPosts && posts){
            // Create a set of post IDs that the user has liked
        const likedPostIds = new Set(likedPosts.map((like) => like.post_id));
  
        // Update each post in the data array to include whether it has been liked
        const updatedPosts = posts.map((post) => ({
          ...post,
          isLiked: likedPostIds.has(post.id),
        }));
        setUpdatedPost(updatedPosts);
        }

        }
        useEffect(() => {
          fetchPost();
        }, [likedPosts, posts]);
        
    
  
  
        const likePostMutation = useMutation({
          mutationFn: likePost,
          onMutate: async (updatedPost) => {
            await queryClient.cancelQueries({ queryKey: ['posts', updatedPost.id] });
            const previousPost = queryClient.getQueryData({
              queryKey: ['posts', updatedPost.id],
            });
            queryClient.setQueryData(['posts', updatedPost.id], updatedPost);
            return { previousPost, updatedPost };
          },
          onError: (err, variables, context) => {
            // rollback changes
            queryClient.setQueryData(
              ['posts', context.updatedPost.id],
              context.previousPost
            );
          },
          onSettled: (data, error, variables, context) => {
            queryClient.invalidateQueries({ queryKey: ['posts', context.updatedPost.id] });
            queryClient.invalidateQueries({ queryKey: ['likedPosts'] });
          },
        });
        

        const handleLike = async (post) => {
          const postId = post.id;
          const existingLike = post.isLiked;
        
          // Optimistic update
          queryClient.setQueryData(['posts'], (prevData) => {
            if (prevData) {
              return prevData.map((p) =>
                p.id === post.id ? { ...p, likes: post.isLiked ? p.likes - 1 : p.likes + 1 } : p
              );
            }
            return prevData;
          });

          likePostMutation.mutate(post, {
            optimisticId: post.id, // Custom option to identify optimistic updates
          });
        
          try {
            if (existingLike) {
              // If post is already liked, unlike it
              await supabase
                .from('user_likes')
                .delete()
                .eq('user_id', 1)
                .eq('post_id', postId);
            } else {
              // If post is not liked, like it
              await supabase
                .from('user_likes')
                .upsert([{ user_id: 1, post_id: postId }]);
            }
            // The optimistic update in onMutate should take care of UI changes
          } catch (error) {
            console.error('Error toggling like:', error.message);
          }
        };
  
  
    return (
      <div className="post-section">
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            isError ? (
              <p>Error fetching posts</p>
            ) : (
              updatedPost.length > 1 ? (
                <div className="post-list">
                  {updatedPost.map((post) => (
                  <article key={post.id}>
                    <h2>{post.title}</h2>
                    <p>{post.content}</p>
                    <div className="article-action-con">
                      <div className="like-con">
                        <button className="like-button" onClick={() => handleLike(post)}>
                          {post.isLiked ? <RiHeartFill className="like-icon" /> : <RiHeartLine className="like-icon" />}
                        </button>
                        <small>Likes: {post.likes}</small>
                      </div>
                      <div className="links-con">
                      <Link to={`update/${post.id}`}><RiEdit2Line className='edit-icon' /></Link>
                      <Link to={`post/${post.id}`}>View</Link>
                      </div>
                    </div>
                  </article>
                ))}
                </div>
              ) : null
            )
          )}
        </div>
  );
};

export default Home;
