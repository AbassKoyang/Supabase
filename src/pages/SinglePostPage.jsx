import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom'
import supabase from '../config/supabse';

const SinglePostPage = () => {
    const postId = useParams();
    const fetchSinglePost = async () => {
        const {data, error} = await supabase.from('posts').select('*').eq('id', postId.id).single();
        if(!error){
            console.log(data)
            return data
        }
        if(error){
            console.log(error);
            throw error;
        }
    }
    const {data:post, error, isLoading} = useQuery({queryKey: ['singlepost'], queryFn: fetchSinglePost})

  return (
    <section className="single-post-page">
        {error && (<p>Error fetching post {error.message}</p>)}
        {isLoading && (<p>Loading..</p>)}
        {post && 
            (
            <div className='single-post'>
            <h2>{post.title}</h2>
            <p>{post.content}</p>
            <p>likes: {post.likes}</p>
            <h3>Comments</h3>
            <form >
                <textarea name="commentbox" id="" cols="30" rows="15"></textarea>
                <button type='button'>Submit comment</button>
            </form>
            </div>)
            }
    </section>
  )
}

export default SinglePostPage