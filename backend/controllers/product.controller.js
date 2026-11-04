const productService = require('../services/product.service');

function parseOptionalNumber(value, fieldName) {
    if (value === undefined || value === '') {
        return undefined;
    }

    const parsed = Number(value);
    if (!Number.isFinite(parsed) || parsed < 0) {
        const error = new Error(`${fieldName} must be a non-negative number`);
        error.statusCode = 400;
        throw error;
    }

    return parsed;
}

class ProductController {
    async getAllProducts(req, res, next) {
        try {
            const {
                search = '',
                category,
                brand,
                minPrice,
                maxPrice,
                inStock,
                requiresPrescription,
                sortBy = 'createdAt',
                order = 'desc'
            } = req.query;
            const min = parseOptionalNumber(minPrice, 'minPrice');
            const max = parseOptionalNumber(maxPrice, 'maxPrice');

            if (min !== undefined && max !== undefined && min > max) {
                return res.status(400).json({ message: 'minPrice cannot exceed maxPrice' });
            }

            if (inStock !== undefined && !['true', 'false'].includes(inStock)) {
                return res.status(400).json({ message: 'inStock must be true or false' });
            }
            if (
                requiresPrescription !== undefined
                && !['true', 'false'].includes(requiresPrescription)
            ) {
                return res.status(400).json({ message: 'requiresPrescription must be true or false' });
            }

            const products = await productService.getAllProducts({
                search: String(search),
                category,
                brand,
                minPrice: min,
                maxPrice: max,
                inStock: inStock === undefined ? undefined : inStock === 'true',
                requiresPrescription: requiresPrescription === undefined
                    ? undefined
                    : requiresPrescription === 'true',
                sortBy: String(sortBy),
                order: String(order).toLowerCase() === 'asc' ? 'asc' : 'desc'
            });

            return res.status(200).json({
                message: 'Products fetched successfully',
                products
            });
        } catch (error) {
            return next(error);
        }
    }

    async getInventory(req, res, next) {
        try {
            const products = await productService.getInventory();
            return res.status(200).json({ products });
        } catch (error) {
            return next(error);
        }
    }

    async addProduct(req, res, next) {
        try {
            const product = await productService.addProduct(req.body || {});
            return res.status(201).json({
                message: 'Product added successfully',
                product
            });
        } catch (error) {
            return next(error);
        }
    }

    async updateProduct(req, res, next) {
        try {
            const product = await productService.updateProduct(req.params.id, req.body || {});
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }

            return res.status(200).json({
                message: 'Product updated successfully',
                product
            });
        } catch (error) {
            return next(error);
        }
    }

    async deactivateProduct(req, res, next) {
        try {
            const product = await productService.deactivateProduct(req.params.id);
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }

            return res.status(200).json({
                message: 'Product deactivated successfully',
                product
            });
        } catch (error) {
            return next(error);
        }
    }

    async getProductById(req, res, next) {
        try {
            const product = await productService.getProductById(req.params.id);
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }

            return res.status(200).json({
                message: 'Product fetched successfully',
                product
            });
        } catch (error) {
            return next(error);
        }
    }
}

module.exports = new ProductController();
