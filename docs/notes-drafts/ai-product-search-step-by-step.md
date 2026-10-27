# How I Built AI Product Search, Step by Step

**Slug:** `ai-product-search-step-by-step`  
**Tags:** AI · Backend · Database  
**Flow image:** `/notes/ai-product-search-flow.jpg` (also under `public/notes/`)

---

## Key takeaways

- **What:** a product search that understands what people mean, not just the exact words they type. A data pipeline turns every product into a vector. The search page mixes vector search with normal database filters.
- **Why:** people type natural human words — sentences, synonyms, typos — not exact product names. Plain keyword search misses those queries. AI search is there to improve results when the wording does not match the catalog text.
- **When:** keyword search is not enough, and you want search based on everyday language and images.
- **How:** clean and shape product data → embed → store vectors with filter tags → at search time, turn the query into a plan → route to SQL, vector, or hybrid → load rows from your database → optionally rank when order matters → measure with a fixed test set. Raise data cleaning early even if it is not your step. Plan ranking if product order matters.

---

## I used to wonder how the big sites did it

I always noticed how sites like Amazon or Alibaba could take almost any words I typed — messy, human, incomplete — and still show products that felt right. Sometimes even a photo was enough. It looked like magic.

At some point I got the chance to work on that kind of feature myself. Before I wrote much production code, I spent a lot of time researching: embeddings, vector search, hybrid retrieval, and how real catalogs stay searchable when the data is imperfect.

This note is what I learned from building it step by step — the challenges and the pipeline, not a client case study.

## Same product, different words

In e-commerce, people search the way they talk. A user types "something light to sit on in a small room". The product is called "Compact folding chair, 3.2 kg". Keyword search finds nothing, because none of the words match.

That gap is the whole reason for AI product search.

## The big picture

There are two parts.

1. A **data pipeline** reads the catalog, builds clean text, creates vectors, writes them to cloud storage, and loads them into a vector database.
2. The **web app** takes the user's query (text or photo-as-words), plans the search, hits the index and/or SQL, then loads real products from your own database.

![AI product search flow: data pipeline on top, search path below](/notes/ai-product-search-flow.jpg)

## Part 1: Building the data pipeline

This part runs in the background. It reads the catalog, turns each product into a vector, and keeps the index up to date.

### Start with the product data — and cleaning

Before embeddings, ask a hard question: is the catalog clean enough?

Dirty names, missing attributes, and inconsistent categories make weak vectors. Data cleaning may not be your ticket, but you should raise it early. Search quality starts with data shape.

Here's what a typical product record might look like:

```json
{
  "sku": "FC-1042",
  "name": "Compact folding chair",
  "brand": "ACME",
  "category_id": "03",
  "category_name": "Chairs",
  "description": "Folds flat, fits in small rooms.",
  "color": "Blue",
  "material": "Aluminum",
  "dimensions": "W45 x D50 x H80 cm",
  "max_load_kg": 100,
  "price": 39.90,
  "in_stock": true,
  "store_id": "S-07",
  "rating": 4.6,
  "cost_price": 18.20,
  "image_url": "https://example.com/img/fc-1042.jpg",
  "product_url": "https://example.com/p/fc-1042",
  "created_at": "2026-05-01"
}
```

Why not dump the whole record into the vector? A vector answers one question: "which products *mean* something close to what the user typed?" Anything that doesn't help with that is noise. So before writing much code, I sorted every field by where it belongs:

| Field | Where it goes | Why |
|---|---|---|
| name, brand, category_name, description | Text to embed | These are the words people search with. |
| color, material, dimensions, max_load_kg | Text to embed | People write "blue metal chair" or "fits a small room", not `width <= 60`. |
| category_id, store_id | Filter (tags) | Exact yes/no checks; codes mean nothing to the model. |
| price, rating | Filter (numbers) | Ranges; vectors are bad at ranges. |
| in_stock | Check in DB after search | Changes often; keeping it in the index forces constant reindex. |
| sku | Vector id | How you find the product again in your database. |
| cost_price, image_url, product_url, created_at | Leave out | No meaning for search; some are private. |

**Names** go in the text. **Codes** go in filters. "Chairs" helps free-text search. `03` does not.

### Step 1: Turn each product into one clean text

Embedding models read text, so the first job is turning the "text to embed" fields into one piece of text. Joining everything into one long block works while the text is short. When it grows past the model's token limit, you must **chunk**.

Cutting at a fixed character length breaks meaning:

```text
Chunk 1: "... Folds f"
Chunk 2: "lat, fits in small rooms..."
```

"Folds flat" is split. The vector from each half is weaker.

So I built text in fixed sections: header (name, brand, category, size), description, then labeled details:

```text
Compact folding chair
Brand: ACME
Category: Chairs
Size: W45 x D50 x H80 cm

Folds flat, fits in small rooms. Strong aluminum frame.

Color: Blue
Material: Aluminum
Max load (kg): 100
```

