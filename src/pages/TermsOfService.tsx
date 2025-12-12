import { FileText } from 'lucide-react';
import { MobileHeader } from '../components/MobileHeader';
import { Card, CardContent } from '../components/ui/card';

interface TermsOfServiceProps {
  onNavigate: (page: string) => void;
}

export function TermsOfService({ onNavigate }: TermsOfServiceProps) {
  return (
    <div className="min-h-screen pt-14">
      <MobileHeader title="Terms of Service" showBack onBack={() => onNavigate('settings')} />

      <div className="p-4 space-y-4">
        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2>Terms of Service</h2>
                <p className="text-muted-foreground">Last updated: November 15, 2025</p>
              </div>
            </div>

            <div className="space-y-4 text-muted-foreground">
              <section>
                <h3 className="text-foreground mb-2">1. Acceptance of Terms</h3>
                <p>
                  By accessing and using StoryForge ("the Service"), you accept and agree to be
                  bound by the terms and provision of this agreement. If you do not agree to these
                  terms, you should not use the Service.
                </p>
              </section>

              <section>
                <h3 className="text-foreground mb-2">2. Use License</h3>
                <p>
                  Permission is granted to temporarily download one copy of StoryForge per device
                  for personal, non-commercial transitory viewing only. This is the grant of a
                  license, not a transfer of title.
                </p>
                <p className="mt-2">Under this license you may not:</p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Modify or copy the materials</li>
                  <li>Use the materials for any commercial purpose</li>
                  <li>Attempt to reverse engineer any software contained in StoryForge</li>
                  <li>Remove any copyright or proprietary notations from the materials</li>
                  <li>Transfer the materials to another person or "mirror" the materials</li>
                </ul>
              </section>

              <section>
                <h3 className="text-foreground mb-2">3. User Content</h3>
                <p>
                  You retain all rights to the content you create and upload to StoryForge. By
                  uploading content, you grant StoryForge a worldwide, non-exclusive, royalty-free
                  license to use, reproduce, and display your content solely for the purpose of
                  operating and improving the Service.
                </p>
              </section>

              <section>
                <h3 className="text-foreground mb-2">4. Account Responsibilities</h3>
                <p>You are responsible for:</p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Maintaining the security of your account and password</li>
                  <li>All activities that occur under your account</li>
                  <li>Ensuring all content you post complies with our content guidelines</li>
                  <li>Not sharing your account with others</li>
                </ul>
              </section>

              <section>
                <h3 className="text-foreground mb-2">5. Prohibited Content</h3>
                <p>You agree not to post content that:</p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Is illegal, harmful, threatening, or abusive</li>
                  <li>Infringes on intellectual property rights</li>
                  <li>Contains malware or harmful code</li>
                  <li>Violates privacy or publicity rights</li>
                  <li>Is spam or unsolicited promotion</li>
                </ul>
              </section>

              <section>
                <h3 className="text-foreground mb-2">6. Age Requirements</h3>
                <p>
                  You must be at least 13 years old to use StoryForge. Users between 13-17 must
                  have parental consent. We comply with COPPA (Children's Online Privacy Protection
                  Act) regulations.
                </p>
              </section>

              <section>
                <h3 className="text-foreground mb-2">7. Subscription and Payments</h3>
                <p>
                  Subscriptions are charged through your Apple ID account. Subscriptions
                  automatically renew unless canceled at least 24 hours before the end of the
                  current period. You can manage subscriptions in your Apple ID settings.
                </p>
              </section>

              <section>
                <h3 className="text-foreground mb-2">8. Termination</h3>
                <p>
                  We reserve the right to terminate or suspend your account immediately, without
                  prior notice, for conduct that we believe violates these Terms of Service or is
                  harmful to other users, us, or third parties.
                </p>
              </section>

              <section>
                <h3 className="text-foreground mb-2">9. Disclaimer</h3>
                <p>
                  The Service is provided "as is" without warranties of any kind. We do not
                  guarantee that the Service will be uninterrupted, timely, secure, or error-free.
                </p>
              </section>

              <section>
                <h3 className="text-foreground mb-2">10. Limitation of Liability</h3>
                <p>
                  StoryForge shall not be liable for any indirect, incidental, special,
                  consequential, or punitive damages resulting from your use of or inability to use
                  the Service.
                </p>
              </section>

              <section>
                <h3 className="text-foreground mb-2">11. Changes to Terms</h3>
                <p>
                  We reserve the right to modify these terms at any time. We will notify users of
                  significant changes via email or in-app notification. Continued use of the Service
                  after changes constitutes acceptance of the new terms.
                </p>
              </section>

              <section>
                <h3 className="text-foreground mb-2">12. Contact Information</h3>
                <p>
                  For questions about these Terms of Service, please contact us at:
                  <br />
                  Email: legal@storyforge.com
                  <br />
                  Address: 123 Story Lane, San Francisco, CA 94102
                </p>
              </section>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
