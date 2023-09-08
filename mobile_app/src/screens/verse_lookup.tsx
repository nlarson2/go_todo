import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
  Keyboard,
  Switch,
  Button,
  TouchableOpacity,
  ScrollView,
  Modal
} from 'react-native';
import { Book, Bible, Verse } from '../shared/types';
import DropdownForm from '../components/dropdownform';
import SuperScript from '../components/superscript';
import AsyncStorage from '@react-native-async-storage/async-storage';

type FormData = {
  bible: string;
  book: string;
  chapter: number;
  useRange: boolean;
  verse1: number;
  verse2: number;
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
  `\u2079`
]



const VerseLookup: React.FC = () => {

  const url = "http://192.168.1.196:8080"
  const [bible, setBible] = useState('');
  const [book, setBook] = useState('');
  const [chapter, setChapter] = useState(1);
  const [useRange, setUseRange] = useState(false);
  const [verse1, setVerse1] = useState(1);
  const [verse2, setVerse2] = useState(1);

  const [verseData, setVerseData] = useState<Verse[]>([]);
  const [verseString, setVerseString] = useState<string>("");

  const [isModalVisible, setModalVisible] = useState(false);
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const saveSearch = async () => {
    try {
      var key = `${book} ${chapter}:`;
      key += useRange ? `${verse1}-${verse2}` : `${verse1}`;
      var value = JSON.stringify(verseData)
      if(await AsyncStorage.getItem(key) === null) {
        await AsyncStorage.setItem(key, value)
      }
      toggleModal()
    } catch (error) {

    }   
  }

  const handleChapterChange = (text: string) => {
    const numericInput = text.replace(/[^0-9]/g, '');
    const newNumber = parseInt(numericInput);
    setChapter(newNumber ? newNumber : 0);
  }
  const handleVerse1Change = (text: string) => {
    const numericInput = text.replace(/[^0-9]/g, '');
    const newNumber = parseInt(numericInput);
    setVerse1(newNumber ? newNumber : 0);
  }
  const handleVerse2Change = (text: string) => {
    const numericInput = text.replace(/[^0-9]/g, '');
    const newNumber = parseInt(numericInput);
    setVerse2(newNumber ? newNumber : 0);
  }

  const fetchVerseData = async () => {
    Keyboard.dismiss()
    try {
      const verseFormatted = useRange ? `${verse1}-${verse2}` : `${verse1}`;
      const response = await fetch(`${url}/verse?bible=${bible}&book=${book}&chapter=${chapter}&verse=${verseFormatted}`);
      const data = await response.json();
      setVerseData(data);
      toggleModal();
    } catch (error) {
      console.error(error);
    }
  }

  const generateVerseString = () => {
    let verseAsString = "";
    for (let i = 0; i < verseData.length; i++) {
      const values: string[] = verseData[i].VerseNumber.toString().split('')
      for( var str in values) (
        verseAsString += scripts[parseInt(str)]
      )
      verseAsString += verseData[i].Scripture;
    }
    // setVerseString(verseAsString)
    return (<>{verseAsString}</>);
  }

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.container}>
          <View style={{ flexDirection: 'row' }}>
            <DropdownForm url={url + '/bibles'} title="Bible" update={setBible} />
            <DropdownForm url={url + '/books'} title="Book" update={setBook} />
          </View>
          <View style={{ flexDirection: 'row' }}>
            <View>
              <Text style={styles.label}>Chapter:</Text>
              <TextInput
                style={styles.input}
                onChangeText={handleChapterChange}
                value={chapter.toString()}
                keyboardType="numeric"
              />
            </View>
            <View>
              <Text style={styles.label}>Use Range:</Text>
              <View style={styles.switch}>
                <Switch
                  trackColor={{ false: '#767577', true: '#81b0ff' }}
                  thumbColor={useRange ? '#f5dd4b' : '#f4f3f4'}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={(prev) => { setUseRange(prev => !prev) }}
                  value={useRange}
                />
              </View>
            </View>
          </View>
          {useRange ?
            <View style={{ flexDirection: 'row' }}>
              <View style={styles.numberInput}>
                <Text style={styles.label}>Start:</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={handleVerse1Change}
                  value={verse1.toString()}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.numberInput}>
                <Text style={styles.label}>End:</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={handleVerse2Change}
                  value={verse2.toString()}
                  keyboardType="numeric"
                />
              </View>
            </View>
            :
            <View style={styles.numberInput}>
              <Text style={styles.label}>Verse:</Text>
              <TextInput
                style={styles.input}
                onChangeText={handleVerse1Change}
                value={verse1.toString()}
                keyboardType="numeric"
              />
            </View>}
          <TouchableOpacity
            style={styles.button}
            onPress={fetchVerseData}
          >
            <Text style={styles.button_text}>Search Verses</Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback >
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={toggleModal}
        style={{ justifyContent: 'center', alignItems: 'center' }}
      >
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.5)',
        }}
        >
          <View style={styles.scrollView}>
          <ScrollView>
            {verseData.length > 0 ?
              <Text style={{fontSize: 20}}>
                {verseData.map((verse, index)=>(
                  <>
                  <SuperScript value={verse.VerseNumber}/>{verse.Scripture}
                  </>
                ))}
              </Text>
              : <></>
            }

          </ScrollView>
            <View style={{ flexDirection: 'row', justifyContent: 'center', backgroundColor:'#fff'}}>
              <TouchableOpacity style={styles.button} onPress={() => saveSearch()}>
                <Text style={{ color: "#fff" }}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => toggleModal()}>
                <Text style={{ color: "#fff" }}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10
  },
  input: {
    width: 100,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'gray',
    padding: 8,
    marginBottom: 10,
  },
  numberInput: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  switch: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#000',
    padding: 20,
    margin: 10,
  },
  button_text: {
    color: "white",
    fontSize: 20,
  },
  scrollView: {
    width: '80%',
    maxHeight: '60%',
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
  },
});

export default VerseLookup;