When a product grows past the limit, split only at section breaks so each chunk stays a complete idea. Labels like `Max load (kg): 100` help the model even if that line ends up alone in a chunk.

### Step 2: Split only the long products

Most products stay one vector. Split only when text goes over a safe character budget (I used about 2,500), into chunks up to about 2,000 characters — still under the model's token limit.

```python
def chunk(sections, min_chars=2500, max_chars=2000):
    full = "\n\n".join(sections)
    if len(full) <= min_chars:
        return [full]
    return pack_sections(sections, max_chars)  # split on sections, then lines
```

Chunk ids look like `PRODUCT123#1`. At search time, strip `#...` and drop duplicates so one product appears once.

### Step 3: Tell the model what the embedding is for

Many models support a **task type**. For product search, embed catalog text as a **document** and the user search as a **query**. Matching pairs matter. The index and the query must use the **same model and the same dimensions**.

### Step 4: Change the model only when you have a reason

I changed the embedding model or its size more than once. Each change had a reason (text-only first, then multimodal for photos, then higher dimensions for accuracy, then a region-limited text-only model for compliance).

Every change of model **or** dimension means a new index and a full re-embed. You cannot mix vectors from different models or sizes. Set model and size explicitly on both sides — defaults drift.

### Step 5: Store vectors with filter tags

Each index entry needs at least:

- **id** — SKU (plus `#n` for chunks)
- **embedding** — the vector
- **restricts** — tag filters (`category_id`, `store_id`, …)
- **numeric_restricts** — number filters (`price`, `rating`, …)

Example shape:

```json
{
  "id": "FC-1042",
  "embedding": [0.12, -0.34, 0.08],
  "restricts": [
    { "namespace": "category_id", "allow": ["03"] },
    { "namespace": "store_id", "allow": ["S-07"] }
  ],
  "numeric_restricts": [
    { "namespace": "price", "value_float": 39.90 },
    { "namespace": "rating", "value_float": 4.6 }
  ]
}
```

The vector DB finds matching ids. Name, price, and image come from your own DB, which stays up to date. Keep fast-changing values (like stock) out of the index; check them after search.

### Step 6: Keep the index fresh

- **Full reindex** — first load, or after model / text-builder changes.
- **Ids mode** — day-to-day add/update/delete for listed products.

Trigger by hand, API, or schedule. A safety check helps: if too many embeds fail, do not replace a working index with a half-built one.

## Part 2: Building the search client

This runs when someone searches.

### Step 1: Let an LLM read the query

Users mix brand, category, price, and intent in one box. Send the query to an LLM and ask for JSON only, with a real category list so codes stay valid:

```json
{
  "keyword": "ACME",
  "semantic_text": "light, for small room",
  "restricts": [{ "namespace": "category_id", "allow": ["03"] }],
  "numeric_restricts": [{ "namespace": "price", "op": "LESS_EQUAL", "value_float": 50.0 }]
}
```

If the LLM fails, degrade safely. Clear `semantic_text` when it only repeats the category name.

### Step 2: Route to SQL, vector, or hybrid

- **SQL** — exact words and filters; great for codes and pure filters; weak on meaning.
- **Vector** — meaning, synonyms, sentences; returns ids + scores; weak alone on hard filters.
- **Hybrid** — vector ranking among products that pass hard filters. If hybrid finds nothing, fall back to SQL with the same filters so the user still sees something valid.

```python
def route(plan):
    if plan.semantic and plan.filters: return "hybrid"
    if plan.semantic:                  return "vector"
    if plan.filters:                   return "sql"
    return "vector"
```

### Step 3: Ranking (worth planning even if you don't own it)

Retrieval finds candidates. **Ranking** decides order. I did not always own the ranking layer, but it is worth implementing when the business cares about position — popularity, stock, margin, or editorial boosts. "Right product" often also means "right place in the list."

### Step 4: Search by photo through words (when the index is text-only)

If the live index is text-only, turn images into words on both sides with the **same** caption prompt: describe product photos in the pipeline, describe the uploaded photo at query time, then search as text.

### Step 5: Measure with a golden set

Gut feeling is not enough. Keep a fixed labeled test set (exact code, brand, typo, synonym, long sentence, photo, …) and score top results with Hit@K, MRR, Recall@K, and NDCG. Same queries every time — so model or text-builder changes are comparable.

## Lessons learned

- **A model mismatch fails silently.** Wrong model or dimension can still return results that make no sense. Fail loud when vector length is wrong.
- **Check index search settings as the catalog grows.** Default "search a few groups" can miss good matches under strict filters; widen the search when needed.
- **Don't let one bad product break the pipeline.** Retries and skip-failed-product behavior keep reindexes healthy.
- **Raise cleaning and ranking early.** Even when they are not your tickets, they decide whether the system feels smart in production.

## Closing

Big-site search looks like magic until you build a piece of it. Then it becomes a clear path: clean data, embeddings, a fresh index, a smart router, optional ranking, and honest measurement. That is the work behind "type anything and still find the right product."
