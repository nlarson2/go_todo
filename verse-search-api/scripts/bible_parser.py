import re
import os
import requests
import json 

url = "http://192.168.1.196:8080/verse/add"

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

for filename in os.listdir('./bibles'):
    file_path = os.path.join('./bibles', filename)
    with open(file_path) as f:
        lines = f.readlines()
        bible = None
        bible_search = bibleRE.search(lines[1])
        if bible_search is None:
            exit(0)
        bible = bible_search.group(1)
        bible_csv_file = bible.replace(" ", "_")

        book = None
        chap = None
        vers = None
        vers_str = None

        for line in lines:
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
                chap=None
                vers=None
            
            if None not in [bible, book, chap, vers, vers_str]:
                print(bible, book, chap, vers, vers_str)
                response = requests.request(
                    "POST",
                    url,
                    data={
                        "bible_name": bible,
                        "book_name": book,
                        "chapter_num": chap,
                        "verse_num": vers,
                        "verse_text": vers_str
                        
                    },
                )
                    
        