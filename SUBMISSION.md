# Inspire by KGL — ChatGPT plugin submission pack

Status: DRAFT. Cash approves every word below before it is submitted.

## Listing

- **Display name (≤30):** Inspire by KGL
- **Subtitle (≤30):** One verified line a day
- **Category:** Creativity
- **Developer name:** JoinThePOD LLC
- **Long description (draft):**
  Inspire is a small library of lines worth keeping. Each one carries its source, so you always know where it came from.
  Keep it, give it to someone, or open the Keep. Give. Live. shop to see printed pieces.
  Nothing is invented: if a line isn't in the library, Inspire says so.
- **Starter prompts (≤128 each):**
  1. Give me today's line.
  2. Find me a line about giving.
  3. Show "Not all giving must be announced." on a card in Loess.

## Required URLs (Cash to supply, all HTTPS)

| Field | Proposed |
| --- | --- |
| websiteURL | https://keepgivelive.com |
| supportURL | https://keepgivelive.com/pages/contact |
| privacyPolicyURL | https://keepgivelive.com/policies/privacy-policy |
| termsOfServiceURL | https://keepgivelive.com/policies/terms-of-service |

The server stores no personal data, uses no sign-in and no cookies. The privacy policy should say that in plain words.

## Positive test cases (5)

| # | Prompt | Expected tools | Expected behavior |
| --- | --- | --- | --- |
| 1 | Give me today's line. | get_daily_line | Returns one library line with its source. |
| 2 | Show me today's line on a card. | get_daily_line, show_card | Card renders with the line, source and a shade band. |
| 3 | Find me a line about giving. | find_lines (theme: give) | Lists matching lines with sources only from the library. |
| 4 | Put "Keep is where it starts." on a card in Bamboo. | find_lines, show_card (shade: bamboo) | Card renders in Bamboo. |
| 5 | Anything about having enough? | find_lines (theme: enough) | Returns "Stop when you have enough." and related lines. |

## Negative test cases (3)

Prompts where Inspire should NOT be called; ChatGPT answers on its own.

| # | Scenario | Prompt |
| --- | --- | --- |
| 1 | Famous-quote lookup; Inspire is a curated library, not a quote search | Find me a famous Steve Jobs quote about innovation for my slides. |
| 2 | Greeting-card design; Inspire cards only show library lines | Design a birthday card for my mom with balloons and her name on it. |
| 3 | Phone-case shopping; Inspire links to the shop but doesn't recommend products | What's the best protective case for an iPhone 16 Pro? |

## Release notes (visible to users)

First release. Ask for today's line, find a line about keeping, giving, living, enough, rest or gratitude, and set it on a card in one of five shades. Every line shows its source.

## Still needed before submitting

- [ ] OpenAI organization verified as JoinThePOD LLC (Platform dashboard → organization settings)
- [x] First pack approved by Cash (8 own lines, 11 Oct 2026)
- [ ] Square icon, at least 48×48 px (the KGL avatar works)
- [ ] Video walkthrough URL (a 1–2 minute screen recording in ChatGPT developer mode)
- [x] Deployed HTTPS endpoint: https://inspire.keepgivelive.com/mcp
- [ ] Release notes: "First release: daily line, find lines, card."
