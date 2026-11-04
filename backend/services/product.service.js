const mongoose = require('mongoose');
const Product = require('../models/product.model');

const editableFields = [
    'name',
    'description',
    'brand',
    'category',
    'price',
    'oldPrice',
    'stock',
    'requiresPrescription',
    'isActive'
];

function escapeRegex(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function selectProductFields(data) {
    return Object.fromEntries(
        Object.entries(data).filter(([field]) => editableFields.includes(field))
    );
}

class ProductService {
    async getAllProducts(options = {}) {
        const filter = { isActive: true };
        const search = options.search?.trim();

        if (search) {
            const searchRegex = new RegExp(escapeRegex(search), 'i');
            filter.$or = [
                { name: searchRegex },
                { brand: searchRegex },
                { category: searchRegex },
                { description: searchRegex }
            ];
        }

        if (options.category) filter.category = String(options.category).trim();
        if (options.brand) filter.brand = String(options.brand).trim();
        if (options.minPrice !== undefined || options.maxPrice !== undefined) {
            filter.price = {};
            if (options.minPrice !== undefined) filter.price.$gte = options.minPrice;
            if (options.maxPrice !== undefined) filter.price.$lte = options.maxPrice;
        }
        if (options.inStock !== undefined) {
            filter.stock = options.inStock ? { $gt: 0 } : 0;
        }
        if (options.requiresPrescription !== undefined) {
            filter.requiresPrescription = options.requiresPrescription;
        }

        const sortableFields = ['createdAt', 'name', 'price', 'stock'];
        const sortField = sortableFields.includes(options.sortBy) ? options.sortBy : 'createdAt';
        const sortDirection = options.order === 'asc' ? 1 : -1;

        return Product.find(filter).sort({ [sortField]: sortDirection });
    }

    async getInventory() {
        return Product.find().sort({ name: 1 });
    }

    async addProduct(productData) {
        return Product.create(selectProductFields(productData));
    }

    async updateProduct(id, productData) {
        if (!mongoose.isValidObjectId(id)) {
            return null;
        }

        const updates = selectProductFields(productData);
        if (Object.keys(updates).length === 0) {
            const error = new Error('At least one valid product field is required');
            error.statusCode = 400;
            throw error;
        }

        return Product.findByIdAndUpdate(id, updates, {
            new: true,
            runValidators: true
        });
    }

    async deactivateProduct(id) {
        if (!mongoose.isValidObjectId(id)) {
            return null;
        }

        return Product.findByIdAndUpdate(
            id,
            { isActive: false },
            { new: true, runValidators: true }
        );
    }

    async getProductById(id) {
        if (!mongoose.isValidObjectId(id)) {
            return null;
        }

        return Product.findOne({
            _id: id,
            isActive: true
        });
    }
}

module.exports = new ProductService();
