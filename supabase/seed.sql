-- Seed Data for Social Media Analytics Dashboard
--
-- User IDs configured:
-- User A (testuser1): 87b39d2f-504d-4ff3-bab8-4dcf0a96faa4
-- User B (testuser2): 88609596-6b0a-428f-b27e-a7acb8f952a2
--
-- IMPORTANT: Run this after creating the schema and RLS policies
--
-- DESIGN NOTE: Data demonstrates both EMPTY STATE and DATE RANGE PICKER features
-- User A: Posts + metrics from March 2024 (historical data)
--   - Default "Last 30 days" shows empty chart (demonstrates empty state handling)
--   - Selecting "All time" or custom date range reveals their historical data
-- User B: Posts + metrics from current dates (January 2026)
--   - Shows full functionality with populated charts

-- ============================================
-- POSTS DATA FOR USER A (15 posts - OLD DATES for empty state demo)
-- ============================================

INSERT INTO posts (user_id, platform, caption, thumbnail_url, media_type, posted_at, likes, comments, shares, saves, reach, impressions, engagement_rate, permalink) VALUES
-- Instagram posts for User A (2024 dates - will show in table but not in 30-day chart)
('87b39d2f-504d-4ff3-bab8-4dcf0a96faa4', 'instagram', 'Excited to share our latest product launch! Check out the new features', 'https://picsum.photos/seed/post1/400/400', 'image', '2024-03-15T14:30:00Z', 1243, 89, 45, 156, 15420, 18650, 8.20, 'https://instagram.com/p/example1'),
('87b39d2f-504d-4ff3-bab8-4dcf0a96faa4', 'instagram', 'Behind the scenes of our creative process', 'https://picsum.photos/seed/post2/400/400', 'carousel', '2024-03-13T10:15:00Z', 892, 67, 34, 112, 12340, 14890, 7.10, 'https://instagram.com/p/example2'),
('87b39d2f-504d-4ff3-bab8-4dcf0a96faa4', 'instagram', 'Team celebration after hitting our Q1 goals!', 'https://picsum.photos/seed/post3/400/400', 'image', '2024-03-10T16:45:00Z', 2156, 234, 89, 298, 28900, 35670, 9.80, 'https://instagram.com/p/example3'),
('87b39d2f-504d-4ff3-bab8-4dcf0a96faa4', 'instagram', 'New tutorial: How to maximize your engagement', 'https://picsum.photos/seed/post4/400/400', 'video', '2024-03-08T09:00:00Z', 3421, 456, 234, 512, 45670, 56780, 11.20, 'https://instagram.com/p/example4'),
('87b39d2f-504d-4ff3-bab8-4dcf0a96faa4', 'instagram', 'Throwback to our first office space', 'https://picsum.photos/seed/post5/400/400', 'image', '2024-03-05T12:30:00Z', 756, 45, 23, 87, 8900, 10234, 6.50, 'https://instagram.com/p/example5'),
('87b39d2f-504d-4ff3-bab8-4dcf0a96faa4', 'instagram', 'Meet the new addition to our team!', 'https://picsum.photos/seed/post6/400/400', 'image', '2024-03-03T15:20:00Z', 1567, 189, 67, 234, 19800, 24560, 8.90, 'https://instagram.com/p/example6'),
('87b39d2f-504d-4ff3-bab8-4dcf0a96faa4', 'instagram', 'Customer spotlight: How they grew 300% with our tools', 'https://picsum.photos/seed/post7/400/400', 'carousel', '2024-03-01T11:00:00Z', 2890, 312, 156, 423, 38900, 47650, 10.40, 'https://instagram.com/p/example7'),

