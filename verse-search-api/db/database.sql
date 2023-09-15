CREATE TABLE IF NOT EXISTS Bible_Versions (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS Books (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL
);


CREATE TABLE IF NOT EXISTS Verses(
    id SERIAL PRIMARY KEY,
    bible_id INT NOT NULL,
    book_id INT NOT NULL,
    chapter_num INT NOT NULL,
    verse_num INT NOT NULL,
    scripture TEXT NOT NULL,
    CONSTRAINT b_version FOREIGN KEY(bible_id) REFERENCES Bible_Versions(id),
    CONSTRAINT book_fk FOREIGN KEY(book_id) REFERENCES Books(id)
);
