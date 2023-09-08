import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { useFocusEffect } from '@react-navigation/native';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { forHorizontalIOS } from '@react-navigation/stack/lib/typescript/src/TransitionConfigs/CardStyleInterpolators';
import SuperScript from '../components/superscript';
import {Verse} from '../shared/types';
import Scripture from '../components/scripture';

const Home: React.FC<any> = ({ navigation }) => {

  const [storageKeys, setStorageKeys] = useState<string[]>([])
  const [selectedKey, setSelectedKey] = useState<string>("");
  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };


  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: "VERSE LIST",
    });
  }, [navigation]);

  //reload data when we return
  const readLocalStorage = async () => {
    const localStorageKeys = await (await AsyncStorage.getAllKeys());
    console.log([...localStorageKeys]);
    setStorageKeys([...localStorageKeys]);
  }

  useFocusEffect(
    React.useCallback(() => {
      console.log('Screen has regained focus. Perform reload logic here.');
      readLocalStorage();
    }, [])
  );


  const getItem = (key: string) => {
    const asyncGetItem = async (key: string) => {
      try {
        const ret = await AsyncStorage.getItem(key);
        return (<>ret</>);
      } catch (error) {
        return (<></>)
      }
    }
    return asyncGetItem(key)
  }

  const deleteItem = (key: string) => {
    const asyncGetItem = async (key: string) => {
      try {
        const ret = await AsyncStorage.removeItem(key);
        readLocalStorage();
      } catch (error) {
      }
    }
    asyncGetItem(key)
    return;
  }

  const [jsonData, setJsonData] = useState("");
  useEffect(() => {
    try {
      const getData = async () => {
        const resp = await AsyncStorage.getItem(selectedKey)
        return resp
      }

    getData().then((result: string | null) => {
      if (result !== null) { 
        setJsonData(result);
      }
    }).catch((erro) => {
      setJsonData("");
    });

    } catch (error) {
      setJsonData("");
    }
  }, [selectedKey])

  
  const updateSelection = (key: string) => {
    setSelectedKey(key);
    toggleModal();
  }



  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Verse Lookup')}
      >
        <Text style={styles.button_text}>Search Verses</Text>
      </TouchableOpacity>
      <ScrollView>
        {storageKeys.map((key, index) => (
          <View key={index} style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'center' }}>
            <View style={{ width: '60%' }}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => updateSelection(key)}
              >
                <Text style={styles.button_text}>
                  {key}
                </Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.delete_button}
              onPress={() => deleteItem(key)}
            >
              <Text style={styles.button_text}>
                X
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
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
            <Text style={{fontWeight: 'bold', fontSize: 15}}>{selectedKey}</Text>
            <ScrollView>
              <Scripture json={jsonData}/>
            </ScrollView>
            <View style={{ flexDirection: 'row', justifyContent: 'center', backgroundColor: '#fff' }}>
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
    alignItems: 'center'
  },
  button: {
    backgroundColor: '#000',
    padding: 20
  },
  delete_button: {
    backgroundColor: '#fc1605',
    padding: 20

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

export default Home;