-- TikTok posts for User A (2024 dates)
('87b39d2f-504d-4ff3-bab8-4dcf0a96faa4', 'tiktok', 'Quick tip: 5 ways to boost your social presence', 'https://picsum.photos/seed/tiktok1/400/400', 'video', '2024-03-14T18:00:00Z', 45670, 1234, 8900, 2340, 234500, 312000, 15.60, 'https://tiktok.com/@example/video1'),
('87b39d2f-504d-4ff3-bab8-4dcf0a96faa4', 'tiktok', 'POV: When your content finally goes viral', 'https://picsum.photos/seed/tiktok2/400/400', 'video', '2024-03-12T20:30:00Z', 89450, 3456, 12340, 4567, 567800, 678900, 18.90, 'https://tiktok.com/@example/video2'),
('87b39d2f-504d-4ff3-bab8-4dcf0a96faa4', 'tiktok', 'Reply to comment: Yes, this really works!', 'https://picsum.photos/seed/tiktok3/400/400', 'video', '2024-03-09T22:15:00Z', 23450, 890, 4560, 1230, 156700, 189000, 12.30, 'https://tiktok.com/@example/video3'),
('87b39d2f-504d-4ff3-bab8-4dcf0a96faa4', 'tiktok', 'A day in the life of a content creator', 'https://picsum.photos/seed/tiktok4/400/400', 'video', '2024-03-07T13:45:00Z', 67890, 2345, 9870, 3456, 345600, 423000, 16.70, 'https://tiktok.com/@example/video4'),
('87b39d2f-504d-4ff3-bab8-4dcf0a96faa4', 'tiktok', 'This hack changed everything for us', 'https://picsum.photos/seed/tiktok5/400/400', 'video', '2024-03-04T17:30:00Z', 34560, 1123, 5670, 1890, 189000, 234500, 14.10, 'https://tiktok.com/@example/video5'),
('87b39d2f-504d-4ff3-bab8-4dcf0a96faa4', 'tiktok', 'Storytime: Our biggest marketing fail', 'https://picsum.photos/seed/tiktok6/400/400', 'video', '2024-03-02T19:00:00Z', 56780, 2890, 7890, 2345, 289000, 356000, 17.20, 'https://tiktok.com/@example/video6'),

-- Additional mixed posts for User A (2024 dates)
('87b39d2f-504d-4ff3-bab8-4dcf0a96faa4', 'instagram', 'Weekend vibes at the office', 'https://picsum.photos/seed/post8/400/400', 'image', '2024-02-28T14:00:00Z', 654, 34, 12, 56, 6780, 7890, 5.40, 'https://instagram.com/p/example8'),
('87b39d2f-504d-4ff3-bab8-4dcf0a96faa4', 'tiktok', 'How we edit our videos - full breakdown', 'https://picsum.photos/seed/tiktok7/400/400', 'video', '2024-02-26T16:30:00Z', 78900, 3456, 11230, 4123, 412300, 498700, 19.30, 'https://tiktok.com/@example/video7');

-- ============================================
-- DAILY METRICS FOR USER A (March 2024 - historical data)
-- Note: Default "Last 30 days" will show empty chart, but using
-- "All time" or custom date range will reveal historical data
-- ============================================

