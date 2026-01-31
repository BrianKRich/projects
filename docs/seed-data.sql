--
-- PostgreSQL database dump
--

\restrict ap1DKwCVW27HjuUMcvhIeWfBFNH6F4whKXBhdoJfF4hCMkb4ECIhvjP9wPDG6FM

-- Dumped from database version 16.11 (Ubuntu 16.11-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 16.11 (Ubuntu 16.11-0ubuntu0.24.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: meets; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.meets VALUES (1, 'Region 4-AAAAA Championship', '2026-10-20', 'Gray, GA', 5000, '', '2026-01-31 04:13:12.135853');


--
-- Data for Name: teams; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.teams VALUES (1, 'Jones County', 'Jones County High School', 'Gray', 'GA', '2026-01-31 04:12:54.64197');


--
-- Data for Name: runners; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.runners VALUES (1, 'John', 'Smith', 'M', 11, 1, '2026-01-31 04:13:03.293978');


--
-- Data for Name: results; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.results VALUES (1, 1, 1, '00:17:45', 1, '2026-01-31 04:13:22.898574');


--
-- Name: meets_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.meets_id_seq', 1, true);


--
-- Name: results_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.results_id_seq', 1, true);


--
-- Name: runners_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.runners_id_seq', 1, true);


--
-- Name: teams_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.teams_id_seq', 1, true);


--
-- PostgreSQL database dump complete
--

\unrestrict ap1DKwCVW27HjuUMcvhIeWfBFNH6F4whKXBhdoJfF4hCMkb4ECIhvjP9wPDG6FM

