'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
  CheckCircle2,
  Store,
  Users,
  UtensilsCrossed,
  ArrowRight,
  ArrowLeft,
  ChefHat,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const steps = [
  { id: 'welcome', title: 'Welcome', description: 'Get started with RestaurantOS' },
  { id: 'restaurant', title: 'Restaurant', description: 'Set up your restaurant' },
  { id: 'menu', title: 'Menu', description: 'Add your first items' },
  { id: 'staff', title: 'Staff', description: 'Invite your team' },
  { id: 'complete', title: 'Complete', description: 'You\'re ready to go!' },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    restaurantName: '',
    address: '',
    cuisine: '',
    menuItems: [{ name: '', price: '' }],
    staffEmails: [''],
  });

  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      router.push('/dashboard');
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateFormData = (field: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <ChefHat className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold">RestaurantOS</span>
          </div>
          <div className="text-sm text-muted-foreground">
            Step {currentStep + 1} of {steps.length}
          </div>
        </div>
      </header>

      {/* Progress */}
      <div className="bg-white px-6 pb-4">
        <div className="max-w-2xl mx-auto">
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {currentStep === 0 && (
                <Card className="text-center py-12">
                  <CardHeader>
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <ChefHat className="h-10 w-10 text-primary" />
                    </div>
                    <CardTitle className="text-3xl">Welcome to RestaurantOS</CardTitle>
                    <CardDescription className="text-lg mt-2">
                      Let's get your restaurant set up in just a few minutes
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 mt-8 mb-8">
                      {[
                        { icon: Store, label: 'Restaurant' },
                        { icon: UtensilsCrossed, label: 'Menu' },
                        { icon: Users, label: 'Staff' },
                      ].map((item, i) => (
                        <div key={i} className="flex flex-col items-center gap-2">
                          <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                            <item.icon className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <span className="text-sm text-muted-foreground">{item.label}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {currentStep === 1 && (
                <Card>
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <Store className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>Tell us about your restaurant</CardTitle>
                    <CardDescription>This information will appear on receipts and customer displays</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Restaurant Name</Label>
                      <Input
                        id="name"
                        placeholder="e.g., Bella Vista"
                        value={formData.restaurantName}
                        onChange={(e) => updateFormData('restaurantName', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        placeholder="e.g., 123 Main St, City"
                        value={formData.address}
                        onChange={(e) => updateFormData('address', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cuisine">Cuisine Type</Label>
                      <Input
                        id="cuisine"
                        placeholder="e.g., Italian, Asian Fusion"
                        value={formData.cuisine}
                        onChange={(e) => updateFormData('cuisine', e.target.value)}
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {currentStep === 2 && (
                <Card>
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <UtensilsCrossed className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>Add your first menu items</CardTitle>
                    <CardDescription>You can always add more later in the menu section</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {formData.menuItems.map((item, index) => (
                      <div key={index} className="flex gap-3">
                        <Input
                          placeholder="Item name"
                          value={item.name}
                          onChange={(e) => {
                            const newItems = [...formData.menuItems];
                            newItems[index].name = e.target.value;
                            updateFormData('menuItems', newItems);
                          }}
                          className="flex-1"
                        />
                        <Input
                          placeholder="Price"
                          type="number"
                          value={item.price}
                          onChange={(e) => {
                            const newItems = [...formData.menuItems];
                            newItems[index].price = e.target.value;
                            updateFormData('menuItems', newItems);
                          }}
                          className="w-28"
                        />
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() =>
                        updateFormData('menuItems', [...formData.menuItems, { name: '', price: '' }])
                      }
                    >
                      + Add Another Item
                    </Button>
                  </CardContent>
                </Card>
              )}

              {currentStep === 3 && (
                <Card>
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>Invite your team</CardTitle>
                    <CardDescription>Add staff members to help manage your restaurant</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {formData.staffEmails.map((email, index) => (
                      <div key={index} className="space-y-2">
                        <Label>Staff Member {index + 1}</Label>
                        <Input
                          type="email"
                          placeholder="email@example.com"
                          value={email}
                          onChange={(e) => {
                            const newEmails = [...formData.staffEmails];
                            newEmails[index] = e.target.value;
                            updateFormData('staffEmails', newEmails);
                          }}
                        />
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() =>
                        updateFormData('staffEmails', [...formData.staffEmails, ''])
                      }
                    >
                      + Add Another Staff
                    </Button>
                  </CardContent>
                </Card>
              )}

              {currentStep === 4 && (
                <Card className="text-center py-12">
                  <CardHeader>
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 className="h-10 w-10 text-emerald-600" />
                    </div>
                    <CardTitle className="text-3xl">You're all set!</CardTitle>
                    <CardDescription className="text-lg mt-2">
                      Your restaurant is ready to start taking orders
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-left max-w-sm mx-auto mt-6">
                      {[
                        'Restaurant profile created',
                        'Menu items added',
                        'Staff invitations sent',
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3 text-sm">
                          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                          {item}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0}
              className={cn(currentStep === 0 && 'invisible')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button onClick={handleNext} size="lg">
              {currentStep === steps.length - 1 ? 'Go to Dashboard' : 'Continue'}
              {currentStep < steps.length - 1 && <ArrowRight className="h-4 w-4 ml-2" />}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
