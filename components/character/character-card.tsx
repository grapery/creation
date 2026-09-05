import Link from "next/link"
import Image from "next/image";
import { Character } from "@/lib/types/character"
import { Card, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageCircle, Heart } from "lucide-react"

export function CharacterCard({ character }: { character: Character }) {
    return (
        <Card className="hover:shadow-md transition-all overflow-hidden group">
            <Link href={`/characters/${character.id}`}>
                <div className="aspect-[3/4] w-full bg-secondary relative">
                    {character.avatar ? (
<Image src={character.avatar} alt={character.name} fill sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-muted-foreground">
                            {character.name[0]}
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                        <h3 className="font-bold text-lg">{character.name}</h3>
                        <p className="text-xs text-white/80 line-clamp-2">{character.description}</p>
                    </div>
                </div>
            </Link>
            <CardFooter className="p-3 bg-muted/30 flex justify-between">
                <div className="flex gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                        <MessageCircle className="h-3 w-3" />
                        {character.chatCount || 0}
                    </span>
                    <span className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        {character.likes || 0}
                    </span>
                </div>
                <Button size="sm" variant="ghost" className="h-6 px-2 text-xs" asChild>
                    <Link href={`/chat/new?characterId=${character.id}`}>Chat</Link>
                </Button>
            </CardFooter>
        </Card>
    )
}
