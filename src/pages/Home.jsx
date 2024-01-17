
import { useSelector, useDispatch } from 'react-redux';
import { selectAllPosts, selectPostStatus, likePost, updateLikes } from '../features/post/postSlice';

const Home = () => {
  const dispatch = useDispatch();
  const posts = useSelector(selectAllPosts);
  const status = useSelector(selectPostStatus);

  const handleLike = (postId, likes) => {
    // Optimistically update the local state
    dispatch(likePost({ postId }));

    // Update the server state (handled by React Query)
    dispatch(updateLikes({ postId, likes }));
  };

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  if (status === 'failed') {
    return <p>Error fetching posts</p>;
  }

  return (
    <div>
      {posts.map((post) => (
        <div key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
          <p>Likes: {post.likes}</p>
          <button onClick={() => handleLike(post.id, post.likes)}>Like</button>
        </div>
      ))}
    </div>
  );
};

export default Home;
