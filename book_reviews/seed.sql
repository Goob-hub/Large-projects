-- Data to work with inside of database --

-- War of art --
INSERT INTO books (title, authors, ibsn, date_read) 
VALUES('The war of art', 'Steven Pressfield', '1936891026', '04/21/2018');
INSERT INTO reviews (review, rating, featured) 
VALUES('Its a great book that gives you a kick in the ass to stop distracting your self and do the things you want to. Lots of wisdom packed into this book that will help you keep yourself on track and hold yourself accountable.', 4, TRUE);

-- Gingerbread man --
INSERT INTO books (title, authors, ibsn, date_read) 
VALUES('The gingerbread man', 'Eric A. Kimmel', '0823411370', '06/25/2006');
INSERT INTO reviews (review, rating, featured) 
VALUES('Now open the oven to see if hes done, This gingerbread man, he know how to run. Out of the oven and onto the floor, Now run away out the kitchen door. The gingerbread man, hes out of the pan!', 5, TRUE);

-- Everybody poops --
INSERT INTO books (title, authors, ibsn, date_read) 
VALUES('Everybody poops', 'Taro Gomi', '0613685725', '11/05/2010');
INSERT INTO reviews (review, rating, featured) 
VALUES('Holy crapoli, an absolute stinker of a book. An assault to my eyes and nostrils. I cant believe any sane entity could come up with something so cursed. What a brown stained disgrace to humanity this book is.', 1, FALSE);
