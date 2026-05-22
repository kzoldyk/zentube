import {
  index,
  integer,
  primaryKey,
  real,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core"

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull(),
  passwordHash: text("password_hash").notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
})

export const usersEmailIndex = uniqueIndex("users_email_unique").on(users.email)

export const sessions = sqliteTable(
  "sessions",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    tokenHash: text("token_hash").notNull(),
    expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  },
  (table) => ({
    sessionTokenHashUnique: uniqueIndex("sessions_token_hash_unique").on(table.tokenHash),
    sessionsUserIdIdx: index("sessions_user_id_idx").on(table.userId),
  })
)

export const userInterests = sqliteTable(
  "user_interests",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    topic: text("topic").notNull(),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  },
  (table) => ({
    uniqueUserTopic: uniqueIndex("user_interests_user_topic_unique").on(
      table.userId,
      table.topic
    ),
    userInterestsUserIdIdx: index("user_interests_user_id_idx").on(table.userId),
  })
)

export const videos = sqliteTable("videos", {
  youtubeId: text("youtube_id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  thumbnailUrl: text("thumbnail_url"),
  channelId: text("channel_id"),
  channelTitle: text("channel_title"),
  duration: text("duration"),
  viewCount: text("view_count"),
  publishedAt: integer("published_at", { mode: "timestamp_ms" }),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
})

export const bookmarks = sqliteTable(
  "bookmarks",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    youtubeId: text("youtube_id")
      .notNull()
      .references(() => videos.youtubeId, { onDelete: "cascade" }),
    note: text("note"),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  },
  (table) => ({
    uniqueBookmark: uniqueIndex("bookmarks_user_video_unique").on(table.userId, table.youtubeId),
    bookmarksUserIdIdx: index("bookmarks_user_id_idx").on(table.userId),
  })
)

export const collections = sqliteTable(
  "collections",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    description: text("description"),
    isPublic: integer("is_public", { mode: "boolean" }).notNull().default(false),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
  },
  (table) => ({
    collectionsUserIdIdx: index("collections_user_id_idx").on(table.userId),
  })
)

export const collectionVideos = sqliteTable(
  "collection_videos",
  {
    collectionId: text("collection_id")
      .notNull()
      .references(() => collections.id, { onDelete: "cascade" }),
    youtubeId: text("youtube_id")
      .notNull()
      .references(() => videos.youtubeId, { onDelete: "cascade" }),
    order: integer("order").notNull().default(0),
    addedAt: integer("added_at", { mode: "timestamp_ms" }).notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.collectionId, table.youtubeId] }),
  })
)

export const watchProgress = sqliteTable(
  "watch_progress",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    youtubeId: text("youtube_id")
      .notNull()
      .references(() => videos.youtubeId, { onDelete: "cascade" }),
    progress: real("progress").notNull().default(0),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
  },
  (table) => ({
    uniqueProgress: uniqueIndex("watch_progress_user_video_unique").on(
      table.userId,
      table.youtubeId
    ),
    watchProgressUserIdIdx: index("watch_progress_user_id_idx").on(table.userId),
  })
)
