import type { SeedBodyBlock, SeedNote } from "./notes-seed-data";

/**
 * Faithful to embeddings-explainer-draft.md.
 * Light additions only: internal path to the AI product search note,
 * and two generated diagrams (vector-as-point, product-map).
 */
export const embeddingsExplainerTakeaways = [
  "What: a plain explanation of embeddings, the lists of numbers that let a search understand meaning. I use a tiny 2-number example you can check by hand.",
  "Who: anyone curious how AI search works, including people who don't write code.",
  'Why: keyword search only matches letters and words. A list of numbers can place "fleece jacket" and "something warm for winter" close together, even when they share no words.',
  "When: when users search in their own words, with synonyms, sentences, or typos, instead of exact product names.",
  "How: an embedding model turns every product and every search into a list of numbers. Similar meanings get similar numbers. Search then finds the products whose numbers are closest to the query's numbers.",
];

/** Body without images — seed script inserts the two diagrams. */
export const embeddingsExplainerBodyWithoutImages: SeedBodyBlock[] = [
  {
    _type: "noteParagraph",
    text: 'A customer types "something warm for winter". The product is called "fleece jacket". They share zero words, so keyword search shows nothing.',
  },
  {
    _type: "noteParagraph",
    text: "This post explains how a list of numbers can fix that. It goes with my previous post on building AI product search (/notes/ai-product-search-step-by-step), where I used embeddings without explaining them. Here I explain them from scratch.",
  },

  { _type: "noteHeading", heading: "The problem: words are not meaning" },
  {
    _type: "noteParagraph",
    text: 'A normal search checks letters. Does the product contain the text the user typed? "Warm" and "fleece" are different words, so the answer is no.',
  },
  {
    _type: "noteParagraph",
    text: "But a person knows a fleece jacket is warm. That sounds hard for a computer, because computers are not like humans. They cannot understand words the way we do. They only know numbers. So how can numbers find the meaning in words people write? In the rest of this post, I will show how that works.",
  },

  { _type: "noteHeading", heading: "What is a vector?" },
  {
    _type: "noteParagraph",
    text: 'A vector is a list of numbers. That\'s all. Think of coordinates on a map: (3, 4) means "3 steps east, 4 steps north". Two numbers give you a point on a flat page. Three give you a point in space.',
  },
  // IMAGE: vector-as-point inserted by seed script
  {
    _type: "noteParagraph",
    text: "Now imagine the numbers describe a product instead of a place.",
  },

  { _type: "noteHeading", heading: "A tiny example" },
  {
    _type: "noteParagraph",
    text: "Let's use two numbers: how warm the product is, and how formal it is. Both go from -5 to 5. The numbers below are made up, only for illustration. Real models don't use a scale like this.",
  },
  {
    _type: "noteTable",
    caption: "Toy 2D product vectors (warm, formal)",
    headers: ["Product", "Warm", "Formal"],
    rows: [
      { cells: ["Fleece jacket", "4", "-2"] },
      { cells: ["Wool coat", "5", "3"] },
      { cells: ["Linen shirt", "-3", "2"] },
      { cells: ["Beach shorts", "-4", "-4"] },
    ],
  },
  {
    _type: "noteParagraph",
    text: "Each row is a vector with two numbers. Draw them as points on a page and you get a map:",
  },
  // IMAGE: product-map inserted by seed script
  {
    _type: "noteParagraph",
    text: "Warm things sit on the right. Cool things sit on the left. Similar products land near each other. That's the whole idea of an embedding: a product becomes a point, and meaning becomes position.",
  },
  {
    _type: "noteParagraph",
    text: "Each number is one dimension, so this example lives in a 2-dimensional space: a flat page. Three numbers would make a point in 3D space. A real embedding with 768 or 1,536 numbers is a point in a space with that many dimensions. Nobody can picture that, but the math works the same way: similar things land close together.",
  },
  {
    _type: "noteParagraph",
    text: 'Now the query. "Something warm for winter" is also turned into two numbers. Say it lands at (4, -1). It\'s warm, and not very formal. The nearest product on the map is the fleece jacket. The words never matched, but the positions did.',
  },

  {
    _type: "noteHeading",
    heading: "Real embeddings have thousands of numbers",
  },
  {
    _type: "noteParagraph",
    text: "Two numbers can only describe two things. A real product has a lot more to say: what it is, what it's for, the material, the style, the mood of the words around it. So real embeddings are much longer.",
  },
  {
    _type: "noteParagraph",
    text: "In my previous post I used 768, 1,536, and 3,072 numbers. The number of numbers is called the dimensions. More dimensions give the model more room to separate small differences. That's why I moved up from 768 to 1,536 there.",
  },
  {
    _type: "noteParagraph",
    text: 'Here is the part that surprises people. In my toy example, I gave each number a clear job: the first meant "how warm", the second meant "how formal". Real embeddings do not work like that. The model gives you a long list of numbers, but it does not tell you what each number stands for. Looking at one number alone usually means nothing to a human. What matters is the whole list together: two things are similar when their full lists land near each other, the same way (4, -2) only makes sense as a pair.',
  },
  {
    _type: "noteParagraph",
    text: "So the toy example is a way to see the idea, not a picture of what's inside a real model.",
  },

  { _type: "noteHeading", heading: "Dimensions are not parameters" },
  {
    _type: "noteParagraph",
    text: "You often hear that a chat model (GPT, Claude, ...) has billions of parameters. Those are two different numbers:",
  },
  {
    _type: "noteBullets",
    items: [
      "Parameters are how big the model is: the internal weights it learned during training.",
      "Dimensions are how many numbers an embedding model gives back for each piece of text.",
    ],
  },
  {
    _type: "noteParagraph",
    text: "Embedding providers always publish the dimensions, because your vector database must be set up for that exact size. For example, one model returns 1,536 numbers and a larger one returns 3,072. Chat models have an internal vector size too, but closed ones usually don't publish it, and you never use it directly.",
  },

  { _type: "noteHeading", heading: "Where do the numbers come from?" },
  {
    _type: "noteParagraph",
    text: "From an embedding model (OpenAI text-embedding-3, Gemini embedding, an open-source sentence model, ...). It is a program trained on huge amounts of text.",
  },
  {
    _type: "noteParagraph",
    text: "The core idea behind the training is old and simple. Linguists have said it for decades: you shall know a word by the company it keeps. Words that appear in similar places in sentences tend to mean similar things. \"Cat\" and \"dog\" show up near \"vet\", \"food\", and \"fur\". \"Truck\" doesn't. So during training, the model nudges its numbers until words with similar company get similar numbers.",
  },
  {
    _type: "noteParagraph",
    text: "I'm keeping this simple on purpose. Modern models use more training tricks than this, and the exact details differ from model to model. The idea to remember is: similar meaning in, similar numbers out. Nobody told the model that \"warm\" relates to \"fleece\". It picked that up from how people write.",
  },

  { _type: "noteHeading", heading: 'How do we measure "close"?' },
  {
    _type: "noteParagraph",
    text: 'Once everything is a list of numbers, "similar" becomes a math question: how close are two lists?',
  },
  {
    _type: "noteParagraph",
    text: "The most common answer is cosine similarity. It looks at the direction two vectors point in. Same direction means the same meaning. The score runs from 1 (same direction) through 0 (unrelated) to -1 (opposite).",
  },
  // IMAGE: cosine-close inserted by seed script
  {
    _type: "noteParagraph",
    text: "Here is the toy example, worked out. The query is (4, -1). For each product, I multiply the numbers pairwise, add them up, and divide by the lengths of both vectors:",
  },
  {
    _type: "noteTable",
    caption: "Cosine similarity of query (4, -1) vs each product",
    headers: ["Product", "Calculation", "Score"],
    rows: [
      {
        cells: [
          "Fleece jacket (4, -2)",
          "(4×4 + -1×-2) / (4.12 × 4.47) = 18 / 18.4",
          "0.98",
        ],
      },
      {
        cells: [
          "Wool coat (5, 3)",
          "(4×5 + -1×3) / (4.12 × 5.83) = 17 / 24.0",
          "0.71",
        ],
      },
      {
        cells: [
          "Beach shorts (-4, -4)",
          "(4×-4 + -1×-4) / (4.12 × 5.66) = -12 / 23.3",
          "-0.51",
        ],
      },
      {
        cells: [
          "Linen shirt (-3, 2)",
          "(4×-3 + -1×2) / (4.12 × 3.61) = -14 / 14.9",
          "-0.94",
        ],
      },
    ],
  },
  {
    _type: "noteParagraph",
    text: "The fleece jacket wins with 0.98. The linen shirt points almost the opposite way, so it scores close to -1. Sort by score, take the top few, and you have a search result.",
  },
  {
    _type: "noteParagraph",
    text: "The same math in a few lines of code:",
  },
  {
    _type: "noteCode",
    language: "python",
    filename: "cosine.py",
    code: `import math

def cosine(a, b):
    dot = sum(x * y for x, y in zip(a, b))
    return dot / (math.hypot(*a) * math.hypot(*b))

print(cosine((4, -1), (4, -2)))  # 0.976`,
  },
  {
    _type: "noteParagraph",
    text: "Real vectors work the same way. They just have 1,536 numbers instead of 2. Some models also scale their vectors to the same length, and then a plain dot product gives the same ranking. (I'm describing that for the common case. Check your model's docs.)",
  },

  { _type: "noteHeading", heading: "How this powers search" },
  {
    _type: "noteParagraph",
    text: "Put it together, and this is what happens in my product search:",
  },
  {
    _type: "noteBullets",
    items: [
      "Before any search: the embedding model turns every product's text into a vector. These are stored in a vector database (Pinecone, pgvector, ...).",
      "At search time: the same model turns the user's query into a vector.",
      "Then: the database finds the product vectors nearest to the query vector. Those are the results.",
    ],
  },
  {
    _type: "noteParagraph",
    text: "Two rules from my previous post matter a lot here. First, the products and the query must use the same model and the same number of dimensions. Different models draw different maps. A point from one map means nothing on another. If they don't match, you don't get an error. You just get strange results.",
  },
  {
    _type: "noteParagraph",
    text: 'Second, many models have task types. I mark products as "documents" and searches as "queries", because a short question and a long description don\'t look alike. The task type helps the model place them close together.',
  },

  { _type: "noteHeading", heading: "The limits" },
  {
    _type: "noteParagraph",
    text: "Embeddings are strong, but they are not magic. These are three common limits, not the full list.",
  },
  {
    _type: "noteBullets",
    items: [
      "Close does not mean true. An embedding finds things that are similar, not things that are correct. A product that sounds like what you asked for can still be wrong for you.",
      'Exact things need exact tools. Product codes, model numbers, and "under $50" are not about meaning. Codes and numbers are poor fits for a vector, so I use normal database filters for them.',
      "The model only knows what it learned. It reflects the text it was trained on, including that text's gaps and bias.",
    ],
  },
  {
    _type: "noteParagraph",
    text: "That's why my search mixes both: vectors for meaning, and the database for exact checks.",
  },

  { _type: "noteHeading", heading: "Wrap-up" },
  {
    _type: "noteParagraph",
    text: 'A vector is just a list of numbers. An embedding model places similar meanings at nearby positions. Search then becomes "find the closest points". No single number means "warm". The meaning lives in the whole list, the same way a point on a map only makes sense as a pair of coordinates.',
  },
  {
    _type: "noteParagraph",
    text: "If you want to see how I built a full search on top of this, read my previous post on building AI product search (/notes/ai-product-search-step-by-step).",
  },
];

/** Tomorrow 8:00 AM ICT (UTC+7) = 2026-10-29T01:00:00.000Z */
export const embeddingsExplainerNoteMeta: Omit<SeedNote, "body"> = {
  slug: "how-can-a-list-of-numbers-understand-a-product",
  title: "How Can a List of Numbers Understand a Product?",
  publishedAt: "2026-10-29T01:00:00.000Z",
  tags: ["AI", "Search", "Embeddings"],
  takeaways: embeddingsExplainerTakeaways,
};
