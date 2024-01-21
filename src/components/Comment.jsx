import { useMutation, useQueryClient } from "@tanstack/react-query"
import supabase from "../config/supabse";
import { useState } from "react";

const Comment = ({comment, postId}) => {
    const query = useQueryClient();
    const [replyContent, setReplyContent] = useState('');
    const [showReply, setShowReply] = useState(false);

    const uploadReply = async () => {
        const {data, error} = await supabase.from('users_comments').insert([{author: {username:'abasskoyang', email: 'abasskoyang12@gmail.com', user_id: 1}, commenter_id: 1, post_id: postId.id, parent_comment_id: comment.id, comment_content: replyContent} ])
        if (error) {
            console.log(error)
            throw new Error('Error uploading reply');
          }
          console.log(data)
        return data;
    }

    const uploadReplyMutation = useMutation({
        mutationKey: ["uploadcomment"],
        mutationFn: uploadReply,
        onSuccess: ()=>{
            query.invalidateQueries({queryKey: ['comments']})
        }
    })

    const handleReplySubmit = (e) => {
        e.preventDefault();
        uploadReplyMutation.mutate();
        console.log(replyContent)
        // if(uploadReplyMutation.isSuccess){
        //     setReplyContent('')
        // }
    };
    const handleReplyButtonClick = () => {
        setShowReply(!showReply);
    }
  return (
    <div className="comments">
        <h3>@{comment.author.username}</h3>
        <small>{comment.author.email}</small>
        <p>{comment.comment_content}</p>
        <button onClick={handleReplyButtonClick}>Reply</button>
       {showReply && (
         <form className='form' onSubmit={handleReplySubmit}>
         <textarea className='textarea' value={replyContent} placeholder='Enter your comment' onChange={(e) => setReplyContent(e.target.value)} name="commentbox" id="" cols="30" rows="6"></textarea>
             <button className='button' type='button' onClick={handleReplySubmit}>
                 {uploadReplyMutation.isPending ? 'Uploading reply...' : 'Upload reply'}
             </button>
        </form>
       )}
        <div className="replies">
                {comment.replies && comment.replies.map((reply) => <Comment comment={reply} />)}
        </div>
    </div>
  )
}

export default Comment