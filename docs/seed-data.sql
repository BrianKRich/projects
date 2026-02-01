-- Jones County XC Seed Data
-- Contains Jones County team, athletes, meets, events, and results

-- Clear existing data (in reverse order of dependencies)
DELETE FROM results;
DELETE FROM runners;
DELETE FROM meets;
DELETE FROM teams;
DELETE FROM events;

-- Events (cross country race types)
INSERT INTO events (id, name, distance_meters, description) VALUES
(1, '5K Varsity', 5000, '5 kilometer varsity race'),
(2, '5K JV', 5000, '5 kilometer junior varsity race'),
(3, '4K', 4000, '4 kilometer race'),
(4, '3K', 3000, '3 kilometer race'),
(5, '2 Mile', 3219, '2 mile race'),
(6, '1 Mile', 1609, '1 mile race');

-- Teams (Jones County only)
INSERT INTO teams (id, name, school, city, state) VALUES
(1, 'Jones County', 'Jones County High School', 'Gray', 'GA');

-- Meets (5 total)
INSERT INTO meets (id, name, date, location, distance_meters, course_description) VALUES
(1, 'Region 4-AAAAA Championship', '2026-10-20', 'Gray, GA', 5000, ''),
(2, 'Jones County Invitational', '2026-09-12', 'Gray, GA', 5000, 'Flat course through Jarrell Plantation'),
(3, 'Peach State Classic', '2026-09-26', 'Carrollton, GA', 5000, 'Hilly terrain with challenging final mile'),
(4, 'Run at the Rock', '2026-10-03', 'Conyers, GA', 5000, 'Rolling hills at Georgia International Horse Park'),
(5, 'Pre-Region Tune-Up', '2026-10-10', 'Macon, GA', 5000, 'Fast flat course at Central City Park');

-- Jones County Runners (17 athletes)
INSERT INTO runners (id, first_name, last_name, gender, grade, team_id) VALUES
(1, 'John', 'Smith', 'M', 11, 1),
(2, 'Michael', 'Johnson', 'M', 12, 1),
(3, 'David', 'Williams', 'M', 11, 1),
(4, 'James', 'Brown', 'M', 10, 1),
(5, 'Robert', 'Davis', 'M', 9, 1),
(6, 'William', 'Miller', 'M', 12, 1),
(7, 'Emma', 'Wilson', 'F', 11, 1),
(8, 'Olivia', 'Moore', 'F', 12, 1),
(9, 'Sophia', 'Taylor', 'F', 10, 1),
(10, 'Isabella', 'Anderson', 'F', 11, 1),
(11, 'Ava', 'Thomas', 'F', 9, 1),
(31, 'Tyler', 'Adams', 'M', 9, 1),
(32, 'Ryan', 'Nelson', 'M', 10, 1),
(33, 'Joshua', 'Hill', 'M', 11, 1),
(34, 'Andrew', 'Baker', 'M', 12, 1),
(35, 'Grace', 'Campbell', 'F', 9, 1),
(36, 'Chloe', 'Mitchell', 'F', 10, 1);

-- Results for Jones County athletes across all meets
INSERT INTO results (runner_id, meet_id, event_id, finish_time, place) VALUES
-- Meet 1: Region 4-AAAAA Championship
(1, 1, 1, '00:17:45', 3),
(2, 1, 1, '00:17:52', 5),
(3, 1, 1, '00:18:15', 12),
(4, 1, 1, '00:18:45', 22),
(5, 1, 1, '00:19:10', 31),
(6, 1, 1, '00:18:02', 7),
(31, 1, 1, '00:19:35', 38),
(32, 1, 1, '00:18:58', 28),
(33, 1, 1, '00:18:22', 15),
(34, 1, 1, '00:18:38', 19),
(7, 1, 1, '00:20:15', 4),
(8, 1, 1, '00:19:55', 2),
(9, 1, 1, '00:20:45', 8),
(10, 1, 1, '00:21:10', 14),
(11, 1, 1, '00:21:45', 22),
(35, 1, 1, '00:22:15', 28),
(36, 1, 1, '00:21:30', 18),

-- Meet 2: Jones County Invitational
(1, 2, 1, '00:17:30', 1),
(2, 2, 1, '00:17:45', 2),
(3, 2, 1, '00:18:05', 4),
(4, 2, 1, '00:18:32', 8),
(5, 2, 1, '00:18:55', 12),
(6, 2, 1, '00:17:58', 3),
(31, 2, 1, '00:19:22', 18),
(32, 2, 1, '00:18:45', 10),
(33, 2, 1, '00:18:12', 5),
(34, 2, 1, '00:18:28', 7),
(7, 2, 1, '00:19:45', 1),
(8, 2, 1, '00:19:50', 2),
(9, 2, 1, '00:20:25', 4),
(10, 2, 1, '00:20:52', 7),
(11, 2, 1, '00:21:28', 12),
(35, 2, 1, '00:21:58', 16),
(36, 2, 1, '00:21:12', 10),

-- Meet 3: Peach State Classic
(1, 3, 1, '00:18:10', 3),
(2, 3, 1, '00:18:25', 5),
(3, 3, 1, '00:18:48', 9),
(4, 3, 1, '00:19:15', 15),
(5, 3, 1, '00:19:42', 22),
(6, 3, 1, '00:18:15', 4),
(31, 3, 1, '00:20:05', 28),
(32, 3, 1, '00:19:28', 18),
(33, 3, 1, '00:18:55', 11),
(34, 3, 1, '00:19:08', 13),
(7, 3, 1, '00:20:45', 3),
(8, 3, 1, '00:20:30', 2),
(9, 3, 1, '00:21:18', 7),
(10, 3, 1, '00:21:48', 12),
(11, 3, 1, '00:22:25', 18),
(35, 3, 1, '00:22:52', 22),
(36, 3, 1, '00:22:02', 14),

-- Meet 4: Run at the Rock
(1, 4, 1, '00:17:52', 2),
(2, 4, 1, '00:18:08', 4),
(3, 4, 1, '00:18:32', 8),
(4, 4, 1, '00:18:58', 14),
(5, 4, 1, '00:19:25', 20),
(6, 4, 1, '00:17:55', 3),
(31, 4, 1, '00:19:48', 25),
(32, 4, 1, '00:19:12', 17),
(33, 4, 1, '00:18:38', 10),
(34, 4, 1, '00:18:52', 12),
(7, 4, 1, '00:20:28', 3),
(8, 4, 1, '00:20:12', 2),
(9, 4, 1, '00:21:02', 7),
(10, 4, 1, '00:21:32', 12),
(11, 4, 1, '00:22:08', 18),
(35, 4, 1, '00:22:38', 22),
(36, 4, 1, '00:21:45', 14),

-- Meet 5: Pre-Region Tune-Up
(1, 5, 1, '00:17:22', 1),
(2, 5, 1, '00:17:38', 3),
(3, 5, 1, '00:17:58', 5),
(4, 5, 1, '00:18:25', 10),
(5, 5, 1, '00:18:48', 15),
(6, 5, 1, '00:17:42', 4),
(31, 5, 1, '00:19:15', 22),
(32, 5, 1, '00:18:38', 12),
(33, 5, 1, '00:18:02', 6),
(34, 5, 1, '00:18:18', 8),
(7, 5, 1, '00:19:32', 2),
(8, 5, 1, '00:19:18', 1),
(9, 5, 1, '00:20:08', 4),
(10, 5, 1, '00:20:38', 8),
(11, 5, 1, '00:21:12', 14),
(35, 5, 1, '00:21:42', 18),
(36, 5, 1, '00:20:52', 10);
