import {
  pgTable,
  serial,
  text,
  varchar,
  boolean,
  integer,
  jsonb,
  timestamp,
  pgEnum,
  uniqueIndex,
  numeric,
} from "drizzle-orm/pg-core";

export const statusEnum = pgEnum("status", ["draft", "published"]);
export const sentimentEnum = pgEnum("sentiment", ["positive", "negative", "mixed"]);

export const authors = pgTable("authors", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 120 }).notNull().unique(),
  name: text("name").notNull(),
  bio: text("bio").notNull(),
  credentials: text("credentials"),
  avatarUrl: text("avatar_url"),
  sameAs: jsonb("same_as").$type<string[]>().default([]),
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 120 }).notNull().unique(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  icon: varchar("icon", { length: 60 }),
  sortOrder: integer("sort_order").default(0),
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export interface PricingPlan {
  name: string;
  price: string;
  billing: string;
  notes?: string;
}
export interface FaqEntry {
  question: string;
  answer: string;
}
export interface ScorecardEntry {
  dimension: string;
  score: number;
  note?: string;
}
export interface CompanyInfo {
  founded?: string;
  hq?: string;
  funding?: string;
  employees?: string;
}
export interface SentimentQuote {
  quote: string;
  source: string;
  url: string;
  sentiment: "positive" | "negative" | "mixed";
}

export const tools = pgTable("tools", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 120 }).notNull().unique(),
  name: text("name").notNull(),
  logoUrl: text("logo_url"),
  website: text("website").notNull(),
  tagline: text("tagline").notNull(),
  tldr: jsonb("tldr").$type<string[]>().notNull().default([]),

  channels: jsonb("channels").$type<string[]>().default([]),
  keyFeatures: jsonb("key_features").$type<string[]>().default([]),
  companyInfo: jsonb("company_info").$type<CompanyInfo>(),
  faq: jsonb("faq").$type<FaqEntry[]>().default([]),
  scorecard: jsonb("scorecard").$type<ScorecardEntry[]>().default([]),

  pricingModel: text("pricing_model"),
  pricingStartingPrice: text("pricing_starting_price"),
  pricingPlans: jsonb("pricing_plans").$type<PricingPlan[]>().default([]),

  pros: jsonb("pros").$type<string[]>().default([]),
  cons: jsonb("cons").$type<string[]>().default([]),
  sentimentQuotes: jsonb("sentiment_quotes").$type<SentimentQuote[]>().default([]),
  bestFor: jsonb("best_for").$type<string[]>().default([]),
  verdict: text("verdict"),

  rating: numeric("rating", { precision: 2, scale: 1 }),
  trending: boolean("trending").default(false),

  status: statusEnum("status").notNull().default("published"),
  authorId: integer("author_id").references(() => authors.id),
  lastVerifiedAt: timestamp("last_verified_at"),
  version: integer("version").notNull().default(1),
  dateAdded: timestamp("date_added").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const toolCategories = pgTable(
  "tool_categories",
  {
    id: serial("id").primaryKey(),
    toolId: integer("tool_id")
      .notNull()
      .references(() => tools.id, { onDelete: "cascade" }),
    categoryId: integer("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
    isPrimary: boolean("is_primary").notNull().default(false),
  },
  (t) => ({
    uniq: uniqueIndex("tool_category_uniq").on(t.toolId, t.categoryId),
  })
);

export interface FeatureMatrixRow {
  feature: string;
  toolA: string | boolean;
  toolB: string | boolean;
}

export const comparisons = pgTable(
  "comparisons",
  {
    id: serial("id").primaryKey(),
    slug: varchar("slug", { length: 160 }).notNull().unique(),
    toolAId: integer("tool_a_id")
      .notNull()
      .references(() => tools.id),
    toolBId: integer("tool_b_id")
      .notNull()
      .references(() => tools.id),
    tldr: jsonb("tldr").$type<string[]>().default([]),
    featureMatrix: jsonb("feature_matrix").$type<FeatureMatrixRow[]>().default([]),
    verdict: text("verdict"),
    status: statusEnum("status").notNull().default("published"),
    authorId: integer("author_id").references(() => authors.id),
    lastVerifiedAt: timestamp("last_verified_at"),
    version: integer("version").notNull().default(1),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (t) => ({
    pairUniq: uniqueIndex("comparison_pair_uniq").on(t.toolAId, t.toolBId),
  })
);

export const alternativePages = pgTable("alternative_pages", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 160 }).notNull().unique(),
  anchorToolId: integer("anchor_tool_id")
    .notNull()
    .references(() => tools.id),
  title: text("title").notNull(),
  intro: text("intro"),
  status: statusEnum("status").notNull().default("published"),
  authorId: integer("author_id").references(() => authors.id),
  lastVerifiedAt: timestamp("last_verified_at"),
  version: integer("version").notNull().default(1),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const alternativeEntries = pgTable("alternative_entries", {
  id: serial("id").primaryKey(),
  pageId: integer("page_id")
    .notNull()
    .references(() => alternativePages.id, { onDelete: "cascade" }),
  toolId: integer("tool_id")
    .notNull()
    .references(() => tools.id),
  blurb: text("blurb").notNull(),
  sortOrder: integer("sort_order").default(0),
});

export const useCasePages = pgTable("use_case_pages", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 160 }).notNull().unique(),
  title: text("title").notNull(),
  intro: text("intro"),
  status: statusEnum("status").notNull().default("published"),
  authorId: integer("author_id").references(() => authors.id),
  lastVerifiedAt: timestamp("last_verified_at"),
  version: integer("version").notNull().default(1),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const useCaseToolEntries = pgTable("use_case_tool_entries", {
  id: serial("id").primaryKey(),
  pageId: integer("page_id")
    .notNull()
    .references(() => useCasePages.id, { onDelete: "cascade" }),
  toolId: integer("tool_id")
    .notNull()
    .references(() => tools.id),
  blurb: text("blurb").notNull(),
  sortOrder: integer("sort_order").default(0),
});

export const settings = pgTable("settings", {
  key: varchar("key", { length: 100 }).primaryKey(),
  value: text("value").notNull(),
});

export const contentRevisions = pgTable("content_revisions", {
  id: serial("id").primaryKey(),
  entityType: varchar("entity_type", { length: 40 }).notNull(),
  entityId: integer("entity_id").notNull(),
  version: integer("version").notNull(),
  snapshot: jsonb("snapshot").notNull(),
  savedAt: timestamp("saved_at").defaultNow(),
});
