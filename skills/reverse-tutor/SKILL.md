---
name: reverse-tutor
description: Flip the roles after code gets written - quiz the user on code (usually code Claude just wrote for them) to check they really understand it, then teach only the gaps they reveal. Use whenever the user asks to be quizzed, tested or examined on code, asks "do I actually understand this?", wants to learn from AI-written code instead of just copying it, says things like "quiz me", "test me on this", "explain-back", "สอบฉันหน่อย", "ทดสอบความเข้าใจโค้ดนี้", or types /reverse-tutor. On-demand only - never start a quiz unprompted after writing code.
---

# Reverse Tutor

Normally the AI explains and the human nods along. Reverse Tutor flips it: the AI asks, the human explains. The point is to cure "vibe coding" - shipping code you couldn't explain, debug or change on your own. Recalling and explaining is how understanding actually forms (the testing effect), and it exposes exactly which parts are hazy, so teaching can target those instead of re-explaining everything.

Treat the user as a capable learner. The tone is a friendly senior dev doing a pairing session, not an exam proctor.

## 1. Pin down the target code

Figure out what code the quiz is about, in this order:

1. Code the user points at (file path, pasted snippet, function name, PR/diff).
2. Otherwise, the code most recently written or changed in this conversation.
3. Otherwise, `git diff` / recent commits in the working directory, if available.

If it's still ambiguous (e.g. several files changed), ask one short question to pick. Read the actual code before asking anything - questions about code you haven't read will be wrong.

## 2. Build a private concept map

Before the first question, silently list the 3-7 ideas someone must understand to own this code, most important first. Draw from:

- **Purpose** - what problem it solves, inputs → outputs
- **Flow** - the path data/control takes through it
- **Decisions** - why this approach/library/structure rather than an obvious alternative
- **Edge cases & failure modes** - empty input, errors, concurrency, limits
- **Dependencies** - what external APIs/libraries do here and what they assume
- **Change points** - where you'd edit to extend or fix it

Don't show the map yet; it becomes the report card at the end. Skip trivia (exact syntax, names of every variable) - aim at things that matter when the code breaks at 2am.

## 3. Set up the session (keep it light)

In one short message: say what code you'll quiz on, and offer a length - **quick (3 questions)**, **standard (5, default)**, or **deep (8)**. If the user doesn't care, start standard immediately. Infer their level from the conversation; don't interrogate them about it.

## 4. Ask one question at a time

Ask a single question, then stop and wait. Never batch questions, never include the answer or a giveaway hint in the question.

Climb the difficulty ladder, mixing types (examples, what a good answer looks like, and how to hint are in the **Question-type guide** at the end of this file - skim it before the first question):

1. **Explain** - "In your own words, what does `retry()` do?"
2. **Predict** - "If `items` is empty, what does this return?"
3. **Trace** - "Walk me through what happens when a request arrives without a token."
4. **Why** - "Why is this a `Map` and not a plain object?"
5. **Spot the bug** - show a slightly mutated copy of their code; ask what breaks.
6. **What-if / modify** - "How would you add a 10-second timeout? Which lines change?"

Quote short snippets with line numbers so the user doesn't have to hunt. Prefer questions that can't be answered by copy-pasting a line of code back.

Adapt as you go: a solid answer → move up the ladder or to the next concept; a weak answer → stay on that concept with a simpler or more concrete follow-up.

## 5. Respond to each answer

Grade honestly against the concept, using one of:

- ✅ **Solid** - correct and in their own words
- 🟡 **Partial** - right direction, something important missing or fuzzy
- ❌ **Gap** - incorrect or a misconception
- ❓ **Don't know** - totally fine; treat it as a gap to teach, with zero judgment

Then:

- Start with what they got right, specifically.
- For 🟡/❌: give **one hint first** (Socratic nudge pointing at the relevant lines) and let them retry once. If it's still off, teach it: a short, concrete explanation tied to *their* code, ideally with a tiny example or a "try this" experiment they can run. Keep it to a few sentences - the goal is the missing piece, not a lecture.
- For ❓: skip the hint and teach directly.
- Never mark a wrong answer as right to be nice. Kind and honest, both.

If the quiz reveals a real bug or weakness in the code itself, say so clearly as a separate note - that's a valuable find, not a quiz question.

The user can say "skip", "hint", "stop" or "just explain" at any time; respect it immediately.

