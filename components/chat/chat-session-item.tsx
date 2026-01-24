import Link from "next/link"
import { ChatSession } from "@/lib/api/chat"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"

export function ChatSessionItem({ session }: { session: ChatSession }) {
    return (
        <Link
            href={`/chat/${session.id}`}
            className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors border-b last:border-0"
        >
            <div className="relative">
                <Avatar className="h-12 w-12">
                    <AvatarImage src={session.characterAvatar} />
                    <AvatarFallback>{session.characterName[0]}</AvatarFallback>
                </Avatar>
                {session.unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center border-2 border-background">
                        {session.unreadCount}
                    </span>
                )}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                    <h4 className="font-semibold truncate">{session.characterName}</h4>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatDistanceToNow(new Date(session.lastMessageTime), { addSuffix: true })}
                    </span>
                </div>
                <p className={cn("text-sm truncate", session.unreadCount > 0 ? "font-medium text-foreground" : "text-muted-foreground")}>
                    {session.lastMessage}
                </p>
            </div>
        </Link>
    )
}
