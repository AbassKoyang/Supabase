import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom'
import supabase from '../config/supabse';
import { useState } from 'react';
import Comment from '../components/Comment';

const SinglePostPage = () => {
    const query =  useQueryClient()
    const postId = useParams();
    const [commentContent, setCommentContent] = useState('');


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
    const uploadComment = async () => {
        const {data, error} = await supabase.from('users_comments').insert([{author: {username:'abasskoyang', email: 'abasskoyang12@gmail.com', user_id: 1}, commenter_id: 1, post_id: postId.id, parent_comment_id: null, comment_content: commentContent} ])
        if (error) {
            console.log(error)
            throw new Error('Error uploading comment');
          }
        return data;
    }

    const fetchComments = async () => {
        const {data, error} = await supabase.from('users_comments').select('*').eq('post_id', postId.id);
        if(error){
            console.log(error)
            throw new Error('Couldnt fetch comments');
        }
        
        const comments = data.map((comment) => ({
            ...comment,
            replies: data.filter((reply) => reply.parent_comment_id === comment.id),
        }));

        const topLevelComments = comments.filter((comment) => !comment.parent_comment_id);

        return topLevelComments;
    }



    const {data:post, error, isLoading} = useQuery({queryKey: ['singlepost'], queryFn: fetchSinglePost});
    const {data:comments, error:commentsError, isLoading:commentsIsLoading} = useQuery({queryKey: ['comments'], queryFn: fetchComments}); 

    const uploadCommentMutation = useMutation({
        mutationKey: ["uploadcomment"],
        mutationFn: uploadComment,
        onSuccess: ()=>{
            query.invalidateQueries({queryKey: ['comments']})
        }
    })


    const handleSubmit = (e) => {
        e.preventDefault();
        uploadCommentMutation.mutate();
    };


  return (
    <section className="single-post-page">
        {error && (<p>Error fetching post {error.message}</p>)}
        {isLoading && (<p>Loading..</p>)}
        {post && 
            (
            <div className='single-post'>
            <h2 className='title'>{post.title}</h2>
            <p className='content'>{post.content}</p>
            <p className='likes'>Likes: {post.likes}</p>
            <h3 className='comment-subtitle'>Comments</h3>
            <form className='form' onSubmit={handleSubmit}>
                <textarea className='textarea' value={commentContent} placeholder='Enter your comment' onChange={(e)=> setCommentContent(e.target.value)} name="commentbox" id="" cols="30" rows="15"></textarea>
                <button className='button' type='button' onClick={handleSubmit}>
                    {uploadCommentMutation.isPending ? 'Uploading comment...' : 'Upload Comment'}
                </button>
            </form>
            <div className='comment-section'>
                {commentsIsLoading && <p>Loading comments...</p>}
                {commentsError && <p>Error fetching comments</p>}
                {comments && comments.length < 1 && <p>Be the first to comment 😃</p>}
                {comments && comments.map((comment) => {
                    return (
                        <Comment key={comment.id} comment={comment} postId={postId} />
                    )
                })}
            </div>
            </div>)
            }
    </section>
  )
}

export default SinglePostPage