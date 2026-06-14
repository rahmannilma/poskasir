export type Category = string;

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: Category;
  image: string;
  modifiers?: string[];
  sku?: string;
  description?: string;
}

export interface OrderItem {
  id: string;
  menuItem: MenuItem;
  quantity: number;
  modifiers: string[];
  notes?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: string;
  type: 'Dine-in' | 'Takeaway' | 'Delivery';
  table?: string;
  items: OrderItem[];
}

export const menuItems: MenuItem[] = [
  // Kopi
  {
    id: 'espresso',
    name: 'Espresso',
    price: 22000,
    category: 'coffee',
    sku: 'KPP-ESP',
    description: 'Ekstraksi kopi murni yang pekat dan kuat',
    image: 'https://images.pexels.com/photos/34563915/pexels-photo-34563915.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    modifiers: ['Ekstra Sloki', 'Tanpa Kafein', 'Kurang Manis'],
  },
  {
    id: 'latte',
    name: 'Latte',
    price: 28000,
    category: 'coffee',
    sku: 'KPP-LAT',
    description: 'Espresso dengan susu hangat dan busa mikro lembut',
    image: 'https://images.pexels.com/photos/15800988/pexels-photo-15800988.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    modifiers: ['Susu Gandum', 'Susu Almond', 'Ekstra Sloki', 'Vanila', 'Kurang Gula'],
  },
  {
    id: 'cappuccino',
    name: 'Cappuccino',
    price: 26000,
    category: 'coffee',
    sku: 'KPP-CAP',
    description: 'Espresso dengan keseimbangan sempurna susu dan busa tebal',
    image: 'https://images.pexels.com/photos/28496565/pexels-photo-28496565.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    modifiers: ['Susu Gandum', 'Susu Almond', 'Ekstra Sloki', 'Kurang Gula'],
  },
  {
    id: 'flat-white',
    name: 'Flat White',
    price: 25000,
    category: 'coffee',
    sku: 'KPP-FTW',
    description: 'Espresso ganda dengan susu bertekstur beludru halus',
    image: 'https://images.pexels.com/photos/18281417/pexels-photo-18281417.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    modifiers: ['Susu Gandum', 'Susu Almond', 'Ekstra Sloki', 'Kurang Gula'],
  },
  {
    id: 'cold-brew',
    name: 'Cold Brew',
    price: 30000,
    category: 'coffee',
    sku: 'KPP-CDB',
    description: 'Kopi seduh dingin selama 12 jam yang halus',
    image: 'https://images.pexels.com/photos/38028988/pexels-photo-38028988.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    modifiers: ['Vanila', 'Karamel', 'Susu Gandum', 'Kurang Es'],
  },
  {
    id: 'americano',
    name: 'Americano',
    price: 24000,
    category: 'coffee',
    sku: 'KPP-AME',
    description: 'Double shot espresso dengan air panas',
    image: 'https://images.pexels.com/photos/8464467/pexels-photo-8464467.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    modifiers: ['Ekstra Sloki', 'Tanpa Kafein', 'Pakai Es'],
  },
  // Teh
  {
    id: 'matcha-latte',
    name: 'Matcha Latte',
    price: 32000,
    category: 'tea',
    sku: 'TEH-MAT',
    description: 'Teh hijau jepang organik premium dengan susu hangat',
    image: 'https://images.pexels.com/photos/34694990/pexels-photo-34694990.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    modifiers: ['Susu Gandum', 'Susu Almond', 'Ekstra Matcha', 'Kurang Gula'],
  },
  {
    id: 'chai-latte',
    name: 'Chai Latte',
    price: 30000,
    category: 'tea',
    sku: 'TEH-CHI',
    description: 'Seduhan teh hitam dengan rempah-rempah eksotis dan susu',
    image: 'https://images.pexels.com/photos/5995769/pexels-photo-5995769.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    modifiers: ['Susu Gandum', 'Susu Almond', 'Ekstra Rempah', 'Kurang Gula'],
  },
  {
    id: 'earl-grey',
    name: 'Earl Grey',
    price: 22000,
    category: 'tea',
    sku: 'TEH-EGY',
    description: 'Teh hitam dengan aroma khas jeruk bergamot',
    image: 'https://images.pexels.com/photos/14415014/pexels-photo-14415014.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    modifiers: ['Madu', 'Lemon', 'Susu'],
  },
  // Makanan
  {
    id: 'almond-croissant',
    name: 'Kroisan Almond',
    price: 25000,
    category: 'food',
    sku: 'MKN-CRO',
    description: 'Roti mentega berlapis perancis dengan isian pasta almond manis',
    image: 'https://images.pexels.com/photos/12176269/pexels-photo-12176269.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    modifiers: ['Hangatkan'],
  },
  {
    id: 'avocado-toast',
    name: 'Roti Panggang Alpukat',
    price: 45000,
    category: 'food',
    sku: 'MKN-AVO',
    description: 'Roti gandum panggang dengan alpukat tumbuk, lada hitam, dan chili flakes',
    image: 'https://images.pexels.com/photos/27590337/pexels-photo-27590337.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    modifiers: ['Tambah Telur', 'Ekstra Alpukat', 'Bebas Gluten'],
  },
  {
    id: 'chocolate-muffin',
    name: 'Muffin Cokelat',
    price: 22000,
    category: 'food',
    sku: 'MKN-MUF',
    description: 'Kue muffin cokelat lembut dengan taburan chocolate chips melimpah',
    image: 'https://images.pexels.com/photos/8017963/pexels-photo-8017963.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    modifiers: ['Hangatkan'],
  },
  {
    id: 'club-sandwich',
    name: 'Roti Lapis Club',
    price: 55000,
    category: 'food',
    sku: 'MKN-CSW',
    description: 'Sandwich tiga lapis dengan dada ayam panggang, daging asap, selada, dan mayo',
    image: 'https://images.pexels.com/photos/5446513/pexels-photo-5446513.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    modifiers: ['Tanpa Tomat', 'Ekstra Keju', 'Bebas Gluten'],
  },
];

export const categoryConfig: Record<Category, { icon: string; label: string }> = {
  coffee: { icon: 'coffee', label: 'Kopi' },
  tea: { icon: 'emoji_food_beverage', label: 'Teh' },
  food: { icon: 'restaurant', label: 'Makanan' },
};

export const baristaAvatar = 'https://images.pexels.com/photos/4350055/pexels-photo-4350055.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940';
