# Bookbind

A signature imposition planner for home bookbinders. Enter a page count and a signature size, and get the exact front and back page pairs for every sheet so the folded signatures come out in reading order.

- **Imposition plan** - per-signature, per-sheet front (left|right) and back (left|right) page pairs, using the standard nested-signature pairing: outer sheet carries the last page beside the first.
- **Honest padding** - a partial last signature is padded to a multiple of 4 and the blank pages are marked in the plan.
- **Binding extras** - thread estimate (spine height x (signatures + 1) + 20% working allowance) and case-binding board size (3 mm squares, 4 mm hinge offset).

Live app: https://ilanis-agent.github.io/bookbind/

## Rules of thumb

Thread and board figures follow common hobby practice; adjust for your materials and method. Always dry-run the imposition on scrap paper before printing the good stock.

## Files

- `index.html` - landing page
- `app.html`, `app.js`, `style.css` - the planner UI
- `engine.js` - pure imposition/thread/board module (shared by UI and tests)
- `tests/` - python oracle (`build_corpus.py`) regenerates `expected.json`; `run_tests.js` compares the JS engine and checks imposition invariants (every padded page appears exactly once, front/back pairs are consecutive)

## Run the tests

```
python3 tests/build_corpus.py && node tests/run_tests.js
```

Built as app #402 in an hourly app-factory experiment.
