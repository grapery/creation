import { Lock } from 'lucide-react';
import { MobileHeader } from '../components/MobileHeader';
import { Card, CardContent } from '../components/ui/card';

interface PrivacyPolicyProps {
  onNavigate: (page: string) => void;
}

export function PrivacyPolicy({ onNavigate }: PrivacyPolicyProps) {
  return (
    <div className="min-h-screen pt-14">
      <MobileHeader title="Privacy Policy" showBack onBack={() => onNavigate('settings')} />

      <div className="p-4 space-y-4">
        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Lock className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2>Privacy Policy</h2>
                <p className="text-muted-foreground">Last updated: November 15, 2025</p>
              </div>
            </div>

            <div className="space-y-4 text-muted-foreground">
              <section>
                <h3 className="text-foreground mb-2">1. Information We Collect</h3>
                <p className="mb-2">We collect information you provide directly to us:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Account information (name, email, username, password)</li>
                  <li>Profile information (bio, avatar, preferences)</li>
                  <li>Content you create (stories, storyboards, comments)</li>
                  <li>Communication data (messages, support inquiries)</li>
                </ul>
                <p className="mt-2">We automatically collect:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Device information (device type, OS version, unique identifiers)</li>
                  <li>Usage data (features used, time spent, interactions)</li>
                  <li>Log data (IP address, browser type, access times)</li>
                </ul>
              </section>

              <section>
                <h3 className="text-foreground mb-2">2. How We Use Your Information</h3>
                <p className="mb-2">We use collected information to:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Provide, maintain, and improve the Service</li>
                  <li>Process your transactions and manage subscriptions</li>
                  <li>Send you technical notices and support messages</li>
                  <li>Respond to your comments and questions</li>
                  <li>Personalize and improve your experience</li>
                  <li>Generate AI content based on your preferences</li>
                  <li>Monitor and analyze trends and usage</li>
                  <li>Detect and prevent fraud and abuse</li>
                </ul>
              </section>

              <section>
                <h3 className="text-foreground mb-2">3. Information Sharing</h3>
                <p className="mb-2">We do not sell your personal information. We may share information:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>
                    <strong>With other users:</strong> Your public profile and content are visible
                    to other users
                  </li>
                  <li>
                    <strong>With service providers:</strong> Third parties who perform services on
                    our behalf (hosting, analytics, payment processing)
                  </li>
                  <li>
                    <strong>For legal reasons:</strong> When required by law or to protect rights
                    and safety
                  </li>
                  <li>
                    <strong>With your consent:</strong> When you explicitly authorize sharing
                  </li>
                </ul>
              </section>

              <section>
                <h3 className="text-foreground mb-2">4. AI and Data Processing</h3>
                <p>
                  When you use our AI features, your prompts and preferences are processed to
                  generate content. We may use anonymized data to improve our AI models. You can
                  opt out of AI data usage in your privacy settings.
                </p>
              </section>

              <section>
                <h3 className="text-foreground mb-2">5. Data Security</h3>
                <p>
                  We implement reasonable security measures to protect your information. However, no
                  method of transmission over the Internet is 100% secure. We use encryption for
                  sensitive data and regularly update our security practices.
                </p>
              </section>

              <section>
                <h3 className="text-foreground mb-2">6. Data Retention</h3>
                <p>
                  We retain your information for as long as your account is active or as needed to
                  provide services. You can request deletion of your data at any time through
                  account settings.
                </p>
              </section>

              <section>
                <h3 className="text-foreground mb-2">7. Children's Privacy</h3>
                <p>
                  StoryForge is not intended for children under 13. We do not knowingly collect
                  information from children under 13. If you believe we have collected information
                  from a child under 13, please contact us immediately.
                </p>
                <p className="mt-2">
                  For users aged 13-17, we provide additional privacy protections and require
                  parental consent where applicable.
                </p>
              </section>

              <section>
                <h3 className="text-foreground mb-2">8. Your Rights</h3>
                <p className="mb-2">You have the right to:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Access your personal information</li>
                  <li>Correct inaccurate data</li>
                  <li>Request deletion of your data</li>
                  <li>Export your data</li>
                  <li>Opt out of marketing communications</li>
                  <li>Object to certain processing activities</li>
                </ul>
              </section>

              <section>
                <h3 className="text-foreground mb-2">9. International Data Transfers</h3>
                <p>
                  Your information may be transferred to and processed in countries other than your
                  own. We ensure appropriate safeguards are in place for international transfers.
                </p>
              </section>

              <section>
                <h3 className="text-foreground mb-2">10. Cookies and Tracking</h3>
                <p>
                  We use cookies and similar technologies to track activity and improve the Service.
                  You can control cookie preferences through your device settings.
                </p>
              </section>

              <section>
                <h3 className="text-foreground mb-2">11. California Privacy Rights</h3>
                <p>
                  California residents have additional rights under the CCPA, including the right to
                  know what personal information is collected and the right to opt out of the sale
                  of personal information.
                </p>
              </section>

              <section>
                <h3 className="text-foreground mb-2">12. GDPR Compliance</h3>
                <p>
                  For users in the European Union, we comply with GDPR requirements. You have rights
                  regarding data portability, erasure, and restriction of processing.
                </p>
              </section>

              <section>
                <h3 className="text-foreground mb-2">13. Changes to This Policy</h3>
                <p>
                  We may update this Privacy Policy from time to time. We will notify you of
                  significant changes via email or in-app notification. Your continued use of the
                  Service after changes constitutes acceptance.
                </p>
              </section>

              <section>
                <h3 className="text-foreground mb-2">14. Contact Us</h3>
                <p>
                  For privacy-related questions or to exercise your rights:
                  <br />
                  Email: privacy@storyforge.com
                  <br />
                  Address: 123 Story Lane, San Francisco, CA 94102
                  <br />
                  Data Protection Officer: dpo@storyforge.com
                </p>
              </section>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
