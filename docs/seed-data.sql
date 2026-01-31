-- Jones County XC Seed Data
-- Contains all teams, runners, meets, and results

-- Clear existing data (in reverse order of dependencies)
TRUNCATE results, runners, meets, teams RESTART IDENTITY CASCADE;

-- Teams (12 total)
INSERT INTO teams (id, name, school, city, state) VALUES
(1, 'Jones County', 'Jones County High School', 'Gray', 'GA'),
(2, 'Veterans', 'Veterans High School', 'Kathleen', 'GA'),
(3, 'Houston County', 'Houston County High School', 'Warner Robins', 'GA'),
(4, 'Warner Robins', 'Warner Robins High School', 'Warner Robins', 'GA'),
(5, 'Northside', 'Northside High School', 'Warner Robins', 'GA'),
(6, 'Perry', 'Perry High School', 'Perry', 'GA'),
(7, 'Westside', 'Westside High School', 'Macon', 'GA'),
(8, 'Central', 'Central High School', 'Macon', 'GA'),
(9, 'Southwest', 'Southwest High School', 'Macon', 'GA'),
(10, 'Rutland', 'Rutland High School', 'Macon', 'GA'),
(11, 'Howard', 'Howard High School', 'Macon', 'GA'),
(12, 'Northeast', 'Northeast High School', 'Macon', 'GA');

-- Meets (5 total)
INSERT INTO meets (id, name, date, location, distance_meters, course_description) VALUES
(1, 'Region 4-AAAAA Championship', '2026-10-20', 'Gray, GA', 5000, ''),
(2, 'Jones County Invitational', '2026-09-12', 'Gray, GA', 5000, 'Flat course through Jarrell Plantation'),
(3, 'Peach State Classic', '2026-09-26', 'Carrollton, GA', 5000, 'Hilly terrain with challenging final mile'),
(4, 'Run at the Rock', '2026-10-03', 'Conyers, GA', 5000, 'Rolling hills at Georgia International Horse Park'),
(5, 'Pre-Region Tune-Up', '2026-10-10', 'Macon, GA', 5000, 'Fast flat course at Central City Park');

-- Runners (100 total)
INSERT INTO runners (id, first_name, last_name, gender, grade, team_id) VALUES
-- Jones County (17 runners)
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
(36, 'Chloe', 'Mitchell', 'F', 10, 1),

-- Veterans (11 runners)
(12, 'Ethan', 'Jackson', 'M', 12, 2),
(13, 'Noah', 'White', 'M', 11, 2),
(14, 'Liam', 'Harris', 'M', 10, 2),
(15, 'Charlotte', 'Martin', 'F', 12, 2),
(16, 'Amelia', 'Garcia', 'F', 11, 2),
(37, 'Nathan', 'Roberts', 'M', 9, 2),
(38, 'Brandon', 'Turner', 'M', 10, 2),
(39, 'Justin', 'Phillips', 'M', 12, 2),
(40, 'Hannah', 'Evans', 'F', 9, 2),
(41, 'Samantha', 'Edwards', 'F', 10, 2),
(42, 'Ashley', 'Collins', 'F', 11, 2),

-- Houston County (11 runners)
(17, 'Mason', 'Martinez', 'M', 11, 3),
(18, 'Lucas', 'Robinson', 'M', 12, 3),
(19, 'Oliver', 'Clark', 'M', 10, 3),
(20, 'Mia', 'Rodriguez', 'F', 11, 3),
(21, 'Harper', 'Lewis', 'F', 12, 3),
(43, 'Kevin', 'Stewart', 'M', 9, 3),
(44, 'Jason', 'Sanchez', 'M', 11, 3),
(45, 'Aaron', 'Morris', 'M', 12, 3),
(46, 'Lauren', 'Rogers', 'F', 9, 3),
(47, 'Kayla', 'Reed', 'F', 10, 3),
(48, 'Nicole', 'Cook', 'F', 12, 3),

-- Warner Robins (10 runners)
(22, 'Benjamin', 'Lee', 'M', 12, 4),
(23, 'Elijah', 'Walker', 'M', 11, 4),
(24, 'Evelyn', 'Hall', 'F', 12, 4),
(25, 'Abigail', 'Allen', 'F', 10, 4),
(49, 'Dylan', 'Morgan', 'M', 9, 4),
(50, 'Kyle', 'Bell', 'M', 10, 4),
(51, 'Sean', 'Murphy', 'M', 11, 4),
(52, 'Rachel', 'Bailey', 'F', 9, 4),
(53, 'Megan', 'Rivera', 'F', 11, 4),
(54, 'Brittany', 'Cooper', 'F', 12, 4),

-- Perry (11 runners) - Note: team_id 5 is Northside, 6 is Perry
(26, 'Daniel', 'Young', 'M', 10, 5),
(27, 'Alexander', 'King', 'M', 11, 5),
(28, 'Matthew', 'Wright', 'M', 9, 5),
(29, 'Emily', 'Scott', 'F', 11, 5),
(30, 'Elizabeth', 'Green', 'F', 10, 5),
(55, 'Austin', 'Richardson', 'M', 12, 5),
(56, 'Trevor', 'Cox', 'M', 10, 5),
(57, 'Jordan', 'Howard', 'M', 11, 5),
(58, 'Alexis', 'Ward', 'F', 9, 5),
(59, 'Taylor', 'Torres', 'F', 12, 5),
(60, 'Morgan', 'Peterson', 'F', 11, 5),

