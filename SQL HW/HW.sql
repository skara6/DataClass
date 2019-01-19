Use Sakila;

#1a
SELECT first_name,last_name 
FROM actor;

#1b
SELECT concat(first_name," ", last_name) 
AS actor_name  
FROM actor;

#2a
SELECT actor_id, first_name,last_name 
FROM actor 
WHERE first_name = "Joe";


#2b
SELECT * 
FROM actor 
WHERE last_name LIKE '%GEN%';

#2c
SELECT last_name, first_name FROM actor WHERE last_name LIKE '%LI%';

#2d
SELECT country_id, country FROM country WHERE country IN ('Afghanistan, Bangladesh, China');

#3a
ALTER TABLE actor ADD COLUMN description BLOB;

#3b
ALTER TABLE actor DROP COLUMN description;

#4a
SELECT last_name,count( last_name )
FROM actor 
GROUP BY last_name;

#4b
SELECT last_name,count( last_name ) 
FROM actor 
GROUP BY last_name HAVING count(last_name) >=2; 

#4c
SET SQL_SAFE_UPDATES=0;
UPDATE actor SET first_name = 'HARPO' WHERE first_name = 'GROUCHO' AND last_name = 'WILLIAMS';


#4d
UPDATE actor SET first_name = 'GROUCHO' WHERE first_name = 'HARPO' AND last_name = 'WILLIAMS';


#5
SHOW CREATE TABLE address;

#6a
SELECT staff.first_name, staff.last_name, address.address 
FROM staff JOIN address ON (staff.address_id = address.address_id);


#6b
SELECT staff.last_name, staff.first_name, sum(amount) 
FROM staff 
JOIN payment ON (staff.staff_id = payment.staff_id)
WHERE payment_date LIKE '2005-08%'; 

#6c
SELECT title, COUNT(actor_id) as 'Actor Count'
FROM film_actor JOIN film
ON (film_actor.film_id = film.film_id)
GROUP BY title;

#6d
SELECT title, (SELECT COUNT(*) FROM inventory WHERE film.film_id = inventory.film_id ) AS 'Number of Copies'
FROM film
WHERE title = 'Hunchback Impossible';

#6e
SELECT sum(amount),customer.first_name, customer.last_name  
FROM payment
JOIN customer ON payment.customer_id = customer.customer_id
GROUP BY customer.first_name, customer.last_name 
ORDER BY customer.last_name ASC;


#7a
SELECT title
FROM film
WHERE language_id IN
	(
		SELECT language_id
        FROM language
        WHERE name = 'English'
	)
AND title LIKE 'K%' OR title LIKE 'Q%';


#7b
SELECT first_name, last_name
FROM actor
WHERE actor_id IN
(
  SELECT actor_id
  FROM film_actor
  WHERE film_id IN
  (
   SELECT film_id
   FROM film
   WHERE title = 'ALONE TRIP'
  )
);

#7c
SELECT first_name,last_name, email
FROM customer 
JOIN address ON (customer.address_id = address.address_id)  
JOIN city ON (city.city_id = address.city_id)
JOIN country ON (country.country_id = city.country_id)
WHERE country = "Canada";

#7d
SELECT title
FROM film
WHERE film_id
in ( 
	 SELECT film_id 
     FROM film_category
     WHERE category_id in
       ( 
          SELECT category_id 
          FROM category
          WHERE name = "Family"
          )
	   );
          
#7e
SELECT title, COUNT(rental_id) as 'Rental Count'
FROM rental 
JOIN inventory
ON (rental.inventory_id = inventory.inventory_id)
JOIN film 
ON (inventory.film_id = film.film_id)
GROUP BY film.title 
ORDER BY count(rental_id) DESC;

#7f
SELECT store.store_id, SUM(amount)
FROM store
JOIN staff
ON store.store_id = staff.store_id
JOIN payment 
ON payment.staff_id = staff.staff_id
GROUP BY store.store_id;

#7g
SELECT store_id, city, country 
FROM store 
JOIN address ON (store.address_id = address.address_id)
JOIN city ON (city.city_id= address.city_id)
JOIN country ON (country.country_id = city.country_id);


#7h
SELECT name, sum(amount) AS 'gross sales'
 FROM category 
 JOIN film_category ON (category.category_id = film_category.category_id)
 JOIN inventory ON (inventory.film_id  = film_category.film_id)
 JOIN rental ON (rental.inventory_id = inventory.inventory_id)
 JOIN payment ON (rental.customer_id = payment.customer_id)
 GROUP BY category.name
 ORDER by sum(amount) DESC LIMIT 5;

#8a
CREATE VIEW hw as 
 SELECT name, sum(amount) AS 'gross sales'
 FROM category 
 JOIN film_category ON (category.category_id = film_category.category_id)
 JOIN inventory ON (inventory.film_id  = film_category.film_id)
 JOIN rental ON (rental.inventory_id = inventory.inventory_id)
 JOIN payment ON ( .customer_id = payment.customer_id)
 GROUP BY category.name
 ORDER by sum(amount) DESC LIMIT 5; 
 
 #8b
 SELECT * FROM hw;
 
 #8c
 DROP VIEW hw;
 