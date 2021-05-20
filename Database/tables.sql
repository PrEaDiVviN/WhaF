DROP TABLE public.photo_instruction
DROP TABLE public.instruction
DROP TABLE public.search
DROP TABLE public.ingredient
DROP TABLE public.recipe
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
	photo VARCHAR(100)
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
	difficulty integer NOT NULL /* 1-10 => 1 easy, 10 hard */
)

CREATE TABLE public.instruction 
(
	instruction_id SERIAL PRIMARY KEY,
	recipe_id integer NOT NULL REFERENCES public.recipe(recipe_id),
	instructions VARCHAR(250) NOT NULL,
	photo VARCHAR(100) NOT NULL
)

CREATE TABLE public.photo_instruction
(
	photo_id SERIAL PRIMARY KEY,
	photo_path VARCHAR(30) NOT NULL,
	instruction_id integer NOT NULL 
		REFERENCES public.instruction(instruction_id)
)

CREATE TABLE public.ingredient
(
	ingredient_id SERIAL PRIMARY KEY,
	recipe_id integer NOT NULL REFERENCES public.recipe(recipe_id),
	ingredient_name VARCHAR(30) NOT NULL
)

CREATE TABLE public.search 
(
	search_id SERIAL PRIMARY KEY,
	user_id integer NOT NULL REFERENCES public.user(user_id),
	recipe_id integer REFERENCES public.recipe(recipe_id),
	ingredient_id integer REFERENCES public.ingredient(ingredient_id),
	difficulty integer
)

/* user table */
INSERT INTO public.user (first_name, last_name, email, username, user_passwd, 
		birth, photo)
	VALUES ('Brinzila', 'Maria', 'maria.brinzila2000@gmail.com', 
		'mariabrinzila_', 'passwd', '2000-02-14', 
		'E:\ASII\profile.jpg');
	
SELECT * FROM public.user;

/* recipe table */
INSERT INTO public.recipe (user_id, recipe_name, photo, category, 
		nr_ingredients, prep_time, final_time, nr_instructions, difficulty)
	VALUES (1, 'RecipeTest', 'E:\Catalog\Recipe1.jpg', 
		'categoryRecipe', 2, 30, 65, 2, 3);

SELECT * FROM public.recipe;

SELECT first_name, last_name, recipe_name FROM public.user u
	JOIN public.recipe r ON r.user_id = u.user_id;
		
/* ingredient table */
INSERT INTO public.ingredient (recipe_id, ingredient_name) 
	VALUES (1, 'I1');

INSERT INTO public.ingredient (recipe_id, ingredient_name) 
	VALUES (1, 'I2');
	
SELECT * FROM public.ingredient;

SELECT recipe_name, ingredient_name FROM public.recipe r
		JOIN public.ingredient i ON r.recipe_id = i.recipe_id;

/* instruction table */
INSERT INTO public.instruction (recipe_id, instructions, photo) 
	VALUES (1, 'blabla', 'E:\catalog\Recipe1.jpg');

INSERT INTO public.instruction (recipe_id, instructions, photo) 
	VALUES (1, 'lalala', 'E:\catalog\Recipe1.jpg');
	
SELECT * FROM public.instruction;

SELECT recipe_name, instructions FROM public.recipe r
		JOIN public.instruction i ON r.recipe_id = i.recipe_id;

/* photo instruction table */
INSERT INTO public.photo_instruction (photo_path, instruction_id) 
	VALUES ('E:\Catalog\Recipe1.jpg', 1);
	
INSERT INTO public.photo_instruction (photo_path, instruction_id) 
	VALUES ('E:\Catalog\Recipe2.jpg', 1);
	
SELECT * FROM public.photo_instruction;

SELECT photo_path, instructions FROM public.photo_instruction i1
	JOIN public.instruction i2 ON i1.instruction_id = i2.instruction_id;
	
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
