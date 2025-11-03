import express from 'express';
import rateLimit from 'express-rate-limit';
import { amazonScraper } from '../utils/amazonScraper.js';

const router = express.Router();

// Rate limiting for scrape endpoint (5 requests per minute)
const scrapeLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5,
  message: { error: 'Too many scrape requests, please try again later' },
});

/**
 * @swagger
 * tags:
 *   name: Scrape
 *   description: Trigger Amazon product scraping
 */

/**
 * @swagger
 * /api/scrape:
 *   post:
 *     summary: Trigger Amazon scraping
 *     description: Scrape Amazon for products based on a search term and optional max products.
 *     tags: [Scrape]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               searchTerm:
 *                 type: string
 *                 description: The search term to query on Amazon
 *               maxProducts:
 *                 type: integer
 *                 default: 10
 *                 description: Maximum number of products to scrape
 *             required:
 *               - searchTerm
 *     responses:
 *       200:
 *         description: Scraping completed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 searchTerm:
 *                   type: string
 *                 count:
 *                   type: integer
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 message:
 *                   type: string
 *       400:
 *         description: Invalid request (missing searchTerm)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       429:
 *         description: Too many requests (rate limit exceeded)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Scraping failed due to server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                 message:
 *                   type: string
 */
router.post('/', scrapeLimiter, async (req, res) => {
  try {
    const { searchTerm, maxProducts = 10 } = req.body;

    if (!searchTerm || typeof searchTerm !== 'string') {
      return res.status(400).json({ error: 'searchTerm is required' });
    }

    console.log(`🔍 Starting scrape for: ${searchTerm}`);

    const products = await amazonScraper(searchTerm, maxProducts);

    res.json({
      success: true,
      searchTerm,
      count: products.length,
      products,
      message: 'Scraping completed successfully',
    });
  } catch (error) {
    console.error('Scraping error:', error);
    res.status(500).json({ 
      error: 'Scraping failed',
      message: error.message,
    });
  }
});

export { router as scrapeRoutes };
