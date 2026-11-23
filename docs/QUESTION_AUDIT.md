# Question coverage audit — 2026-11-23

Reviewed all **80 questions**. **42 answer sets expanded**, 14 further questions corrected or bounded, and 24 retained. **6,277 net answers added.**

## What complete means

The owner approved using complete, clearly stated source lists for questions with no finite universal answer set. These questions now identify a source directory, a dated snapshot, or a published reference catalog. Every entry in each imported source list is accepted; the coverage file also enumerates any retained original examples. A finite reference catalog is not a claim to enumerate every real-world programming language, tool, event, famous person, or possible future invention.

`data/question-coverage.json` records source labels, canonical game answers, supporting URLs, complete accepted catalogs, and retained legacy examples. `npm run check` verifies every recorded source label and every accepted alias against the actual matcher, checks explicit rarity ordering and the two-gem cap, and simulates daily selection. This protects the published catalog from losing answers during future edits; a changing external site still requires a fresh import.

## Flagged incomplete questions — expanded

| Question | Before → after | Clear gap and correction |
| --- | ---: | --- |
| `git-commands` | 34 → 157 | Only 34 of 157 documented commands were covered. |
| `linux-commands` | 52 → 1606 | The 52 examples omitted hundreds of documented user commands. |
| `programming-languages` | 43 → 575 | 43 examples omitted hundreds of recognized languages. |
| `nasa` | 62 → 688 | 62 examples omitted most entries in NASA’s A–Z directory. |
| `data-structures` | 39 → 202 | 39 examples omitted most NIST-listed data structures. |
| `sorting-algorithms` | 28 → 86 | The 28 examples omitted many algorithms in NIST’s Sorting index. |
| `texas-rivers` | 41 → 161 | 41 examples omitted river forks and many smaller named rivers. |
| `aggie-coaches` | 14 → 34 | The 14 answers omitted early head coaches and interim coaches. |
| `tamu-colleges` | 15 → 17 | The 15 answers omitted Engineering Medicine and Marine Sciences/Maritime Studies and used several former names. |
| `engineering-buildings` | 29 → 33 | The building directory includes Doherty, Cain, Teague and Civil Engineering Lab, absent from the 29-answer list. |
| `tamu-campuses` | 10 → 14 | The university locations page names Bryan, Corpus Christi, Kingsville and Temple, all missing. |
| `athletic-facilities` | 20 → 35 | The 20 answers omitted the natatorium, Polo Road Rec, Traditions Club, Watts course and other official facilities. |
| `engineering-math` | 32 → 670 | The 32 examples did not cover the engineering calculus curriculum. |
| `physics-laws` | 49 → 101 | 49 examples omitted named laws and equations in standard university-physics indexes. Equivalent laws/statements are aliases, preserving one score per accepted law family. |
| `famous-aggies` | 30 → 571 | The 30 examples excluded hundreds of listed former students. |
| `famous-engineers` | 69 → 671 | A 69-person subjective fame list could never cover engineers, inventors and scientists; replaced with a complete published honor roll. |
| `polygons` | 32 → 39 | The finite example list omitted named polygons such as digon, tetracontagon and pentacontagon. |
| `bridge-types` | 25 → 46 | The 25 examples omitted standard slab, frame, tee-beam, channel-beam and other FHWA types. |
| `engineering-software` | 40 → 57 | The 40 course-software examples omitted packages in TAMU’s official Software Center and first-year BYOD list. |
| `engineering-calculators` | 19 → 28 | The 19 examples omitted calculator models in TI’s current guidebook directories. |
| `sec-movies` | 5 → 50 | The five answers omitted most film recommendations, especially thread replies. |
| `sec-book-club` | 16 → 30 | 16 examples omitted titles on the published Fall 2025 and Spring 2026 voting lists. |
| `course-prefixes` | 20 → 24 | The engineering course list omitted MTDE, DAEN, ITSV and the college-wide CLEN prefix. |
| `engineering-majors` | 21 → 23 | Data Engineering and Information Technology Service Management were absent from the 21-major list. |
| `circuit-components` | 39 → 70 | The 39 examples omitted antenna, microphone, ferrite bead, DIAC, JFET, IGBT and other standard generic devices. |
| `metals` | 74 → 126 | The 74 metal/alloy examples omitted many metallic elements, including entire lanthanide and actinide groups. |
| `hand-tools` | 43 → 132 | 43 examples omitted many ordinary tools and whole families such as dividers, reamers, taps/dies, hatchets and vises. |
| `airplane-parts` | 36 → 88 | 36 examples omitted structural members, landing-gear parts, cowling, cabin safety parts and other standard components. |
| `engineering-failures` | 41 → 176 | The 41 examples omitted most published industrial accident investigations. |
| `texas-teams` | 24 → 32 | The selective major/minor list missed Dallas’s UFL team, RGV Vipers, two MiLB clubs, El Paso Locomotive and all Texas MLS NEXT Pro teams. |
| `renewable-energy` | 11 → 23 | The broad source question omitted named biomass fuels and marine/solar technologies. |
| `career-fair-prep` | 23 → 30 | The old wording allowed any imaginable object; bounded to the published preparation checklist and reference items. |
| `career-fair-companies` | 92 → 639 | The vague 92-company example list was much smaller than the two confirmed SEC 2026 rosters. |
| `lab-equipment` | 51 → 114 | The 51 examples omitted lab ovens/freezers, incubators, chromatography, mass spectrometry and many other instrument families. |
| `career-fair-swag` | 32 → 66 | The original 32 examples omitted many giveaway categories and could not cover arbitrary possible swag. |
| `aggie-sports` | 49 → 50 | Poultry Judging was missing despite the team’s 2026 national title. |
| `competition-teams` | 17 → 19 | Baja SAE and SEED’s engineering-sales competition team were absent. |
| `sec-events` | 20 → 70 | The general SEC program question had only 20 entries while the sourced reminder catalog already held 67 eligible events. |
| `aggie-traditions` | 33 → 41 | T-Camp, Howdy Camp, Final Review and March to the Brazos were missing from the 33 examples. |
| `zachry-spaces` | 17 → 24 | The 17-space list omitted the Welcome Center, global programs/advising offices, HPE Tech Deck, huddle rooms and Leach Center. |
| `sec-nicknames` | 27 → 31 | Ole Miss’s Tony/Landshark, Kentucky’s Scratch and Oklahoma’s Boomer/Sooner and Top Daug were missing. |
| `logic-gates` | 8 → 12 | The unrestricted wording omitted other Boolean functions; explicitly covered all one/two-input single-output Boolean gate families. |

