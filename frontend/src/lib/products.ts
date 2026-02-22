export interface Product {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  price: number;
  currency: string;
  category: string;
  artisan: string;
  country: string;
  image: string;
  tags: string[];
  inStock: boolean;
}

export const categories = [
  "All",
  "Pottery & Ceramics",
  "Textiles & Weaving",
  "Jewelry & Metalwork",
  "Woodwork & Carving",
  "Leather Goods",
  "Food & Spices",
];

export const products: Product[] = [
  {
    id: "hand-thrown-clay-bowl",
    name: "Hand-Thrown Clay Bowl",
    description: "Traditional terracotta bowl with hand-painted geometric patterns inspired by Roma motifs.",
    longDescription: "This beautiful hand-thrown clay bowl is crafted using techniques passed down through generations of Roma potters in central Serbia. Each piece is individually shaped on a traditional wheel, dried slowly in open air, and fired in a wood-burning kiln. The geometric patterns are hand-painted using natural pigments, making every bowl truly one-of-a-kind.",
    price: 45.00,
    currency: "EUR",
    category: "Pottery & Ceramics",
    artisan: "Dragan M.",
    country: "Serbia",
    image: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&h=600&fit=crop",
    tags: ["handmade", "pottery", "traditional"],
    inStock: true,
  },
  {
    id: "woven-kilim-runner",
    name: "Woven Kilim Runner",
    description: "Handwoven wool kilim with traditional Balkans diamond pattern in natural dyes.",
    longDescription: "This stunning kilim runner is handwoven on a traditional loom by skilled textile artisans in Kosovo. Made from locally sourced wool and colored with natural plant-based dyes, it features the iconic diamond pattern found throughout Balkans weaving traditions. Each runner takes approximately two weeks to complete.",
    price: 120.00,
    currency: "EUR",
    category: "Textiles & Weaving",
    artisan: "Fatima H.",
    country: "Kosovo",
    image: "https://images.unsplash.com/photo-1600166898405-da9535204843?w=600&h=600&fit=crop",
    tags: ["handwoven", "textile", "wool"],
    inStock: true,
  },
  {
    id: "filigree-silver-pendant",
    name: "Filigree Silver Pendant",
    description: "Delicate sterling silver filigree pendant with traditional Roma swirl design.",
    longDescription: "This exquisite pendant showcases the ancient art of silver filigree, a technique perfected by Roma silversmiths over centuries. Each swirl and curl is formed from thin silver wire, carefully soldered into an intricate design. The pendant comes on a 45cm sterling silver chain and arrives in a handmade gift box.",
    price: 85.00,
    currency: "EUR",
    category: "Jewelry & Metalwork",
    artisan: "Elena V.",
    country: "North Macedonia",
    image: "https://images.unsplash.com/photo-1515562141589-67f0d569b6f5?w=600&h=600&fit=crop",
    tags: ["silver", "filigree", "jewelry"],
    inStock: true,
  },
  {
    id: "carved-walnut-cutting-board",
    name: "Carved Walnut Cutting Board",
    description: "Hand-carved serving board from Bosnian walnut with decorative border pattern.",
    longDescription: "Crafted from a single piece of aged Bosnian walnut, this serving and cutting board features a delicately carved border inspired by traditional Roma woodcarving motifs. The wood is treated with food-safe linseed oil and beeswax, bringing out the rich natural grain. A perfect blend of functionality and artistry.",
    price: 55.00,
    currency: "EUR",
    category: "Woodwork & Carving",
    artisan: "Alen K.",
    country: "Bosnia",
    image: "https://images.unsplash.com/photo-1588165171080-c89acfa5ee83?w=600&h=600&fit=crop",
    tags: ["wood", "walnut", "kitchen"],
    inStock: true,
  },
  {
    id: "embroidered-linen-tablecloth",
    name: "Embroidered Linen Tablecloth",
    description: "Hand-embroidered linen tablecloth with traditional floral patterns in red and gold.",
    longDescription: "This luxurious tablecloth is crafted from natural linen and adorned with hand-embroidered floral patterns that have been part of Roma textile traditions for centuries. The intricate stitching uses red and gold threads, creating a warm and festive centerpiece for any table. Machine washable and designed to become softer with each wash.",
    price: 95.00,
    currency: "EUR",
    category: "Textiles & Weaving",
    artisan: "Mira S.",
    country: "Albania",
    image: "https://images.unsplash.com/photo-1594040226829-7f251ab46d80?w=600&h=600&fit=crop",
    tags: ["embroidery", "linen", "tablecloth"],
    inStock: true,
  },
  {
    id: "copper-coffee-pot-cezve",
    name: "Copper Coffee Pot (Cezve)",
    description: "Hand-hammered copper cezve for traditional Balkans coffee with brass handle.",
    longDescription: "This hand-hammered copper cezve is an essential piece of Balkans coffee culture. Crafted by skilled Roma coppersmiths in Montenegro, each pot is shaped from a single sheet of copper, hammered to perfection, and fitted with a handturned brass handle. The interior is tin-lined for safe daily use. Makes 2-3 cups of rich, traditional coffee.",
    price: 40.00,
    currency: "EUR",
    category: "Jewelry & Metalwork",
    artisan: "Marko D.",
    country: "Montenegro",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=600&fit=crop",
    tags: ["copper", "coffee", "handmade"],
    inStock: true,
  },
  {
    id: "leather-satchel-bag",
    name: "Leather Satchel Bag",
    description: "Vegetable-tanned leather satchel with hand-stitched details and brass buckle.",
    longDescription: "This timeless satchel is made from vegetable-tanned cowhide leather, processed using traditional methods that give it a rich patina over time. Every stitch is done by hand using waxed linen thread, and the solid brass buckle is cast locally. Features an interior pocket and adjustable shoulder strap. Fits laptops up to 13 inches.",
    price: 150.00,
    currency: "EUR",
    category: "Leather Goods",
    artisan: "Besnik Q.",
    country: "Albania",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=600&fit=crop",
    tags: ["leather", "bag", "handstitched"],
    inStock: true,
  },
  {
    id: "ajvar-homemade-spread",
    name: "Homemade Ajvar Spread",
    description: "Traditional roasted red pepper and eggplant spread made from a family recipe.",
    longDescription: "This rich, smoky ajvar is made from hand-roasted red peppers and eggplant, following a cherished Roma family recipe from southern Serbia. The peppers are fire-roasted over open flame, peeled by hand, and slowly cooked with cold-pressed sunflower oil and garlic. No preservatives or artificial ingredients. Perfect on crusty bread, with grilled meats, or as a pasta sauce.",
    price: 12.00,
    currency: "EUR",
    category: "Food & Spices",
    artisan: "Jovana P.",
    country: "Serbia",
    image: "https://images.unsplash.com/photo-1563822249366-3efb23b8e0c9?w=600&h=600&fit=crop",
    tags: ["food", "ajvar", "traditional"],
    inStock: true,
  },
  {
    id: "ceramic-espresso-set",
    name: "Ceramic Espresso Cup Set",
    description: "Set of 4 hand-glazed ceramic espresso cups with saucers in earthy tones.",
    longDescription: "This set of four espresso cups with matching saucers is hand-thrown and glazed in a small pottery workshop in North Macedonia. Each cup features a unique combination of earthy glazes — sage, terracotta, cream, and charcoal — applied by hand to create an organic, one-of-a-kind finish. Dishwasher safe and built to last.",
    price: 60.00,
    currency: "EUR",
    category: "Pottery & Ceramics",
    artisan: "Samir T.",
    country: "North Macedonia",
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600&h=600&fit=crop",
    tags: ["ceramic", "espresso", "set"],
    inStock: true,
  },
  {
    id: "hand-carved-wooden-flute",
    name: "Hand-Carved Wooden Flute",
    description: "Traditional kaval flute carved from plum wood with decorative burnt patterns.",
    longDescription: "This traditional kaval flute is hand-carved from aged plum wood by a Roma instrument maker in Kosovo. The decorative patterns are created using a heated metal tool, a technique known as pyrography. The flute produces a warm, haunting tone characteristic of Balkans folk music. Comes with a protective cloth sleeve and care instructions.",
    price: 35.00,
    currency: "EUR",
    category: "Woodwork & Carving",
    artisan: "Ismet B.",
    country: "Kosovo",
    image: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=600&h=600&fit=crop",
    tags: ["music", "flute", "woodcarving"],
    inStock: true,
  },
  {
    id: "balkans-spice-collection",
    name: "Balkans Spice Collection",
    description: "Curated set of 6 traditional Balkans spice blends in handmade ceramic jars.",
    longDescription: "This collection brings together six signature spice blends used across the Western Balkans, each prepared by hand and presented in small handmade ceramic jars. Includes: Vegeta-style herb mix, smoky paprika, mountain oregano, coriander-cumin blend, dried chili flakes, and a sweet cinnamon-rose mix for desserts. Each jar contains 30g of freshly ground spices.",
    price: 48.00,
    currency: "EUR",
    category: "Food & Spices",
    artisan: "Amina R.",
    country: "Bosnia",
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&h=600&fit=crop",
    tags: ["spices", "collection", "ceramic"],
    inStock: true,
  },
  {
    id: "leather-journal-embossed",
    name: "Embossed Leather Journal",
    description: "Hand-bound journal with embossed Roma sun motif and recycled cotton pages.",
    longDescription: "This elegant journal features a cover of vegetable-tanned leather embossed with a traditional Roma sun motif. The 120 pages are made from recycled cotton fiber, giving them a beautiful texture perfect for writing or sketching. Hand-bound using a coptic stitch that allows the journal to lay completely flat. A meaningful gift for writers and artists.",
    price: 38.00,
    currency: "EUR",
    category: "Leather Goods",
    artisan: "Liridon G.",
    country: "Kosovo",
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&h=600&fit=crop",
    tags: ["leather", "journal", "handbound"],
    inStock: true,
  },
];

export function getProduct(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getProductsByCategory(category: string): Product[] {
  if (category === "All") return products;
  return products.filter((p) => p.category === category);
}
