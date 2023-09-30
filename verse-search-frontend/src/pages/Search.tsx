import { useState } from "react";

import DropdownForm from "../components/DropDownForm";
import NavBar from "../components/NavBar";
import Modal from "../components/Modal";

import { Verse, VerseSet } from "../types";

import "./styles/Slider.css";

interface SearchProps {
  isMobile: boolean;
  update?: any;
}

const scripts = [
  `\u2070`,
  `\u00B9`,
  `\u00B2`,
  `\u00B3`,
  `\u2074`,
  `\u2075`,
  `\u2076`,
  `\u2077`,
  `\u2078`,
  `\u2079`,
];

function Search(props: SearchProps) {
  const url = "http://104.237.141.80:8080";
  const [bible, setBible] = useState("");
  const [book, setBook] = useState("");
  const [chapter, setChapter] = useState(1);
  const [useRange, setUseRange] = useState<boolean>(false);
  const [verse1, setVerse1] = useState<number>(1);
  const [verse2, setVerse2] = useState<number>(1);

  const [verseData, setVerseData] = useState<Verse[]>([]);

  const [isModalVisible, setModalVisible] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const saveSearch = async () => {
    try {
      let key = `${book} ${chapter}:`;
      key += useRange ? `${verse1}-${verse2}` : `${verse1}`;
      let value = verseData;
      let currentScriptures = localStorage.getItem("scripts");
      let new_scriptures: VerseSet[] = currentScriptures
        ? JSON.parse(currentScriptures)
        : [];
      for (let i = 0; i < new_scriptures.length; i++) {
        if (new_scriptures[i].verse === key) {
          toggleModal();
          return;
        }
      }
      new_scriptures.push({ verse: key, scripture: value });
      localStorage.setItem("scripts", JSON.stringify(new_scriptures));
      toggleModal();
      if (props.update) props.update();
    } catch (error) {}
  };

  async function fetchVerseData() {
    try {
      setFetchingData(true);
      toggleModal();
      const verseFormatted = useRange ? `${verse1}-${verse2}` : `${verse1}`;
      const response = await fetch(
        `${url}/verse?bible=${bible}&book=${book}&chapter=${chapter}&verse=${verseFormatted}`
      );
      const data = await response.json();
      setVerseData(data);
    } catch (error) {
      console.error(error);
    } finally {
      setFetchingData(false);
    }
  }

  function generateVerseString() {
    let verseAsString = "";
    for (let i = 0; i < verseData.length; i++) {
      console.log(verseData[i]);
      const values: string[] = verseData[i].VerseNumber.toString().split("");
      console.log(verseData[i].VerseNumber.toString().split(""));
      for (let j = 0; j < values.length; j++) {
        console.log(scripts[parseInt(values[j])], values[j]);
        verseAsString += scripts[parseInt(values[j])];
      }
      verseAsString += verseData[i].Scripture;
    }
    return <>{verseAsString}</>;
  }

  return (
    <>
      <div className="page">
        {props.isMobile && (
          <NavBar
            title="Search"
            leftLink={{ text: "< Home", navigateTo: "/" }}
          />
        )}
        <div className="page-content">
          <DropdownForm url={url + "/bibles"} title="Bible" update={setBible} />
          <DropdownForm url={url + "/books"} title="Book" update={setBook} />
          <div>
            <label>Chapter: </label>
            <input
              type="number"
              className="number-input"
              value={chapter}
              onChange={(e) => setChapter(parseInt(e.target.value))}
            />
          </div>
          <div>
            <label>Verse{useRange && " 1"}: </label>
            <input
              type="number"
              className="number-input"
              value={verse1}
              onChange={(e) => setVerse1(parseInt(e.target.value))}
            />
          </div>
          <div>
            <label>Use Range: </label>
            <label className="switch">
              <input
                type="checkbox"
                onChange={(e) => setUseRange(e.target.checked)}
              />
              <span className="slider round"></span>
            </label>
          </div>
          {useRange && (
            <div>
              <label>Verse 2: </label>
              <input
                type="number"
                className="number-input"
                value={verse2}
                onChange={(e) => setVerse2(parseInt(e.target.value))}
              />
            </div>
          )}
          <div>
            <p className="button" onClick={fetchVerseData}>
              Submit
            </p>
          </div>
        </div>
      </div>
      {isModalVisible && (
        <Modal toggleModal={toggleModal}>
          {fetchingData ? (
            "LOADING"
          ) : (
            <div>
              <h2>
                {book} {chapter}:{verse1}
                {useRange && "-" + verse2}
              </h2>
              <div className="scripture">{generateVerseString()}</div>
              <p className="button" onClick={saveSearch}>
                Save
              </p>
            </div>
          )}
        </Modal>
      )}
    </>
  );
}

export default Search;
