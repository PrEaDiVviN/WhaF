DROP TABLE public.session;

CREATE TABLE public.session
(
    line_id SERIAL NOT NULL,
    user_id integer,
    sessionid character varying(50) COLLATE pg_catalog."default",
    connection_time character varying(50) COLLATE pg_catalog."default",
    CONSTRAINT session_pkey PRIMARY KEY (line_id)
)

SELECT * FROM public.session;