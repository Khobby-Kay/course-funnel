-- Supabase setup for protected course videos
-- Run in Supabase Dashboard → SQL Editor after creating your project.

-- Private bucket (no public URLs — access only via signed links from your server)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'course-videos',
  'course-videos',
  false,
  524288000,
  array['video/mp4', 'video/webm', 'video/quicktime']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Recommended folder layout when uploading in Storage UI:
--   course-videos/
--     digital-marketing-mastery/
--       m1-l1.mp4
--       m1-l2.mp4
--     social-media-pro/
--       intro.mp4

-- No public SELECT policy — students get short-lived signed URLs from
-- POST /api/courses/[slug]/lessons/[lessonId]/video after payment access check.
