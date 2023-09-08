type Bible = {
    name: string;
}

type Book = { 
    name: string;
}

type Verse = {
    BookName: string;
    ChapterNumber: number;
    VerseNumber: number;
    Scripture: string;

}

export {Book, Bible, Verse}