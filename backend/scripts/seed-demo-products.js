require('dotenv').config();

const mongoose = require('mongoose');
const Product = require('../models/product.model');

const demoProducts = [
    {
        name: 'Paracetamol Tablets (10 tablets)',
        description: 'Sample pharmacy catalog item.',
        brand: 'MediNest Essentials',
        category: 'Medicines',
        price: 35,
        oldPrice: 45,
        stock: 30
    },
    {
        name: 'Cough Relief Syrup (100 ml)',
        description: 'Sample pharmacy catalog item.',
        brand: 'MediNest Essentials',
        category: 'Medicines',
        price: 95,
        oldPrice: 120,
        stock: 24
    },
    {
        name: 'Oral Rehydration Salts (1 sachet)',
        description: 'Sample pharmacy catalog item.',
        brand: 'MediNest Essentials',
        category: 'Medicines',
        price: 25,
        oldPrice: 30,
        stock: 40
    },
    {
        name: 'Daily Multivitamin Tablets (30 tablets)',
        description: 'Sample nutrition catalog item.',
        brand: 'MediNest Nutrition',
        category: 'Vitamins',
        price: 399,
        oldPrice: 499,
        stock: 20
    },
    {
        name: 'Vitamin C Chewable Tablets (30 tablets)',
        description: 'Sample nutrition catalog item.',
        brand: 'MediNest Nutrition',
        category: 'Vitamins',
        price: 249,
        oldPrice: 299,
        stock: 22
    },
    {
        name: 'Omega-3 Softgel Capsules (30 capsules)',
        description: 'Sample nutrition catalog item.',
        brand: 'MediNest Nutrition',
        category: 'Vitamins',
        price: 599,
        oldPrice: 699,
        stock: 18
    },
    {
        name: 'Probiotic Capsules (15 capsules)',
        description: 'Sample wellness catalog item.',
        brand: 'MediNest Wellness',
        category: 'Wellness',
        price: 449,
        oldPrice: 549,
        stock: 16
    },
    {
        name: 'Daily Nutrition Powder (200 g)',
        description: 'Sample wellness catalog item.',
        brand: 'MediNest Wellness',
        category: 'Wellness',
        price: 699,
        oldPrice: 799,
        stock: 14
    },
    {
        name: 'Gentle Face Cleanser (100 ml)',
        description: 'Sample personal care catalog item.',
        brand: 'MediNest Care',
        category: 'Personal care',
        price: 249,
        oldPrice: 299,
        stock: 20
    },
    {
        name: 'Daily Moisturizer (100 ml)',
        description: 'Sample personal care catalog item.',
        brand: 'MediNest Care',
        category: 'Personal care',
        price: 349,
        oldPrice: 399,
        stock: 18
    },
    {
        name: 'Baby Lotion (200 ml)',
        description: 'Sample baby care catalog item.',
        brand: 'MediNest Baby',
        category: 'Baby products',
        price: 199,
        oldPrice: 239,
        stock: 16
    },
    {
        name: 'Baby Wash (200 ml)',
        description: 'Sample baby care catalog item.',
        brand: 'MediNest Baby',
        category: 'Baby products',
        price: 179,
        oldPrice: 219,
        stock: 16
    },
    {
        name: 'Herbal Ashwagandha Capsules (30 capsules)',
        description: 'Sample herbal catalog item.',
        brand: 'MediNest Ayurveda',
        category: 'Ayurveda',
        price: 399,
        oldPrice: 449,
        stock: 14
    },
    {
        name: 'Herbal Turmeric Capsules (30 capsules)',
        description: 'Sample herbal catalog item.',
        brand: 'MediNest Ayurveda',
        category: 'Ayurveda',
        price: 299,
        oldPrice: 349,
        stock: 18
    },
    {
        name: 'Digital Thermometer',
        description: 'Sample health device catalog item.',
        brand: 'MediNest Health Tools',
        category: 'Devices',
        price: 299,
        oldPrice: 399,
        stock: 12
    },
    {
        name: 'Automatic Blood Pressure Monitor',
        description: 'Sample health device catalog item.',
        brand: 'MediNest Health Tools',
        category: 'Devices',
        price: 1599,
        oldPrice: 1899,
        stock: 8
    },
    {
        name: 'Fluoride Toothpaste (100 g)',
        description: 'Sample oral care catalog item.',
        brand: 'MediNest Oral Care',
        category: 'Oral care',
        price: 120,
        oldPrice: 145,
        stock: 25
    },
    {
        name: 'Soft Bristle Toothbrush',
        description: 'Sample oral care catalog item.',
        brand: 'MediNest Oral Care',
        category: 'Oral care',
        price: 89,
        oldPrice: 110,
        stock: 30
    },
    {
        name: 'Nourishing Shampoo (200 ml)',
        description: 'Sample hair care catalog item.',
        brand: 'MediNest Hair Care',
        category: 'Hair care',
        price: 299,
        oldPrice: 349,
        stock: 18
    },
    {
        name: 'Daily Care Conditioner (180 ml)',
        description: 'Sample hair care catalog item.',
        brand: 'MediNest Hair Care',
        category: 'Hair care',
        price: 279,
        oldPrice: 329,
        stock: 18
    }
];

