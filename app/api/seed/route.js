import connectDB from "@/lib/db";
import Product from "@/models/Product";

// Random lorem-style image (kept for the original 42 placeholder products)
const getRandomImage = () => `https://picsum.photos/500/300?random=${Math.random()}`;

// Real product photo from Unsplash (curated, free to use, no API key needed).
// We rotate through these so every new product gets a real, product-like photo.
const UNSPLASH_IDS = [
    "1542291026-7eec264c27ff",
    "1546868871-7041f2a55e12",
    "1572635196237-14b3f281503f",
    "1556228720-195a672e8a03",
    "1523275335684-37898b6baf30",
    "1505740420928-5e560c06d30e",
    "1556909114-44e3e9399a2e",
    "1556909114-f6e7ad7d3136",
    "1556909195-44c3f9a8a5b3",
    "1542291026-7eec264c27ff",
    "1556228720-195a672e8a03",
    "1505740420928-5e560c06d30e",
];

const getRealProductImage = (i) =>
    `https://images.unsplash.com/photo-${UNSPLASH_IDS[i % UNSPLASH_IDS.length]}?w=800&h=800&fit=crop&auto=format`;

// 66 new products with real product photos, grouped by category
const NEW_PRODUCTS = [
    // Footwear (8)
    { title: "Classic White Sneakers", category: "Footwear", price: 69.99, description: "Clean white sneakers that pair with everything in your wardrobe." },
    { title: "Trail Running Shoes", category: "Footwear", price: 89.99, description: "Rugged trail shoes built for off-road adventures and grip." },
    { title: "Leather Loafers", category: "Footwear", price: 119.99, description: "Genuine leather loafers with hand-stitched details." },
    { title: "High-Top Canvas Shoes", category: "Footwear", price: 54.99, description: "Retro high-top canvas shoes with rubber toe cap." },
    { title: "Slip-On Sandals", category: "Footwear", price: 34.99, description: "Comfortable slip-on sandals perfect for casual summer days." },
    { title: "Hiking Boots", category: "Footwear", price: 139.99, description: "Waterproof hiking boots with ankle support and rugged soles." },
    { title: "Sports Slides", category: "Footwear", price: 24.99, description: "Lightweight slides for post-workout or poolside lounging." },
    { title: "Formal Oxford Shoes", category: "Footwear", price: 149.99, description: "Polished oxford shoes for formal occasions and office wear." },
    // Apparel (9)
    { title: "Classic Polo Shirt", category: "Apparel", price: 29.99, description: "Soft cotton polo with ribbed collar and two-button placket." },
    { title: "Slim Fit Jeans", category: "Apparel", price: 49.99, description: "Stretchy slim-fit denim with classic five-pocket styling." },
    { title: "Graphic Print Tee", category: "Apparel", price: 22.99, description: "Soft cotton t-shirt featuring original graphic print." },
    { title: "Wool Overcoat", category: "Apparel", price: 199.99, description: "Tailored wool overcoat with notched lapels and button closure." },
    { title: "Casual Chino Pants", category: "Apparel", price: 44.99, description: "Versatile chinos with a slim straight fit and soft twill fabric." },
    { title: "Knit Sweater", category: "Apparel", price: 59.99, description: "Cozy knit sweater with ribbed cuffs and crew neckline." },
    { title: "Summer Shorts", category: "Apparel", price: 32.99, description: "Quick-dry shorts with elastic waistband for easy wear." },
    { title: "Plaid Flannel Shirt", category: "Apparel", price: 39.99, description: "Soft brushed flannel shirt in a timeless plaid pattern." },
    { title: "Linen Button-Up", category: "Apparel", price: 54.99, description: "Breathable linen shirt with a relaxed, everyday fit." },
    // Electronics (8)
    { title: "Noise-Cancelling Earbuds", category: "Electronics", price: 149.99, description: "True wireless earbuds with active noise cancellation and 30h battery life." },
    { title: "4K Action Camera", category: "Electronics", price: 229.99, description: "Shoot stunning 4K video underwater or on the go with this rugged action cam." },
    { title: "Bluetooth Earbuds Pro", category: "Electronics", price: 89.99, description: "Premium Bluetooth earbuds with deep bass and crystal-clear calls." },
    { title: "Portable Power Station", category: "Electronics", price: 299.99, description: "200Wh portable power station for camping, travel, and emergencies." },
    { title: "Smart Home Hub", category: "Electronics", price: 99.99, description: "Voice-controlled smart home hub compatible with thousands of devices." },
    { title: "Wireless Gaming Mouse", category: "Electronics", price: 59.99, description: "High-precision wireless mouse with 16,000 DPI sensor and RGB." },
    { title: "USB Condenser Microphone", category: "Electronics", price: 79.99, description: "Studio-quality USB mic for podcasting, streaming, and calls." },
    { title: "Mechanical Keyboard TKL", category: "Electronics", price: 119.99, description: "Tenkeyless mechanical keyboard with hot-swappable switches." },
    // Accessories (8)
    { title: "Minimalist Wallet", category: "Accessories", price: 39.99, description: "Slim RFID-blocking wallet that fits comfortably in your front pocket." },
    { title: "Canvas Tote Bag", category: "Accessories", price: 29.99, description: "Sturdy canvas tote with reinforced straps, perfect for daily errands." },
    { title: "Leather Belt", category: "Accessories", price: 34.99, description: "Full-grain leather belt with brushed nickel buckle." },
    { title: "Travel Backpack 30L", category: "Accessories", price: 79.99, description: "Carry-on friendly travel backpack with padded laptop sleeve." },
    { title: "Aviator Sunglasses", category: "Accessories", price: 49.99, description: "Classic aviator sunglasses with UV400 polarized lenses." },
    { title: "Beanie Hat", category: "Accessories", price: 19.99, description: "Soft knit beanie that keeps you warm in cold weather." },
    { title: "Silk Scarf", category: "Accessories", price: 39.99, description: "Lightweight silk scarf in a vibrant printed pattern." },
    { title: "Wool Beanie", category: "Accessories", price: 24.99, description: "Warm wool-blend beanie with a snug, comfortable fit." },
    // Jewelry (5)
    { title: "Pearl Drop Earrings", category: "Jewelry", price: 49.99, description: "Elegant freshwater pearl drop earrings with sterling silver hooks." },
    { title: "Stainless Steel Watch", category: "Jewelry", price: 159.99, description: "Minimalist stainless steel watch with sapphire crystal glass." },
    { title: "Leather Wrap Bracelet", category: "Jewelry", price: 29.99, description: "Hand-braided leather bracelet with magnetic clasp." },
    { title: "Diamond Stud Earrings", category: "Jewelry", price: 199.99, description: "Classic round-cut diamond studs set in 14k white gold." },
    { title: "Rose Gold Ring", category: "Jewelry", price: 89.99, description: "Dainty rose gold band with subtle hammered finish." },
    // Home & Kitchen (7)
    { title: "Ceramic Coffee Mug Set", category: "Home & Kitchen", price: 24.99, description: "Set of 4 handmade ceramic mugs in soft matte colors." },
    { title: "Cast Iron Skillet", category: "Home & Kitchen", price: 49.99, description: "Pre-seasoned 12-inch cast iron skillet for stovetop and oven." },
    { title: "Bamboo Cutting Board", category: "Home & Kitchen", price: 34.99, description: "Eco-friendly bamboo cutting board with juice groove." },
    { title: "Stainless Steel Cookware Set", category: "Home & Kitchen", price: 199.99, description: "10-piece stainless steel cookware set with glass lids." },
    { title: "Espresso Machine", category: "Home & Kitchen", price: 249.99, description: "Semi-automatic espresso machine with built-in grinder and steam wand." },
    { title: "Memory Foam Pillow", category: "Home & Kitchen", price: 44.99, description: "Contoured memory foam pillow that supports neck and shoulders." },
    { title: "French Press 1L", category: "Home & Kitchen", price: 29.99, description: "Classic French press for rich, full-bodied coffee in minutes." },
    // Furniture (5)
    { title: "Mid-Century Armchair", category: "Furniture", price: 349.99, description: "Mid-century modern armchair with solid wood legs and soft upholstery." },
    { title: "Bookshelf 5-Tier", category: "Furniture", price: 179.99, description: "Sturdy 5-tier bookshelf in warm walnut finish." },
    { title: "Bedside Nightstand", category: "Furniture", price: 129.99, description: "Compact nightstand with drawer and open shelf for storage." },
    { title: "Velvet Accent Chair", category: "Furniture", price: 289.99, description: "Plush velvet accent chair with gold-tipped legs." },
    { title: "Coffee Table Round", category: "Furniture", price: 219.99, description: "Round coffee table with marble top and metal cross base." },
    // Sports (7)
    { title: "Resistance Band Set", category: "Sports", price: 29.99, description: "Set of 5 resistance bands for full-body strength training." },
    { title: "Foam Roller", category: "Sports", price: 24.99, description: "High-density foam roller for muscle recovery and stretching." },
    { title: "Running Belt", category: "Sports", price: 19.99, description: "Lightweight running belt with zip pocket for phone and keys." },
    { title: "Cycling Helmet", category: "Sports", price: 59.99, description: "Aerodynamic cycling helmet with adjustable fit and ventilation." },
    { title: "Boxing Gloves 12oz", category: "Sports", price: 49.99, description: "Professional 12oz boxing gloves with padded wrist support." },
    { title: "Jump Rope Speed", category: "Sports", price: 14.99, description: "Adjustable speed jump rope with ball-bearing handles." },
    { title: "Inflatable Stand-Up Paddleboard", category: "Sports", price: 399.99, description: "10ft inflatable SUP board with paddle, pump, and carry bag." },
    // Gaming (6)
    { title: "Gaming Chair Pro", category: "Gaming", price: 249.99, description: "Ergonomic gaming chair with lumbar pillow and 4D armrests." },
    { title: "Mechanical Gaming Keyboard", category: "Gaming", price: 129.99, description: "RGB mechanical keyboard with linear red switches." },
    { title: "Gaming Mouse Pad XL", category: "Gaming", price: 24.99, description: "Extra-large RGB mouse pad with anti-slip rubber base." },
    { title: "Streaming Webcam 1080p", category: "Gaming", price: 79.99, description: "Full HD 1080p webcam with auto-focus and built-in microphone." },
    { title: "Capture Card HDMI", category: "Gaming", price: 149.99, description: "4K passthrough capture card for streaming and recording gameplay." },
    { title: "Gaming Desk L-Shaped", category: "Gaming", price: 219.99, description: "L-shaped gaming desk with cable management and cup holder." },
    // Photography (4)
    { title: "Mirrorless Camera Body", category: "Photography", price: 899.99, description: "24MP mirrorless camera body with 4K video recording." },
    { title: "Camera Lens 50mm", category: "Photography", price: 349.99, description: "Fast 50mm prime lens with stunning bokeh and sharpness." },
    { title: "Camera Bag Messenger", category: "Photography", price: 79.99, description: "Weather-resistant messenger bag with padded camera inserts." },
    { title: "LED Ring Light Kit", category: "Photography", price: 59.99, description: "18-inch dimmable ring light with stand for portraits and video." },
];

