import axios from 'axios';

export async function oxylabsScrapeAmazon(searchTerm, maxProducts = 10) {
  if (!process.env.OXYLABS_USERNAME || !process.env.OXYLABS_PASSWORD) {
    throw new Error('Missing OXYLABS_USERNAME/OXYLABS_PASSWORD');
  }

  const payload = {
    source: 'amazon_search',
    query: searchTerm,
    domain: 'com',
    parse: true,
  };

  const { data } = await axios.post(
    'https://realtime.oxylabs.io/v1/queries',
    payload,
    {
      auth: {
        username: process.env.OXYLABS_USERNAME,
        password: process.env.OXYLABS_PASSWORD,
      },
      timeout: 30000,
    }
  );


  const parsedResults = data?.results?.[0]?.content?.results;
  const items = Array.isArray(parsedResults) ? parsedResults.slice(0, maxProducts) : [];

  return items
    .map((p) => ({
      title: p.title,
      price: p.price?.value ?? null,
      currency: p.price?.currency || 'USD',
      rating: p.rating ?? null,
      reviewsCount: p.reviews_count ?? null,
      imageUrl: p.image || null,
      productUrl: p.url,
      scrapedAt: new Date(),
      category: searchTerm,
    }))
    .filter((i) => i.title && i.productUrl && i.price);
}