const categoryProducts = [
    {
        category: 'Medicines',
        brand: 'MediNest Essentials',
        items: [
            ['Antacid Chewable Tablets (10 tablets)', 65],
            ['Saline Nasal Drops (10 ml)', 55],
            ['Antiseptic Solution (100 ml)', 89],
            ['Pain Relief Gel (30 g)', 110],
            ['Cough Lozenges (10 lozenges)', 45],
            ['Elastic Bandage Roll (1 pack)', 49],
            ['ORS Travel Sachets (1 sachet)', 28]
        ]
    },
    {
        category: 'Vitamins',
        brand: 'MediNest Nutrition',
        items: [
            ['Vitamin B Complex Tablets (30 tablets)', 279],
            ['Calcium Supplement Tablets (30 tablets)', 329],
            ['Zinc Supplement Tablets (30 tablets)', 199],
            ['Vitamin D Supplement (30 capsules)', 249],
            ['Biotin Supplement Tablets (30 tablets)', 349],
            ['Daily Multivitamin Gummies (30 gummies)', 399],
            ['Iron Supplement Tablets (30 tablets)', 229]
        ]
    },
    {
        category: 'Wellness',
        brand: 'MediNest Wellness',
        items: [
            ['Herbal Infusion Tea (20 bags)', 249],
            ['Electrolyte Drink Mix (10 sachets)', 299],
            ['Plant Protein Powder (200 g)', 699],
            ['Probiotic Blend Capsules (15 capsules)', 449],
            ['Dietary Fiber Powder (200 g)', 349],
            ['Daily Hydration Powder (10 sachets)', 279],
            ['Wellness Herbal Drops (30 ml)', 199],
            ['Nutrition Drink Powder (200 g)', 549]
        ]
    },
    {
        category: 'Personal care',
        brand: 'MediNest Care',
        items: [
            ['Daily Sunscreen Lotion (50 ml)', 299],
            ['Nourishing Body Lotion (200 ml)', 279],
            ['Gentle Hand Wash (200 ml)', 149],
            ['Moisturizing Lip Balm (10 g)', 99],
            ['Gentle Face Cleanser (150 ml)', 279],
            ['Hand Cream (50 ml)', 179],
            ['Daily Body Wash (200 ml)', 249],
            ['Cleansing Wipes (30 wipes)', 129]
        ]
    },
    {
        category: 'Baby products',
        brand: 'MediNest Baby',
        items: [
            ['Gentle Baby Shampoo (200 ml)', 189],
            ['Soft Baby Wipes (72 wipes)', 149],
            ['Baby Diaper Cream (50 g)', 179],
            ['Baby Massage Oil (100 ml)', 199],
            ['Gentle Baby Wash (200 ml)', 189],
            ['Baby Powder (100 g)', 119],
            ['Baby Moisturizer (100 ml)', 169],
            ['Baby Cotton Buds (pack of 50)', 79]
        ]
    },
    {
        category: 'Ayurveda',
        brand: 'MediNest Ayurveda',
        items: [
            ['Tulsi Herbal Tablets (30 tablets)', 229],
            ['Amla Herbal Capsules (30 capsules)', 279],
            ['Neem Herbal Soap (75 g)', 99],
            ['Herbal Massage Oil (100 ml)', 249],
            ['Turmeric Herbal Tea (20 bags)', 219],
            ['Herbal Wellness Powder (100 g)', 299],
            ['Brahmi Herbal Capsules (30 capsules)', 329],
            ['Herbal Hair Oil (100 ml)', 189]
        ]
    },
    {
        category: 'Devices',
        brand: 'MediNest Health Tools',
        items: [
            ['Finger Pulse Oximeter', 999],
            ['Digital Weighing Scale', 1199],
            ['Portable Nebulizer', 1499],
            ['Digital Glucose Meter', 899],
            ['Reusable Hot Water Bag', 349],
            ['Upper Arm Blood Pressure Monitor', 1799],
            ['Digital Thermometer with Flexible Tip', 399],
            ['Medicine Organizer Box', 199]
        ]
    },
    {
        category: 'Oral care',
        brand: 'MediNest Oral Care',
        items: [
            ['Mint Mouthwash (250 ml)', 179],
            ['Dental Floss Picks (30 pieces)', 99],
            ['Tongue Cleaner', 59],
            ['Sensitive Care Toothpaste (100 g)', 139],
            ['Kids Soft Toothbrush', 79],
            ['Interdental Brush Set (6 pieces)', 149],
            ['Fresh Breath Spray (15 ml)', 129],
            ['Soft Bristle Toothbrush Twin Pack', 119]
        ]
    },
    {
        category: 'Hair care',
        brand: 'MediNest Hair Care',
        items: [
            ['Nourishing Hair Oil (100 ml)', 199],
            ['Daily Hair Serum (50 ml)', 249],
            ['Repair Conditioner (180 ml)', 279],
            ['Hair Mask (100 g)', 329],
            ['Gentle Daily Shampoo (200 ml)', 269],
            ['Scalp Massage Brush', 149],
            ['Leave-in Hair Cream (100 ml)', 229],
            ['Wide Tooth Comb', 89]
        ]
    }
];

