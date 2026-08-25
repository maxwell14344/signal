export interface ScoringCriterionDef {
  key: string;
  group: string;
  label: string;
  description: string;
}

export const SCORING_GROUPS = [
  "Channel Coverage",
  "AI Capability",
  "Inbox & Agent Experience",
  "Native Integrations",
  "Commerce & Business Logic",
  "Reporting & Scale",
] as const;

export const SCORING_CRITERIA: ScoringCriterionDef[] = [
  // Channel coverage
  {
    key: "native-channels",
    group: "Channel Coverage",
    label: "Number of native channels",
    description: "Email, live chat, WhatsApp, SMS, Instagram DM, Facebook Messenger, voice.",
  },
  {
    key: "omnichannel-unification",
    group: "Channel Coverage",
    label: "True omnichannel unification",
    description: "Do all channels land in one thread per customer, or do agents juggle separate inboxes per channel.",
  },

  // AI capability
  {
    key: "ai-availability",
    group: "AI Capability",
    label: "AI availability",
    description: "Is there a genuine AI agent, or just canned \"smart replies.\"",
  },
  {
    key: "ai-resolution-accuracy",
    group: "AI Capability",
    label: "AI resolution accuracy",
    description: "Measurable rate of correctly resolved tickets without escalation — the number vendors most inflate.",
  },
  {
    key: "ai-training-method",
    group: "AI Capability",
    label: "AI training method",
    description: "Does it learn from your help center/docs automatically, or require manual intent-building.",
  },
  {
    key: "hallucination-controls",
    group: "AI Capability",
    label: "Hallucination controls",
    description: "Can it cite sources, restrict itself to approved knowledge, or does it improvise.",
  },
  {
    key: "automation-depth",
    group: "AI Capability",
    label: "Automation depth",
    description: "Simple if/then rules vs. multi-step agentic workflows (routing + tagging + resolution + follow-up).",
  },
  {
    key: "sentiment-intent-detection",
    group: "AI Capability",
    label: "Sentiment/intent detection",
    description: "Can it flag frustrated customers or urgent issues automatically.",
  },

  // Inbox & agent experience
  {
    key: "unified-inbox",
    group: "Inbox & Agent Experience",
    label: "Unified inbox",
    description: "Single pane across all channels, one customer view.",
  },
  {
    key: "ai-human-handoff",
    group: "Inbox & Agent Experience",
    label: "Live chat option alongside AI",
    description: "Seamless AI-to-human handoff without losing context.",
  },
  {
    key: "internal-collaboration",
    group: "Inbox & Agent Experience",
    label: "Internal collaboration tools",
    description: "Internal notes, @mentions, assignment rules.",
  },
  {
    key: "canned-responses",
    group: "Inbox & Agent Experience",
    label: "Canned responses/macros",
    description: "Reusable templates for agents.",
  },

  // Native integrations
  {
    key: "integration-shopify",
    group: "Native Integrations",
    label: "Shopify",
    description: "Order lookups, refunds, order status inside chat.",
  },
  {
    key: "integration-woocommerce",
    group: "Native Integrations",
    label: "WooCommerce",
    description: "Native WooCommerce integration depth.",
  },
  {
    key: "integration-wordpress",
    group: "Native Integrations",
    label: "WordPress",
    description: "As a website widget, not just a plugin embed.",
  },
  {
    key: "integration-wix",
    group: "Native Integrations",
    label: "Wix",
    description: "Native Wix integration depth.",
  },
  {
    key: "integration-squarespace",
    group: "Native Integrations",
    label: "Squarespace",
    description: "Native Squarespace integration depth.",
  },
  {
    key: "integration-webflow",
    group: "Native Integrations",
    label: "Webflow",
    description: "Native Webflow integration depth.",
  },
  {
    key: "integration-automation-platforms",
    group: "Native Integrations",
    label: "Make.com / Zapier / n8n",
    description: "No-code workflow triggers.",
  },
  {
    key: "integration-crm",
    group: "Native Integrations",
    label: "CRM integrations",
    description: "HubSpot, Salesforce, Pipedrive sync.",
  },

  // Commerce/business logic
  {
    key: "order-payment-data-access",
    group: "Commerce & Business Logic",
    label: "Order & payment data access",
    description: "Can the bot actually see order status/tracking, not just talk about it.",
  },
  {
    key: "multi-language-support",
    group: "Commerce & Business Logic",
    label: "Multi-language support",
    description: "Auto-detect and respond in the customer's language.",
  },

  // Reporting & scale
  {
    key: "analytics-depth",
    group: "Reporting & Scale",
    label: "Analytics depth",
    description: "Resolution time, CSAT, deflection rate, agent performance dashboards.",
  },
  {
    key: "pricing-transparency",
    group: "Reporting & Scale",
    label: "Pricing model transparency",
    description: "Per-seat vs. per-resolution vs. per-conversation — this materially changes cost at scale.",
  },
  {
    key: "api-webhook-extensibility",
    group: "Reporting & Scale",
    label: "API/webhook extensibility",
    description: "Can you build custom logic on top, or are you locked into the vendor's workflow builder.",
  },
];
