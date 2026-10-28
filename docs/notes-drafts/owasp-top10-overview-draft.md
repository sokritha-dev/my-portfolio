# OWASP Top 10 in 5 Minutes: A Short Overview

**Key takeaways**

- **What:** a short tour of the OWASP Top 10:2025, the list of the ten most critical security risks for web applications. Each risk gets a plain explanation, a tiny example, and the basic fix.
- **Who:** any developer who builds web apps or APIs and wants a map of the main security risks before going deep.
- **Why:** most attacks don't need clever tricks. They use common mistakes, like a missing permission check or a string glued into a query. Knowing the list helps you spot these mistakes early.
- **When:** at the start of a project, before a code review, or any time you wonder "what could go wrong here?"
- **How:** read each risk in about a minute. Then watch for the series: every risk will get its own detailed post, with code, attacks, and fixes.

Change `/orders/123` to `/orders/124` in the address bar. If you see someone else's order, your app has the #1 risk on this list.

## What is OWASP, and what is the Top 10?

OWASP is the Open Worldwide Application Security Project. It is an open, non-profit community that publishes free tools, guides, and standards for application security.

The **OWASP Top 10** is its best-known document. OWASP calls it "a standard awareness document for developers and web application security". It is a broad consensus on the most critical security risks for web applications.

This post covers the **2025 edition**, the latest one on owasp.org. It is the 8th edition of the list. It has two new categories: Software Supply Chain Failures (A03, a wider version of the old "vulnerable and outdated components" risk) and Mishandling of Exceptional Conditions (A10).

Below, I keep each risk short. Think of this post as the map. The later posts are the trip.

One warning: each example below is just one common case. Every risk covers many more.

## A01: Broken Access Control

Access control means users can only do what they are allowed to do. When it breaks, people can see or change things that aren't theirs.

**Example:** an order page loads `/orders/123` and only checks that you are logged in. You change the number to `124` and read another customer's order.

```js
// naive: any logged-in user can read any order
const order = await db.orders.find(req.params.id);

// better: the order must belong to the current user
const order = await db.orders.find(req.params.id, { userId: req.user.id });
```

**This is just one case.** It also covers: admin actions with no permission check, users giving themselves more rights (privilege escalation), guessing URLs to reach pages that aren't linked, and server-side request forgery (SSRF), where an attacker makes your server send requests for them.

**Basic fix:** check permissions on the server, deny by default, and always check that the record belongs to the user.

## A02: Security Misconfiguration

The app is fine, but the setup is not. A system, app, or cloud service is configured in an unsafe way.

**Example:** a cloud storage bucket (S3, GCS, ...) is left public. Or an admin account still uses the default password. Or an error page shows a full stack trace to every visitor.

**This is just one case.** It also covers: unneeded features, ports, or accounts left switched on, missing security headers, and unsafe default settings in frameworks, servers, or databases.

**Basic fix:** use a repeatable, automated setup. Turn off what you don't need, change defaults, and review permissions often.

## A03: Software Supply Chain Failures

Your app is built from code you didn't write: libraries, build tools, and updates. If one of them is compromised, your app is too.

**Example:** a small package that your app depends on, directly or through another package, ships a malicious update. You install it with the next `npm install` and now the bad code runs in your app.

**This is just one case.** It also covers: out-of-date or unsupported libraries and servers, a build pipeline (CI/CD) that is less protected than the app it builds, and no review step, so one person can push code to production alone.

**Basic fix:** know what you depend on, remove what you don't use, only take packages from trusted sources, and watch for known vulnerabilities in them.

## A04: Cryptographic Failures

This is about missing or weak encryption. It covers data in transit, data at rest, and the keys that protect them.

**Example:** a site sends login forms over plain HTTP, so anyone on the same network can read the password. Or an app stores passwords with a fast, unsalted hash, so a leaked database is easy to crack.

**This is just one case.** It also covers: old or weak algorithms (like MD5 or SHA1), encryption keys saved in a code repository, and random numbers that are too predictable.

**Basic fix:** encrypt data in transit with TLS, encrypt sensitive data at rest, and hash passwords with a slow, salted function (Argon2, scrypt, PBKDF2, ...). Don't store sensitive data you don't need.