// Original 42 products (with random lorem images) — kept as-is
const ORIGINAL_PRODUCTS = [
    { title: "Running Shoes", description: "Lightweight and breathable running shoes for outdoor activities.", price: 79.99, category: "Footwear", image: getRandomImage() },
    { title: "Blue Sneakers", description: "Comfortable and stylish blue sneakers for everyday wear.", price: 59.99, category: "Footwear", image: getRandomImage() },
    { title: "Red T-Shirt", description: "Soft and breathable red t-shirt made from 100% cotton.", price: 19.99, category: "Apparel", image: getRandomImage() },
    { title: "Wireless Headphones", description: "High-quality wireless headphones with noise-cancellation feature.", price: 129.99, category: "Electronics", image: getRandomImage() },
    { title: "Smart Watch", description: "Feature-rich smartwatch with fitness and sleep tracking.", price: 149.99, category: "Electronics", image: getRandomImage() },
    { title: "Gaming Mouse", description: "RGB gaming mouse with programmable buttons.", price: 39.99, category: "Electronics", image: getRandomImage() },
    { title: "Mechanical Keyboard", description: "Mechanical keyboard with tactile switches and RGB lighting.", price: 89.99, category: "Electronics", image: getRandomImage() },
    { title: "Laptop Backpack", description: "Water-resistant backpack with laptop compartment.", price: 49.99, category: "Accessories", image: getRandomImage() },
    { title: "Leather Wallet", description: "Premium leather wallet with multiple card slots.", price: 24.99, category: "Accessories", image: getRandomImage() },
    { title: "Black Hoodie", description: "Warm and comfortable hoodie for everyday use.", price: 34.99, category: "Apparel", image: getRandomImage() },
    { title: "Denim Jacket", description: "Classic denim jacket with a modern fit.", price: 54.99, category: "Apparel", image: getRandomImage() },
    { title: "Running Shoes", description: "Lightweight running shoes with cushioned soles.", price: 79.99, category: "Footwear", image: getRandomImage() },
    { title: "White Sneakers", description: "Minimalist white sneakers suitable for all occasions.", price: 64.99, category: "Footwear", image: getRandomImage() },
    { title: "Bluetooth Speaker", description: "Portable Bluetooth speaker with deep bass.", price: 69.99, category: "Electronics", image: getRandomImage() },
    { title: "Travel Mug", description: "Insulated travel mug keeps drinks hot or cold.", price: 14.99, category: "Home & Kitchen", image: getRandomImage() },
    { title: "Coffee Maker", description: "Automatic coffee maker with programmable timer.", price: 89.99, category: "Home & Kitchen", image: getRandomImage() },
    { title: "Office Chair", description: "Ergonomic office chair with lumbar support.", price: 199.99, category: "Furniture", image: getRandomImage() },
    { title: "Study Desk", description: "Spacious wooden desk ideal for study and work.", price: 149.99, category: "Furniture", image: getRandomImage() },
    { title: "LED Desk Lamp", description: "Adjustable LED desk lamp with brightness control.", price: 29.99, category: "Home & Kitchen", image: getRandomImage() },
    { title: "Yoga Mat", description: "Non-slip yoga mat suitable for all exercises.", price: 24.99, category: "Sports", image: getRandomImage() },
    { title: "Dumbbell Set", description: "Adjustable dumbbell set for home workouts.", price: 99.99, category: "Sports", image: getRandomImage() },
    { title: "Football", description: "Durable football for practice and matches.", price: 19.99, category: "Sports", image: getRandomImage() },
    { title: "Basketball", description: "Professional-grade basketball with superior grip.", price: 29.99, category: "Sports", image: getRandomImage() },
    { title: "Tennis Racket", description: "Lightweight tennis racket for beginners and pros.", price: 79.99, category: "Sports", image: getRandomImage() },
    { title: "Sunglasses", description: "Stylish UV-protected sunglasses.", price: 29.99, category: "Accessories", image: getRandomImage() },
    { title: "Baseball Cap", description: "Adjustable baseball cap with breathable fabric.", price: 16.99, category: "Accessories", image: getRandomImage() },
    { title: "Silver Necklace", description: "Elegant silver necklace for daily wear.", price: 44.99, category: "Jewelry", image: getRandomImage() },
    { title: "Gold Bracelet", description: "Stylish bracelet with premium finish.", price: 59.99, category: "Jewelry", image: getRandomImage() },
    { title: "Smartphone Stand", description: "Adjustable stand for phones and small tablets.", price: 12.99, category: "Accessories", image: getRandomImage() },
    { title: "USB-C Hub", description: "Multi-port USB-C hub for laptops and tablets.", price: 34.99, category: "Electronics", image: getRandomImage() },
    { title: "External SSD", description: "Fast and portable external SSD storage.", price: 119.99, category: "Electronics", image: getRandomImage() },
    { title: "Monitor 24 Inch", description: "Full HD monitor with vivid colors.", price: 179.99, category: "Electronics", image: getRandomImage() },
    { title: "Wireless Charger", description: "Fast wireless charger compatible with most devices.", price: 24.99, category: "Electronics", image: getRandomImage() },
    { title: "Portable Power Bank", description: "10000mAh power bank for charging on the go.", price: 29.99, category: "Electronics", image: getRandomImage() },
    { title: "Gaming Controller", description: "Wireless controller with responsive controls.", price: 49.99, category: "Gaming", image: getRandomImage() },
    { title: "Gaming Headset", description: "Immersive surround sound gaming headset.", price: 69.99, category: "Gaming", image: getRandomImage() },
    { title: "Action Camera", description: "Compact action camera for adventures and travel.", price: 199.99, category: "Electronics", image: getRandomImage() },
    { title: "Tripod Stand", description: "Lightweight tripod stand for cameras and phones.", price: 39.99, category: "Photography", image: getRandomImage() },
    { title: "Water Bottle", description: "Reusable stainless steel water bottle.", price: 18.99, category: "Home & Kitchen", image: getRandomImage() },
    { title: "Air Fryer", description: "Healthy cooking air fryer with digital controls.", price: 129.99, category: "Home & Kitchen", image: getRandomImage() },
    { title: "Electric Kettle", description: "Fast-boiling electric kettle with auto shut-off.", price: 39.99, category: "Home & Kitchen", image: getRandomImage() },
    { title: "Coffee Maker Deluxe", description: "Automatic coffee maker for home brewing.", price: 59.99, category: "Home & Kitchen", image: getRandomImage() },
];

// Attach a picsum.photos image (same style as the original 42) + featured flag
// to the 67 new products so the whole store has consistent imagery.
const newProductsWithImages = NEW_PRODUCTS.map((p, i) => ({
    ...p,
    image: getRandomImage(),
    featured: true,
}));

export async function GET() {
    await connectDB();
    await Product.deleteMany();

    // New (66) products first, then the original 42 — so the new
    // real-image products appear at the top of every section.
    const all = [...newProductsWithImages, ...ORIGINAL_PRODUCTS];
    await Product.insertMany(all);

    return Response.json({
        message: "Database seeded successfully",
        total: all.length,
        newRealImageProducts: newProductsWithImages.length,
        originalProducts: ORIGINAL_PRODUCTS.length,
    });
}
