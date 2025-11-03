import express from 'express';
import { prisma } from '../config/prisma.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management endpoints
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     description: Retrieve a list of products with optional search, limit, and sort.
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search term for title or category
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Maximum number of products to return
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [price_asc, price_desc, rating, newest]
 *           default: newest
 *         description: Sort order
 *     responses:
 *       200:
 *         description: List of products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *       500:
 *         description: Failed to fetch products
 */
router.get('/', async (req, res) => {
  try {
    const { q = '', limit = 50, sort = 'newest' } = req.query;
    const takeLimit = parseInt(limit);

    const where = q
      ? {
          OR: [
            { title: { contains: q, mode: 'insensitive' } },
            { category: { contains: q, mode: 'insensitive' } },
          ],
        }
      : {};

    let orderBy;
    switch (sort) {
      case 'price_asc':
        orderBy = { price: 'asc' };
        break;
      case 'price_desc':
        orderBy = { price: 'desc' };
        break;
      case 'rating':
        orderBy = { rating: 'desc' };
        break;
      case 'newest':
      default:
        orderBy = { scrapedAt: 'desc' };
        break;
    }

    const products = await prisma.product.findMany({
      where,
      take: takeLimit * 2,
      orderBy,
    });

    const uniqueMap = new Map();
    const uniqueProducts = [];

    for (const p of products) {
      const key = p.imageUrl || p.title;
      if (!uniqueMap.has(key)) {
        uniqueMap.set(key, true);
        uniqueProducts.push(p);
      }
      if (uniqueProducts.length >= takeLimit) break;
    }

    res.json({
      count: uniqueProducts.length,
      products: uniqueProducts,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get a single product
 *     description: Retrieve full details of a product by its ID.
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *       500:
 *         description: Failed to fetch product
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

/**
 * @swagger
 * /api/products/stats/summary:
 *   get:
 *     summary: Get product statistics
 *     description: Retrieve basic dashboard statistics such as total products, average price, and average rating.
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Dashboard summary
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalProducts:
 *                   type: integer
 *                 averagePrice:
 *                   type: number
 *                 averageRating:
 *                   type: number
 *       500:
 *         description: Failed to fetch stats
 */
router.get('/stats/summary', async (req, res) => {
  try {
    const totalProducts = await prisma.product.count();
    const avgPrice = await prisma.product.aggregate({
      _avg: { price: true },
    });
    const avgRating = await prisma.product.aggregate({
      _avg: { rating: true },
    });

    res.json({
      totalProducts,
      averagePrice: avgPrice._avg.price,
      averageRating: avgRating._avg.rating,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         title:
 *           type: string
 *         price:
 *           type: number
 *         currency:
 *           type: string
 *         rating:
 *           type: number
 *         reviewsCount:
 *           type: integer
 *         imageUrl:
 *           type: string
 *         productUrl:
 *           type: string
 *         category:
 *           type: string
 *         scrapedAt:
 *           type: string
 *           format: date-time
 *         priceHistory:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               price:
 *                 type: number
 *               date:
 *                 type: string
 *                 format: date-time
 */

export { router as productRoutes };
