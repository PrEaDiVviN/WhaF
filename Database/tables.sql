DROP TABLE public.instruction
DROP TABLE public.search
DROP TABLE public.ingredient
DROP TABLE public.recipe
DROP TABLE public.tried
DROP TABLE public.user

CREATE TABLE public.user
(
	/* SERIAl => se autoincrementeaza */
	user_id SERIAL PRIMARY KEY,
	first_name VARCHAR(50) NOT NULL, 
	last_name VARCHAR(50) NOT NULL, 
	email VARCHAR(100) NOT NULL, 
	username VARCHAR(50) NOT NULL,
	user_passwd VARCHAR(25) NOT NULL,
	birth DATE NOT NULL,
	photo VARCHAR(100),
	status integer NOT NULL
)

CREATE TABLE public.recipe
(
	recipe_id SERIAL PRIMARY KEY,
	user_id integer NOT NULL REFERENCES public.user(user_id),
	recipe_name VARCHAR(50) NOT NULL,
	photo VARCHAR(100) NOT NULL,
	category VARCHAR(50) NOT NULL, 
	nr_ingredients integer NOT NULL, 
	prep_time integer NOT NULL,
	final_time integer NOT NULL,
	nr_instructions integer NOT NULL,
	score integer NOT NULL,
	difficulty VARCHAR(25) NOT NULL /* easy, medium, hard */
)

CREATE TABLE public.instruction
(
    instruction_id SERIAL PRIMARY KEY,
    recipe_id integer NOT NULL REFERENCES public.recipe(recipe_id),
    instructions VARCHAR(250) NOT NULL,
    photo VARCHAR(100) NOT NULL
)

CREATE TABLE public.ingredient
(
	ingredient_id SERIAL PRIMARY KEY,
	recipe_id integer NOT NULL REFERENCES public.recipe(recipe_id),
	ingredient_name VARCHAR(30) NOT NULL,
	score integer NOT NULL, 
	search_score integer NOT NULL
)

CREATE TABLE public.search 
(
	search_id SERIAL PRIMARY KEY,
	user_id integer NOT NULL REFERENCES public.user(user_id),
	recipe_id integer REFERENCES public.recipe(recipe_id),
	ingredient_id integer REFERENCES public.ingredient(ingredient_id),
	difficulty VARCHAR(25)
)

CREATE TABLE public.tried
(
    id_try SERIAL PRIMARY KEY,
    id_user integer NOT NULL,
    recipe_name VARCHAR(100) NOT NULL, 
    photo VARCHAR(100) NOT NULL
)

/* user table */
INSERT INTO public.user (first_name, last_name, email, username, user_passwd, 
		birth, photo, status)
	VALUES ('Brinzila', 'Maria', 'maria.brinzila2000@gmail.com', 
		'mariabrinzila', 'mariaB123-', '2000-02-14', null, 0);

/* recipe table */
INSERT INTO public.recipe (user_id, recipe_name, photo, category, 
		nr_ingredients, prep_time, final_time, nr_instructions, difficulty)
	VALUES (1, 'RecipeTest', 'E:\Catalog\Recipe1.jpg', 
		'categoryRecipe', 2, 30, 65, 2, 3);

SELECT first_name, last_name, recipe_name FROM public.user u
	JOIN public.recipe r ON r.user_id = u.user_id;
		
/* ingredient table */
INSERT INTO public.ingredient (recipe_id, ingredient_name) 
	VALUES (1, 'I1');

INSERT INTO public.ingredient (recipe_id, ingredient_name) 
	VALUES (1, 'I2');

SELECT recipe_name, ingredient_name FROM public.recipe r
		JOIN public.ingredient i ON r.recipe_id = i.recipe_id;

/* instruction table */
INSERT INTO public.instruction (recipe_id, instructions, photo) 
	VALUES (1, 'blabla', 'E:\catalog\Recipe1.jpg');

INSERT INTO public.instruction (recipe_id, instructions, photo) 
	VALUES (1, 'lalala', 'E:\catalog\Recipe1.jpg');

SELECT recipe_name, instructions FROM public.recipe r
		JOIN public.instruction i ON r.recipe_id = i.recipe_id;
	
/* search table */
INSERT INTO public.search (user_id, recipe_id)
	VALUES (1, 1);
	
INSERT INTO public.search (user_id, ingredient_id)
	VALUES (1, 1);
	
INSERT INTO public.search (user_id, difficulty)
	VALUES (1, 3);

SELECT username, recipe_name FROM public.search s
	JOIN public.user u ON s.user_id = u.user_id
	JOIN public.recipe r ON s.recipe_id = r.recipe_id
	WHERE search_id = 1;
	
SELECT username, ingredient_name FROM public.search s
	JOIN public.user u ON s.user_id = u.user_id
	JOIN public.ingredient i ON s.ingredient_id = i.ingredient_id
	WHERE search_id = 2;
	
SELECT username, difficulty FROM public.search s
	JOIN public.user u ON s.user_id = u.user_id
	WHERE search_id = 3;
	
SELECT * FROM public.user;

SELECT * FROM public.recipe ORDER BY recipe_id ASC;

SELECT * FROM public.ingredient;

SELECT * FROM public.tried;

SELECT COUNT(*) AS nr FROM public.recipe;

DELETE FROM public.recipe WHERE recipe_id = 1;

UPDATE public.user SET username = 'mariabrinzila' WHERE user_id = 1;

SELECT recipe_name, score, category, first_name, last_name FROM public.recipe r
	JOIN public.user u ON r.user_id = u.user_id
	ORDER BY score DESC;
	
SELECT ingredient_name, score FROM public.ingredient ORDER BY score DESC;
	
INSERT INTO public.ingredient (recipe_id, ingredient_name, score, search_score) 
	VALUES (4, 'I2', 0, 0);
	
SELECT ingredient_id, score FROM public.ingredient WHERE ingredient_name = 'I9' 
	ORDER BY ingredient_id ASC;
