import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom'
import supabase from '../config/supabse';

const SinglePostPage = () => {
    const postId = useParams();
    console.log(postId);
    const fetchSinglePost = async () => {
        const {data, error} = await supabase.from('posts').select('*').eq('id', postId.id);
        if(!error) return data;
        if(error){
            console.log(error);
            throw error;
        }
    }
    const {data:post, error, isLoading, isError} = useQuery({queryKey: ['singlepost'], queryFn: fetchSinglePost})

  return (
    <section className="single-post-page">
        {error && (<p>Error fetching post</p>)}

        {post && 
            (
            <div>
            <h2>{post.title}</h2>
            <p>{post.content}</p>
            <p>likes: {post.likes}</p>
            <h3>Comments</h3>
            </div>)
            }
    </section>
  )
}

export default SinglePostPage