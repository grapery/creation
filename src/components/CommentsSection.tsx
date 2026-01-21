import { useEffect, useState } from 'react';
import { apiClient } from '../lib/api';
import type { Comment, GenericResponse, CreateCommentReq } from '../types';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, ThumbsUp, ThumbsDown, Loader2 } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';

interface CommentsSectionProps {
    targetType: 'story' | 'storyboard';
    targetId: string;
}

export function CommentsSection({ targetType, targetId }: CommentsSectionProps) {
    const { user } = useAuthStore();
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [commentText, setCommentText] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchComments();
    }, [targetType, targetId]);

    const fetchComments = async () => {
        setLoading(true);
        try {
            // Support snake_case query params if needed, but backend handler checked both
            const res = await apiClient.get<GenericResponse<{ comments: Comment[], total: number }>>('/comments', {
                params: { targetType, targetId, limit: 50 }
            });
            const data = res.data.data as any; // Handle potential wrapper variance
            setComments(data.comments || data.items || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handlePostComment = async () => {
        if (!commentText.trim()) return;
        setSubmitting(true);
        try {
            const payload: CreateCommentReq = {
                targetType,
                targetId,
                content: commentText
            };
            const res = await apiClient.post<GenericResponse<Comment>>('/comments', payload);
            if (res.data.data) {
                // Prepend new comment
                const newComment = res.data.data;
                // Manually populate author for immediate display if missed
                if (!newComment.author && user) {
                    newComment.author = user;
                }
                setComments([newComment, ...comments]);
                setCommentText('');
            }
        } catch (err) {
            console.error("Failed to post comment:", err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleLike = async (id: string, isLike: boolean) => {
        // Optimistic update would be good here, but for now just call API and maybe refetch or nothing
        try {
            // API: /comments/:id/like or /comments/:id/dislike
            // Backend handler: LikeComment, DislikeComment
            const endpoint = isLike ? `/comments/${id}/like` : `/comments/${id}/dislike`;
            await apiClient.post(endpoint);
            // Ideally update local state
            setComments(comments.map(c => {
                if (c.id === id) {
                    return {
                        ...c,
                        likes: isLike ? c.likes + 1 : c.likes,
                        isLiked: isLike,
                        // Naive logic, doesn't handle switching from dislike to like perfectly without more logic
                    };
                }
                return c;
            }));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Comments
            </h3>

            {/* Input */}
            <div className="flex gap-3">
                <Avatar className="w-8 h-8">
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback>{user?.username?.[0] || 'G'}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                    <textarea
                        className="w-full min-h-[80px] p-3 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="What are your thoughts?"
                        value={commentText}
                        onChange={e => setCommentText(e.target.value)}
                    />
                    <div className="flex justify-end">
                        <Button size="sm" onClick={handlePostComment} disabled={submitting || !commentText.trim()}>
                            {submitting && <Loader2 className="mr-2 w-3 h-3 animate-spin" />}
                            Comment
                        </Button>
                    </div>
                </div>
            </div>

            {/* List */}
            {loading ? (
                <div className="text-center py-4">Loading comments...</div>
            ) : (
                <div className="space-y-4">
                    {comments.map(comment => (
                        <div key={comment.id} className="flex gap-3">
                            <Avatar className="w-8 h-8">
                                <AvatarImage src={comment.author?.avatar} />
                                <AvatarFallback>{comment.author?.username?.[0] || 'U'}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-1">
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <span className="font-bold text-gray-900">{comment.author?.displayName || comment.author?.username || 'Unknown'}</span>
                                    <span>{formatDistanceToNow(comment.createdAt * 1000)} ago</span>
                                </div>
                                <p className="text-sm text-gray-800">{comment.content}</p>
                                <div className="flex items-center gap-4 text-xs text-gray-500 font-bold mt-1">
                                    <button
                                        className={`flex items-center gap-1 hover:bg-gray-100 p-1 rounded ${comment.isLiked ? 'text-orange-500' : ''}`}
                                        onClick={() => handleLike(comment.id, true)}
                                    >
                                        <ThumbsUp className="w-4 h-4" />
                                        {comment.likes || 0}
                                    </button>
                                    <button className="flex items-center gap-1 hover:bg-gray-100 p-1 rounded">
                                        <ThumbsDown className="w-4 h-4" />
                                    </button>
                                    <button className="hover:bg-gray-100 p-1 rounded">Reply</button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {comments.length === 0 && (
                        <div className="text-gray-500 text-sm text-center py-4">No comments yet.</div>
                    )}
                </div>
            )}
        </div>
    );
}
