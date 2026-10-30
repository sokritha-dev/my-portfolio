import type { SeedBodyBlock, SeedNote } from "./notes-seed-data";

/**
 * Faithful to a01-broken-access-control-draft.md.
 * Light addition: internal path to the OWASP overview note.
 */
export const a01BrokenAccessControlTakeaways = [
  "What: a deep dive into A01, the #1 risk in the OWASP Top 10:2025. It shows six common ways access control breaks, each with a naive snippet, an attack, and a fix.",
  "Who: any developer who builds a web app or API with logins or user data.",
  "Why: login is not enough. If the server doesn't check what each user may do, anyone can read or change things that aren't theirs.",
  "When: every time you write or review an endpoint that reads, changes, or deletes data.",
  "How: check on the server, on every request, who owns the thing and what the user may do with it. Deny by default. Test with two users.",
];

export const a01BrokenAccessControlBody: SeedBodyBlock[] = [
  {
    _type: "noteParagraph",
    text: "Open your own order page, change /orders/123 to /orders/124, and press Enter. If you see someone else's order, read on.",
  },

  { _type: "noteHeading", heading: "Intro" },
  {
    _type: "noteParagraph",
    text: "This is the first detailed post in my series on the OWASP Top 10. In my OWASP Top 10 overview (/notes/owasp-top10-overview), I gave each risk one minute. Now I take them one by one. We start at the top of the list: A01:2025 Broken Access Control.",
  },
  {
    _type: "noteParagraph",
    text: 'OWASP says it "maintains its position at #1" in the 2025 edition. Its page also says that 100% of the applications tested had some form of broken access control.',
  },
  {
    _type: "noteParagraph",
    text: "The examples below are common cases, not the full list. OWASP maps 40 weakness types to this risk.",
  },

  { _type: "noteHeading", heading: "The big picture" },
  {
    _type: "noteParagraph",
    text: "Two words are easy to mix up:",
  },
  {
    _type: "noteBullets",
    items: [
      "Authentication answers: who are you? (login, password, token)",
      "Authorization answers: what are you allowed to do?",
    ],
  },
  {
    _type: "noteParagraph",
    text: 'Access control is the rule set that says "user A can read user A\'s orders, and only an admin can delete users." OWASP describes it as making sure "users cannot act outside of their intended permissions."',
  },
  {
    _type: "noteParagraph",
    text: "It breaks in three simple ways:",
  },
  {
    _type: "noteBullets",
    items: [
      'The check is missing. The developer built the endpoint and forgot to ask "may this user do this?"',
      "The check is only in the UI. The button is hidden, but the API behind it is open.",
      "The server trusts the client. It believes an id, a role, or a flag that the browser sent.",
    ],
  },
  {
    _type: "noteParagraph",
    text: "Remember one rule: the attacker controls everything the browser sends. Hidden fields, headers, ids, JSON bodies.",
  },
  {
    _type: "noteParagraph",
    text: "In the snippets below, I use a small Express-style handler. req.user is the logged-in user, set by a login middleware (so authentication is already done). db is any database layer.",
  },

  {
    _type: "noteHeading",
    heading: "Form 1: Insecure direct object reference (IDOR)",
  },
  {
    _type: "noteParagraph",
    text: "An IDOR happens when the app uses an id from the request to load a record, and never asks if the record belongs to the user. OWASP's cheat sheet lists three ingredients: an object, a reference to it (an id, a filename, a token), and a missing object-level check.",
  },
  {
    _type: "noteParagraph",
    text: "Naive code:",
  },
  {
    _type: "noteCode",
    language: "javascript",
    filename: "orders-naive.js",
    code: `app.get("/orders/:id", requireLogin, async (req, res) => {
  const order = await db.orders.findById(req.params.id);
  res.json(order);
});`,
  },
  {
    _type: "noteParagraph",
    text: "The attack: I log in as user A and open my order /orders/123. Then I try /orders/124, /orders/125, and so on. Each one returns another customer's order.",
  },
  {
    _type: "noteParagraph",
    text: "Fixed code:",
  },
  {
    _type: "noteCode",
    language: "javascript",
    filename: "orders-fixed.js",
    code: `app.get("/orders/:id", requireLogin, async (req, res) => {
  const order = await db.orders.findOne({
    id: req.params.id,
    userId: req.user.id, // look only inside this user's own orders
  });
  if (!order) return res.status(404).end();
  res.json(order);
});`,
  },
  {
    _type: "noteParagraph",
    text: "Now the lookup only searches the user's own data. Another user's order simply isn't found.",
  },
  {
    _type: "noteParagraph",
    text: "Random ids (UUIDs) make guessing harder, but OWASP calls that only extra defense.",
  },

  {
    _type: "noteHeading",
    heading: "Form 2: Missing checks on admin and write actions",
  },
  {
    _type: "noteParagraph",
    text: 'Many apps protect the page but forget the API. The admin screen hides the "Delete user" button from normal users. But the endpoint behind it only checks that you are logged in. OWASP lists this directly: an API with missing access controls for POST, PUT, and DELETE.',
  },
  {
    _type: "noteParagraph",
    text: "Naive code:",
  },
  {
    _type: "noteCode",
    language: "javascript",
    filename: "users-delete-naive.js",
    code: `// the "Delete" button is only shown to admins in the UI
app.delete("/users/:id", requireLogin, async (req, res) => {
  await db.users.delete(req.params.id);
  res.status(204).end();
});`,
  },
  {
    _type: "noteParagraph",
    text: "The attack: I'm a normal user. I don't see the button, but I don't need it. I just use curl:",
  },
  {
    _type: "noteCode",
    language: "bash",
    filename: "attack.sh",
    code: `curl -X DELETE https://example.com/users/42 -H "Authorization: Bearer <my normal token>"`,
  },
  {
    _type: "noteParagraph",
    text: "The server deletes user 42.",
  },
  {
    _type: "noteParagraph",
    text: "Fixed code:",
  },
  {
    _type: "noteCode",
    language: "javascript",
    filename: "users-delete-fixed.js",
    code: `app.delete("/users/:id", requireLogin, requireRole("admin"), async (req, res) => {
  await db.users.delete(req.params.id);
  res.status(204).end();
});`,
  },
  {
    _type: "noteParagraph",
    text: "The check lives on the server, next to the action.",
  },

  {
    _type: "noteHeading",
    heading: "Form 3: Privilege escalation through mass assignment",
  },
  {
    _type: "noteParagraph",
    text: "Privilege escalation means a user gets more rights than they should. One easy way is mass assignment. A framework copies every field from the request body into the record. If the record has a role field, the user can set it.",
  },
  {
    _type: "noteParagraph",
    text: "Naive code:",
  },
  {
    _type: "noteCode",
    language: "javascript",
    filename: "profile-naive.js",
    code: `app.put("/profile", requireLogin, async (req, res) => {
  // copies everything the client sent
  await db.users.update(req.user.id, req.body);
  res.json({ ok: true });
});`,
  },
  {
    _type: "noteParagraph",
    text: 'The attack: the profile form sends { "name": "Sok" }. I send this instead:',
  },
  {
    _type: "noteCode",
    language: "json",
    filename: "attack.json",
    code: `{ "name": "Sok", "role": "admin" }`,
  },
  {
    _type: "noteParagraph",
    text: "The server saves it. I am now an admin.",
  },
  {
    _type: "noteParagraph",
    text: "OWASP's mass assignment cheat sheet shows the same thing with isAdmin=true. The attacker only needs to guess a field name.",
  },
  {
    _type: "noteParagraph",
    text: "Fixed code:",
  },
  {
    _type: "noteCode",
    language: "javascript",
    filename: "profile-fixed.js",
    code: `app.put("/profile", requireLogin, async (req, res) => {
  const { name, email } = req.body; // allow only these fields
  await db.users.update(req.user.id, { name, email });
  res.json({ ok: true });
});`,
  },
  {
    _type: "noteParagraph",
    text: 'Use an allow-list of fields. A block-list ("don\'t allow role") fails the day someone adds a new sensitive field.',
  },

  {
    _type: "noteHeading",
    heading: "Form 4: Forced browsing to unlinked pages",
  },
  {
    _type: "noteParagraph",
    text: "Forced browsing means guessing URLs. The page isn't linked anywhere, so the developer assumes nobody will find it. But URLs are easy to guess: /admin, /backup, /admin_getappInfo.",
  },
  {
    _type: "noteParagraph",
    text: "OWASP's scenario #2 says: if an unauthenticated user can open the page, it's a flaw. If a normal user can open the admin page, it's a flaw.",
  },
  {
    _type: "noteParagraph",
    text: "Naive code:",
  },
  {
    _type: "noteCode",
    language: "javascript",
    filename: "admin-reports-naive.js",
    code: `// no link points here, so "nobody will find it"
app.get("/admin/reports", async (req, res) => {
  res.json(await db.reports.all());
});`,
  },
  {
    _type: "noteParagraph",
    text: "The attack: I type /admin/reports into the address bar. It works, even though I'm not logged in.",
  },
  {
    _type: "noteParagraph",
    text: "Fixed code:",
  },
  {
    _type: "noteCode",
    language: "javascript",
    filename: "admin-reports-fixed.js",
    code: `app.get("/admin/reports", requireLogin, requireRole("admin"), async (req, res) => {
  res.json(await db.reports.all());
});`,
  },
  {
    _type: "noteParagraph",
    text: "Hiding a URL is not access control. The same goes for files. OWASP says to turn off directory listing and keep .git folders and backup files out of the web root.",
  },

  { _type: "noteHeading", heading: "Form 5: CORS misconfiguration" },
  {
    _type: "noteParagraph",
    text: 'CORS (cross-origin resource sharing) is a browser feature. It lets a server say which other websites may call its API from a browser. OWASP lists "CORS misconfiguration allows API access from unauthorized or untrusted origins" as one form of broken access control.',
  },
  {
    _type: "noteParagraph",
    text: 'The usual mistake is making it too loose, so "everything just works."',
  },
  {
    _type: "noteParagraph",
    text: "Naive code:",
  },
  {
    _type: "noteCode",
    language: "javascript",
    filename: "cors-naive.js",
    code: `app.use((req, res, next) => {
  // trust whatever site is asking
  res.set("Access-Control-Allow-Origin", req.headers.origin);
  res.set("Access-Control-Allow-Credentials", "true");
  next();
});`,
  },
  {
    _type: "noteParagraph",
    text: "The attack, step by step:",
  },
  {
    _type: "noteBullets",
    items: [
      "The setup. A user is logged in to your app at app.example.com, so their browser holds a login cookie for it.",
      "The trap. In another tab, they visit my page at evil.example. My page runs a script that quietly asks app.example.com/api/orders for data.",
      "Cookies go along. The browser automatically attaches the user's cookie. To your server, the request looks like it came from that logged-in user.",
      "The browser's guard. Normally the browser won't let a script from evil.example read a reply from app.example.com. This is the same-origin policy. CORS is how a server says \"this other site may read my replies.\"",
      'The mistake. The naive code copies whatever origin the request names straight back as "allowed", with cookies too. So the server answers "evil.example is allowed."',
      "The result. The browser hands the reply to my script. Now I have the user's private orders.",
    ],
  },
  {
    _type: "noteParagraph",
    text: "PortSwigger's CORS guide calls this exact pattern exploitable.",
  },
  {
    _type: "noteParagraph",
    text: "Fixed code:",
  },
  {
    _type: "noteCode",
    language: "javascript",
    filename: "cors-fixed.js",
    code: `const ALLOWED = new Set(["https://app.example.com"]);

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (ALLOWED.has(origin)) {
    res.set("Access-Control-Allow-Origin", origin);
    res.set("Access-Control-Allow-Credentials", "true");
  }
  next();
});`,
  },
  {
    _type: "noteParagraph",
    text: "Allow only sites you trust, from a fixed list. Don't allow null. CORS only controls browsers. It never replaces server-side checks.",
  },

  {
    _type: "noteHeading",
    heading: "Form 6: Server-side request forgery (SSRF)",
  },
  {
    _type: "noteParagraph",
    text: "SSRF used to be its own item on the list. In 2025, OWASP folded it into A01. The idea: the attacker can't reach an internal system, but your server can. So they trick your server into making the request for them.",
  },
  {
    _type: "noteParagraph",
    text: "A common place is a link preview. A user pastes a link in a chat or post box. Your server fetches the page and shows its title and image. The user decides which address your server calls.",
  },
  {
    _type: "noteParagraph",
    text: "Naive code:",
  },
  {
    _type: "noteCode",
    language: "javascript",
    filename: "preview-naive.js",
    code: `app.post("/preview", requireLogin, async (req, res) => {
  const page = await fetch(req.body.url); // any URL the user pastes
  const html = await page.text();
  res.json({ title: getTitle(html), image: getImage(html) });
});`,
  },
  {
    _type: "noteParagraph",
    text: "The attack, step by step:",
  },
  {
    _type: "noteBullets",
    items: [
      "The setup. Your app runs in a private network. Some services there, like an admin panel or the cloud metadata service, can't be reached from the internet.",
      "The paste. I paste http://localhost:8080/admin or http://169.254.169.254/ as my \"link\". OWASP's cheat sheet lists the second one as a cloud metadata address.",
      "The fetch. Your server calls it. The request starts inside your network, so your network trusts it.",
      'The result. The internal service answers, and your app puts part of the answer into the "preview" for me. OWASP says SSRF "is often used to access and steal credentials and access tokens from metadata services."',
    ],
  },
  {
    _type: "noteParagraph",
    text: 'Webhooks, "import from URL", and PDF or screenshot generators have the same risk.',
  },
  {
    _type: "noteParagraph",
    text: "Real case: Capital One, 2019. US court papers say the attacker used a misconfigured web application firewall to send commands to Capital One's cloud servers. Those commands returned security credentials, which were used to copy data from storage. The US Department of Justice says more than 100 million people were affected. Amazon (AWS) said it believes SSRF was used, but that the main causes were the firewall mistake and permissions broader than intended. Security researchers say the credentials came from the cloud metadata service. So SSRF was one step, and nothing else stopped it.",
  },
  {
    _type: "noteParagraph",
    text: "Fixed code (simplified):",
  },
  {
    _type: "noteCode",
    language: "javascript",
    filename: "preview-fixed.js",
    code: `app.post("/preview", requireLogin, async (req, res) => {
  const url = new URL(req.body.url);
  if (url.protocol !== "https:") {
    return res.status(400).json({ error: "URL not allowed" });
  }
  // refuse private, localhost, and link-local addresses
  const { address } = await dns.lookup(url.hostname);
  if (!isPublicIp(address)) {
    return res.status(400).json({ error: "URL not allowed" });
  }
  const page = await fetch(url, {
    redirect: "error",                 // don't follow redirects
    signal: AbortSignal.timeout(3000), // don't wait forever
  });
  const html = (await page.text()).slice(0, 200_000); // cap the size
  res.json({ title: getTitle(html), image: getImage(html) }); // nothing else
});`,
  },
  {
    _type: "noteParagraph",
    text: "A link preview must accept any public site, so a host allow-list won't fit. OWASP says to check that the address is public, and to turn off redirects. If you know your hosts, use an allow-list instead.",
  },
  {
    _type: "noteParagraph",
    text: "This is still simplified. A second DNS lookup can give a different answer, and block-lists are easy to bypass. So a real fix needs more layers: network rules that stop your server from reaching internal services, and on AWS, IMDSv2 (a safer metadata service), which OWASP says helps against some SSRF.",
  },

  { _type: "noteHeading", heading: "These are only some of the cases" },
  {
    _type: "noteParagraph",
    text: "Six forms are not the whole risk. OWASP also lists:",
  },
  {
    _type: "noteBullets",
    items: [
      "tampering with or replaying a login token (JWT), or a cookie or hidden field that raises your rights,",
      "acting as a user without being logged in at all,",
      "cross-site request forgery (CSRF),",
      "path traversal, where ../ in a filename reaches files outside the allowed folder.",
    ],
  },
  {
    _type: "noteParagraph",
    text: "The pattern is the same: the server did not check, or trusted the client. I'll cover these in a follow-up post: A01, part 2.",
  },

  { _type: "noteHeading", heading: "How to prevent it" },
  {
    _type: "noteParagraph",
    text: "This list comes from OWASP's A01 prevention guidance and its Authorization Cheat Sheet.",
  },
  {
    _type: "noteBullets",
    items: [
      "Check on the server. Only trusted server-side code can enforce access control. UI checks are for looks.",
      'Deny by default. Except for public resources, the answer is "no" until a rule says "yes."',
      "Check on every request. Include API calls and background jobs. The attacker only needs the one you forgot.",
      'Check ownership, not just login. Model your data so a lookup is always "this record, for this user."',
      "Use one central helper. A middleware or policy layer is easier to review than checks scattered in every handler.",
      "Don't trust client data. Treat ids, roles, flags, and hidden fields as untrusted. Take the user from the session, and allow only the fields you expect.",
      "Keep tokens short-lived. Invalidate sessions at logout on the server.",
      "Rate limit. It slows down tools that loop through ids.",
      "Log failures. Record access control failures and alert on repeated ones.",
      "Test it. OWASP says to put access control into unit and integration tests.",
    ],
  },

  { _type: "noteHeading", heading: "How to test your own app" },
  {
    _type: "noteParagraph",
    text: "Try each one with a normal test account, not your admin account.",
  },
  {
    _type: "noteBullets",
    items: [
      "Create user A and user B, each with their own orders, files, or tickets.",
      "Log in as A. Request B's records by changing ids in URLs, query strings, and request bodies. Try read, update, delete, and export.",
      "As a normal user, call admin endpoints directly with curl or your browser's dev tools. Try GET, POST, PUT, and DELETE.",
      "Add extra fields like role or isAdmin to update requests. Check if they save.",
      "Type guessable URLs like /admin, /backup, /.git/config. Check what comes back.",
      "Look at your CORS headers. Is the origin a fixed list, or does it echo anything back?",
      "If any feature fetches a URL for the user (link previews, webhooks, import from URL), try an internal address like http://localhost.",
      "Turn these checks into automated tests, so they run on every change.",
    ],
  },

  { _type: "noteHeading", heading: "Wrap-up" },
  {
    _type: "noteParagraph",
    text: "Broken access control is a family of mistakes with one root: the app didn't check who may do what, on the server, on every request. The fixes: check ownership, deny by default, allow only expected fields, and keep the rules in one place.",
  },
  {
    _type: "noteParagraph",
    text: "The next post in the series is A02: Security Misconfiguration. It is about safe setup: default passwords, open cloud storage, noisy error pages, and missing headers. Thanks for reading.",
  },
];

export const a01BrokenAccessControlNoteMeta: Omit<SeedNote, "body"> = {
  slug: "a01-broken-access-control-explained-with-code",
  title: "A01: Broken Access Control, Explained with Code",
  publishedAt: "2026-10-30T02:00:00.000Z",
  tags: ["Security", "Backend", "Full Stack"],
  series: {
    title: "OWASP Top 10",
    slug: "owasp-top-10",
    part: 2,
  },
  takeaways: a01BrokenAccessControlTakeaways,
};