## Scope, date, and membership corrections

| Question | Before → after | Correction |
| --- | ---: | --- |
| `si-derived-units` | 22 → 22 | The answers cover a closed set, but the old wording was broader than the set. |
| `planets` | 13 → 13 | The answers cover a closed set, but the old wording was broader than the set. |
| `residence-halls` | 39 → 39 | The answers already included apartments, but the prompt said only residence halls. |
| `tamus-schools` | 13 → 12 | Removed Sul Ross State University, which is not a Texas A&M System member. No member university was missing. |
| `greek-chapters` | 35 → 34 | Kappa Sigma was missing; the old list also contained chapters outside the current official IFC/CPC directories. |
| `sec-quotes` | 199 → 199 | Replaced rolling/current wording with the documented complete import’s date, so later additions are not silently rejected. |
| `sec-quoted` | 72 → 72 | Replaced rolling/current wording with the documented complete import’s date, so later additions are not silently rejected. |
| `sec-quotes-characters` | 21 → 21 | Replaced rolling/current wording with the documented complete import’s date, so later additions are not silently rejected. |
| `sec-slack-channels` | 95 → 95 | Replaced rolling/current wording with the documented complete import’s date, so later additions are not silently rejected. |
| `sec-emojis` | 157 → 157 | Replaced rolling/current wording with the documented complete import’s date, so later additions are not silently rejected. |
| `sec-events-2526` | 67 → 67 | Dated the original reminder import explicitly. |
| `sec-lunch-and-learns` | 33 → 33 | Dated the original reminder import explicitly. |
| `eb-members` | 28 → 28 | Replaced a moving five-year window with the published October 2026 leadership reference edition. |
| `texas-cities` | 8375 → 8375 | The list was already broad, but the wording wrongly called every populated place an incorporated city. |

## Material scope changes

- `famous-engineers` now asks for a National Inventors Hall of Fame inductee. The former subjective engineer/inventor/scientist list could not be made universally complete; the full published inductee list supplies a finite, verifiable replacement.
- `sec-book-club` covers the complete Fall 2025 and Spring 2026 ballots, plus the two selected Fall 2026 books. The unselected Fall 2026 nominations are excluded explicitly because that deck returned unavailable. Unsupported old examples were removed.
- `texas-teams` names the 13 covered professional leagues in the question itself. All 32 Texas teams in those leagues are included; independent leagues and other sports are outside its stated scope. Houston Gamblers and Dallas Renegades accept their former Roughnecks/Arlington names.
- `logic-gates` now covers all one/two-input, single-output Boolean functions grouped into 12 gate families. Quantum, three-input, multi-output and non-Boolean-output devices are outside the question.
- Older Slack questions now state the original import dates instead of claiming a rolling “past year” or an automatically current workspace catalog.
- Texas cities now explicitly include towns and unincorporated communities from the existing Census/GNIS snapshot.
- Texas A&M System universities now correctly contain 12 members; Sul Ross was removed. IFC/CPC coverage adds Kappa Sigma and removes Tau Kappa Epsilon and independent Beta Upsilon Chi; all 14 CPC chapters, including Delta Zeta, remain.

## Retained questions — no clear omission found in this pass

These retain their existing closed sets or previously imported source snapshots. “Retained” does not mean a fresh independent recertification of every private roster, older export, or live business listing. Source/date limitations remain relevant; notably the eateries are the already researched November 21 snapshot, not a live Google Places census.

| Question | Answers | Existing coverage basis |
| --- | ---: | --- |
| `texas-counties` | 254 | All 254 counties in the official state list. |
| `texas-state-parks` | 86 | Previously verified 86 distinct parks/natural areas in the TPWD directory, with units grouped. |
| `sec-leadership-hometowns` | 18 | Previously verified 18 towns from the dated SEC leadership profiles. |
| `sec-event-locations` | 22 | Previously documented 22 venue/room answers, each with a supporting public Slack message. |
| `aggiespirit-routes` | 20 | Previously verified 20 routes in the official How to Ride guide snapshot. |
| `si-prefixes` | 24 | All 24 official SI prefixes. |
| `sec-cities` | 15 | 15 distinct home cities for 16 SEC schools; the two Columbias share a city-name answer. |
| `cstat-streets` | 128 | Previously researched 128 named campus roads from TAMU GIS. |
| `cstat-eats` | 270 | 270 eateries from the 2026-11-21 review/location audit; current city-limit and 50-review criteria remain. |
| `sec-stadiums` | 16 | One stadium per SEC school; 16 entries. |
| `football-roster` | 122 | Original complete 122-player posted 2026 roster snapshot; no newly verified omission. |
| `mbb-roster` | 17 | Original complete 17-player posted 2026–27 roster snapshot; no newly verified omission. |
| `ec-members` | 30 | Original named 2025–26 EC roster, not the current team page. |
| `career-fair-s26` | 270 | 270 confirmed Spring 2026 registrations from the original complete export. |
| `career-fair-f26` | 512 | 512 confirmed Fall 2026 registrations from the original complete export. |
| `sec-committees` | 16 | 16 committee entries; compared against the SEC division/team descriptions, no clear missing committee identified. |
| `eso` | 167 | Existing 167-organization department/Get Involved reference list; no new verified omission identified. |
| `campus-buildings` | 635 | Existing 635-building campus inventory; no clear new omission identified. |
| `sec-schools` | 16 | All 16 conference members. |
| `elements` | 118 | All 118 named chemical elements. |
| `greek-letters` | 24 | All 24 Greek letter names. |
| `si-base-units` | 7 | All seven SI base units. |
| `simple-machines` | 6 | All six classical simple machines. |
| `sec-summer-places` | 9 | All nine places/regions in the existing summer-2026 channel snapshot. |

