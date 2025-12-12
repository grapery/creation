import { useState } from 'react';
import { ThumbsUp, ThumbsDown, MessageSquare, MoreVertical } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Comment } from '../lib/mockData';

interface CommentSectionProps {
  comments: Comment[];
}

function CommentItem({ comment, depth = 0 }: { comment: Comment; depth?: number }) {
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState('');

  const handleSubmitReply = () => {
    console.log('Reply submitted:', replyText);
    setReplyText('');
    setShowReply(false);
  };

  return (
    <div className={`${depth > 0 ? 'ml-8 border-l pl-4' : ''}`}>
      <div className="flex gap-3 mb-4">
        <Avatar className="h-8 w-8">
          <AvatarImage src={comment.author.avatar} />
          <AvatarFallback>{comment.author.displayName[0]}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-muted-foreground">
              {comment.author.displayName}
            </span>
            <span className="text-muted-foreground">
              {new Date(comment.createdAt).toLocaleDateString()}
            </span>
            <Button variant="ghost" size="sm" className="ml-auto">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
          
          <p className="mb-2">{comment.content}</p>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="h-8">
              <ThumbsUp className="h-3 w-3 mr-1" />
              {comment.likes}
            </Button>
            <Button variant="ghost" size="sm" className="h-8">
              <ThumbsDown className="h-3 w-3 mr-1" />
              {comment.dislikes}
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8"
              onClick={() => setShowReply(!showReply)}
            >
              <MessageSquare className="h-3 w-3 mr-1" />
              Reply
            </Button>
          </div>

          {showReply && (
            <div className="mt-3 space-y-2">
              <Textarea
                placeholder="Write a reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="min-h-[80px]"
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleSubmitReply}>
                  Post Reply
                </Button>
                <Button size="sm" variant="outline" onClick={() => setShowReply(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-4 space-y-4">
              {comment.replies.map((reply) => (
                <CommentItem key={reply.id} comment={reply} depth={depth + 1} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function CommentSection({ comments }: CommentSectionProps) {
  const [newComment, setNewComment] = useState('');

  const handleSubmitComment = () => {
    console.log('Comment submitted:', newComment);
    setNewComment('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-4">Comments ({comments.length})</h3>
        
        <div className="space-y-2 mb-6">
          <Textarea
            placeholder="Share your thoughts..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[100px]"
          />
          <Button onClick={handleSubmitComment}>
            Post Comment
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
}