INSERT INTO daily_metrics (user_id, date, engagement, reach) VALUES
('87b39d2f-504d-4ff3-bab8-4dcf0a96faa4', '2024-03-15', 15420, 45670),
('87b39d2f-504d-4ff3-bab8-4dcf0a96faa4', '2024-03-14', 18760, 52340),
('87b39d2f-504d-4ff3-bab8-4dcf0a96faa4', '2024-03-13', 12340, 38900),
('87b39d2f-504d-4ff3-bab8-4dcf0a96faa4', '2024-03-12', 45670, 123400),
('87b39d2f-504d-4ff3-bab8-4dcf0a96faa4', '2024-03-11', 9870, 28900),
('87b39d2f-504d-4ff3-bab8-4dcf0a96faa4', '2024-03-10', 23450, 67890),
('87b39d2f-504d-4ff3-bab8-4dcf0a96faa4', '2024-03-09', 14560, 42300),
('87b39d2f-504d-4ff3-bab8-4dcf0a96faa4', '2024-03-08', 34560, 98700),
('87b39d2f-504d-4ff3-bab8-4dcf0a96faa4', '2024-03-07', 28900, 82300),
('87b39d2f-504d-4ff3-bab8-4dcf0a96faa4', '2024-03-06', 8760, 24560),
('87b39d2f-504d-4ff3-bab8-4dcf0a96faa4', '2024-03-05', 11230, 32100),
('87b39d2f-504d-4ff3-bab8-4dcf0a96faa4', '2024-03-04', 19870, 56780),
('87b39d2f-504d-4ff3-bab8-4dcf0a96faa4', '2024-03-03', 16540, 47890),
('87b39d2f-504d-4ff3-bab8-4dcf0a96faa4', '2024-03-02', 31230, 89700),
('87b39d2f-504d-4ff3-bab8-4dcf0a96faa4', '2024-03-01', 27890, 78900),
('87b39d2f-504d-4ff3-bab8-4dcf0a96faa4', '2024-02-29', 21340, 62300),
('87b39d2f-504d-4ff3-bab8-4dcf0a96faa4', '2024-02-28', 13450, 39800),
('87b39d2f-504d-4ff3-bab8-4dcf0a96faa4', '2024-02-27', 9870, 28700),
('87b39d2f-504d-4ff3-bab8-4dcf0a96faa4', '2024-02-26', 38900, 112300),
('87b39d2f-504d-4ff3-bab8-4dcf0a96faa4', '2024-02-25', 15670, 45600),
('87b39d2f-504d-4ff3-bab8-4dcf0a96faa4', '2024-02-24', 7890, 23400),
('87b39d2f-504d-4ff3-bab8-4dcf0a96faa4', '2024-02-23', 5670, 16780),
('87b39d2f-504d-4ff3-bab8-4dcf0a96faa4', '2024-02-22', 12340, 36700),
('87b39d2f-504d-4ff3-bab8-4dcf0a96faa4', '2024-02-21', 18900, 54300),
('87b39d2f-504d-4ff3-bab8-4dcf0a96faa4', '2024-02-20', 24560, 71200),
('87b39d2f-504d-4ff3-bab8-4dcf0a96faa4', '2024-02-19', 16780, 48900),
('87b39d2f-504d-4ff3-bab8-4dcf0a96faa4', '2024-02-18', 11230, 32400),
('87b39d2f-504d-4ff3-bab8-4dcf0a96faa4', '2024-02-17', 8900, 26700),
('87b39d2f-504d-4ff3-bab8-4dcf0a96faa4', '2024-02-16', 14560, 42100),
('87b39d2f-504d-4ff3-bab8-4dcf0a96faa4', '2024-02-15', 19870, 57800);

-- ============================================
-- POSTS DATA FOR USER B (15 posts - CURRENT DATES for full demo)
-- ============================================

