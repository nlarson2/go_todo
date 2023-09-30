import React, { useState, useEffect } from "react";
import Modal from "../components/Modal";

interface DropdownOptions {
  url: string;
  title: string;
  update: React.Dispatch<React.SetStateAction<string>>;
}

interface ReadData {
  id: number;
  name: string;
}

function DropdownForm(props: DropdownOptions) {
  const [selectedValue, setSelectedValue] = useState<string>("");
  const [isModalVisible, setModalVisible] = useState(true);
  const [options, setOptions] = useState<ReadData[]>();

  const toggleModal = () => {
    console.log("toggle");
    setModalVisible(!isModalVisible);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const reponse = await fetch(props.url);
        const data = await reponse.json();
        setOptions(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    props.update(selectedValue);
    toggleModal();
  }, [selectedValue]);

  return (
    <div>
      <label>{props.title}: </label>
      <input
        type="text"
        contentEditable="false"
        value={selectedValue}
        onClick={toggleModal}
        readOnly={true}
      />

      {isModalVisible && (
        <Modal toggleModal={toggleModal}>
          <h2>Pick A {props.title}</h2>
          <div className="scroll-options">
            {options?.map((option) => (
              <div
                key={option.id}
                onClick={() => setSelectedValue(option.name)}
              >
                <p>{option.name}</p>
              </div>
            ))}
          </div>
        </Modal>
      )}
    </div>
  );
}

export default DropdownForm;