const additionalDemoProducts = categoryProducts.flatMap(({ category, brand, items }) => (
    items.map(([name, price]) => ({
        name,
        description: `Illustrative demo listing for the ${category} catalog; verify product details and price before sale.`,
        brand,
        category,
        price,
        oldPrice: Math.round(price * 1.15),
        stock: 20
    }))
));
const allDemoProducts = [...demoProducts, ...additionalDemoProducts];
const productCounts = new Map();
for (const product of allDemoProducts) {
    if (!productCounts.has(product.category)) productCounts.set(product.category, new Set());
    productCounts.get(product.category).add(`${product.brand}:${product.name}`);
}

for (const { category } of categoryProducts) {
    const count = productCounts.get(category)?.size || 0;
    if (count < 10) {
        throw new Error(`${category} needs at least 10 unique demo products; found ${count}.`);
    }
}

async function seedDemoProducts() {
    const mongoUri = process.env.MONGO_URL
        || process.env.MONGODB_URI
        || 'mongodb://127.0.0.1:27017/medinest';

    await mongoose.connect(mongoUri);
    for (const product of allDemoProducts) {
        const { description, ...insertFields } = product;
        await Product.findOneAndUpdate(
            { name: product.name, brand: product.brand },
            {
                $set: { description },
                $setOnInsert: {
                    ...insertFields,
                    isActive: true,
                    requiresPrescription: false
                }
            },
            { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
        );
    }

    const categorySummary = [...productCounts]
        .map(([category, products]) => `${category}: ${products.size}`)
        .join(', ');
    console.log(`Verified ${allDemoProducts.length} illustrative products. ${categorySummary}.`);
}

if (require.main === module) {
    seedDemoProducts()
        .catch((error) => {
            console.error('Failed to seed demo products:', error.message);
            process.exitCode = 1;
        })
        .finally(async () => {
            await mongoose.disconnect();
        });
}

module.exports = { allDemoProducts, categoryProducts };
