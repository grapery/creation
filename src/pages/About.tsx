import { Heart, Users, Sparkles, Mail } from 'lucide-react';
import { MobileHeader } from '../components/MobileHeader';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';

interface AboutProps {
  onNavigate: (page: string) => void;
}

export function About({ onNavigate }: AboutProps) {
  return (
    <div className="min-h-screen pt-14">
      <MobileHeader title="About StoryForge" showBack onBack={() => onNavigate('settings')} />

      <div className="p-4 space-y-4">
        {/* App Info */}
        <Card>
          <CardContent className="p-6 text-center space-y-4">
            <div className="flex justify-center">
              <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                <Sparkles className="h-10 w-10 text-primary-foreground" />
              </div>
            </div>
            <div>
              <h1 className="mb-2">StoryForge</h1>
              <p className="text-muted-foreground">Version 1.0.0 (Build 2025.11.15)</p>
            </div>
            <p className="text-muted-foreground">
              Create, collaborate, and share amazing stories with the world. Powered by AI to bring
              your imagination to life.
            </p>
          </CardContent>
        </Card>

        {/* Mission */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Heart className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="mb-1">Our Mission</h3>
                <p className="text-muted-foreground">
                  To empower storytellers worldwide by providing intuitive tools that make creative
                  collaboration accessible to everyone.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="mb-1">Community First</h3>
                <p className="text-muted-foreground">
                  Built by storytellers, for storytellers. We believe in the power of community
                  creativity and collaborative narratives.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="mb-1">AI-Powered</h3>
                <p className="text-muted-foreground">
                  Leveraging cutting-edge AI technology to enhance your storytelling, from
                  character development to visual storyboards.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <Card>
          <CardContent className="p-4">
            <h3 className="mb-3">Key Features</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Create unlimited stories with branching narratives</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Visual storyboard editor with AI generation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Character development and AI chat interactions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Collaborate with writers worldwide</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Social engagement and community features</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>TikTok-style immersive reading experience</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Credits */}
        <Card>
          <CardContent className="p-4">
            <h3 className="mb-3">Credits & Attributions</h3>
            <div className="space-y-2 text-muted-foreground">
              <p>
                <strong>Icons:</strong> Lucide Icons
              </p>
              <p>
                <strong>UI Components:</strong> shadcn/ui
              </p>
              <p>
                <strong>AI Models:</strong> OpenAI, Stability AI
              </p>
              <p>
                <strong>Avatar Service:</strong> DiceBear
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <h3>Get in Touch</h3>
            <p className="text-muted-foreground">
              We'd love to hear from you! Whether you have feedback, questions, or need support.
            </p>
            <div className="flex flex-col gap-2">
              <Button variant="outline" className="w-full justify-start">
                <Mail className="mr-2 h-4 w-4" />
                support@storyforge.com
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Users className="mr-2 h-4 w-4" />
                Join our Community
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Copyright */}
        <div className="text-center text-muted-foreground pb-4">
          <p>© 2025 StoryForge Inc.</p>
          <p>All rights reserved.</p>
          <p className="mt-2">Made with ❤️ for storytellers everywhere</p>
        </div>
      </div>
    </div>
  );
}
