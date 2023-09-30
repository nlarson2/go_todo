import { useEffect, useState } from "react";

import { useIsMobile } from "../hooks/Windows";
import Search from "./Search";
import { VerseSet } from "../types";
import Modal from "../components/Modal";

import NavBar from "../components/NavBar";

interface HomeProps {
  isMobile: boolean;
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

function Home(props: HomeProps) {
  const isMobile = useIsMobile(800);
  const [verseSets, setVerseSets] = useState<VerseSet[]>([]);
  const [selectedVerse, setSelectedVerse] = useState<number>(-1);
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState("");

  function toggleModal() {
    setModalVisible((prev) => !prev);
  }

  function fetchLocalStorage() {
    let response = localStorage.getItem("scripts");
    if (response) setVerseSets(JSON.parse(response));
    else setVerseSets([]);
  }
  function handleVerseSelected(index: number) {
    try {
      if (index >= verseSets.length) return;
      setSelectedVerse(index);
    } catch (error: any) {
      setModalVisible(false);
      setErrorMessage(error.message);
    }
  }
  function deleteVerse(index: number) {
    if (verseSets.length > index && index >= 0) {
      setVerseSets((prev) => {
        let new_versesets = [];
        for (let i = 0; i < prev.length; i++) {
          if (i != index) new_versesets.push(verseSets[i]);
        }
        localStorage.setItem("scripts", JSON.stringify(new_versesets));
        return new_versesets;
      });
    }
  }

  useEffect(() => {
    fetchLocalStorage();
  }, []);

  useEffect(() => {
    setModalVisible(selectedVerse >= 0 && selectedVerse < verseSets.length);
  }, [selectedVerse]);

  function generateVerseString() {
    try {
      let verseData = verseSets[selectedVerse].scripture;
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
    } catch (error: any) {
      setErrorMessage(error.message);
      setModalVisible(false);
    }
  }

  return (
    <>
      {errorMessage}
      <div className="page">
        {isMobile && (
          <NavBar
            title="Home"
            rightLink={{ text: "Search >", navigateTo: "/search" }}
          />
        )}
        <div className="page-content">
          {verseSets?.map((verseSet, index) => {
            return (
              <div key={index} className="grid">
                <p
                  className="button"
                  onClick={() => handleVerseSelected(index)}
                >
                  {verseSet.verse}
                </p>
                <p className="del-btn" onClick={() => deleteVerse(index)}>
                  X
                </p>
              </div>
            );
          })}
        </div>
      </div>
      {!isMobile && (
        <Search isMobile={props.isMobile} update={fetchLocalStorage} />
      )}
      {isModalVisible && (
        <Modal toggleModal={toggleModal}>
          <h2>{verseSets[selectedVerse].verse}</h2>
          <div className="scripture">{generateVerseString()}</div>
        </Modal>
      )}
    </>
  );
}

export default Home;