INSERT INTO posts (user_id, platform, caption, thumbnail_url, media_type, posted_at, likes, comments, shares, saves, reach, impressions, engagement_rate, permalink) VALUES
-- Instagram posts for User B (January 2026 - current dates)
('88609596-6b0a-428f-b27e-a7acb8f952a2', 'instagram', 'New collection dropping next week!', 'https://picsum.photos/seed/userb1/400/400', 'image', '2026-01-15T11:00:00Z', 3456, 234, 123, 456, 34560, 42300, 11.20, 'https://instagram.com/p/userb1'),
('88609596-6b0a-428f-b27e-a7acb8f952a2', 'instagram', 'Studio tour - where the magic happens', 'https://picsum.photos/seed/userb2/400/400', 'carousel', '2026-01-13T14:30:00Z', 2345, 178, 89, 234, 23450, 28900, 9.80, 'https://instagram.com/p/userb2'),
('88609596-6b0a-428f-b27e-a7acb8f952a2', 'instagram', 'Collaboration announcement coming soon', 'https://picsum.photos/seed/userb3/400/400', 'image', '2026-01-11T09:15:00Z', 4567, 345, 167, 523, 45670, 56780, 12.30, 'https://instagram.com/p/userb3'),
('88609596-6b0a-428f-b27e-a7acb8f952a2', 'instagram', 'Making of our best-selling product', 'https://picsum.photos/seed/userb4/400/400', 'video', '2026-01-09T16:00:00Z', 5678, 456, 234, 678, 56780, 69000, 13.50, 'https://instagram.com/p/userb4'),
('88609596-6b0a-428f-b27e-a7acb8f952a2', 'instagram', 'Customer review that made us cry', 'https://picsum.photos/seed/userb5/400/400', 'image', '2026-01-07T12:45:00Z', 1890, 234, 78, 189, 18900, 23400, 8.70, 'https://instagram.com/p/userb5'),
('88609596-6b0a-428f-b27e-a7acb8f952a2', 'instagram', 'Flash sale starts NOW!', 'https://picsum.photos/seed/userb6/400/400', 'image', '2026-01-05T08:00:00Z', 6789, 567, 345, 789, 67890, 82300, 14.60, 'https://instagram.com/p/userb6'),
('88609596-6b0a-428f-b27e-a7acb8f952a2', 'instagram', 'Your feedback shaped this update', 'https://picsum.photos/seed/userb7/400/400', 'carousel', '2026-01-03T10:30:00Z', 3210, 289, 145, 321, 32100, 39800, 10.20, 'https://instagram.com/p/userb7'),

-- TikTok posts for User B (January 2026)
('88609596-6b0a-428f-b27e-a7acb8f952a2', 'tiktok', 'Packing orders ASMR', 'https://picsum.photos/seed/userbtik1/400/400', 'video', '2026-01-14T21:00:00Z', 123450, 5670, 23450, 8900, 890000, 1023000, 21.30, 'https://tiktok.com/@userb/video1'),
('88609596-6b0a-428f-b27e-a7acb8f952a2', 'tiktok', 'Day in my life running a small business', 'https://picsum.photos/seed/userbtik2/400/400', 'video', '2026-01-12T15:30:00Z', 89000, 3400, 15670, 5600, 560000, 678000, 18.70, 'https://tiktok.com/@userb/video2'),
('88609596-6b0a-428f-b27e-a7acb8f952a2', 'tiktok', 'What 1000 orders looks like', 'https://picsum.photos/seed/userbtik3/400/400', 'video', '2026-01-10T18:45:00Z', 156000, 7890, 34560, 12340, 1234000, 1456000, 23.10, 'https://tiktok.com/@userb/video3'),
('88609596-6b0a-428f-b27e-a7acb8f952a2', 'tiktok', 'Replying to haters with kindness', 'https://picsum.photos/seed/userbtik4/400/400', 'video', '2026-01-08T20:00:00Z', 45670, 2340, 8900, 3450, 345000, 412000, 15.40, 'https://tiktok.com/@userb/video4'),
('88609596-6b0a-428f-b27e-a7acb8f952a2', 'tiktok', 'How I started with $100', 'https://picsum.photos/seed/userbtik5/400/400', 'video', '2026-01-06T13:00:00Z', 234000, 12340, 56780, 23450, 2340000, 2780000, 26.80, 'https://tiktok.com/@userb/video5'),
('88609596-6b0a-428f-b27e-a7acb8f952a2', 'tiktok', 'Product development process', 'https://picsum.photos/seed/userbtik6/400/400', 'video', '2026-01-04T11:30:00Z', 67800, 3450, 12340, 5670, 567000, 678900, 17.90, 'https://tiktok.com/@userb/video6'),

-- Additional posts for User B
('88609596-6b0a-428f-b27e-a7acb8f952a2', 'instagram', 'End of year reflection', 'https://picsum.photos/seed/userb8/400/400', 'carousel', '2026-01-01T17:00:00Z', 4321, 321, 156, 432, 43210, 52300, 11.90, 'https://instagram.com/p/userb8'),
('88609596-6b0a-428f-b27e-a7acb8f952a2', 'tiktok', 'My 2026 business goals', 'https://picsum.photos/seed/userbtik7/400/400', 'video', '2025-12-31T22:00:00Z', 98700, 4560, 19870, 7890, 789000, 923000, 20.50, 'https://tiktok.com/@userb/video7');

