CREATE TABLE IF NOT EXISTS bible_db.Bibles (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS Books (
    id SERIAL PRIMARY KEY,
    bible_id INT,
    name TEXT NOT NULL,
    CONSTRAINT fk_bible FOREIGN KEY(bible_id) REFERENCES Bibles(id)
);

CREATE TABLE IF NOT EXISTS Chapters (
    id SERIAL PRIMARY KEY,
    book_id INT,
    chapter INT NOT NULL,
    CONSTRAINT fk_book FOREIGN KEY(book_id) REFERENCES Books(id)
);

CREATE TABLE IF NOT EXISTS Verses(
    id SERIAL PRIMARY KEY,
    chapter_id INT,
    verse_num INT NOT NULL,
    scripture TEXT NOT NULL,
    CONSTRAINT fk_chapter FOREIGN KEY(chapter_id) REFERENCES Chapters(id)
);