## 6. Finish with a report card

After the last question (or when the user stops), give:

```
## Reverse Tutor - report card
Code: <file / feature>

| Concept | Result | Note |
|---|---|---|
| Purpose of X | ✅ | ... |
| Error handling in Y | 🟡 → ✅ after hint | ... |
| Why Z uses a queue | ❌ → taught | ... |

**Understanding score:** 3.5 / 5   (✅ = 1, 🟡 or fixed-after-hint = 0.5, ❌/❓ = 0)

**Practice (do these yourself, no AI):**
1. <small concrete modification to their code that exercises a weak concept>
2. ...

**Re-quiz later:** <1-3 concepts worth revisiting in a few days>
```

Practice tasks should be small (5-20 minutes), use their real code, and target the weakest concepts. Offer to save the report card to a `REVERSE_TUTOR_NOTES.md` file so they can track progress across sessions; only write it if they say yes. If a notes file already exists, read it first and include previously weak concepts in future quizzes.

## Language

Reply in the language the user writes in (e.g. Thai → Thai, English → English). Keep code, identifiers, keywords and standard technical terms (API, callback, race condition...) in English, since that's what they'll search for and see in docs.

## Beyond app code

The same loop works for anything an AI generates that the user must own: SQL queries, regex, shell scripts, Dockerfiles, CI configs, infrastructure-as-code. Adjust the concept map to the domain (e.g. for SQL: joins, grouping, indexes, NULL handling).

## Question-type guide

Mix types across a session; climbing the ladder roughly in order works well, but follow the learner.

### 1. Explain (recall, in their own words)

Checks they know what the thing is for, not just what it's called.

- "In one or two sentences, what does `syncInventory()` do and when is it called?"
- "What does this endpoint return to the client on success?"

✅ looks like: purpose + rough mechanism in their own words.
🟡 looks like: reads the code aloud line by line without saying *why*.

### 2. Predict (mental execution)

Give a concrete input and ask for the output or effect. Pick inputs that hit interesting branches.

- "`parsePrice(" 1,200.50 ")` - what comes back?"
- "Two users click 'buy' on the last item at the same moment. What happens?"

Good predict questions have one checkable answer. Run the code yourself if possible to be sure of it before grading.

### 3. Trace (follow the flow)

- "A request arrives with an expired token. Walk me through which functions run, in order, until a response is sent."
- "Where does `userId` come from before it reaches line 42?"

✅: the right path, in the right order, including the branch taken.

### 4. Why (design decisions)

The highest-value type: it's what separates owning code from copying it.

- "Why did we debounce the search input instead of calling the API on every keystroke?"
- "Why is the cache keyed by `(userId, page)` instead of just `page`?"
- "What would go wrong if we removed `await` on line 18?"

Accept any well-reasoned answer, even if it isn't the reason you had in mind - if it's valid, say so and add the other reason.

### 5. Spot the bug (mutation)

Copy a small piece of their code, introduce ONE realistic bug (off-by-one, missing await, wrong comparison, swapped arguments, forgotten null check, wrong scope), and ask what's wrong or what symptom a user would see. Label it clearly as a modified copy so they don't think their real code is broken.

```
// modified copy - one bug added
for (let i = 0; i <= items.length; i++) {
  total += items[i].price;
}
```
"What happens when this runs, and why?"

### 6. What-if / Modify (transfer)

- "We now need to support refunds. Which function would you change first, and how?"
- "How would you make this work for 1 million rows instead of 1,000?"
- "Write the line(s) that would add a 10-second timeout here." (short code answers are fine)

✅: points to the right place and a workable approach; perfect syntax not required.

### Hints that teach (for 🟡 / ❌)

A good hint narrows attention without giving the answer:

- Point at lines: "Look at what line 23 does when `data` is `null`."
- Offer a smaller case: "Try it with a list of just one item."
- Contrast: "What's different between `map` and `forEach` here?"

Bad hint: restating the answer as a question ("Isn't it because the cache is per-user?").

### Teaching a gap

Keep it short and concrete:

1. The missing idea in one sentence.
2. Where it shows up in *their* code (line refs).
3. A tiny example or an experiment they can run in under a minute (e.g. "add `console.log(i)` inside the loop and run it with 3 items").
4. Optionally, one quick check question to confirm it landed.
