import type { SeedBodyBlock, SeedNote } from "./notes-seed-data";

/**
 * Faithful to what-is-an-llm-draft.md.
 * Light addition: series hook for upcoming tokens / hallucination posts.
 */
export const whatIsAnLlmTakeaways = [
  "What: an LLM is a computer program that writes text by guessing the next word, again and again.",
  'Who: anyone who has used a chatbot and wondered, "How does this work?" No tech background needed.',
  "Why: when you know what an LLM really does, you can use it better and trust it the right amount.",
  "When: any time you ask a chatbot to write, explain, summarize, or translate something.",
  "How: it reads a huge amount of text, learns which words usually follow which, and uses that to build an answer one word at a time.",
];

/** Body without images — seed script inserts the next-word chart. */
export const whatIsAnLlmBodyWithoutImages: SeedBodyBlock[] = [
  {
    _type: "noteParagraph",
    text: "You already use a tiny version of it every day: the next-word suggestion on your phone keyboard.",
  },

  { _type: "noteHeading", heading: "What the letters mean" },
  {
    _type: "noteParagraph",
    text: "LLM stands for Large Language Model. Let's take the words one by one.",
  },
  {
    _type: "noteBullets",
    items: [
      "Language: it works with human language, like English, French, or Spanish.",
      "Model: a model is a program that has learned patterns from examples. It is not a person and not a robot. It is software.",
      "Large: it learned from a very large amount of text, and it is a very big program.",
    ],
  },
  {
    _type: "noteParagraph",
    text: "You have probably used one. ChatGPT, Claude, and Gemini are all chatbots powered by an LLM.",
  },

  { _type: "noteHeading", heading: "Start with your phone keyboard" },
  {
    _type: "noteParagraph",
    text: 'Open a message and type "Good". Your phone shows suggestions like "morning", "night", or "luck". You didn\'t teach it that. It learned that these words often come after "good".',
  },
  {
    _type: "noteParagraph",
    text: 'Now type "See you". It might suggest "later" or "soon".',
  },
  {
    _type: "noteParagraph",
    text: "Your keyboard is guessing the next word. It looks at what you typed and picks the words that most often come next.",
  },
  {
    _type: "noteParagraph",
    text: "An LLM does the same thing. The difference is the size.",
  },

  { _type: "noteHeading", heading: "The same idea, but much bigger" },
  {
    _type: "noteParagraph",
    text: "Your keyboard mostly looks at the last word or two. An LLM looks at your whole question and everything written so far in the chat. So its guesses are much smarter.",
  },
  {
    _type: "noteParagraph",
    text: 'Here is a sentence with the last word missing: "The cat sat on the …"',
  },
  {
    _type: "noteParagraph",
    text: 'You can guess it. "Mat" is the most likely one. "Floor" and "sofa" also make sense. "Moon" would be strange.',
  },
  {
    _type: "noteParagraph",
    text: "An LLM does this kind of guessing too. It gives each possible next word a score for how likely it is:",
  },
  // IMAGE: next-word-guess inserted by seed script
  {
    _type: "noteParagraph",
    text: "The numbers above are made up, only to show the idea. Real LLMs do not show you a chart like this. They just pick one of the likely words and move on.",
  },
  {
    _type: "noteParagraph",
    text: "Then it does it again. It adds that word to the sentence and guesses the next one. And again. Word after word, it builds a full answer.",
  },
  {
    _type: "noteParagraph",
    text: "That's it. When you ask a chatbot a question, it writes the answer one small piece at a time. (Sometimes the piece is a whole word, sometimes just part of a word. I'll explain that in a later post.)",
  },

  { _type: "noteHeading", heading: "How does it learn?" },
  {
    _type: "noteParagraph",
    text: "Imagine a person who has read a giant library. Books, websites, articles, and conversations. After reading so much, that person starts to notice how language works. Which words go together. How a polite email sounds. How a recipe is written. How a story usually ends.",
  },
  {
    _type: "noteParagraph",
    text: "An LLM learns in a similar way. It reads a very large amount of text. As it reads, it practices a simple game: cover the next word and try to guess it. Each time it guesses wrong, it adjusts itself a little. After doing this an enormous number of times, it gets very good at it.",
  },
  {
    _type: "noteParagraph",
    text: "Nobody sits down and types in the rules of grammar or the facts of the world. The LLM picks up patterns from the text on its own.",
  },

  { _type: "noteHeading", heading: "Is it like a baby growing up?" },
  {
    _type: "noteParagraph",
    text: "In some ways, yes. A new model starts out knowing nothing. Then it learns language by taking in huge amounts of text, a bit like a baby who learns to talk by hearing people around them for years.",
  },
  {
    _type: "noteParagraph",
    text: "But there is one big difference. A baby keeps learning every day. An LLM stops learning when its training ends.",
  },
  {
    _type: "noteParagraph",
    text: "When you chat with an LLM, it does not grow from your conversation the way a child would. Some chatbots can save notes about you for later chats, but the model itself is not learning. Its knowledge is frozen at the end of training.",
  },
  {
    _type: "noteParagraph",
    text: "So a better picture is a student who studied for many years, and then their knowledge was frozen on graduation day. The student can still use everything they learned. They just can't learn anything new on their own.",
  },
  {
    _type: "noteParagraph",
    text: 'The LLM only "grows up" when the company trains a new version. That is why you see names like version 4, version 5, and so on. Each one is a new student who studied more.',
  },

  { _type: "noteHeading", heading: "What is an LLM good at?" },
  {
    _type: "noteParagraph",
    text: "Because it is so good at language, it can help with many everyday jobs:",
  },
  {
    _type: "noteBullets",
    items: [
      "Writing: a first draft of an email, a message, or a short story.",
      "Summarizing: turning a long article into a few lines.",
      "Translating: moving text from one language to another.",
      "Explaining: answering a question in simple words, or the same answer again in simpler words.",
      "Brainstorming: giving you ten name ideas for your shop.",
    ],
  },
  {
    _type: "noteParagraph",
    text: "In all of these, the work is about language. That is where an LLM is strongest.",
  },

  { _type: "noteHeading", heading: "What does it get wrong?" },
  {
    _type: "noteParagraph",
    text: "This part matters. An LLM is a great helper, but it is not perfect.",
  },
  {
    _type: "noteParagraph",
    text: 'It can sound sure and still be wrong. Remember, it picks words that sound likely. It does not check whether the sentence is true. Sometimes the likely-sounding answer is a false one. This is called a hallucination. It means the AI gives an answer that sounds real but is false, like a made-up fact, a fake quote, or a book that does not exist. It is not lying on purpose. It just does not know the answer is wrong.',
  },
  {
    _type: "noteParagraph",
    text: 'It doesn\'t "know" things like a person. You know your own birthday because you lived it. An LLM only knows patterns from text. It has no life and no experiences behind its words.',
  },
  {
    _type: "noteParagraph",
    text: "It may not know recent news. Remember the student frozen on graduation day? It learned from text collected up to some point in time. Things that happened after that, it may not know. Some chatbots can search the web to help with this, but not all of them do.",
  },

  { _type: "noteHeading", heading: "A simple tip" },
  {
    _type: "noteParagraph",
    text: "Double-check anything important. If the answer is about health, money, law, or a fact you will share with other people, look it up in a trusted source too. For a birthday message or a list of ideas, you can relax.",
  },
  {
    _type: "noteParagraph",
    text: "A good way to think about it: an LLM is like a very fast, very well-read helper who sometimes speaks with too much confidence. Use it for a first draft, then check it yourself.",
  },

  { _type: "noteHeading", heading: "Wrap-up" },
  {
    _type: "noteBullets",
    items: [
      "An LLM is a program that learned from a huge amount of text.",
      "It writes by guessing the next word, again and again, like your phone keyboard but much bigger.",
      "It is great with language, and it can still be wrong, so check the important things.",
    ],
  },
  {
    _type: "noteParagraph",
    text: "I'll write more beginner posts on this topic. Two ideas I plan to cover next are tokens, which are the small pieces an LLM reads and writes, and why AI hallucinates, in more detail.",
  },
];

/** Live now — 2026-10-31 09:50 AM ICT (UTC+7). */
export const whatIsAnLlmNoteMeta: Omit<SeedNote, "body"> = {
  slug: "what-is-an-llm",
  title: "What Is an LLM? A Simple Guide for Beginners",
  publishedAt: "2026-10-31T02:50:00.000Z",
  tags: ["AI", "LLM", "Beginners"],
  series: {
    title: "LLM Basics",
    slug: "llm-basics",
    part: 1,
  },
  takeaways: whatIsAnLlmTakeaways,
};