## Published scopes and sources

### `git-commands`

Name a Git command from the official command manual

All command entries in the Git 2.56 command manual retrieved 2026-11-23, including porcelain, plumbing and documented helper commands. Options and guide names do not count. Accept the subcommand with or without git.

Sources: [git-scm.com](https://git-scm.com/docs/git)

### `linux-commands`

Name a Linux user command in man7.org’s section-1 index

Every section-1 user-command entry in the man7.org Linux manual index retrieved 2026-11-23; a command with several manual entries counts once. Shell builtins already accepted by the game remain accepted.

Sources: [man7.org](https://man7.org/linux/man-pages/dir_section_1.html)

### `programming-languages`

Name a programming or SQL query language in GitHub Linguist

All GitHub Linguist entries typed programming, plus entries whose canonical name contains SQL, from the 2026-11-23 registry snapshot. Registry aliases count. Markup, prose and unrelated data formats are excluded. Previously accepted engineering-language names remain accepted.

Sources: [raw.githubusercontent.com](https://raw.githubusercontent.com/github-linguist/linguist/main/lib/linguist/languages.yml)

### `nasa`

Name a mission, spacecraft, program or experiment in NASA’s A–Z directory

Every entry in NASA’s A to Z List of NASA Missions snapshot retrieved 2026-11-23. The directory also includes NASA-supported international missions, instruments, experiments and technology programs, which count. Numbered missions are separate from their umbrella program; previously accepted spacecraft also remain accepted.

Sources: [www.nasa.gov](https://www.nasa.gov/a-to-z-of-nasa-missions/)

### `data-structures`

Name a data structure in NIST’s dictionary

Every entry under Data Structures in NIST DADS Index by Type, snapshot retrieved 2026-11-23. Synonymous labels that link to the same definition share an answer. Previously accepted engineering-course examples remain accepted.

Sources: [xlinux.nist.gov](https://xlinux.nist.gov/dads/termsType.html)

### `sorting-algorithms`

Name a sorting algorithm in NIST’s dictionary

Every algorithm-labelled [A] entry in the Sorting section of NIST DADS Index by Area, retrieved 2026-11-23. Definitions, problems and techniques are excluded. Previously accepted sorting algorithms remain accepted, including newer algorithms not in NIST’s older index.

Sources: [xlinux.nist.gov](https://xlinux.nist.gov/dads/termsArea.html), [docs.python.org](https://docs.python.org/3/howto/sorting.html)

### `texas-rivers`

Name a Texas river or river-classified waterway in TxDOT’s stream dataset

All distinct nonempty names classified River, Major River or Minor River in TxDOT’s Texas Streams dataset, retrieved 2026-11-23. This classification includes certain bayous/creeks and river forks, which count separately. Existing accepted waterways, including Arroyo Colorado, remain accepted.

Sources: [services.arcgis.com](https://services.arcgis.com/KTcxiTD9dsQw4r7Z/arcgis/rest/services/Texas_Streams/FeatureServer/0/query?where=STRM_NM+IS+NOT+NULL+AND+STRM_TYPE+IN+%28%27River%27%2C%27Major+River%27%2C%27Minor+River%27%29&outFields=STRM_NM&returnDistinctValues=true&returnGeometry=false&f=json)

### `aggie-coaches`

Name a Texas A&M head football coach, including interim coaches

Every named head coach in 12thman.com’s Football Year-by-Year Results, plus interim head coaches Gary Darnell (2007), Tim DeRuyter (2011) and Elijah Robinson (2023). Repeated tenures share one answer. Snapshot through 2026-11-23.

Sources: [12thman.com](https://12thman.com/sports/football/year-by-year), [12thman.com](https://12thman.com/news/2007/11/24/darnell-named-interim-head-football-coach), [12thman.com](https://12thman.com/news/2011/12/8/meineke-car-care-bowl-of-texas-news-conference), [12thman.com](https://12thman.com/news/2023/11/13/robinson-meets-media-at-weekly-press-conference)

### `tamu-colleges`

Name a college or school in Texas A&M’s academic directory

All 17 academic colleges and schools listed by Texas A&M on 2026-11-23, including Galveston’s College of Marine Sciences and Maritime Studies. Branch campuses are locations rather than extra colleges. Former school/college names remain aliases.

Sources: [www.tamu.edu](https://www.tamu.edu/academics/colleges-schools/index.html)

### `engineering-buildings`

Name a Texas A&M engineering building

All buildings in the College of Engineering building directory retrieved 2026-11-23, plus the previously accepted engineering/research buildings. Outdoor quads and parking structures do not count as buildings.

Sources: [engineering.tamu.edu](https://engineering.tamu.edu/about/buildings/index.html)

### `tamu-campuses`

Name a city or site listed for a Texas A&M University campus or center

All cities/sites named on Texas A&M’s Campuses and Locations page and its Health-campus summary on 2026-11-23, together with the existing RELLIS site answer. The University System’s other universities do not count by themselves. Qatar remains included while its branch campus winds down.

Sources: [www.tamu.edu](https://www.tamu.edu/academics/campuses-locations.html)

### `athletic-facilities`

Name a Texas A&M Athletics or Rec Sports facility

Every facility-detail page linked by the official 12thman Athletics facilities directory, plus the Rec Sports facility navigation and previously accepted named athletics/rec facilities. Facility complexes and their separately named venues can count separately.

Sources: [12thman.com](https://12thman.com/facilities), [recsports.tamu.edu](https://recsports.tamu.edu/facilities/)

### `engineering-math`

Name a topic in the indexes of OpenStax Calculus, Volumes 1–3

Every index term in OpenStax Calculus Volumes 1–3 retrieved 2026-11-23, plus the game’s previously accepted engineering-math topics. Closely synonymous spellings share an answer; generic real-world illustrations in the indexes also remain eligible where explicitly listed.

Sources: [openstax.org](https://openstax.org/books/calculus-volume-1/pages/index), [openstax.org](https://openstax.org/books/calculus-volume-2/pages/index), [openstax.org](https://openstax.org/books/calculus-volume-3/pages/index)

### `physics-laws`

Name a law, equation or principle indexed in OpenStax University Physics

Every index term containing law, equation, principle, theorem, rule, postulate or conservation in OpenStax University Physics Volumes 1–3, retrieved 2026-11-23, together with previously accepted engineering laws. The words are matched as whole words.

Sources: [openstax.org](https://openstax.org/books/university-physics-volume-1/pages/index), [openstax.org](https://openstax.org/books/university-physics-volume-2/pages/index), [openstax.org](https://openstax.org/books/university-physics-volume-3/pages/index)

### `si-derived-units`

Name an SI derived unit with a special name

All 22 SI derived units with special names. Arbitrary compound units and prefixed variants are not separate answers.

Sources: [www.bipm.org](https://www.bipm.org/en/publications/si-brochure)

### `planets`

Name one of the eight planets or five IAU-recognized dwarf planets

The eight Solar System planets and the five dwarf planets recognized by the IAU as of 2026-11-23. Dwarf-planet candidates, moons and exoplanets are excluded.

Sources: [science.nasa.gov](https://science.nasa.gov/dwarf-planets/)

### `famous-aggies`

Name a notable Texas A&M former student in the alumni reference list

All real people in the Class year tables in Wikipedia’s List of Texas A&M University people, retrieved 2026-11-23, plus the previously accepted alumni/group answers. Faculty-only and fictional sections are excluded. This is an explicitly bounded notable-alumni reference list, not all former students.

Sources: [en.wikipedia.org](https://en.wikipedia.org/wiki/List_of_Texas_A%26M_University_people)

### `famous-engineers`

Name an inductee of the National Inventors Hall of Fame

Every inductee in the National Inventors Hall of Fame’s full alphabetic list retrieved 2026-11-23. This replaces the former unbounded famous engineer/inventor/scientist question. Honorary groups and fictional people are excluded.

Sources: [www.invent.org](https://www.invent.org/inductees/list)

### `polygons`

Name a polygon in the MathWorld Polygon reference table or its named-shape list

Every numeric polygon in the names table on MathWorld’s Polygon page (2–20 sides, multiples of ten through 100, and 10,000), plus the originally accepted named shapes/large polygons. An n-gon spelling is an alias only for listed side counts. This finite reference list replaces the former unbounded wording.

Sources: [mathworld.wolfram.com](https://mathworld.wolfram.com/Polygon.html)

### `bridge-types`

Name a bridge type in FHWA’s structure-type table or the bridge reference list

Every named structure type in Table 10 of FHWA’s LTBP Bridge Performance Primer (Other excluded), together with originally accepted bridge designs, uses and movable-bridge types. The explicit finite reference list is the scope; materials and arbitrary combinations are not extra answers.

Sources: [www.fhwa.dot.gov](https://www.fhwa.dot.gov/publications/research/infrastructure/structures/ltbp/13051/)

### `engineering-software`

Name software in TAMU’s Software Center, engineering BYOD guide or course-software reference list

All software products shown in TAMU’s public Available Software listing on 2026-11-23 and the engineering BYOD applications list, plus originally accepted engineering-course software. OS/version variants share an answer. Hardware tokens are excluded. Some Software Center packages are restricted to particular users; inclusion does not imply universal access.

Sources: [software.tamu.edu](https://software.tamu.edu/public/AvailableSoftware.aspx), [engineering.tamu.edu](https://engineering.tamu.edu/academics/byod/software.html)

### `engineering-calculators`

Name a calculator in the engineering-calculator reference list

All models in TI’s current graphing/scientific guidebook directories retrieved 2026-11-23, plus the original TI, Casio, HP, NumWorks, online-calculator and slide-rule entries. The reference list is finite; color variants are not separate models. A model and its explicitly accepted family alias may share one answer.

Sources: [education.ti.com](https://education.ti.com/en/product-resources/guidebooks/graphing-calculators), [education.ti.com](https://education.ti.com/en/product-resources/guidebooks/scientific-calculators)

### `sec-movies`

Name a film or film series explicitly named in SEC’s #movies through Nov 2026

Every distinct film title or film series explicitly named in text in all 93 messages/replies returned for the public #movies channel through 2026-11-23. Named series count once; specific films in the referenced Shrek, LOTR and HTTYD series map to that series answer. Images, vague recommendations such as any Jane Austen adaptation, and TV-only titles are excluded.

Sources: [studentengineers.slack.com](https://studentengineers.slack.com/archives/C09KJ7U8QJW/p1777071233116859?thread_ts=1777058134.139199&cid=C09KJ7U8QJW), [studentengineers.slack.com](https://studentengineers.slack.com/archives/C09KJ7U8QJW/p1777067330873989?thread_ts=1777058134.139199&cid=C09KJ7U8QJW), [studentengineers.slack.com](https://studentengineers.slack.com/archives/C09KJ7U8QJW/p1777067065924699?thread_ts=1777058134.139199&cid=C09KJ7U8QJW), [studentengineers.slack.com](https://studentengineers.slack.com/archives/C09KJ7U8QJW/p1777067003303589?thread_ts=1777058134.139199&cid=C09KJ7U8QJW), [studentengineers.slack.com](https://studentengineers.slack.com/archives/C09KJ7U8QJW/p1777066990620029?thread_ts=1777058134.139199&cid=C09KJ7U8QJW), [studentengineers.slack.com](https://studentengineers.slack.com/archives/C09KJ7U8QJW/p1777066983059059?thread_ts=1777058134.139199&cid=C09KJ7U8QJW), [studentengineers.slack.com](https://studentengineers.slack.com/archives/C09KJ7U8QJW/p1777066034969819?thread_ts=1777058134.139199&cid=C09KJ7U8QJW), [studentengineers.slack.com](https://studentengineers.slack.com/archives/C09KJ7U8QJW/p1777060799201449?thread_ts=1777058134.139199&cid=C09KJ7U8QJW), [studentengineers.slack.com](https://studentengineers.slack.com/archives/C09KJ7U8QJW/p1777058306147999?thread_ts=1777058134.139199&cid=C09KJ7U8QJW), [studentengineers.slack.com](https://studentengineers.slack.com/archives/C09KJ7U8QJW/p1777058300149349?thread_ts=1777058134.139199&cid=C09KJ7U8QJW), [studentengineers.slack.com](https://studentengineers.slack.com/archives/C09KJ7U8QJW/p1764368574518669?thread_ts=1764368383.288669&cid=C09KJ7U8QJW), [studentengineers.slack.com](https://studentengineers.slack.com/archives/C09KJ7U8QJW/p1764368383288669?thread_ts=1764368383.288669&cid=C09KJ7U8QJW), [studentengineers.slack.com](https://studentengineers.slack.com/archives/C09KJ7U8QJW/p1760128782474679?thread_ts=1759971515.439809&cid=C09KJ7U8QJW), [studentengineers.slack.com](https://studentengineers.slack.com/archives/C09KJ7U8QJW/p1760048964605849?thread_ts=1759971515.439809&cid=C09KJ7U8QJW), [studentengineers.slack.com](https://studentengineers.slack.com/archives/C09KJ7U8QJW/p1760049023654659?thread_ts=1759971515.439809&cid=C09KJ7U8QJW), [studentengineers.slack.com](https://studentengineers.slack.com/archives/C09KJ7U8QJW/p1759987029152159?thread_ts=1759971515.439809&cid=C09KJ7U8QJW), [studentengineers.slack.com](https://studentengineers.slack.com/archives/C09KJ7U8QJW/p1759986385007259?thread_ts=1759971515.439809&cid=C09KJ7U8QJW), [studentengineers.slack.com](https://studentengineers.slack.com/archives/C09KJ7U8QJW/p1759978949181809?thread_ts=1759971515.439809&cid=C09KJ7U8QJW), [studentengineers.slack.com](https://studentengineers.slack.com/archives/C09KJ7U8QJW/p1759978017813889?thread_ts=1759971515.439809&cid=C09KJ7U8QJW), [studentengineers.slack.com](https://studentengineers.slack.com/archives/C09KJ7U8QJW/p1759976881773199?thread_ts=1759971515.439809&cid=C09KJ7U8QJW), [studentengineers.slack.com](https://studentengineers.slack.com/archives/C09KJ7U8QJW/p1759972352513969?thread_ts=1759971515.439809&cid=C09KJ7U8QJW), [studentengineers.slack.com](https://studentengineers.slack.com/archives/C09KJ7U8QJW/p1759971692111599?thread_ts=1759971515.439809&cid=C09KJ7U8QJW), [studentengineers.slack.com](https://studentengineers.slack.com/archives/C09KJ7U8QJW/p1759971666496199?thread_ts=1759971515.439809&cid=C09KJ7U8QJW), [studentengineers.slack.com](https://studentengineers.slack.com/archives/C09KJ7U8QJW/p1777067189443409?thread_ts=1777058134.139199&cid=C09KJ7U8QJW), [studentengineers.slack.com](https://studentengineers.slack.com/archives/C09KJ7U8QJW/p1759971665838639?thread_ts=1759971515.439809&cid=C09KJ7U8QJW), [studentengineers.slack.com](https://studentengineers.slack.com/archives/C09KJ7U8QJW/p1759971640560559?thread_ts=1759971515.439809&cid=C09KJ7U8QJW)

### `sec-book-club`

Name a book on SEC’s Fall 2025/Spring 2026 ballots or selected for Fall 2026

Every title on the Fall 2025 voting document and Spring 2026 nomination deck, plus the two announced Fall 2026 selections, Catch-22 and When Breath Becomes Air. The unselected Fall 2026 nominations are outside this explicit question scope; that nomination deck is unavailable. Original answers without evidence in these named sources were removed.

Sources: [docs.google.com](https://docs.google.com/document/d/13r9lg3mgMWs-k4llsVW6FLDcwp_1zUsK5VZ0rYqAKtw/edit), [docs.google.com](https://docs.google.com/presentation/d/1lUpMm30GMF8Pc241_SHoe3KyWeqH-c6scg-B0k5gd8I/edit)

### `course-prefixes`

Name an undergraduate College of Engineering course prefix (like ENGR)

All 24 engineering prefixes in the published undergraduate reference list, checked against the undergraduate catalog on 2026-11-23. Includes college-wide CLEN, Data Engineering DAEN, Information Technology Service Management ITSV and Multidisciplinary Engineering MTDE. Cross-college support subjects and graduate-only prefixes are excluded.

Sources: [catalog.tamu.edu](https://catalog.tamu.edu/undergraduate/course-descriptions/)

### `residence-halls`

Name a College Station Texas A&M residence hall or campus apartment community

All College Station residence halls in Residence Life’s housing and Corps directories, plus the White Creek and Gardens apartment communities. Individual apartment buildings are not separate answers.

Sources: [reslife.tamu.edu](https://reslife.tamu.edu/housing-options/), [reslife.tamu.edu](https://reslife.tamu.edu/corps-housing/)

### `tamus-schools`

Name one of the Texas A&M University System’s 12 universities

All 12 universities listed in the System Universities and Agencies directory on 2026-11-23. State agencies, branch campuses and other university systems are excluded.

Sources: [tamus.edu](https://tamus.edu/about/universities-and-agencies/)

### `engineering-majors`

Name an undergraduate major in Texas A&M’s College of Engineering

Every distinct bachelor’s major in the College of Engineering’s Degree Programs Offered directory retrieved 2026-11-23. BS/BA versions and departmental duplicates share one major answer. Graduate degrees, minors, concentrations and certificates are excluded.

Sources: [engineering.tamu.edu](https://engineering.tamu.edu/academics/degrees/index.html)

### `circuit-components`

Name a component or device family in KiCad’s Device library or the circuit reference list

Every one of the 564 generic symbols in KiCad’s Device library retrieved 2026-11-23 is covered by a component-family answer; package, pin-order, drawing-style and channel-count variants share a family. Previously accepted ICs, sensors and other circuit components also count. Symbol identifiers are accepted aliases.

Sources: [kicad.github.io](https://kicad.github.io/symbols/Device.html)

### `metals`

Name a metallic element in PubChem’s periodic table or an alloy in the metals reference list

All elements in PubChem’s Alkali metal, Alkaline earth metal, Transition metal, Post-transition metal, Lanthanide and Actinide groups as retrieved 2026-11-23, plus the originally accepted alloy families. Metalloids/nonmetals and arbitrary commercial grades are excluded. Element symbols are accepted only when unambiguous.

Sources: [pubchem.ncbi.nlm.nih.gov](https://pubchem.ncbi.nlm.nih.gov/rest/pug/periodictable/JSON), [periodic-table.rsc.org](https://periodic-table.rsc.org/)

### `hand-tools`

Name a tool in the Army hand-tool manual or the hand-tools reference list

All tool families and named variants in the List of Tools in Army TM 9-867 Maintenance and Care of Hand Tools, plus previously accepted modern hand tools. A family may group minor variants; the full names of those variants are aliases. Abrasive wheels, oilstones, measuring tools and manual accessories in the source list count.

Sources: [www.govinfo.gov](https://www.govinfo.gov/content/pkg/GOVPUB-W-3ceba03bcf8294abb336ca2b2f1a1385/html/GOVPUB-W-3ceba03bcf8294abb336ca2b2f1a1385.htm)

### `airplane-parts`

Name an airplane component in the FAA construction chapter or the aircraft reference list

All airplane component labels/families in FAA Pilot’s Handbook of Aeronautical Knowledge, Chapter 3 Aircraft Construction, plus the originally accepted aircraft parts and named subcomponents in the published reference list. Aircraft categories, aerodynamic forces and construction materials do not count as parts.

Sources: [www.faa.gov](https://www.faa.gov/sites/faa.gov/files/regulations_policies/handbooks_manuals/aviation/phak/05_phak_ch3.pdf), [www.faa.gov](https://www.faa.gov/sites/faa.gov/files/regulations_policies/handbooks_manuals/aviation/phak/22_phak_index.pdf)

### `engineering-failures`

Name an incident in the CSB’s completed-investigation catalog or the engineering-failure reference list

Every completed investigation listed across all 20 pages of the U.S. Chemical Safety Board directory retrieved 2026-11-23, plus the original aviation, space, nuclear, structural and other engineering case studies. Multiple reports on one incident share one answer. A disaster being included does not imply that every death or impact was caused only by an engineering error.

Sources: [www.csb.gov](https://www.csb.gov/investigations/completed-investigations/)

### `texas-teams`

Name a Texas team in the NFL, MLB, NBA, WNBA, NHL, MLS, NWSL, UFL, AHL, G League, MiLB, USL Championship or MLS NEXT Pro

All 32 Texas-based teams in the 13 leagues named in the question as of 2026-11-23. This explicit league scope replaces an unbounded all-pro-sports question. Independent leagues, junior/amateur teams, college teams and other sports are excluded. Houston Roughnecks and Arlington Renegades are accepted former names of the current Houston Gamblers and Dallas Renegades.

Sources: [www.theufl.com](https://www.theufl.com/news/united-football-league-announces-new-vision-2026), [gleague.nba.com](https://gleague.nba.com/teams), [www.mlb.com](https://www.mlb.com/milb/about/teams/by-affiliate), [www.uslchampionship.com](https://www.uslchampionship.com/league-teams), [www.mlsnextpro.com](https://www.mlsnextpro.com/clubs/)

### `renewable-energy`

Name a renewable source or technology in the EIA/DOE renewable-energy reference list

The five EIA main renewable-source categories, their explicitly named biomass fuels, and marine/solar technologies in the published reference list, alongside the original accepted source families. Fossil fuels, conventional nuclear power, ordinary batteries and hydrogen without a specified renewable production pathway are excluded. Related source and technology answers may count separately.

Sources: [www.eia.gov](https://www.eia.gov/energyexplained/renewable-sources/types-and-usage.php), [www.energy.gov](https://www.energy.gov/eere/water/marine-energy-basics)

### `career-fair-prep`

Name a preparation item on SEC’s career-fair checklist or the preparation reference list

Every preparation item explicitly listed on SEC’s student-information page and TAMU Career Center preparation page, plus the original practical preparation reference items. Physical items, clothing, documents and prepared information count; arbitrary belongings not in the reference list do not.

Sources: [careerfair.sec.tamu.edu](https://careerfair.sec.tamu.edu/students), [careercenter.tamu.edu](https://careercenter.tamu.edu/current-students/find-an-internship-job/career-fair-preparation/)

### `career-fair-companies`

Name an employer registered for either SEC’s Spring or Fall 2026 Career Fair

The complete union of confirmed Spring 2026 and Fall 2026 employer registrations already maintained in career-fair-s26 and career-fair-f26, plus original accepted engineering employers. SEC Test Employer is excluded. An employer at both fairs counts once.

Sources: [data/questions.json#career-fair-s26](data/questions.json#career-fair-s26), [data/questions.json#career-fair-f26](data/questions.json#career-fair-f26)

### `greek-chapters`

Name a chapter in Texas A&M’s IFC or Collegiate Panhellenic Council directory

All 20 chapters in the current IFC member list and all 14 chapters in the CPC directory, retrieved 2026-11-23. Multicultural/NPHC chapters, independent Christian fraternities and historical unlisted chapters are excluded.

Sources: [aggieifc.org](https://aggieifc.org/ifc-chapters-1), [cpc.tamu.edu](https://cpc.tamu.edu/chapters/)

### `sec-quotes`

Name a quote from SEC Slack’s #quotes (Oct 23, 2025–Oct 22, 2026)

All 199 posts in the previously imported #quotes snapshot, 2025-10-23 through 2026-10-22. Later posts are outside this dated question; the original loose matching and aliases are retained.

Sources: [README.md#the-slack-prompts](README.md#the-slack-prompts)

### `sec-quoted`

Name someone quoted in SEC’s #quotes (Oct 23, 2025–Oct 22, 2026)

Every person identified in the established 199-post #quotes snapshot, including the original attributed faculty answers. No new claim about later quotes.

Sources: [README.md#the-slack-prompts](README.md#the-slack-prompts)

### `sec-quotes-characters`

Name a celebrity or character named in SEC’s #quotes (Oct 2025–Oct 2026)

The 21 originally extracted celebrities/characters in the dated #quotes snapshot, 2025-10-23 through 2026-10-22. A bounded snapshot replaces rolling this past year wording.

Sources: [README.md#the-slack-prompts](README.md#the-slack-prompts)

### `sec-slack-channels`

Name a public SEC Slack channel in the October 2026 directory

The 97 public non-archived channels in the original 2026-10-23 directory import, grouped into 95 answers because three fantasy-football channels share one answer. Later-created channels are outside the dated question.

Sources: [README.md#the-slack-prompts](README.md#the-slack-prompts)

### `sec-emojis`

Name a custom emoji in SEC Slack’s October 2026 emoji catalog

The original 2026-10-23 full custom-emoji catalog, grouped into 157 answers. The alphabet-letter emoji variants share one answer. Later-added emoji are outside this dated question.

Sources: [README.md#the-slack-prompts](README.md#the-slack-prompts)

### `lab-equipment`

Name a lab item in OSHA’s apparatus/analytical-instrument lists or the laboratory reference list

Every named equipment/instrument family in OSHA SIC 3821 Laboratory Apparatus and Furniture and SIC 3826 Laboratory Analytical Instruments, plus the original chemistry/physics/engineering lab reference items. Minor variants and plural labels share one answer; furniture explicitly listed by OSHA counts.

Sources: [www.osha.gov](https://www.osha.gov/sic-manual/3821), [www.osha.gov](https://www.osha.gov/sic-manual/3826)

### `career-fair-swag`

Name a giveaway or booth-product category in the career-fair swag reference list

All 40 Product Groups filters in 4imprint’s Recruitment and Job Fair Swag catalog retrieved 2026-11-23, plus the originally accepted career-fair giveaway items. This finite reference list includes booth-display products and excludes arbitrary products not in either published list. Product models, colors and sizes share a category.

Sources: [www.4imprint.com](https://www.4imprint.com/tag/3083/recruitment-and-job-fairs)

### `aggie-sports`

Name a sport or judging event in Texas A&M’s varsity, Rec Sports or Agriculture team reference lists

All sport families in the 12thman varsity navigation, the 40-team Rec Sports directory, and the agriculture competitive-team reference list, retrieved 2026-11-23. Men’s/women’s versions share a sport; individual judging disciplines count separately. Informal intramurals and unlisted independent groups are excluded.

Sources: [12thman.com](https://12thman.com/), [recsports.tamu.edu](https://recsports.tamu.edu/programs/sport-clubs/contact-information/), [www.poultryfoundation.org](https://www.poultryfoundation.org/news/pressRelease.cfm?pid=5EF67803C133063DEA5834F1D56BA350)

### `competition-teams`

Name a Texas A&M engineering competition team in the department/team reference lists

Named competition teams in the College of Engineering department/team reference list, including Galveston Aquatic Robotics, Baja SAE and SEED engineering-sales competition. This is a published finite team snapshot through 2026-11-23, not every capstone team, contest participant or informal project group.

Sources: [news.engineering.tamu.edu](https://news.engineering.tamu.edu/news/2026/03/28/qa-with-the-texas-am-baja-engineering-team/), [www.tamuseed.org](https://www.tamuseed.org/about), [fedc.engr.tamu.edu](https://fedc.engr.tamu.edu/)

### `sec-events`

Name an SEC event or program in its website/reminder reference lists

The complete previously imported 67-event weekly-reminder/meeting-reminder catalog, August 2025–October 2026, combined with the original 20 recurring SEC programs. Multiple editions of a recurring event share an answer. Unannounced or later events are outside this dated reference list. The paired since-fall-2025 question remains kept apart.

Sources: [home.sec.tamu.edu](https://home.sec.tamu.edu/), [README.md#the-slack-prompts](README.md#the-slack-prompts)

### `sec-events-2526`

Name an SEC event held in the Aug 2025–Oct 2026 reminder snapshot, internal or external

The complete originally imported public weekly-reminder and meeting-reminder catalog, August 2025 through October 2026. The date range freezes eligibility rather than implying an automatically refreshed current list.

Sources: [README.md#the-slack-prompts](README.md#the-slack-prompts)

### `sec-lunch-and-learns`

Name a company that hosted an SEC Lunch & Learn or Dine & Discuss in the Aug 2025–Oct 2026 reminder snapshot

The complete originally imported public weekly-reminder and meeting-reminder catalog, August 2025 through October 2026. The date range freezes eligibility rather than implying an automatically refreshed current list.

Sources: [README.md#the-slack-prompts](README.md#the-slack-prompts)

### `aggie-traditions`

Name an Aggie tradition or entry in TAMU’s official traditions reference guide

Every named tradition/culture entry in the five official Texas A&M traditions category pages—Aggie Culture, Corps, Gameday, Orientation and Remembrance—plus the original student-tradition reference entries. Informal newly invented practices are outside this finite guide snapshot.

Sources: [www.tamu.edu](https://www.tamu.edu/campus-community/traditions/aggie-culture/index.html), [www.tamu.edu](https://www.tamu.edu/campus-community/traditions/corps-of-cadets/index.html), [www.tamu.edu](https://www.tamu.edu/campus-community/traditions/gameday/index.html), [www.tamu.edu](https://www.tamu.edu/campus-community/traditions/orientation/index.html), [www.tamu.edu](https://www.tamu.edu/campus-community/traditions/remembrance/index.html)

### `zachry-spaces`

Name a Zachry space or landmark in the official tour/reference list (not a numbered classroom)

All individually named spaces/landmarks in the seven stops of Zachry’s official self-guided tour, plus the existing Fischer-center and SEC landmark reference entries. The complex’s E-Quad/outdoor spaces count. Numbered classrooms/study rooms do not count separately; the named ESO office remains an accepted exception.

Sources: [zachry.tamu.edu](https://zachry.tamu.edu/tours/self-guided-tour/), [engineering.tamu.edu](https://engineering.tamu.edu/academics/leach-learning-resource-center/explore.html)

### `sec-nicknames`

Name a nickname or mascot in the SEC-school traditions reference list

Nicknames for the 16 current SEC schools, the previously accepted primary live/costumed mascots, and the named mascot entries in the cited Ole Miss, Kentucky and Oklahoma traditions pages. Mascot generations share a family; Boomer/Sooner and Albert/Alberta count as one pair each. This is the explicitly published reference list, including documented historical entries, not every historical animal’s individual registered name.

Sources: [olemisssports.com](https://olemisssports.com/news/2018/8/11/football-ole-miss-announces-name-of-new-landshark-mascot), [ukathletics.com](https://ukathletics.com/mascots/), [soonersports.com](https://soonersports.com/sports/2023/10/31/ou-mascots)

### `eb-members`

Name a past or current SEC Executive Board member in the October 2026 reference roster

The 28 past/current EB members in the original five-year leadership reference list published in October 2026. This question covers that fixed reference edition; later boards and unlisted earlier terms are outside its stated scope.

Sources: [docs/QUESTION_BANK.md](docs/QUESTION_BANK.md)

### `texas-cities`

Name a Texas city, town or community in the Census/GNIS reference list

All 8,375 originally imported Texas populated-place entries: incorporated cities from Census 2023 estimates, 2020 census-designated places and USGS GNIS unincorporated communities. The question includes communities explicitly rather than incorrectly labelling every entry a city. The imported gazetteer is a dated snapshot, not a live place-name registry.

Sources: [www.census.gov](https://www.census.gov/geographies/reference-files/time-series/geo/gazetteer-files.html), [www.usgs.gov](https://www.usgs.gov/us-board-on-geographic-names/domestic-names)

### `logic-gates`

Name a Boolean logic-gate family with up to two inputs and one output

All 16 Boolean functions of two variables, grouped into 12 gate families: the six symmetric binary gates, buffer/projection, NOT, constant true, constant false, implication and nonimplication. Exchanging input names does not create another family. Quantum gates, multi-output gates, tri-state/non-Boolean outputs and three-or-more-input functions are excluded.

Sources: [www.hyperphysics.phy-astr.gsu.edu](https://www.hyperphysics.phy-astr.gsu.edu/hbase/Electronic/diglog.html), [reference.wolfram.com](https://reference.wolfram.com/language/ref/BooleanFunction.html)

## Verification

- All 80 prompt IDs, the pool, packs, apart groups and scheduling gates are preserved.
- Daily question selection through dive 37 (2026-11-23) is compared against the pre-audit bank.
- Source-label/canonical mapping, alias collisions, tier ordering and gem caps are checked by `tools/check-coverage.mjs`.
- `npm run check` also checks all references and simulates more than 400 daily selections.
- Source catalogs are snapshots; outside additions are eligible only after the stated source scope/catalog is refreshed.
