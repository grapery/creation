import { FileText, Globe, Shield } from 'lucide-react';
import { MobileHeader } from '../components/MobileHeader';
import { Card, CardContent } from '../components/ui/card';

interface RegulatoryInfoProps {
  onNavigate: (page: string) => void;
}

export function RegulatoryInfo({ onNavigate }: RegulatoryInfoProps) {
  return (
    <div className="min-h-screen pt-14">
      <MobileHeader
        title="Regulatory Information"
        showBack
        onBack={() => onNavigate('settings')}
      />

      <div className="p-4 space-y-4">
        {/* Company Information */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2>Company Information</h2>
                <p className="text-muted-foreground">Legal entity details</p>
              </div>
            </div>

            <div className="space-y-3 text-muted-foreground">
              <div>
                <p className="font-medium text-foreground">Legal Name</p>
                <p>StoryForge Inc.</p>
              </div>
              <div>
                <p className="font-medium text-foreground">Registration Number</p>
                <p>123456789</p>
              </div>
              <div>
                <p className="font-medium text-foreground">Registered Address</p>
                <p>
                  123 Story Lane
                  <br />
                  San Francisco, CA 94102
                  <br />
                  United States
                </p>
              </div>
              <div>
                <p className="font-medium text-foreground">VAT/Tax ID</p>
                <p>US-987654321</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ICP Filing (China) */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Globe className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3>ICP Filing Information</h3>
                <p className="text-muted-foreground">中国备案信息</p>
              </div>
            </div>
            <div className="text-muted-foreground space-y-2">
              <p>
                <strong>ICP License:</strong> 京ICP备12345678号
              </p>
              <p>
                <strong>Operating Permit:</strong> 京B2-20123456
              </p>
              <p>
                <strong>Network Security Filing:</strong> 11010802012345
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Compliance */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3>Compliance & Certifications</h3>
              </div>
            </div>
            <div className="space-y-2 text-muted-foreground">
              <div>
                <p className="font-medium text-foreground">GDPR Compliance</p>
                <p>Fully compliant with EU General Data Protection Regulation</p>
              </div>
              <div>
                <p className="font-medium text-foreground">COPPA Compliance</p>
                <p>Children's Online Privacy Protection Act certified</p>
              </div>
              <div>
                <p className="font-medium text-foreground">CCPA Compliance</p>
                <p>California Consumer Privacy Act compliant</p>
              </div>
              <div>
                <p className="font-medium text-foreground">App Store Guidelines</p>
                <p>Meets all Apple App Store review guidelines</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Regional Information */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <h3>Regional Representatives</h3>
            <div className="space-y-3 text-muted-foreground">
              <div>
                <p className="font-medium text-foreground">European Union</p>
                <p>
                  StoryForge EU Ltd.
                  <br />
                  Dublin, Ireland
                  <br />
                  eu-representative@storyforge.com
                </p>
              </div>
              <div>
                <p className="font-medium text-foreground">United Kingdom</p>
                <p>
                  StoryForge UK Ltd.
                  <br />
                  London, United Kingdom
                  <br />
                  uk-representative@storyforge.com
                </p>
              </div>
              <div>
                <p className="font-medium text-foreground">China (mainland)</p>
                <p>
                  故事锻造科技有限公司
                  <br />
                  Beijing, China
                  <br />
                  cn-representative@storyforge.com
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Business License */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <h3>Business Licenses</h3>
            <div className="space-y-2 text-muted-foreground">
              <p>
                <strong>California Business License:</strong> BL-2023-456789
              </p>
              <p>
                <strong>Digital Services License:</strong> DSL-US-2023-1234
              </p>
              <p>
                <strong>Content Distribution License:</strong> CDL-2023-9876
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Dispute Resolution */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <h3>Dispute Resolution</h3>
            <div className="text-muted-foreground space-y-2">
              <p>
                <strong>Governing Law:</strong> State of California, United States
              </p>
              <p>
                <strong>Arbitration:</strong> Any disputes shall be resolved through binding
                arbitration in accordance with the rules of the American Arbitration Association
              </p>
              <p>
                <strong>EU Online Dispute Resolution:</strong>{' '}
                <a
                  href="https://ec.europa.eu/consumers/odr"
                  className="text-primary hover:underline"
                >
                  ec.europa.eu/consumers/odr
                </a>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-muted-foreground pb-4">
          <p>For regulatory inquiries:</p>
          <p>legal@storyforge.com</p>
        </div>
      </div>
    </div>
  );
}
