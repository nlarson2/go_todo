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

type VerseSet = {
    verse: string;
    scripture: Verse[];
  }

export {Book, Bible, Verse, VerseSet}