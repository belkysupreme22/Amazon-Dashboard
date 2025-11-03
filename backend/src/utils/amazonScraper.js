import axios from 'axios';
import * as cheerio from 'cheerio';
import { prisma } from '../config/prisma.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { oxylabsScrapeAmazon } from './oxylabsScraper.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class AmazonScraper {
  constructor() {
    this.baseUrl = 'https://www.amazon.com';
    this.userAgent =
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124 Safari/537.36';
  }

  async delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async scrapeSearchResults(searchTerm, maxProducts = 10) {
    try {
      const searchUrl = `${this.baseUrl}/s?k=${encodeURIComponent(searchTerm)}`;
      const response = await axios.get(searchUrl, {
        headers: {
          'User-Agent': this.userAgent,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive',
        },
        timeout: 10000,
      });

      const $ = cheerio.load(response.data);
      const products = [];

      $('div[data-component-type="s-search-result"]').each((i, el) => {
        if (products.length >= maxProducts) return false;
        const $el = $(el);

        const title = $el.find('h2 a span').first().text().trim() || null;
        const productUrl = $el.find('h2 a').attr('href') || null;
        const fullUrl = productUrl ? `${this.baseUrl}${productUrl.split('?')[0]}` : null;

        const priceText = $el.find('.a-price .a-offscreen').first().text();
        const price = this.parsePrice(priceText);

        const ratingText = $el.find('.a-icon-alt').first().text();
        const rating = this.parseRating(ratingText);

        const reviewsText = $el.find('.a-size-base').text();
        const reviewsCount = this.parseReviewsCount(reviewsText);

        const imgEl = $el.find('img').first();
        const imageUrl = imgEl.attr('src') || imgEl.attr('data-src') || null;

        products.push({
          title,
          price,
          currency: 'USD',
          rating,
          reviewsCount,
          imageUrl,
          productUrl: fullUrl,
          scrapedAt: new Date(),
          category: searchTerm,
        });
      });

      return products;
    } catch (error) {
      return [];
    }
  }

  parsePrice(text) {
    if (!text) return null;
    const match = text.match(/\$?([0-9,]+\.?[0-9]*)/);
    return match ? parseFloat(match[1].replace(/,/g, '')) : null;
  }

  parseRating(text) {
    if (!text) return null;
    const match = text.match(/([0-9]+\.[0-9]+)/);
    return match ? parseFloat(match[1]) : null;
  }

  parseReviewsCount(text) {
    if (!text) return null;
    const match = text.match(/([0-9,]+)/);
    return match ? parseInt(match[1].replace(/,/g, ''), 10) : null;
  }

  getFallbackData(maxProducts) {
    try {
      const samplePath = path.join(__dirname, '../../prisma/sampleProducts.json');
      const sampleProducts = JSON.parse(fs.readFileSync(samplePath, 'utf8'));
      return sampleProducts.slice(0, maxProducts);
    } catch {
      return [];
    }
  }

  addToPriceHistory(existingHistory, newPrice) {
    const history = existingHistory || [];
    return [
      { price: newPrice, date: new Date().toISOString() },
      ...history.slice(0, 29),
    ];
  }

  fillMissingFields(product, searchTerm) {
    const timestamp = Date.now();
    const randomSuffix = Math.floor(Math.random() * 1000);

    return {
      title: product.title || `Unknown ${searchTerm} Product #${timestamp}-${randomSuffix}`,
      price: product.price != null ? product.price : 0,
      currency: product.currency || 'USD',
      rating: product.rating != null ? product.rating : 0,
      reviewsCount: product.reviewsCount != null ? product.reviewsCount : 0,
      imageUrl: product.imageUrl || 'https://via.placeholder.com/150',
      productUrl:
        product.productUrl ||
        `https://amazon.com/dummy/${searchTerm.replace(/\s+/g, '-')}-${timestamp}-${randomSuffix}`,
      category: product.category || searchTerm,
      scrapedAt: product.scrapedAt || new Date(),
      priceHistory: product.priceHistory || [
        { price: product.price != null ? product.price : 0, date: new Date().toISOString() },
      ],
    };
  }

  async saveProducts(products, searchTerm) {
    const saved = [];
    for (let product of products) {
      try {
        const completeProduct = this.fillMissingFields(product, searchTerm);

        const existing = await prisma.product.findFirst({
          where: { productUrl: completeProduct.productUrl },
        });

        if (existing) {
          const updated = await prisma.product.update({
            where: { id: existing.id },
            data: {
              ...completeProduct,
              priceHistory:
                existing.price !== completeProduct.price
                  ? this.addToPriceHistory(existing.priceHistory, completeProduct.price)
                  : existing.priceHistory,
            },
          });
          saved.push(updated);
        } else {
          const created = await prisma.product.create({ data: completeProduct });
          saved.push(created);
        }

        await this.delay(100);
      } catch {}
    }
    return saved;
  }
}

const scraper = new AmazonScraper();

export async function amazonScraper(searchTerm, maxProducts = 10) {
  let allProducts = [];

  // 1️⃣ Oxylabs
  try {
    const oxyProducts = await oxylabsScrapeAmazon(searchTerm, maxProducts);
    if (oxyProducts.length > 0) allProducts = allProducts.concat(oxyProducts);
    console.log("✅ oxyProducts returned ", allProducts.length)
  } catch {}

  // 2️⃣ Axios + Cheerio
  try {
    const cheerioProducts = await scraper.scrapeSearchResults(searchTerm, maxProducts);
    if (cheerioProducts.length > 0) allProducts = allProducts.concat(cheerioProducts);
    console.log("✅ cheecheerioProducts  returned ", allProducts.length)
  } catch {}

  // 3️⃣ Fallback
  if (allProducts.length === 0) {
    allProducts = scraper.getFallbackData(maxProducts);
  }

  const saved = await scraper.saveProducts(allProducts, searchTerm);
  return saved;
}