-- ============================================
-- DAILY METRICS FOR USER B ONLY (Last 30 days)
-- Dates: Dec 17, 2025 to Jan 15, 2026
-- User A has NO daily metrics to demonstrate empty state
-- ============================================

INSERT INTO daily_metrics (user_id, date, engagement, reach) VALUES
('88609596-6b0a-428f-b27e-a7acb8f952a2', '2026-01-15', 34560, 98700),
('88609596-6b0a-428f-b27e-a7acb8f952a2', '2026-01-14', 67890, 189000),
('88609596-6b0a-428f-b27e-a7acb8f952a2', '2026-01-13', 28900, 82300),
('88609596-6b0a-428f-b27e-a7acb8f952a2', '2026-01-12', 45670, 127800),
('88609596-6b0a-428f-b27e-a7acb8f952a2', '2026-01-11', 52340, 145600),
('88609596-6b0a-428f-b27e-a7acb8f952a2', '2026-01-10', 89700, 245600),
('88609596-6b0a-428f-b27e-a7acb8f952a2', '2026-01-09', 38900, 108900),
('88609596-6b0a-428f-b27e-a7acb8f952a2', '2026-01-08', 31230, 87600),
('88609596-6b0a-428f-b27e-a7acb8f952a2', '2026-01-07', 23450, 67800),
('88609596-6b0a-428f-b27e-a7acb8f952a2', '2026-01-06', 78900, 218900),
('88609596-6b0a-428f-b27e-a7acb8f952a2', '2026-01-05', 56780, 156700),
('88609596-6b0a-428f-b27e-a7acb8f952a2', '2026-01-04', 41230, 115600),
('88609596-6b0a-428f-b27e-a7acb8f952a2', '2026-01-03', 35670, 98900),
('88609596-6b0a-428f-b27e-a7acb8f952a2', '2026-01-02', 18900, 54300),
('88609596-6b0a-428f-b27e-a7acb8f952a2', '2026-01-01', 27890, 78900),
('88609596-6b0a-428f-b27e-a7acb8f952a2', '2025-12-31', 98700, 267800),
('88609596-6b0a-428f-b27e-a7acb8f952a2', '2025-12-30', 45670, 127800),
('88609596-6b0a-428f-b27e-a7acb8f952a2', '2025-12-29', 31230, 89700),
('88609596-6b0a-428f-b27e-a7acb8f952a2', '2025-12-28', 24560, 71200),
('88609596-6b0a-428f-b27e-a7acb8f952a2', '2025-12-27', 19870, 57800),
('88609596-6b0a-428f-b27e-a7acb8f952a2', '2025-12-26', 12340, 36700),
('88609596-6b0a-428f-b27e-a7acb8f952a2', '2025-12-25', 8900, 26700),
('88609596-6b0a-428f-b27e-a7acb8f952a2', '2025-12-24', 21340, 62300),
('88609596-6b0a-428f-b27e-a7acb8f952a2', '2025-12-23', 34560, 96700),
('88609596-6b0a-428f-b27e-a7acb8f952a2', '2025-12-22', 42300, 118900),
('88609596-6b0a-428f-b27e-a7acb8f952a2', '2025-12-21', 28900, 82300),
('88609596-6b0a-428f-b27e-a7acb8f952a2', '2025-12-20', 15670, 45600),
('88609596-6b0a-428f-b27e-a7acb8f952a2', '2025-12-19', 19870, 57800),
('88609596-6b0a-428f-b27e-a7acb8f952a2', '2025-12-18', 26700, 76500),
('88609596-6b0a-428f-b27e-a7acb8f952a2', '2025-12-17', 38900, 108900);
