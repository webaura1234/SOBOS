'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import {  DashboardHeader } from '@/components/dashboard/dashboard-layout';
import {
  Plus,
  Search,
  X,
  Star,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Flame,
  UtensilsCrossed,
  Coffee,
  Leaf,
  AlertCircle,
} from 'lucide-react';

/* ─── Demo data ─── */
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  category: 'appetizer' | 'main' | 'dessert' | 'beverage' | 'special';
  price: number;
  isAvailable: boolean;
  isPopular?: boolean;
  isVeg?: boolean;
  isSpicy?: boolean;
  calories?: number;
  prepTime?: number; // minutes
  image: string;
}

export const DEMO_ITEMS: MenuItem[] = [
  /* Appetizers */
  {
    id: '1',
    name: 'Bruschetta al Pomodoro',
    description: 'Grilled sourdough with fresh tomatoes, garlic, basil and extra-virgin olive oil',
    category: 'appetizer',
    price: 8.99,
    isAvailable: true,
    isPopular: true,
    isVeg: true,
    calories: 220,
    prepTime: 8,
    image: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=400&h=300&fit=crop',
  },
  {
    id: '2',
    name: 'Caesar Salad',
    description: 'Crisp romaine, aged parmesan, house-made Caesar dressing, croutons',
    category: 'appetizer',
    price: 10.99,
    isAvailable: true,
    isVeg: true,
    calories: 310,
    prepTime: 10,
    image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=400&h=300&fit=crop',
  },
  {
    id: '3',
    name: 'Calamari Fritti',
    description: 'Crispy fried squid rings with marinara dipping sauce and lemon wedge',
    category: 'appetizer',
    price: 13.99,
    isAvailable: true,
    isSpicy: false,
    calories: 420,
    prepTime: 12,
    image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400&h=300&fit=crop',
  },
  {
    id: '4',
    name: 'Mushroom Soup',
    description: 'Creamy wild mushroom bisque with truffle oil and chives',
    category: 'appetizer',
    price: 9.5,
    isAvailable: true,
    isVeg: true,
    calories: 280,
    prepTime: 6,
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=300&fit=crop',
  },
  {
    id: '5',
    name: 'Chicken Wings',
    description: 'Crispy wings tossed in buffalo sauce, served with blue cheese dip',
    category: 'appetizer',
    price: 14.99,
    isAvailable: true,
    isPopular: true,
    isSpicy: true,
    calories: 580,
    prepTime: 18,
    image: 'https://images.unsplash.com/photo-1569691899455-88464f6d3310?w=400&h=300&fit=crop',
  },

  /* Mains */
  {
    id: '6',
    name: 'Margherita Pizza',
    description: 'San Marzano tomato, fresh mozzarella, basil, extra-virgin olive oil',
    category: 'main',
    price: 14.99,
    isAvailable: true,
    isPopular: true,
    isVeg: true,
    calories: 720,
    prepTime: 18,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop',
  },
  {
    id: '7',
    name: 'Pepperoni Pizza',
    description: 'Double pepperoni, mozzarella blend, tomato sauce, oregano',
    category: 'main',
    price: 16.99,
    isAvailable: true,
    isPopular: true,
    calories: 890,
    prepTime: 20,
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=300&fit=crop',
  },
  {
    id: '8',
    name: 'Grilled Salmon',
    description: 'Atlantic salmon, lemon butter sauce, seasonal vegetables, wild rice',
    category: 'main',
    price: 24.99,
    isAvailable: true,
    isPopular: true,
    calories: 610,
    prepTime: 22,
    image: 'https://images.unsplash.com/photo-1485921325833-c519f76c4927?w=400&h=300&fit=crop',
  },
  {
    id: '9',
    name: 'Ribeye Steak 300g',
    description: 'USDA prime ribeye, garlic butter, rosemary, roasted potatoes',
    category: 'main',
    price: 42.99,
    isAvailable: true,
    isPopular: true,
    calories: 920,
    prepTime: 25,
    image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400&h=300&fit=crop',
  },
  {
    id: '10',
    name: 'Truffle Pasta',
    description: 'Fresh pappardelle, black truffle, parmesan cream, chives',
    category: 'main',
    price: 19.99,
    isAvailable: true,
    isPopular: true,
    isVeg: true,
    calories: 680,
    prepTime: 15,
    image: 'https://images.unsplash.com/photo-1611270629569-8b357cb88ec9?w=400&h=300&fit=crop',
  },
  {
    id: '11',
    name: 'Pasta Carbonara',
    description: 'Spaghetti, pancetta, egg yolk, pecorino romano, black pepper',
    category: 'main',
    price: 16.99,
    isAvailable: true,
    calories: 710,
    prepTime: 14,
    image: 'https://images.unsplash.com/photo-1546549095-5a3cb1d4538fc?w=400&h=300&fit=crop',
  },
  {
    id: '12',
    name: 'Chicken Parmesan',
    description: 'Breaded chicken breast, marinara, melted mozzarella, spaghetti',
    category: 'main',
    price: 18.99,
    isAvailable: true,
    calories: 760,
    prepTime: 20,
    image: 'https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?w=400&h=300&fit=crop',
  },
  {
    id: '13',
    name: 'Veggie Buddha Bowl',
    description: 'Quinoa, roasted chickpeas, avocado, cherry tomatoes, tahini dressing',
    category: 'main',
    price: 15.99,
    isAvailable: true,
    isVeg: true,
    calories: 490,
    prepTime: 12,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop',
  },
  {
    id: '14',
    name: 'Spicy Thai Noodles',
    description: 'Rice noodles, vegetables, peanut sauce, lime, chili, coriander',
    category: 'main',
    price: 14.99,
    isAvailable: false,
    isVeg: true,
    isSpicy: true,
    calories: 540,
    prepTime: 15,
    image: 'https://images.unsplash.com/photo-1552611052-33e04de081de?w=400&h=300&fit=crop',
  },
  {
    id: '15',
    name: 'Fish & Chips',
    description: 'Beer-battered cod, hand-cut chips, mushy peas, tartar sauce',
    category: 'main',
    price: 17.99,
    isAvailable: true,
    calories: 850,
    prepTime: 20,
    image: 'https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?w=400&h=300&fit=crop',
  },

  /* Desserts */
  {
    id: '16',
    name: 'Tiramisu',
    description: 'Classic Italian coffee dessert, mascarpone cream, cocoa dusting',
    category: 'dessert',
    price: 7.99,
    isAvailable: true,
    isVeg: true,
    calories: 380,
    prepTime: 5,
    image: 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=400&h=300&fit=crop',
  },
  {
    id: '17',
    name: 'Chocolate Lava Cake',
    description: 'Warm dark chocolate fondant, vanilla ice cream, berry coulis',
    category: 'dessert',
    price: 8.99,
    isAvailable: true,
    isPopular: true,
    isVeg: true,
    calories: 490,
    prepTime: 14,
    image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400&h=300&fit=crop',
  },
  {
    id: '18',
    name: 'Crème Brûlée',
    description: 'Classic French custard with caramelised sugar crust, fresh berries',
    category: 'dessert',
    price: 7.5,
    isAvailable: true,
    isVeg: true,
    calories: 340,
    prepTime: 8,
    image: 'https://images.unsplash.com/photo-1473614137233-a309af82f0a1?w=400&h=300&fit=crop',
  },
  {
    id: '19',
    name: 'Gelato (3 scoops)',
    description: 'Choice of Stracciatella, Pistachio, Mango or Strawberry sorbet',
    category: 'dessert',
    price: 6.99,
    isAvailable: true,
    isVeg: true,
    calories: 280,
    prepTime: 3,
    image: 'https://images.unsplash.com/photo-1563805042-7684c8a9e9ce?w=400&h=300&fit=crop',
  },
  {
    id: '20',
    name: 'New York Cheesecake',
    description: 'Baked vanilla cheesecake, graham cracker crust, mixed berry compote',
    category: 'dessert',
    price: 7.99,
    isAvailable: false,
    isVeg: true,
    calories: 460,
    prepTime: 5,
    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400&h=300&fit=crop',
  },

  /* Beverages */
  {
    id: '21',
    name: 'House Red Wine (glass)',
    description: 'Chianti Classico, Tuscany — dry, medium body, cherry and tobacco notes',
    category: 'beverage',
    price: 8.0,
    isAvailable: true,
    calories: 125,
    prepTime: 1,
    image: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=400&h=300&fit=crop',
  },
  {
    id: '22',
    name: 'House White Wine (glass)',
    description: 'Pinot Grigio, Veneto — crisp, light, citrus and peach',
    category: 'beverage',
    price: 8.0,
    isAvailable: true,
    calories: 120,
    prepTime: 1,
    image: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=400&h=300&fit=crop',
  },
  {
    id: '23',
    name: 'Craft Beer (500ml)',
    description: 'Rotating selection of local craft ales and lagers, ask your server',
    category: 'beverage',
    price: 6.5,
    isAvailable: true,
    calories: 210,
    prepTime: 1,
    image: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=400&h=300&fit=crop',
  },
  {
    id: '24',
    name: 'Fresh Lemonade',
    description: 'Hand-squeezed lemons, cane sugar, fresh mint, sparkling water',
    category: 'beverage',
    price: 4.5,
    isAvailable: true,
    isVeg: true,
    calories: 95,
    prepTime: 3,
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&h=300&fit=crop',
  },
  {
    id: '25',
    name: 'Espresso',
    description: 'Double shot Italian espresso, rich crema',
    category: 'beverage',
    price: 3.5,
    isAvailable: true,
    isVeg: true,
    calories: 8,
    prepTime: 2,
    image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400&h=300&fit=crop',
  },
  {
    id: '26',
    name: 'Cappuccino',
    description: 'Double espresso, steamed milk, thick microfoam, dusted with cocoa',
    category: 'beverage',
    price: 4.5,
    isAvailable: true,
    isVeg: true,
    calories: 80,
    prepTime: 4,
    image: 'https://images.unsplash.com/photo-1534687941688-651ccaafbff8?w=400&h=300&fit=crop',
  },
  {
    id: '27',
    name: 'Mango Lassi',
    description: 'Alphonso mango, yoghurt, cardamom, rose water, chilled',
    category: 'beverage',
    price: 5.0,
    isAvailable: true,
    isVeg: true,
    calories: 190,
    prepTime: 3,
    image: 'https://images.unsplash.com/photo-1546889864-4e4f16bb3520?w=400&h=300&fit=crop',
  },

  /* Chef Specials */
  {
    id: '28',
    name: "Chef's Tasting Menu",
    description: '5-course seasonal tasting menu — changes weekly, ask your server for details',
    category: 'special',
    price: 65.0,
    isAvailable: true,
    isPopular: true,
    calories: 1200,
    prepTime: 60,
    image: 'https://images.unsplash.com/photo-1414235077428-33898b82d363?w=400&h=300&fit=crop',
  },
  {
    id: '29',
    name: 'Wagyu Beef Burger',
    description: 'A5 Wagyu patty, aged cheddar, caramelised onion, brioche bun, truffle fries',
    category: 'special',
    price: 34.99,
    isAvailable: true,
    isPopular: true,
    calories: 1100,
    prepTime: 22,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
  },
  {
    id: '30',
    name: 'Seafood Linguine',
    description: 'Tiger prawns, mussels, scallops, cherry tomatoes, white wine butter sauce',
    category: 'special',
    price: 28.99,
    isAvailable: true,
    calories: 680,
    prepTime: 20,
    image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400&h=300&fit=crop',
  },
];

