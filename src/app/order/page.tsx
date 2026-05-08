'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  ChefHat,
  Clock,
  Star,
  ArrowLeft,
  Check,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock menu data
const categories = [
  { id: 'appetizers', name: 'Appetizers' },
  { id: 'mains', name: 'Main Courses' },
  { id: 'desserts', name: 'Desserts' },
  { id: 'drinks', name: 'Drinks' },
];

const menuItems = [
  { id: '1', category: 'appetizers', name: 'Bruschetta', description: 'Grilled bread with tomatoes, garlic, and basil', price: 8.99, image: '/placeholder-food.jpg', popular: true },
  { id: '2', category: 'appetizers', name: 'Caesar Salad', description: 'Fresh romaine with parmesan and croutons', price: 10.99, image: '/placeholder-food.jpg' },
  { id: '3', category: 'mains', name: 'Margherita Pizza', description: 'Classic tomato, mozzarella, and basil', price: 14.99, image: '/placeholder-food.jpg', popular: true },
  { id: '4', category: 'mains', name: 'Grilled Salmon', description: 'Atlantic salmon with seasonal vegetables', price: 24.99, image: '/placeholder-food.jpg' },
  { id: '5', category: 'mains', name: 'Pasta Carbonara', description: 'Creamy pasta with pancetta and egg', price: 16.99, image: '/placeholder-food.jpg' },
  { id: '6', category: 'desserts', name: 'Tiramisu', description: 'Classic Italian coffee dessert', price: 7.99, image: '/placeholder-food.jpg' },
  { id: '7', category: 'drinks', name: 'House Wine', description: 'Red or white, 6oz glass', price: 8.00, image: '/placeholder-food.jpg' },
];

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export default function OrderPage() {
  const [activeCategory, setActiveCategory] = useState('appetizers');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const addToCart = (item: typeof menuItems[0]) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { id: item.id, name: item.name, price: item.price, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const filteredItems = menuItems.filter((item) => item.category === activeCategory);

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center"
        >
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="h-8 w-8 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Order Placed!</h1>
          <p className="text-muted-foreground mb-6">
            Your order has been sent to the kitchen. We'll bring it to your table shortly.
          </p>
          <div className="bg-muted rounded-lg p-4 mb-6">
            <p className="text-sm text-muted-foreground">Estimated time</p>
            <p className="text-xl font-semibold flex items-center justify-center gap-2">
              <Clock className="h-5 w-5" />
              20-25 minutes
            </p>
          </div>
          <Button onClick={() => { setOrderPlaced(false); setCart([]); }} className="w-full">
            Place Another Order
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <ChefHat className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">Bella Vista</h1>
              <p className="text-xs text-muted-foreground">Table 5</p>
            </div>
          </div>
          
          <Sheet>
            <SheetTrigger>
              <Button variant="outline" size="icon" className="relative">
                <ShoppingBag className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-medium">
                    {cartCount}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md">
              <SheetHeader>
                <SheetTitle>Your Order</SheetTitle>
              </SheetHeader>
              <div className="mt-6 flex flex-col h-[calc(100vh-200px)]">
                {cart.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
                    <ShoppingBag className="h-12 w-12 mb-3 opacity-30" />
                    <p>Your cart is empty</p>
                  </div>
                ) : (
                  <>
                    <ScrollArea className="flex-1 -mx-6 px-6">
                      <div className="space-y-4">
                        {cart.map((item) => (
                          <div key={item.id} className="flex items-center gap-3">
                            <div className="flex-1">
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => updateQuantity(item.id, -1)}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-6 text-center font-medium">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => updateQuantity(item.id, 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-destructive"
                              onClick={() => removeFromCart(item.id)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                    <Separator className="my-4" />
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-lg font-bold">
                        <span>Total</span>
                        <span>${cartTotal.toFixed(2)}</span>
                      </div>
                      <Button 
                        className="w-full" 
                        size="lg"
                        onClick={() => setOrderPlaced(true)}
                      >
                        Place Order
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Category Tabs */}
      <div className="sticky top-16 z-30 bg-white border-b">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex gap-1 py-3 overflow-x-auto scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
                  activeCategory === cat.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-muted/80'
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <main className="max-w-5xl mx-auto px-4 py-6 pb-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filteredItems.map((item) => (
              <Card key={item.id} className="overflow-hidden group">
                <div className="aspect-video bg-muted relative">
                  <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                    <ChefHat className="h-12 w-12 opacity-20" />
                  </div>
                  {item.popular && (
                    <Badge className="absolute top-2 right-2 bg-amber-500 hover:bg-amber-600">
                      <Star className="h-3 w-3 mr-1 fill-current" />
                      Popular
                    </Badge>
                  )}
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{item.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                        {item.description}
                      </p>
                    </div>
                    <span className="font-bold text-lg">${item.price.toFixed(2)}</span>
                  </div>
                  <Button 
                    className="w-full mt-4" 
                    variant="outline"
                    onClick={() => addToCart(item)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add to Order
                  </Button>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
