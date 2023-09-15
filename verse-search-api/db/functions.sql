CREATE OR REPLACE PROCEDURE insert_verse(bible_name text, book_name text, chapter_number integer, verse_number integer, scripture text)
LANGUAGE plpgsql
AS $$
DECLARE
bible_pk integer;
book_pk integer;
chapter_pk integer;
verse_pk integer;
BEGIN

	SELECT id INTO bible_pk FROM Bible_Versions WHERE name = bible_name LIMIT 1;
    IF bible_pk IS NULL THEN
        INSERT INTO Bible_Versions (name) VALUES (bible_name) RETURNING id INTO bible_pk;
    END IF;

    SELECT id INTO book_pk FROM Books as bk WHERE bk.name = book_name;
    IF book_pk IS NULL THEN
        INSERT INTO Books (name) VALUES (book_name) RETURNING id INTO book_pk;
    END IF;
	
	SELECT id INTO verse_pk FROM Verses as v where v.verse_num = verse_number and v.chapter_num = chapter_number and  v.book_id = book_pk and v.bible_id = bible_pk;
	if verse_pk IS NULL THEN
    	INSERT INTO Verses (bible_id, book_id, chapter_num, verse_num, scripture) VALUES (bible_pk, book_pk, chapter_number, verse_number, scripture);
	END IF;
END;
$$;
