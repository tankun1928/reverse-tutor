// Demo code to try Reverse Tutor on: "quiz me on examples/demo/cart.js"
const cache = new Map();

async function fetchPrice(sku, { retries = 2 } = {}) {
  if (cache.has(sku)) return cache.get(sku);
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(`https://api.example.com/price/${encodeURIComponent(sku)}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const { price } = await res.json();
      cache.set(sku, price);
      return price;
    } catch (err) {
      if (attempt === retries) throw err;
      await new Promise((r) => setTimeout(r, 2 ** attempt * 200));
    }
  }
}

async function cartTotal(items) {
  const prices = await Promise.all(items.map((i) => fetchPrice(i.sku)));
  return items.reduce((sum, item, idx) => sum + prices[idx] * item.qty, 0);
}

module.exports = { fetchPrice, cartTotal };
