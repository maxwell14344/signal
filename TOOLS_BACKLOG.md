# Tool Backlog — 25-Criteria Rubric Rollout

Tracks progress adding new tools and re-scoring existing ones against the
25-criteria rubric (`lib/scoringCriteria.ts`). Each tool = full profile
(TLDR, pricing, channels, features, capabilities, FAQ, pros/cons,
sentiment quotes, verdict) + `criteriaScores` scored against the
25-criteria rubric. New tools do NOT get a legacy 5-dimension `scorecard`
entry — that system is being phased out, so new tools launch straight
into the new rubric.

**Status: paused after a partial first batch.** Batch-mode (10 tools
dispatched in parallel via background research agents) hit reliability
problems — several agents crashed or stalled mid-research, and the
throughput/quality tradeoff wasn't worth it. Going forward, tools are
added **one at a time** rather than in parallel batches. The full
candidate list below is preserved for reference; batch/priority grouping
no longer applies going forward.

## Re-score existing tools (not yet on the 25-criteria rubric)

- [x] ManyChat
- [x] Tidio
- [x] SiteGPT
- [x] Wonderchat

## Added so far (one-off + partial batch 1)

- [x] Freshchat
- [x] Freshdesk (retried solo, one at a time — succeeded)
- [x] Gorgias (retried solo — succeeded)
- [x] Groove (retried solo — succeeded; company rebranded to Helply mid-2026, documented in the profile)
- [x] Help Scout
- [x] HubSpot Service Hub
- [x] Kayako
- [x] LiveChat
- [x] Olark
- [x] Tawk.to (retried solo — succeeded)
- [x] Gladly
- [x] Front
- [x] Re:amaze (acquired by GoDaddy in 2021, noted in profile)
- [x] Chaport (flagged as not genuine AI — rule-based chatbot builder, not LLM-based)
- [x] Userlike (rebranded to Lime Connect in Sept 2025, noted in profile)
- [x] LiveAgent
- [x] Respond.io
- [x] SleekFlow (public pricing conflicting across sources, noted in profile)
- [x] Trengo
- [x] Interakt (shares founder with Haptik, AI powered by Haptik's platform, noted in profile)
- [x] Wati (flagged serious repeated billing/cancellation complaints in reviews)

## Attempted, failed, not yet retried

(none remaining — all four retried solo, one at a time, and succeeded)

## Remaining candidates (not yet started)

Live Chat & Helpdesk: (all done — see "Added so far" below)

WhatsApp / Omnichannel Messaging: AiSensy, Yellow.ai, Twilio Flex,
MessageBird (Bird), Zoko, DelightChat, Charles, Gallabox, Verloop,
Haptik, Kommo, 360dialog, Rasayel

Chatbot / Automation Builders: Chatfuel, Landbot, Botpress, YourGPT,
Voiceflow, MobileMonkey, Drift, Ada, Ultimate.ai, Cognigy, Kore.ai,
Zowie, Forethought, Decagon, Sierra

AI Agentic Platforms: Crescendo, Aidbase, eesel AI, Siena AI

Enterprise / CRM-adjacent: Salesforce Service Cloud, Microsoft Dynamics
365 Customer Service, SAP Service Cloud, Genesys, NICE CXone, Five9,
Talkdesk, Verint

Community / Ticketing-adjacent: Zoho Desk, Jira Service Management,
osTicket, Spiceworks, SupportBee, HelpCrunch, Comm100

## Notes

- Skipped as duplicates of existing tools: Intercom Fin (covered by the
  existing Intercom profile), Zendesk AI (covered by the existing Zendesk
  profile).
- Already in the system before this backlog: Chatbase, Crisp, Heyy,
  Intercom, ManyChat, SiteGPT, Tidio, Wonderchat, Zendesk.
- Along the way, real pricing corrections were found and fixed on
  Chatbase and SiteGPT (both had the annual-discounted rate mislabeled as
  the flat monthly price) and Heyy (pricing was undocumented, now public).
