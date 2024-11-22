const products = [
  {
    name: "Eco-Friendly Water Bottle",
    description: "Stylish 500ml insulated water bottle made from recycled materials. Keeps drinks cold for 24 hours or hot for 12 hours.",
    price: 24.99,
    category: "Eco-Friendly",
    imageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8",
    stockQuantity: 100,
    featured: true,
    tags: ["eco-friendly", "sustainable", "hydration", "trending"],
    freeShipping: true,
    discountedPrice: 19.99,
    viewCount: 150
  },
  {
    name: "Smart LED Strip Lights",
    description: "10m RGB LED strip with app control, music sync, and voice control compatibility. Perfect for room ambiance.",
    price: 29.99,
    category: "Tech Accessories",
    imageUrl: "https://images.unsplash.com/photo-1586902197503-e71026292412",
    stockQuantity: 75,
    featured: true,
    tags: ["smart home", "lighting", "tech", "trending"],
    freeShipping: false,
    discountedPrice: 24.99,
    viewCount: 200
  },
  {
    name: "Collapsible Storage Boxes (Set of 3)",
    description: "Space-saving fabric storage boxes with lids. Perfect for organizing closets, toys, or office supplies.",
    price: 34.99,
    category: "Home Organization",
    imageUrl: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7",
    stockQuantity: 50,
    featured: true,
    tags: ["organization", "storage", "home", "bestseller"],
    freeShipping: true,
    discountedPrice: 29.99,
    viewCount: 180
  },
  {
    name: "Resistance Bands Set",
    description: "5-piece exercise bands set with different resistance levels. Includes carry bag and workout guide.",
    price: 19.99,
    category: "Wellness & Fitness",
    imageUrl: "https://images.unsplash.com/photo-1598632640487-6ea4a5e8d6c0",
    stockQuantity: 120,
    featured: false,
    tags: ["fitness", "workout", "home gym", "trending"],
    freeShipping: false,
    discountedPrice: 16.99,
    viewCount: 250
  },
  {
    name: "Interactive Cat Toy",
    description: "Battery-operated moving toy that keeps cats entertained. Features random movement patterns and LED light.",
    price: 22.99,
    category: "Pet Accessories",
    imageUrl: "https://images.unsplash.com/photo-1587300003388-59208cc962cb",
    stockQuantity: 60,
    featured: true,
    tags: ["pets", "cats", "toys", "bestseller"],
    freeShipping: false,
    discountedPrice: 18.99,
    viewCount: 170
  },
  {
    name: "Bamboo Desk Organizer",
    description: "Sustainable bamboo desk organizer with multiple compartments for stationery and devices.",
    price: 39.99,
    category: "Home Organization",
    imageUrl: "https://images.unsplash.com/photo-1591637333184-19aa5d6f9f6c",
    stockQuantity: 45,
    featured: true,
    tags: ["eco-friendly", "organization", "office", "trending"],
    freeShipping: true,
    discountedPrice: 34.99,
    viewCount: 190
  },
  {
    name: "Phone Camera Lens Kit",
    description: "3-in-1 clip-on phone camera lenses including macro, wide-angle, and fisheye.",
    price: 27.99,
    category: "Tech Accessories",
    imageUrl: "https://images.unsplash.com/photo-1590845947698-8924d7409b27",
    stockQuantity: 80,
    featured: false,
    tags: ["photography", "mobile", "tech", "trending"],
    freeShipping: false,
    discountedPrice: 22.99,
    viewCount: 160
  },
  {
    name: "Yoga Mat with Alignment Lines",
    description: "Non-slip eco-friendly yoga mat with alignment markings for proper pose positioning.",
    price: 44.99,
    category: "Wellness & Fitness",
    imageUrl: "https://images.unsplash.com/photo-1592432678016-e910b452f9a2",
    stockQuantity: 35,
    featured: true,
    tags: ["yoga", "fitness", "wellness", "eco-friendly"],
    freeShipping: true,
    discountedPrice: 39.99,
    viewCount: 220
  }
];

module.exports = products;