-- Westside (10 runners)
(61, 'Connor', 'Gray', 'M', 12, 7),
(62, 'Hunter', 'Ramirez', 'M', 11, 7),
(63, 'Cole', 'James', 'M', 10, 7),
(64, 'Chase', 'Watson', 'M', 9, 7),
(65, 'Blake', 'Brooks', 'M', 11, 7),
(66, 'Paige', 'Kelly', 'F', 12, 7),
(67, 'Brooke', 'Sanders', 'F', 11, 7),
(68, 'Sydney', 'Price', 'F', 10, 7),
(69, 'Jasmine', 'Bennett', 'F', 9, 7),
(70, 'Victoria', 'Wood', 'F', 11, 7),

-- Central (10 runners)
(71, 'Caleb', 'Barnes', 'M', 12, 8),
(72, 'Logan', 'Ross', 'M', 11, 8),
(73, 'Ian', 'Henderson', 'M', 10, 8),
(74, 'Garrett', 'Coleman', 'M', 9, 8),
(75, 'Derek', 'Jenkins', 'M', 10, 8),
(76, 'Natalie', 'Perry', 'F', 12, 8),
(77, 'Stephanie', 'Powell', 'F', 11, 8),
(78, 'Jennifer', 'Long', 'F', 10, 8),
(79, 'Amanda', 'Patterson', 'F', 9, 8),
(80, 'Rebecca', 'Hughes', 'F', 11, 8),

-- Southwest (10 runners)
(81, 'Marcus', 'Flores', 'M', 12, 9),
(82, 'Trent', 'Washington', 'M', 11, 9),
(83, 'Bryce', 'Butler', 'M', 10, 9),
(84, 'Jared', 'Simmons', 'M', 9, 9),
(85, 'Cameron', 'Foster', 'M', 11, 9),
(86, 'Danielle', 'Gonzales', 'F', 12, 9),
(87, 'Christina', 'Bryant', 'F', 11, 9),
(88, 'Vanessa', 'Alexander', 'F', 10, 9),
(89, 'Amber', 'Russell', 'F', 9, 9),
(90, 'Michelle', 'Griffin', 'F', 10, 9),

-- Rutland (5 runners)
(91, 'Eric', 'Diaz', 'M', 12, 10),
(92, 'Adam', 'Hayes', 'M', 11, 10),
(93, 'Patrick', 'Myers', 'M', 10, 10),
(94, 'Sara', 'Ford', 'F', 12, 10),
(95, 'Melissa', 'Hamilton', 'F', 11, 10),

-- Howard (5 runners)
(96, 'Scott', 'Graham', 'M', 12, 11),
(97, 'Brian', 'Sullivan', 'M', 11, 11),
(98, 'Steven', 'Wallace', 'M', 10, 11),
(99, 'Jessica', 'West', 'F', 12, 11),
(100, 'Laura', 'Cole', 'F', 11, 11);

-- Results (38 total)
INSERT INTO results (id, runner_id, meet_id, finish_time, place) VALUES
-- Region 4-AAAAA Championship - Boys
(1, 1, 1, '00:17:45', 1),
(2, 2, 1, '00:17:52', 2),
(3, 3, 1, '00:18:15', 5),
(4, 4, 1, '00:18:45', 8),
(5, 5, 1, '00:19:10', 12),
(6, 6, 1, '00:18:02', 3),
(7, 12, 1, '00:17:38', 1),
(8, 13, 1, '00:18:08', 4),
(9, 14, 1, '00:18:30', 6),
(10, 17, 1, '00:18:35', 7),
(11, 18, 1, '00:18:55', 10),
(12, 22, 1, '00:18:48', 9),
(13, 23, 1, '00:19:05', 11),

-- Region 4-AAAAA Championship - Girls
(14, 7, 1, '00:20:15', 2),
(15, 8, 1, '00:19:55', 1),
(16, 9, 1, '00:20:45', 4),
(17, 10, 1, '00:21:10', 6),
(18, 11, 1, '00:21:45', 8),
(19, 15, 1, '00:20:30', 3),
(20, 16, 1, '00:20:55', 5),
(21, 20, 1, '00:21:20', 7),
(22, 21, 1, '00:21:50', 9),
(23, 24, 1, '00:22:05', 10),
(24, 25, 1, '00:22:30', 11),

-- Jones County Invitational
(25, 1, 2, '00:17:30', 1),
(26, 2, 2, '00:17:45', 2),
(27, 3, 2, '00:18:05', 3),
(28, 7, 2, '00:19:45', 1),
(29, 8, 2, '00:19:50', 2),
(30, 12, 2, '00:17:55', 4),
(31, 15, 2, '00:20:15', 3),

-- Peach State Classic
(32, 1, 3, '00:18:10', 3),
(33, 2, 3, '00:18:25', 5),
(34, 6, 3, '00:18:15', 4),
(35, 8, 3, '00:20:30', 2),
(36, 12, 3, '00:17:50', 1),
(37, 13, 3, '00:18:05', 2),
(38, 17, 3, '00:18:40', 6);

-- Reset sequences to match data
SELECT setval('teams_id_seq', 12, true);
SELECT setval('meets_id_seq', 5, true);
SELECT setval('runners_id_seq', 100, true);
SELECT setval('results_id_seq', 38, true);
