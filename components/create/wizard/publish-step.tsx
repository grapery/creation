"use client";

import { Wand2, FileText, Image as ImageIcon, Video, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PublishStepProps {
    data: {
        title: string;
        style: string;
        content: string;
        images?: string[];
        video?: string;
    };
    onChange: (data: any) => void;
    onPublish: () => void;
    onBack: () => void;
}

export function PublishStep({ data, onPublish, onBack }: PublishStepProps) {
    const [isPublishing, setIsPublishing] = useState(false);

    const handlePublish = async () => {
        setIsPublishing(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsPublishing(false);
        onPublish();
    };

    return (
        <div className="space-y-6">
            {/* Preview Card */}
            <div className="p-6 bg-background border border-border rounded-xl space-y-4">
                <h2 className="text-xl font-semibold text-foreground mb-4">
                    Preview
                </h2>
                
                {/* Cover */}
                {data.images && data.images.length > 0 && (
                    <div className="rounded-lg overflow-hidden mb-4">
                        <img 
                            src={data.images[0]} 
                            alt="Cover" 
                            className="w-full h-[240px] object-cover"
                        />
                    </div>
                )}
                
                {/* Title */}
                <h3 className="text-2xl font-bold text-foreground">{data.title}</h3>
                
                {/* Style Badge */}
                {data.style && (
                    <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                        {data.style}
                    </span>
                )}
                
                {/* Content */}
                {data.content && (
                    <p className="text-base text-muted-foreground leading-relaxed mt-4">
                        {data.content}
                    </p>
                )}
                
                {/* Stats */}
                <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                        <ImageIcon className="w-4 h-4" />
                        <span>{data.images?.length || 0} images</span>
                    </div>
                    {data.video && (
                        <div className="flex items-center gap-1.5">
                            <Video className="w-4 h-4" />
                            <span>1 video</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Metadata Review */}
            <div className="p-6 bg-background border border-border rounded-xl space-y-4">
                <h2 className="text-xl font-semibold text-foreground">
                    Metadata
                </h2>
                
                <div className="space-y-3">
                    <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Title</span>
                        <span className="text-sm font-medium text-foreground">{data.title}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Style</span>
                        <span className="text-sm font-medium text-foreground">{data.style}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Scenes</span>
                        <span className="text-sm font-medium text-foreground">{data.images?.length || 0}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Content</span>
                        <span className="text-sm font-medium text-foreground truncate max-w-[200px]">{data.content.substring(0, 50)}...</span>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
                <Button
                    variant="outline"
                    onClick={onBack}
                    className="flex-1"
                >
                    Back
                </Button>
                <Button
                    onClick={handlePublish}
                    disabled={isPublishing}
                    className="flex-1 bg-black hover:bg-gray-800 text-white"
                >
                    {isPublishing ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            Publishing...
                        </>
                    ) : (
                        <>
                            <Send className="w-4 h-4 mr-2" />
                            Publish Storyboard
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}
