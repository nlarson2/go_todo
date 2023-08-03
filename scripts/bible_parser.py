import re
import os
import requests

url = "localhost:8080"

bible_template = """
{
    "name": "%s",
    "bible_verses": [
        %s
    ]
}
"""
verse_template = """
        {
            "book_name": "%s",
            "chapter_number": %s,
            "verse_number": %s,
            "verse_text": "%s"
        }
"""

item_divider = '|||||'

bibleRE = re.compile('biblename="(.+)">')
bookRE = re.compile('bname="([a-zA-Z.]+)">')
chapterRE = re.compile('<CHAPTER cnumber="([0-9]+)">')
verseRE = re.compile('<VERS vnumber="([0-9]+)">(.+)</VERS>')



with open('./bibles/Bible_English_ESV.xml') as f:
    lines = f.readlines()
    bible = None
    bible_search = bibleRE.search(lines[1])
    if bible_search is None:
        exit(0)
    bible = bible_search.group(1)
    bible_csv_file = bible.replace(" ", "_")
    print(bible)
    with open('./bibles/{0}.txt'.format(bible_csv_file), 'w') as csv:
        book = None
        chap = None
        vers = None
        vers_str = None

        for line in lines[0:50]:
            bible_search = bibleRE.search(line)
            book_search = bookRE.search(line)
            chap_search = chapterRE.search(line)
            vers_search = verseRE.search(line)

            if bible_search:
                bible = bible_search.group(1)
            elif book_search:
                book = book_search.group(1)
            elif chap_search:
                chap = chap_search.group(1)
            elif vers_search:
                vers = vers_search.group(1)
                vers_str = vers_search.group(2)
            else:
                book=None
                chap=None
                vers=None
            
            if None not in [bible, book, chap, vers, vers_str]:
                print(bible, book, chap, vers, vers_str)
                response = requests.post(
                    url,
                    data={
                        "bible_name": bible,
                        "book_name": book,
                        "chapter_num": chap,
                        "verse_num": vers,
                        "verse_text": vers_str
                        
                    }
                )
                csv.write(item_divider.join([bible, book, chap, vers, vers_str]) + "\n")

    with open('./bibles/{0}.txt'.format(bible_csv_file)) as f:
        lines = f.readlines()
        verses = []
        with open('./bibles/{0}.json'.format(bible_csv_file), 'w') as json:
            for line in lines:
                line = line.strip("\n")
                line = line.replace("\"", "\\\"")
                line = line.split(item_divider)
                print(line)
                print(line[1], line[2], line[3], line[4])
                verses.append(verse_template % (line[1], line[2], line[3], line[4]))
            json.write(bible_template % (lines[0][0], ",".join(verses)))
