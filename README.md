# SECrillion

The [Student Engineers' Council](https://home.sec.tamu.edu/) daily dive: 7 prompts, 25 seconds each, and rarer answers sink deeper. Inspired by [Krillion](https://krillion.io).

The front end is plain HTML, CSS and JS with no build step. Vercel serverless functions in `/api` pool answers and scores in Neon Postgres.

## Deploy (Vercel + Neon)

1. Import the repo into Vercel. No framework preset or build command is needed.
2. In the project's **Storage** tab, add a **Neon** Postgres database. That sets `DATABASE_URL` for you.
3. Deploy. The API creates its tables (`db/schema.sql`) on the first request, so a fresh Neon database needs no manual setup. To create them ahead of time instead:
   ```sh
   npm install
   vercel env pull .env.local
   npm run migrate
   ```

## Run locally

- `npm run dev` (`vercel dev`) gives you the full game with the live database.
- `python3 -m http.server 8000` serves only the front end. With no `/api`, the game falls back to seed counts and shows no ranking.

## Files

| Path | What it is |
|---|---|
| `js/config.js` | Name, launch date (Dive #1), timer, backend |
| `data/questions.json` | Every prompt, the daily schedule and the themed packs |
| `tools/check-questions.mjs` | Linter for the question file: `node tools/check-questions.mjs` |
| `api/` | Vercel functions: `counts`, `answer`, `score`, `scores` |
| `db/schema.sql` | Neon tables (`answer_counts`, `scores`) |
| `js/scoring.js` | Matching, points and tier bands |

## Writing questions

Each prompt is a list of accepted answers, and each answer has a **seed count**:

```json
"campus-buildings": {
  "prompt": "Name a building on the Texas A&M campus in College Station",
  "answers": [
    "Zachry | Zachry Engineering Education Complex | ZACH = 30",
    "Evans Library | Evans = 20",
    "Cushing Library | Cushing = 3",
    "Francis Hall = 0"
  ]
}
```

- `Canonical | alias | alias = seed`. The first name is the one players see. Aliases are other spellings that also count.
- The **seed** is how many imaginary divers gave that answer. The most common answer scores **10**. Rarer answers score more (`10 + 88·(1 − √(count/top))`). A valid answer with seed **0** scores the full **100**.
- If what a player types isn't on the list, they're told and can try again until the timer runs out. So **the list is the rules**. Be generous: list every valid answer you can think of, and mark the obscure ones `= 0`.
- Matching ignores case, accents, punctuation, a leading "the" and trailing plurals. Any name or alias counts, so SHPE and Society of Hispanic Professional Engineers are the same answer.
- A near miss isn't scored right away. Like Krillion's answer corrections, the game puts the closest answer in the box ("Did you mean Society of Hispanic Professional Engineers?") and the player presses Enter to dive with it or keeps typing. Near misses are typos and swapped letters (SPHE), word-form slips ("Engineering" for "Engineers"), a missing word ("Society of Hispanic Engineers") and the start of exactly one answer's name ("Ellicott Dredge"). An alias that's only a letter or two off a different answer can trigger a surprising suggestion, so keep aliases distinct.
- Instead of a number, an answer can name its depth level: `Tristan Forks = plankton`. The levels are `plankton`, `schooler`, `rare`, `deep cut` and `secrillion` (One in a SECrillion). They score 10, 30, 42, 62 and 82 points, as long as the prompt has at least one `plankton` answer.
- Plain objects work too: `{ "a": "Zachry", "aka": ["ZACH"], "n": 30 }`.

### Scheduling

- `pool` lists the SEC / Aggie-engineering prompts. Daily dives and Unlimited only draw from it. The general engineering prompts (elements, polygons, …) are only reachable through their themed packs.

- `daily[0]` is Dive #1, `daily[1]` is Dive #2, and so on, counted from `launchDate`. Once the schedule runs out, each day gets a random set of prompts, seeded by the date so everyone gets the same ones.
- `packs` show up under **Themed Packs**. Each play draws 7 of the pack's prompts.
- Run `node tools/check-questions.mjs` after editing. It flags duplicate aliases and unknown prompt ids.

## How live rarity works

- When a player gives an accepted answer, `/api/answer` adds one to that prompt's tally in `answer_counts`. The server checks the answer against its own copy of `questions.json`, so junk can't get in, and what players type is never stored.
- At the start of a dive, `/api/counts` returns those tallies. They're added to your seed counts, so rarity makes sense from day one and then follows real play.
- `/api/score` and `/api/scores` drive the "better than X%" curve, which appears only once 5 real scores exist (no estimates).
- There's no rate limiting, so a determined player could inflate tallies. If that ever matters, add Vercel's firewall rate limits to `/api/*`.

## The ESO prompt

`eso` lists 109 engineering student organizations, taken from each department's student-orgs page on engineering.tamu.edu. The seed counts rank them by size:

| Seed | Size tier | Examples |
|---|---|---|
| 25–30 | Flagship | SEC, SWE, SHPE, IEEE, ASME, SPE |
| 10–15 | Large | PAID, AIChE, AIAA, ASCE, NSBE, BMES, Tau Beta Pi, EWB, SAE, TAMUhack |
| 2–5 | Mid-size | IISE, SEDS, Robomaster, Concrete Canoe, Steel Bridge, honor societies |
| 1 | Small | rocketry teams, ID/ET societies, smaller honor societies |
| 0 | Niche | graduate associations, advisory councils, small technical chapters |

No org publishes a member count. The tiers are estimates anchored on these data points: SPE (1,300+ members in 2015), SHPE (National Large Chapter of the Year in 2019 and 2021), SWE (300+ active members) and PAID (called one of A&M's largest orgs). SEC officers should adjust them, and once the database is live, real answers take over.

## The career fair prompts

`career-fair-s26` and `career-fair-f26` ask players to name a company at the Spring 2026 and Fall 2026 SEC Career Fairs. Both come from the confirmed-registration list (`Companies_at_S26_or_F26.csv`: 270 Spring companies, 512 Fall; "SEC Test Employer" is left out). Seeds rank name recognition among engineering students: 20–30 for household names (TI, Boeing, ExxonMobil), 10–18 for big engineering employers, 3–8 for companies known in their industry, and 1–2 for niche ones.

Each prompt has exactly one seed-0 company, the "one in a SECrillion" worth the full 100: **Sazerac** (Spring) and **Ellicott Dredge Enterprises** (Fall). Keep it to one per prompt; `node tools/check-questions.mjs` shows the unseen count.

To merge a new roster into a prompt, put one company per line in a text file and run `node tools/import-fair.mjs roster.txt --prompt career-fair-f26`. Companies already in the prompt keep their ranking. New ones are seeded by name recognition (or 1 if unknown) and listed so you can adjust them. While a fair is still upcoming on HireAggies, you can import it directly by its nickname, e.g. `node tools/import-fair.mjs sec_f26_cdf`.
