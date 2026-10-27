import type { SeedBodyBlock, SeedNote } from "./notes-seed-data";

/**
 * Body from the original draft (kept faithful).
 * Light additions: short personal opening + flow image injected by seed script.
 */
export const aiProductSearchTakeaways = [
  "What: a product search that understands what people mean, not just the exact words they type. A data pipeline turns every product into a vector. The search page mixes vector search with normal database filters.",
  "Who: any developer with a catalog of thousands of products whose users type sentences, typos, or synonyms instead of exact product names.",
  "Why: plain LIKE '%word%' search only finds the words you typed. It can't tell that \"light chair for a small room\" and \"compact folding chair\" mean the same thing.",
  "When: when you run an e-commerce catalog. In e-commerce, people are happier when they can search in their own words or a full sentence than when they have to guess the exact keyword.",
  "How: build clean text for each product, embed it with an embedding model (Gemini, OpenAI, ...), and store it with filter tags. At search time, an LLM (Claude, GPT, ...) turns the query into a small JSON plan. A router picks SQL, vector, or hybrid search, and the database fills in the final rows. A labeled test set tells me if a change helped.",
];

export const aiProductSearchBodyWithoutFlowImage: SeedBodyBlock[] = [
  // --- light addition: personal opening ---
  {
    _type: "noteHeading",
    heading: "I used to wonder how the big sites did it",
  },
  {
    _type: "noteParagraph",
    text: "I always noticed how sites like Amazon or Alibaba could take almost any words I typed — messy, human, incomplete — and still show products that felt right. Sometimes even a photo was enough. It looked like magic.",
  },
  {
    _type: "noteParagraph",
    text: "At some point I got the chance to work on that kind of feature myself. Before I implemented much of it, I spent a lot of time researching. This note is the step-by-step path I ended up with.",
  },

  // --- original draft from here ---
  { _type: "noteHeading", heading: "Same product, different words" },
  {
    _type: "noteParagraph",
    text: 'In e-commerce, people search the way they talk. A user types "something light to sit on in a small room". The product is called "Compact folding chair, 3.2 kg". Keyword search finds nothing, because none of the words match.',
  },

  { _type: "noteHeading", heading: "The big picture" },
  {
    _type: "noteParagraph",
    text: "There are two parts. A data pipeline reads the catalog, builds the vectors, writes them as files to cloud storage (S3, GCS, ...), and loads them into a vector database (Vertex AI Vector Search, Pinecone, pgvector, ...). The web app takes the user's query, searches the index, and loads the products from the same database.",
  },
  {
    _type: "noteCode",
    language: "text",
    filename: "flow-overview.txt",
    code: `catalog DB ──► pipeline: text → chunks → embeddings → vector index
                                                        ▲
      query ──► web: LLM plan → router → vector / SQL ───┘ → load rows from DB`,
  },
  // FLOW_IMAGE inserted here by seed script (before Part 1)

  {
    _type: "noteHeading",
    heading: "Part 1: Building the data pipeline",
  },
  {
    _type: "noteParagraph",
    text: "This part runs in the background. It reads the catalog, turns each product into a vector, and keeps the index up to date.",
  },

  { _type: "noteHeading", heading: "Start with the product data" },
  {
    _type: "noteParagraph",
    text: "Here's what a typical product record in an online shop might look like:",
  },
  {
    _type: "noteCode",
    language: "json",
    filename: "product-example.json",
    code: `{
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
}`,
  },
  {
    _type: "noteParagraph",
    text: 'Why not dump the whole record into the vector? A vector answers one question: "which products *mean* something close to what the user typed?" Anything that doesn\'t help with that is noise. So before writing any code, I sorted every field by where it belongs:',
  },
  {
    _type: "noteTable",
    caption: "Where each product field belongs",
    headers: ["Field", "Where it goes", "Why"],
    rows: [
      {
        cells: [
          "name, brand, category_name, description",
          "Text to embed",
          "These are the words people search with.",
        ],
      },
      {
        cells: [
          "color, material, dimensions, max_load_kg",
          "Text to embed",
          'People write "blue metal chair" or "fits a small room", not width <= 60.',
        ],
      },
      {
        cells: [
          "category_id, store_id",
          "Filter (tags)",
          "These are exact yes or no checks, and codes mean nothing to the model.",
        ],
      },
      {
        cells: [
          "price, rating",
          "Filter (numbers)",
          '"Under $50" and "4 stars and up" are ranges, and vectors are bad at ranges.',
        ],
      },
      {
        cells: [
          "in_stock",
          "Check in the database after the search",
          "It changes every day, so you'd have to reindex all the time to keep it right.",
        ],
      },
      {
        cells: [
          "sku",
          "The vector's id",
          "It's how you find the product again in your database.",
        ],
      },
      {
        cells: [
          "cost_price, image_url, product_url, created_at",
          "Leave out",
          "They add nothing to the meaning, and some are private.",
        ],
      },
    ],
  },
  {
    _type: "noteParagraph",
    text: "Your own fields will differ, but the question for each one is the same: would a shopper type this, filter by it, or never think about it?",
  },
  {
    _type: "noteParagraph",
    text: 'Names go in the text and codes go in filters. A category name like "Chairs" helps free-text search. A category code like 03 means nothing to the model.',
  },

  {
    _type: "noteHeading",
    heading: "Step 1: Turn each product into one clean text",
  },
  {
    _type: "noteParagraph",
    text: 'Embedding models read text, so the first job is turning the "text to embed" fields into one piece of text. The easy way is to join them into one long block:',
  },
  {
    _type: "noteCode",
    language: "text",
    code: "Compact folding chair ACME Chairs W45 x D50 x H80 cm Folds flat, fits in small rooms. Strong aluminum frame holds up to 100 kg. Blue Aluminum",
  },
  {
    _type: "noteParagraph",
    text: "This works while the text is short. But an embedding model doesn't read characters, it reads tokens (small pieces of words), and every model has a limit on how many tokens it accepts in one input. When a product's text goes over that limit, you have to split it into smaller pieces, called chunks, and embed each one. So you need to know how long your product text is, and plan for it to grow as descriptions and specs get longer.",
  },
  {
    _type: "noteParagraph",
    text: "Here's what happens when a long block gets cut at a fixed length. To keep it small, pretend the limit is 60 characters:",
  },
  {
    _type: "noteCode",
    language: "text",
    code: `Chunk 1: "Compact folding chair ACME Chairs W45 x D50 x H80 cm Folds f"
Chunk 2: "lat, fits in small rooms. Strong aluminum frame holds up to "
Chunk 3: "100 kg. Blue Aluminum"`,
  },
  {
    _type: "noteParagraph",
    text: "This is where the meaning starts to break:",
  },
  {
    _type: "noteBullets",
    items: [
      '"Folds flat" is split across two chunks, so neither chunk knows the chair folds flat.',
      'Chunk 2 ends with "holds up to" and never says how much.',
      'Chunk 3 says "100 kg" but doesn\'t say what it is or which product it belongs to.',
    ],
  },
  {
    _type: "noteParagraph",
    text: 'Each chunk carries half an idea, so its vector means less, and a search for "folding chair that holds 100 kg" may not match any of them well.',
  },
  {
    _type: "noteParagraph",
    text: "So I built the text in fixed sections instead: a header (name, brand, category name, size), a description, and labeled details like color, material, and max load.",
  },
  {
    _type: "noteCode",
    language: "text",
    code: `Compact folding chair
Brand: ACME
Category: Chairs
Size: W45 x D50 x H80 cm

Folds flat, fits in small rooms. Strong aluminum frame.

Color: Blue
Material: Aluminum
Max load (kg): 100`,
  },
  {
    _type: "noteParagraph",
    text: "Today, most of my products still fit in one chunk. When one grows past the limit, Step 2 cuts it only at a section break, so every chunk is a complete idea, like the full header or a whole block of details. Nothing gets lost in the middle.",
  },
  {
    _type: "noteParagraph",
    text: "The labels help too. Max load (kg): 100 tells the model what a bare number means, even when it ends up in a chunk of its own. Generally, a vector made from focused text is sharper than one made from mixed, noisy text. I didn't measure that myself, but it's why I kept the text short and clean.",
  },

  {
    _type: "noteHeading",
    heading: "Step 2: Split only the long products",
  },
  {
    _type: "noteParagraph",
    text: "Most products are short, so each one gets a single vector. A product is only split when its text goes over about 2,500 characters. Then I cut it along the section breaks from Step 1 into chunks of up to 2,000 characters. I measure in characters because it's simple to check, but the real limit is in tokens, so check your model's token limit and leave room under it.",
  },
  {
    _type: "noteCode",
    language: "python",
    filename: "chunk.py",
    code: `def chunk(sections, min_chars=2500, max_chars=2000):
    full = "\\n\\n".join(sections)
    if len(full) <= min_chars:
        return [full]
    return pack_sections(sections, max_chars)  # split on sections, then lines`,
  },
  {
    _type: "noteParagraph",
    text: "Each chunk gets an id like PRODUCT123#1 or PRODUCT123#2. At search time I remove the #... part and drop duplicates, so a product appears only once.",
  },

  {
    _type: "noteHeading",
    heading: "Step 3: Tell the model what the embedding is for",
  },
  {
    _type: "noteParagraph",
    text: "Many embedding models let you say what an embedding will be used for. This is usually called the task type. The same text gets a slightly different vector depending on the task, tuned for that job.",
  },
  {
    _type: "noteParagraph",
    text: 'Why does that matter for search? A short query and a long product text don\'t look alike. "light chair for small room" and a full product description share almost no words. A task type tells the model one side is a question and the other is the answer it\'s looking for, so the model pulls them closer together.',
  },
  {
    _type: "noteParagraph",
    text: "Common task types fall into two groups:",
  },
  {
    _type: "noteTable",
    caption: "Common embedding task types",
    headers: ["Group", "Task types", "Used for"],
    rows: [
      {
        cells: [
          "Two sides (one for what's stored, one for the question)",
          "document + query",
          "Search, like product search",
        ],
      },
      {
        cells: [
          "Two sides",
          "document + question answering",
          "Finding the text that answers a question",
        ],
      },
      {
        cells: [
          "Two sides",
          "document + fact verification",
          "Finding text that proves or disproves a claim",
        ],
      },
      {
        cells: [
          "Two sides",
          "document + code query",
          "Finding code from a plain-language request",
        ],
      },
      {
        cells: [
          "One side (everything embedded the same way)",
          "classification",
          "Sorting text into fixed labels, like positive or negative reviews",
        ],
      },
      {
        cells: [
          "One side",
          "clustering",
          "Grouping similar texts, like similar products",
        ],
      },
      {
        cells: [
          "One side",
          "semantic similarity",
          "Checking how alike two texts are. This isn't meant for search.",
        ],
      },
    ],
  },
  {
    _type: "noteParagraph",
    text: "Product search is the first case. I embed every product as a document and every user search as a query. Some models take the task type as a setting. Others expect it written at the start of the text, like this:",
  },
  {
    _type: "noteCode",
    language: "text",
    code: `document: "title: none | text: Compact folding chair ..."
query:    "task: search result | query: light chair for small room"`,
  },
  {
    _type: "noteParagraph",
    text: "Exact names vary by model, so check your model's docs. Two rules always apply. Both sides of a search have to use the matching pair, and the index and the query must use the same model and the same number of dimensions. That second rule matters, because I changed the model or the size three times.",
  },

  {
    _type: "noteHeading",
    heading: "Step 4: Change the model only when you have a reason",
  },
  {
    _type: "noteParagraph",
    text: "I changed the embedding model or its size three times. Each version below says what I used and why.",
  },
  {
    _type: "noteParagraph",
    text: "v1: a text-only embedding model, 768 dimensions",
  },
  {
    _type: "noteBullets",
    items: [
      "What: a text-only model at its native 768 dimensions.",
      "Why: the first version only searched product text, so a text-only model was enough.",
    ],
  },
  {
    _type: "noteParagraph",
    text: "v2: a multimodal embedding model, 768 dimensions",
  },
  {
    _type: "noteBullets",
    items: [
      "What: a model that puts text and images into the same vector space, so product photos and product text can share one index. 768 was fine because this model normalizes vectors cut below its full 3,072 dimensions for you.",
      "Why: I wanted search by photo, and a text-only model can't embed an image.",
    ],
  },
  {
    _type: "noteParagraph",
    text: "v3: the same multimodal model, 1,536 dimensions",
  },
  {
    _type: "noteBullets",
    items: [
      "What: the same model at a bigger size. By the time photo search shipped, the search side and the live index both ran at 1,536.",
      "Why: accuracy. At 1,536 dimensions the search results were more accurate than at 768, so I moved up a size. Same model, new size, so it still needed a fresh index and a full re-embed.",
    ],
  },
  {
    _type: "noteParagraph",
    text: "v4: a newer text-only model, 3,072 dimensions",
  },
  {
    _type: "noteBullets",
    items: [
      "What: a text-only model at its full 3,072 dimensions, running in the same region as the index, with a text-only index.",
      "Why: users' search text and uploaded photos had to stay in the same country as the users for privacy and compliance reasons, so the index moved to a region there. The multimodal model was only offered in a few regions, and that wasn't one of them.",
    ],
  },
  {
    _type: "noteParagraph",
    text: "Here's the whole history at a glance:",
  },
  {
    _type: "noteCode",
    language: "text",
    code: `v1  text-only model            768   text only
v2  multimodal model           768   text + image   (photo search)
v3  same multimodal model     1536   text + image   (better accuracy than 768)
v4  newer text-only model     3072   text only      (index moved to a region where v2/v3 isn't offered)`,
  },
  {
    _type: "noteParagraph",
    text: "Every change of model or dimension means a new index and a full re-embed. You can't mix vectors of different models or sizes. One place still defaulted to 1,536 after the move to 3,072. Defaults drift, so set the model and size explicitly on both sides.",
  },

  {
    _type: "noteHeading",
    heading: "Step 5: Store vectors with filter tags",
  },
  {
    _type: "noteParagraph",
    text: "Each entry the pipeline sends to the vector database has four fields:",
  },
  {
    _type: "noteBullets",
    items: [
      "id: the product's SKU (plus #1, #2 for chunks). It's how I find the product in my own database later.",
      "embedding: the vector itself, a list of numbers whose length must match the index (3,072 now).",
      'restricts: tag filters. Each one is a name with a list of allowed values, like category_id: ["03"]. A search can say "only products with these tags".',
      'numeric_restricts: number filters. Each one is a name with one number, like price: 39.90. A search can say "less than", "greater than", or "equal to".',
    ],
  },
  {
    _type: "noteParagraph",
    text: "Here's the folding chair from Part 1 as one entry:",
  },
  {
    _type: "noteCode",
    language: "json",
    filename: "vector-entry.json",
    code: `{
  "id": "FC-1042",
  "embedding": [0.12, -0.34, 0.08, "..."],
  "restricts": [
    { "namespace": "category_id", "allow": ["03"] },
    { "namespace": "store_id", "allow": ["S-07"] }
  ],
  "numeric_restricts": [
    { "namespace": "price", "value_float": 39.90 },
    { "namespace": "rating", "value_float": 4.6 }
  ]
}`,
  },
  {
    _type: "noteParagraph",
    text: "How the entries get in. The pipeline writes one line like this for every product into JSON files. It uploads the files to cloud storage, then asks the vector database to import them.",
  },
  {
    _type: "noteParagraph",
    text: "What I didn't send. The format has a few optional fields, like a short metadata blob for display data. I skipped them because I don't need them. The search only uses the vector database to find matching ids. The name, price, and image come from my own database, which is always up to date.",
  },
  {
    _type: "noteParagraph",
    text: "Names differ between tools. These four field names are one vector database's format. Others use different names for the same ideas. Pinecone, for example, puts all filter values in one metadata object.",
  },
  {
    _type: "noteParagraph",
    text: "Keep fast-changing values out. Only put a value in the index if it rarely changes and has one value per product. Stock changes every day, so it would be out of date between reindexes. I check it in the database after the vector search instead. The same goes for a price that's different at each store. Since there's no single number to store, it stays in the database.",
  },

  { _type: "noteHeading", heading: "Step 6: Keep the index fresh" },
  {
    _type: "noteParagraph",
    text: "Products change, so the index has to keep up. The pipeline can run in two modes:",
  },
  {
    _type: "noteBullets",
    items: [
      "Full: re-embeds every product and replaces the whole index. Use it for the first load, and any time you change the embedding model, its size, or how the product text is built, because old and new vectors can't be mixed.",
      "Ids: only adds, updates, or deletes the products you list. Use it for day-to-day changes, because it's fast and leaves everything else alone.",
    ],
  },
  {
    _type: "noteParagraph",
    text: "And there are three ways to start it:",
  },
  {
    _type: "noteBullets",
    items: [
      "By hand, from a command. For the first load, a full rebuild after a model change, or fixing a few products.",
      "From an API call. So another system, like an admin screen or a product import, can ask for a refresh right after it changes products.",
      "On a schedule. A regular job catches anything the other two missed. It finds products that were never embedded or have changed since their last embedding, and sends only those in ids mode:",
    ],
  },
  {
    _type: "noteCode",
    language: "sql",
    filename: "changed-products.sql",
    code: `SELECT p.sku FROM products p
LEFT JOIN (SELECT product_id, MAX(updated_at) AS embedded_at
           FROM product_embeddings GROUP BY product_id) e
  ON e.product_id = p.id
WHERE p.deleted_at IS NULL
  AND (e.embedded_at IS NULL OR p.updated_at > e.embedded_at);`,
  },
  {
    _type: "noteParagraph",
    text: "A full run also has a safety check. If more than 5% of products fail to embed, it stops before uploading, and the old index stays live. A half-built index never replaces a working one.",
  },

  {
    _type: "noteHeading",
    heading: "Part 2: Building the search client",
  },
  {
    _type: "noteParagraph",
    text: "This part runs when someone searches. It reads the query, picks the right search, and returns real products from the database.",
  },

  {
    _type: "noteHeading",
    heading: "Step 1: Let an LLM read the query",
  },
  {
    _type: "noteParagraph",
    text: "Users mix many things into one search box, like a price, a category, a brand, and a use. I send the query to the LLM and ask for JSON only. The prompt includes the real category list, so the model can only pick codes that exist.",
  },
  {
    _type: "noteCode",
    language: "json",
    filename: "search-plan.json",
    code: `{
  "keyword": "ACME",
  "semantic_text": "light, for small room",
  "restricts": [{ "namespace": "category_id", "allow": ["03"] }],
  "numeric_restricts": [{ "namespace": "price", "op": "LESS_EQUAL", "value_float": 50.0 }]
}`,
  },
  {
    _type: "noteParagraph",
    text: "If the LLM call fails, the search gets no plan instead of an error. I also clear semantic_text when it only repeats the category name, because then it adds noise and no meaning.",
  },

  {
    _type: "noteHeading",
    heading: "Step 2: Route to SQL, vector, or hybrid",
  },
  {
    _type: "noteParagraph",
    text: "The plan from Step 1 decides which kind of search runs. There are three, and each is good at something different:",
  },
  {
    _type: "noteBullets",
    items: [
      "SQL search is a normal database query. It matches exact words and values, like name LIKE '%ACME%' AND price <= 50. It's fast and predictable, and it's the best choice for exact codes, model numbers, and searches that are only filters. But it can't understand meaning. \"Light chair for a small room\" finds nothing unless those exact words are in the product.",
      "Vector search embeds the user's words as a query (Part 1, Step 3) and finds the products whose vectors are closest in meaning. It handles synonyms, full sentences, and descriptions. It returns only ids and scores, so I load the real products from the database by id and keep the vector's order. But on its own, it doesn't know about price ranges or categories.",
      "Hybrid search is vector search plus hard rules. The filters from the plan go into the vector query itself, as the restricts and numeric_restricts from Part 1, Step 5.",
    ],
  },
  {
    _type: "noteParagraph",
    text: "So the difference is this: vector search ranks every product by meaning, and hybrid search ranks by meaning only among the products that pass your filters. They also act differently when nothing matches. If a vector-only search finds nothing, the user sees nothing. If a hybrid search finds nothing, it falls back to a plain SQL query with the same filters, so the user still sees products that fit their price or category.",
  },
  {
    _type: "noteParagraph",
    text: "A small router reads the plan and picks one:",
  },
  {
    _type: "noteCode",
    language: "python",
    filename: "route.py",
    code: `def route(plan):
    if plan.semantic and plan.filters: return "hybrid"
    if plan.semantic:                  return "vector"
    if plan.filters:                   return "sql"
    return "vector"`,
  },

  {
    _type: "noteHeading",
    heading: "Step 3: Search by photo through words",
  },
  {
    _type: "noteParagraph",
    text: "The move to a text-only index broke photo search, and it broke without any error. The fix turns images into words on both sides. The pipeline asks an LLM to describe each product's main photo and adds that to the product text. An uploaded photo gets described with the same prompt and searched as normal text.",
  },
  {
    _type: "noteParagraph",
    text: "That only works if both sides use exactly the same prompt.",
  },

  {
    _type: "noteHeading",
    heading: "Step 4: Measure with a golden set",
  },
  {
    _type: "noteParagraph",
    text: "You can't improve search by gut feeling, so I built a golden set: a fixed list of test queries where I already know the right answers. I wrote 70 of them, 5 each for 14 types, such as exact code, brand, category, typo, synonym, long sentence, and photo. Each query lists the products that should come back, with a relevance score from 0 (wrong) to 3 (perfect match).",
  },
  {
    _type: "noteCode",
    language: "json",
    filename: "golden-example.json",
    code: `{ "id": 6, "query": "light chair that is easy to use indoors", "type": "text",
  "intent": "semantic", "expected": [{ "productId": "FC-1042", "relevance": 3 }] }`,
  },
  {
    _type: "noteParagraph",
    text: "One command runs every query through the real search and scores the top 10 results with four standard metrics:",
  },
  {
    _type: "noteBullets",
    items: [
      "Hit@10: did at least one right product show up in the top 10?",
      "MRR@10 (mean reciprocal rank): how high did the first right product appear? First place scores 1, second scores 1/2, third scores 1/3, and so on.",
      "Recall@10: out of all the right products, how many made it into the top 10?",
      "NDCG@10: are the best matches near the top? It gives more credit for a perfect match ranked first than one ranked tenth.",
    ],
  },
  {
    _type: "noteParagraph",
    text: "The report also lists the five worst queries, so I know exactly where to look next. Because the queries never change, any change to the model, the text builder, or the search settings can be checked against the same test to see whether it actually helped.",
  },

  { _type: "noteHeading", heading: "Lessons learned" },
  {
    _type: "noteBullets",
    items: [
      "A model mismatch fails silently. If the query and index vectors come from different models, the search still returns results. They just make no sense. Now the code throws an error when the query vector has the wrong length, and a \"doctor\" command checks the whole chain.",
      "Check the index search settings as the index grows. To stay fast, the vector index splits products into small groups and, by default, only looks inside a few of them, like checking just a few shelves in a big store. That was fine while the index was small. As it grew, and with strict filters on top, the few groups it checked didn't hold enough matching products, so good results got missed. Telling it to check every group fixed this, and search stayed just as fast.",
      "Don't let one bad product break the pipeline. One reindex lost a handful of products to connection timeouts. I raised the connect timeout, retry connection errors three times, and skip a failed product instead of stopping the run.",
    ],
  },
];

export const aiProductSearchNoteMeta: Omit<SeedNote, "body"> = {
  slug: "ai-product-search-step-by-step",
  title: "How I Built AI Product Search, Step by Step",
  publishedAt: "2026-10-27",
  tags: ["AI", "Backend", "Database"],
  takeaways: aiProductSearchTakeaways,
};
