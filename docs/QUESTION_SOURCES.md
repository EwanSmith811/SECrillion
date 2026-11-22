# November 2026 question-bank update

The question bank and rarity tiers are maintained in `data/questions.json`. Run `npm run check` and `node tools/export-bank.mjs` after editing it. `node tools/export-bank.mjs --all` also includes the career-fair questions.

## College Station eateries

The prompt explicitly requires **at least 50 Google reviews at an individual eatery location within College Station city limits**. Do not sum multiple branches' reviews or substitute reviews for a host hotel, hospital, grocery store, airport, stadium, or other facility. An independently listed bakery or restaurant inside a larger business can qualify. Restaurants, cafes, tea/coffee shops, bakeries, desserts, food trucks, dining halls, dine-in cinemas, and bars that serve food are included. Permanently closed businesses and alcohol-only venues are excluded. Multiple branches of the same eatery share one answer.

`data/cstat-eats.sources.json` records the research date, qualifying location evidence, Google-review counts, and exclusion examples. Discovery used the full public [BrazosEats permit directory](https://www.brazoseats.com/search), followed by [Google Maps](https://www.google.com/maps/search/restaurants+in+College+Station+Texas/) cuisine, category, neighborhood, and individual-place checks. Boundaries and ambiguous addresses were checked against the city's [municipal boundary](https://gis.cstx.gov/csgis/rest/services/_OpenData/OpenData_PDS/MapServer/3) and [address points](https://gis.cstx.gov/csgis/rest/services/_OpenData/OpenData_PDS/MapServer/19).

This is a **2026-11-21 research snapshot**, not a live Google Places feed or a proof that no qualifying unindexed business exists. Some directory matches were incorrect or stale; direct Google observations took precedence. Refresh the list when businesses open, close, relocate, or cross 50 reviews. A postal address saying “College Station” is insufficient, and a “Wellborn” address can still be inside city limits. Christopher's World Grille is in Bryan and is excluded at the owner's explicit direction to use College Station city limits.

Rarity estimates familiarity among TAMU students, not quality, star rating, price, or distance from campus. Fuego is plankton; Gumby's and Koppe Bridge are schooler. Familiar sit-down restaurants such as Casa do Brasil, Fish Daddy's, Stella Southern Cafe, and PORTERS are rare. Niche/newer places are deeper. Balanced Foods and Do You Like Bapcha are the only two 100-point answers, matching the game's two-gem cap.

## Ten new prompts

| ID | Scope and source |
| --- | --- |
| `sec-leadership-hometowns` | All 18 hometowns of the 38 EB/EC profiles on the live [SEC team page](https://home.sec.tamu.edu/our-team), fetched 2026-11-21. Faculty advisors excluded. |
| `sec-eb-roles` | All six Executive Board offices on the [team page](https://home.sec.tamu.edu/our-team) and [SEC website](https://home.sec.tamu.edu/). |
| `sec-event-locations` | Rooms and venues from SEC's public `#weekly_reminders`, August 2025–November 2026. `data/sec-event-locations.sources.json` links supporting Slack messages for every answer. It contains no copied message bodies, contact details, passwords, or private-channel content. |
| `aggie-core-values` | All six [official Core Values](https://www.tamu.edu/about/purpose-values.html). |
| `tamu-libraries` | All five entries in the [University Libraries directory/navigation](https://library.tamu.edu/spaces/), including Galveston. Evans and the Annex share one answer; former names are aliases. |
| `aggiespirit-routes` | All 20 routes in the official [How to Ride route-description tables](https://transportation.tamu.edu/Transit/howtoride.aspx); names and route numbers accepted. Historical routes and night combinations excluded. |
| `si-prefixes` | All 24 [NIST SI prefixes](https://www.nist.gov/pml/owm/metric-si-prefixes), including the four added in 2022. Full names avoid case-insensitive symbol collisions. |
| `osi-layers` | All seven layers in [IBM's OSI reference](https://www.ibm.com/think/topics/osi-model), with layer-number aliases. |
| `doe-national-labs` | All 17 [DOE National Laboratories](https://www.energy.gov/national-laboratories), including the National Laboratory of the Rockies and its former NREL names. |
| `additive-processes` | All seven standard additive-manufacturing categories, checked against [NIST](https://www.nist.gov/additive-manufacturing/research-areas/technologies), [DOE](https://www.energy.gov/documents/advanced-manufacturing-technology-assessment-additive-manufacturingpdf), and [OpenStax](https://openstax.org/books/additive-manufacturing-essentials/pages/2-1-processes-and-process-organization). Common technologies map to their process family as aliases. |

The new prompts join their relevant themed packs and the daily/Unlimited pool. `poolFrom: 36` enables them for daily dives starting **2026-11-22**; related prompts are kept apart. Question selection for dives 1–35 remains unchanged. All new prompts use explicit rarity tiers and at most two 100-point answers.