## A05: Injection

An injection happens when untrusted user input is sent to an interpreter (a database, a browser, the command line) and the interpreter runs it as a command.

**Example:** the app builds a query by gluing the user's input into a string. The user types a bit of SQL instead of a name, and the database runs it.

```js
// naive: input becomes part of the query
db.query("SELECT * FROM users WHERE name = '" + name + "'");

// better: input stays data
db.query("SELECT * FROM users WHERE name = ?", [name]);
```

**This is just one case.** It also covers: other interpreters, such as NoSQL, OS command, and LDAP injection, and cross-site scripting (XSS), where hostile input runs in a visitor's browser.

**Basic fix:** keep data separate from commands. Use parameterized queries and safe APIs, and validate input on the server.

## A06: Insecure Design

Some problems are not coding bugs. The feature was designed without a needed protection. OWASP is clear on this point: a perfect implementation can't fix a design that never had the control.

**Example:** a password reset feature lets anyone try unlimited guesses at a 4-digit code. The code can be perfectly written, but the design never limited the attempts.

**This is just one case.** It also covers: a password recovery flow built on "secret questions", a business rule that can be abused at scale (like booking hundreds of seats in a few requests), and no protection against bots that buy out limited items.

**Basic fix:** think about abuse before you build. Use threat modeling, reuse proven design patterns, and write tests for misuse cases, not just normal use.

## A07: Authentication Failures

The system can be tricked into treating the wrong person as a real user.

**Example:** a login form allows unlimited attempts. An attacker runs a list of leaked usernames and passwords against it (this is called credential stuffing), and some of them work.

**This is just one case.** It also covers: password spraying (trying small variations of leaked passwords), weak or missing multi-factor authentication, and sessions that stay valid after logout.

**Basic fix:** use multi-factor authentication where you can, block automated attempts, never ship default passwords, reject weak or breached passwords, and give the same error message for every login failure.

## A08: Software or Data Integrity Failures

The app trusts code or data without checking that it is real and unchanged.

**Example:** a page loads a script from a third-party server (a CDN, ...). If that server is hacked, the attacker's script runs on your page. Or a build pipeline pulls an artifact and uses it without checking where it came from.

**This is just one case.** It also covers: a build pipeline that pulls code without checking a signature, auto-updates that install without an integrity check, and insecure deserialization, where an attacker edits data your app trusts.

**Basic fix:** verify what you trust. Use signatures and integrity checks, take code only from trusted sources, and review changes to code and pipeline settings.

## A09: Security Logging & Alerting Failures

If you don't log and watch what happens, you can't see an attack. If nobody gets an alert, you can't react to it.

**Example:** an attacker tries thousands of passwords on a login form. The app only logs successful logins, so nobody sees the failed attempts at all.

**This is just one case.** It also covers: logs that nobody monitors, logs that can be tampered with, and alerts that are too noisy, so the real ones get missed.

**Basic fix:** log logins, failed logins, and permission failures with enough context. Protect the logs from tampering, and set up alerts that someone really reads.

## A10: Mishandling of Exceptional Conditions

Apps meet unusual situations: bad input, a timeout, a missing value, a full disk. If the app doesn't handle them well, it can crash, act in strange ways, or leave a hole open.

**Example:** a payment step fails halfway because of a network error. The code ignores the error and marks the order as paid anyway. This is called "failing open".

```js
// naive: ignore the error and move on
try { await charge(order); } catch (e) {}
order.status = "paid";

// better: fail closed
try {
  await charge(order);
  order.status = "paid";
} catch (e) {
  await rollback(order);
  throw e;
}
```

**This is just one case.** It also covers: errors that reveal sensitive details, missing or late error handling, race conditions, and crashes caused by problems like running out of memory or a network failure.

**Basic fix:** expect things to go wrong. Handle errors where they happen, roll back half-finished work, fail closed, and add limits like rate limits and quotas.

## This is a series

This post is only the overview. One minute per risk is enough to know what each one is, but not enough to fix it well.

Next, each risk will get its own post, one by one, in this order. Each post will show the naive code, how an attacker breaks it, and how to fix it. I'll start with A01: Broken Access Control.

The full official list is on [owasp.org/Top10](https://owasp.org/Top10/).
