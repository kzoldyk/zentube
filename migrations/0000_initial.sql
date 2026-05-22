CREATE TABLE `users` (
  `id` text PRIMARY KEY NOT NULL,
  `email` text NOT NULL,
  `password_hash` text NOT NULL,
  `created_at` integer NOT NULL
);
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);

CREATE TABLE `sessions` (
  `id` text PRIMARY KEY NOT NULL,
  `user_id` text NOT NULL,
  `token_hash` text NOT NULL,
  `expires_at` integer NOT NULL,
  `created_at` integer NOT NULL,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);
CREATE UNIQUE INDEX `sessions_token_hash_unique` ON `sessions` (`token_hash`);
CREATE INDEX `sessions_user_id_idx` ON `sessions` (`user_id`);

CREATE TABLE `user_interests` (
  `id` text PRIMARY KEY NOT NULL,
  `user_id` text NOT NULL,
  `topic` text NOT NULL,
  `created_at` integer NOT NULL,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);
CREATE UNIQUE INDEX `user_interests_user_topic_unique` ON `user_interests` (`user_id`, `topic`);
CREATE INDEX `user_interests_user_id_idx` ON `user_interests` (`user_id`);

CREATE TABLE `videos` (
  `youtube_id` text PRIMARY KEY NOT NULL,
  `title` text NOT NULL,
  `description` text,
  `thumbnail_url` text,
  `channel_id` text,
  `channel_title` text,
  `duration` text,
  `view_count` text,
  `published_at` integer,
  `created_at` integer NOT NULL,
  `updated_at` integer NOT NULL
);

CREATE TABLE `bookmarks` (
  `id` text PRIMARY KEY NOT NULL,
  `user_id` text NOT NULL,
  `youtube_id` text NOT NULL,
  `note` text,
  `created_at` integer NOT NULL,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`youtube_id`) REFERENCES `videos`(`youtube_id`) ON DELETE CASCADE
);
CREATE UNIQUE INDEX `bookmarks_user_video_unique` ON `bookmarks` (`user_id`, `youtube_id`);
CREATE INDEX `bookmarks_user_id_idx` ON `bookmarks` (`user_id`);

CREATE TABLE `collections` (
  `id` text PRIMARY KEY NOT NULL,
  `user_id` text NOT NULL,
  `name` text NOT NULL,
  `description` text,
  `is_public` integer NOT NULL DEFAULT 0,
  `created_at` integer NOT NULL,
  `updated_at` integer NOT NULL,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);
CREATE INDEX `collections_user_id_idx` ON `collections` (`user_id`);

CREATE TABLE `collection_videos` (
  `collection_id` text NOT NULL,
  `youtube_id` text NOT NULL,
  `order` integer NOT NULL DEFAULT 0,
  `added_at` integer NOT NULL,
  PRIMARY KEY (`collection_id`, `youtube_id`),
  FOREIGN KEY (`collection_id`) REFERENCES `collections`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`youtube_id`) REFERENCES `videos`(`youtube_id`) ON DELETE CASCADE
);

CREATE TABLE `watch_progress` (
  `id` text PRIMARY KEY NOT NULL,
  `user_id` text NOT NULL,
  `youtube_id` text NOT NULL,
  `progress` real NOT NULL DEFAULT 0,
  `updated_at` integer NOT NULL,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`youtube_id`) REFERENCES `videos`(`youtube_id`) ON DELETE CASCADE
);
CREATE UNIQUE INDEX `watch_progress_user_video_unique` ON `watch_progress` (`user_id`, `youtube_id`);
CREATE INDEX `watch_progress_user_id_idx` ON `watch_progress` (`user_id`);
