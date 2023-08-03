CREATE OR REPLACE PROCEDURE insert_verse(bible_name text, book_name text, chapter_number integer, verse_number integer, scripture text)
LANGUAGE plpgsql
AS $$
DECLARE
    bible_id integer;
    book_id integer;
    chapter_id integer;
BEGIN
    
    SELECT id INTO bible_id FROM Bibles WHERE name = bible_name LIMIT 1;
    IF bible_id IS NULL THEN
        INSERT INTO Bibles (name) VALUES (bible_name) RETURNING id INTO bible_id;
    END IF;

    SELECT id INTO book_id FROM Books as bk WHERE bk.name = book_name and bk.bible_id = bible_id;
    IF book_id IS NULL THEN
        INSERT INTO Books (bible_id, name) VALUES (bible_id, book_name) RETURNING id INTO book_id;
    END IF;

    SELECT id INTO chapter_id FROM Chapters as c where c.chapter = chapter_number and c.book_id = book_id;
    if chapter_id IS NULL THEN
        INSERT INTO Chapters (book_id, chapter) VALUES (book_id, chapter_number) RETURNING id INTO chapter_id;
    END IF;

    INSERT INTO Verses (chapter_id, verse_num, scripture) VALUES (chapter_id, verse_number, scripture);

END;
$$;