-- Jones County XC Seed Data

-- Clear existing data
DELETE FROM results;
DELETE FROM athletes;
DELETE FROM meets;
DELETE FROM coaches;

-- Athletes (17 Jones County runners)
INSERT INTO athletes (id, name, gender, grade, personal_record, events) VALUES
(1, 'John Smith', 'M', 11, '17:22', '5K Varsity'),
(2, 'Michael Johnson', 'M', 12, '17:38', '5K Varsity'),
(3, 'David Williams', 'M', 11, '17:58', '5K Varsity'),
(4, 'James Brown', 'M', 10, '18:25', '5K Varsity, 5K JV'),
(5, 'Robert Davis', 'M', 9, '18:48', '5K JV'),
(6, 'William Miller', 'M', 12, '17:42', '5K Varsity'),
(7, 'Emma Wilson', 'F', 11, '19:32', '5K Varsity'),
(8, 'Olivia Moore', 'F', 12, '19:18', '5K Varsity'),
(9, 'Sophia Taylor', 'F', 10, '20:08', '5K Varsity, 5K JV'),
(10, 'Isabella Anderson', 'F', 11, '20:38', '5K Varsity'),
(11, 'Ava Thomas', 'F', 9, '21:12', '5K JV'),
(12, 'Tyler Adams', 'M', 9, '19:15', '5K JV'),
(13, 'Ryan Nelson', 'M', 10, '18:38', '5K Varsity, 5K JV'),
(14, 'Joshua Hill', 'M', 11, '18:02', '5K Varsity'),
(15, 'Andrew Baker', 'M', 12, '18:18', '5K Varsity'),
(16, 'Grace Campbell', 'F', 9, '21:42', '5K JV'),
(17, 'Chloe Mitchell', 'F', 10, '20:52', '5K Varsity, 5K JV');

-- Meets (5 total)
INSERT INTO meets (id, name, date, location, description) VALUES
(1, 'Region 4-AAAAA Championship', '2026-10-20', 'Gray, GA', 'Regional championship meet'),
(2, 'Jones County Invitational', '2026-09-12', 'Gray, GA', 'Flat course through Jarrell Plantation'),
(3, 'Peach State Classic', '2026-09-26', 'Carrollton, GA', 'Hilly terrain with challenging final mile'),
(4, 'Run at the Rock', '2026-10-03', 'Conyers, GA', 'Rolling hills at Georgia International Horse Park'),
(5, 'Pre-Region Tune-Up', '2026-10-10', 'Macon, GA', 'Fast flat course at Central City Park');

-- Results
INSERT INTO results (athlete_id, meet_id, time, place) VALUES
-- Meet 1: Region 4-AAAAA Championship
(1, 1, '17:45', 3),
(2, 1, '17:52', 5),
(3, 1, '18:15', 12),
(4, 1, '18:45', 22),
(5, 1, '19:10', 31),
(6, 1, '18:02', 7),
(12, 1, '19:35', 38),
(13, 1, '18:58', 28),
(14, 1, '18:22', 15),
(15, 1, '18:38', 19),
(7, 1, '20:15', 4),
(8, 1, '19:55', 2),
(9, 1, '20:45', 8),
(10, 1, '21:10', 14),
(11, 1, '21:45', 22),
(16, 1, '22:15', 28),
(17, 1, '21:30', 18),

-- Meet 2: Jones County Invitational
(1, 2, '17:30', 1),
(2, 2, '17:45', 2),
(3, 2, '18:05', 4),
(4, 2, '18:32', 8),
(5, 2, '18:55', 12),
(6, 2, '17:58', 3),
(12, 2, '19:22', 18),
(13, 2, '18:45', 10),
(14, 2, '18:12', 5),
(15, 2, '18:28', 7),
(7, 2, '19:45', 1),
(8, 2, '19:50', 2),
(9, 2, '20:25', 4),
(10, 2, '20:52', 7),
(11, 2, '21:28', 12),
(16, 2, '21:58', 16),
(17, 2, '21:12', 10),

-- Meet 3: Peach State Classic
(1, 3, '18:10', 3),
(2, 3, '18:25', 5),
(3, 3, '18:48', 9),
(4, 3, '19:15', 15),
(5, 3, '19:42', 22),
(6, 3, '18:15', 4),
(12, 3, '20:05', 28),
(13, 3, '19:28', 18),
(14, 3, '18:55', 11),
(15, 3, '19:08', 13),
(7, 3, '20:45', 3),
(8, 3, '20:30', 2),
(9, 3, '21:18', 7),
(10, 3, '21:48', 12),
(11, 3, '22:25', 18),
(16, 3, '22:52', 22),
(17, 3, '22:02', 14),

-- Meet 4: Run at the Rock
(1, 4, '17:52', 2),
(2, 4, '18:08', 4),
(3, 4, '18:32', 8),
(4, 4, '18:58', 14),
(5, 4, '19:25', 20),
(6, 4, '17:55', 3),
(12, 4, '19:48', 25),
(13, 4, '19:12', 17),
(14, 4, '18:38', 10),
(15, 4, '18:52', 12),
(7, 4, '20:28', 3),
(8, 4, '20:12', 2),
(9, 4, '21:02', 7),
(10, 4, '21:32', 12),
(11, 4, '22:08', 18),
(16, 4, '22:38', 22),
(17, 4, '21:45', 14),

-- Meet 5: Pre-Region Tune-Up
(1, 5, '17:22', 1),
(2, 5, '17:38', 3),
(3, 5, '17:58', 5),
(4, 5, '18:25', 10),
(5, 5, '18:48', 15),
(6, 5, '17:42', 4),
(12, 5, '19:15', 22),
(13, 5, '18:38', 12),
(14, 5, '18:02', 6),
(15, 5, '18:18', 8),
(7, 5, '19:32', 2),
(8, 5, '19:18', 1),
(9, 5, '20:08', 4),
(10, 5, '20:38', 8),
(11, 5, '21:12', 14),
(16, 5, '21:42', 18),
(17, 5, '20:52', 10);

-- Coaches (5 staff)
INSERT INTO coaches (id, name, title, bio) VALUES
(1, 'Dan Callahan', 'Head Coach', 'Dedicated to developing young athletes and building a championship program.'),
(2, 'Sara Whitfield', 'Assistant Coach', 'Focuses on meet-day strategy and race preparation.'),
(3, 'Marcus Tate', 'Assistant Coach', 'Specializes in strength training and injury prevention.'),
(4, 'Linda Harrow', 'Assistant Coach', 'Oversees JV development and freshman integration.'),
(5, 'Kevin Brandt', 'Assistant Coach - Administration', 'Handles scheduling, communications, and team logistics.');