const CATEGORY_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  appetizer: {
    label: 'Appetizer',
    color: 'bg-amber-100 text-amber-800',
    icon: <UtensilsCrossed className="h-3 w-3" />,
  },
  main: { label: 'Main Course', color: 'bg-blue-100 text-blue-800', icon: <Flame className="h-3 w-3" /> },
  dessert: { label: 'Dessert', color: 'bg-pink-100 text-pink-800', icon: <Star className="h-3 w-3" /> },
  beverage: { label: 'Beverage', color: 'bg-cyan-100 text-cyan-800', icon: <Coffee className="h-3 w-3" /> },
  special: { label: "Chef's Special", color: 'bg-purple-100 text-purple-800', icon: <Star className="h-3 w-3" /> },
};

export default function MenuPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [items, setItems] = useState<MenuItem[]>(DEMO_ITEMS);
  const router = useRouter();

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const matchCat = category === 'all' || item.category === category;
      const matchSearch =
        !search ||
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [items, search, category]);

  const toggleAvailability = (id: string) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, isAvailable: !i.isAvailable } : i)));
  };

  const counts = useMemo(
    () => ({
      all: items.length,
      appetizer: items.filter((i) => i.category === 'appetizer').length,
      main: items.filter((i) => i.category === 'main').length,
      dessert: items.filter((i) => i.category === 'dessert').length,
      beverage: items.filter((i) => i.category === 'beverage').length,
      special: items.filter((i) => i.category === 'special').length,
    }),
    [items]
  );

  return (
    <>
      <DashboardHeader
        title="Menu Management"
        description={`${items.filter((i) => i.isAvailable).length} of ${items.length} items available`}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setSearch('')}>
              <X className="mr-1 h-3.5 w-3.5" /> Reset
            </Button>
            <Button size="sm" onClick={() => router.push('/menu?action=add')}>
              <Plus className="mr-2 h-4 w-4" /> Add Item
            </Button>
          </div>
        }
      />

      {/* ── Filters ── */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search menu items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Category tabs */}
        <div className="flex gap-1.5 flex-wrap">
          {(['all', 'appetizer', 'main', 'dessert', 'beverage', 'special'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                category === cat
                  ? 'bg-foreground text-background border-foreground'
                  : 'bg-white text-muted-foreground border-border hover:bg-muted'
              }`}
            >
              {cat === 'all' ? 'All' : CATEGORY_CONFIG[cat].label}{' '}
              <span className="ml-1 opacity-60">({counts[cat]})</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Stats bar ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total Items', value: items.length, color: 'bg-slate-50 border-slate-200' },
          {
            label: 'Available Now',
            value: items.filter((i) => i.isAvailable).length,
            color: 'bg-emerald-50 border-emerald-200',
          },
          {
            label: 'Unavailable',
            value: items.filter((i) => !i.isAvailable).length,
            color: 'bg-red-50 border-red-200',
          },
          {
            label: 'Popular Items',
            value: items.filter((i) => i.isPopular).length,
            color: 'bg-amber-50 border-amber-200',
          },
        ].map((stat) => (
          <div key={stat.label} className={`${stat.color} border rounded-xl p-4`}>
            <p className="text-2xl font-black">{stat.value}</p>
            <p className="text-xs text-muted-foreground font-medium mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* ── Grid ── */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <AlertCircle className="h-10 w-10 text-muted-foreground mb-3" />
          <p className="font-semibold text-muted-foreground">No items found</p>
          <p className="text-sm text-muted-foreground">Try adjusting your search or category filter</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence>
            {filtered.map((item, idx) => {
              const catCfg = CATEGORY_CONFIG[item.category];
              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.02, duration: 0.2 }}
                >
                  <Card
                    className={`group relative overflow-hidden border transition-shadow hover:shadow-md ${!item.isAvailable ? 'opacity-60' : ''}`}
                  >
                    {/* image banner */}
                    <div className="h-40 bg-slate-100 flex items-center justify-center select-none overflow-hidden relative">
                      <div className="absolute inset-0 bg-black/5 z-10" />
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
                      />
                    </div>

                    {/* badges */}
                    <div className="absolute top-2 left-2 flex gap-1 flex-wrap">
                      {item.isPopular && (
                        <span className="bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                          <Star className="h-2.5 w-2.5" /> Popular
                        </span>
                      )}
                      {item.isSpicy && (
                        <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                          <Flame className="h-2.5 w-2.5" /> Spicy
                        </span>
                      )}
                      {item.isVeg && (
                        <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                          <Leaf className="h-2.5 w-2.5" /> Veg
                        </span>
                      )}
                    </div>

                    {/* availability toggle */}
                    <button
                      onClick={() => toggleAvailability(item.id)}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 backdrop-blur-sm shadow-sm border hover:bg-white transition-colors"
                      title={item.isAvailable ? 'Mark unavailable' : 'Mark available'}
                    >
                      {item.isAvailable ? (
                        <Eye className="h-3.5 w-3.5 text-emerald-600" />
                      ) : (
                        <EyeOff className="h-3.5 w-3.5 text-red-500" />
                      )}
                    </button>

                    <CardContent className="p-4">
                      {/* category + price row */}
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${catCfg.color}`}>
                          {catCfg.label}
                        </span>
                        <span className="font-black text-base">${item.price.toFixed(2)}</span>
                      </div>

                      {/* name + description */}
                      <h3 className="font-bold text-sm leading-tight mb-1 line-clamp-1">{item.name}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-3">
                        {item.description}
                      </p>

                      {/* meta row */}
                      <div className="flex items-center justify-between text-[10px] text-muted-foreground border-t pt-3">
                        <span>⏱ {item.prepTime}m</span>
                        {item.calories && <span>🔥 {item.calories} kcal</span>}
                        <span className={`font-bold ${item.isAvailable ? 'text-emerald-600' : 'text-red-500'}`}>
                          {item.isAvailable ? 'Available' : 'Unavailable'}
                        </span>
                      </div>

                      {/* action buttons */}
                      <div className="flex gap-2 mt-3">
                        <Button variant="outline" size="sm" className="flex-1 h-7 text-xs">
                          <Edit2 className="mr-1 h-3 w-3" /> Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 w-8 px-0 text-red-500 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                          onClick={() => setItems((prev) => prev.filter((i) => i.id !== item.id))}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </>
  );
}
