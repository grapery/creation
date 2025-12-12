import { Check, Crown, Sparkles, Zap } from 'lucide-react';
import { MobileHeader } from '../components/MobileHeader';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';

interface MembershipProps {
  onNavigate: (page: string) => void;
}

export function Membership({ onNavigate }: MembershipProps) {
  const currentPlan = 'free'; // or 'pro', 'premium'

  const plans = [
    {
      id: 'free',
      name: 'Free',
      icon: Sparkles,
      price: '$0',
      period: 'forever',
      features: [
        '3 active stories',
        '10 storyboards per month',
        'Basic AI generation',
        'Community features',
        'Standard support',
      ],
      limitations: [
        'Limited storage (500MB)',
        'Watermarked exports',
      ],
    },
    {
      id: 'pro',
      name: 'Pro',
      icon: Zap,
      price: '$9.99',
      period: 'per month',
      popular: true,
      features: [
        'Unlimited stories',
        '100 storyboards per month',
        'Advanced AI generation',
        'Priority support',
        'Remove watermarks',
        'HD exports',
        '5GB storage',
        'Collaboration tools',
      ],
    },
    {
      id: 'premium',
      name: 'Premium',
      icon: Crown,
      price: '$19.99',
      period: 'per month',
      features: [
        'Everything in Pro',
        'Unlimited storyboards',
        'Premium AI models',
        'Custom branding',
        '24/7 priority support',
        '50GB storage',
        'Advanced analytics',
        'Team collaboration',
        'API access',
      ],
    },
  ];

  const handleSubscribe = (planId: string) => {
    console.log('Subscribe to:', planId);
    // Mock IAP flow
    alert(`Subscribing to ${planId} plan via Apple IAP`);
  };

  const handleManageSubscription = () => {
    // Opens Apple subscription management
    console.log('Opening Apple subscription management');
    alert('This would open iOS subscription settings');
  };

  return (
    <div className="min-h-screen pt-14">
      <MobileHeader title="Membership" showBack onBack={() => onNavigate('settings')} />

      <div className="p-4 space-y-6">
        {/* Current Plan */}
        <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-muted-foreground">Current Plan</p>
                <h2 className="capitalize">{currentPlan}</h2>
              </div>
              {currentPlan !== 'free' && (
                <Badge variant="secondary">Active</Badge>
              )}
            </div>
            {currentPlan !== 'free' && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleManageSubscription}
                className="w-full mt-2"
              >
                Manage Subscription
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Plans */}
        <div>
          <h3 className="mb-3 px-1">Available Plans</h3>
          <div className="space-y-4">
            {plans.map((plan) => {
              const Icon = plan.icon;
              const isCurrentPlan = currentPlan === plan.id;

              return (
                <Card
                  key={plan.id}
                  className={
                    plan.popular
                      ? 'border-primary shadow-lg'
                      : isCurrentPlan
                      ? 'border-primary/50'
                      : ''
                  }
                >
                  {plan.popular && (
                    <div className="bg-primary text-primary-foreground text-center py-1">
                      <span>Most Popular</span>
                    </div>
                  )}
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle>{plan.name}</CardTitle>
                          {isCurrentPlan && (
                            <Badge variant="secondary" className="mt-1">
                              Current
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-baseline">
                          <span className="text-2xl font-bold">{plan.price}</span>
                        </div>
                        <p className="text-muted-foreground">{plan.period}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </div>
                      ))}
                      {plan.limitations?.map((limitation, index) => (
                        <div key={`limit-${index}`} className="flex items-start gap-2 text-muted-foreground">
                          <span className="flex-shrink-0 mt-0.5">•</span>
                          <span>{limitation}</span>
                        </div>
                      ))}
                    </div>

                    {!isCurrentPlan && (
                      <Button
                        onClick={() => handleSubscribe(plan.id)}
                        className="w-full"
                        variant={plan.popular ? 'default' : 'outline'}
                      >
                        {plan.id === 'free' ? 'Downgrade' : 'Subscribe'}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Purchase Info */}
        <Card>
          <CardContent className="p-4 space-y-2 text-muted-foreground">
            <p>
              • Subscriptions are charged through your Apple ID account
            </p>
            <p>
              • Subscriptions automatically renew unless canceled 24 hours before the end of the
              current period
            </p>
            <p>
              • Manage subscriptions in your Apple ID account settings
            </p>
            <p>
              • No refunds for partial subscription periods
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
