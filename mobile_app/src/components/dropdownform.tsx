import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView} from 'react-native';
import {Picker} from '@react-native-picker/picker';


interface DropdownOptions {
    url: string;
    title: string;
    update: React.Dispatch<React.SetStateAction<string>>;
}

interface ReadData {
    id: number;
    name: string;
}

const DropdownForm: React.FC<DropdownOptions> = (props: DropdownOptions) => {
    const [selectedValue, setSelectedValue] = useState<string>("");
    const [isModalVisible, setModalVisible] = useState(true);
    const [options, setOptions] = useState<ReadData[]>();

    const [test, setTest] = useState();
    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    useEffect(() => {
        const fetchData = async () => {
          try {
            const reponse = await fetch(props.url)
            const data = await reponse.json();  
            setOptions(data);
          } catch (error) {
            console.error(error)
          }
        }

        fetchData();
      }, [])

    useEffect(() =>{ 
        props.update(selectedValue);
        toggleModal();
    }, [selectedValue])

    function getOptions() {
        return (
            <>
            {options?.map((option, index) => (
                <TouchableOpacity 
                    key={option.id} 
                    onPress={() => setSelectedValue(option.name)}
                    style={{
                        padding: 10,
                        borderBottomWidth: 1,
                        borderBottomColor: 'gray',
                    }}
                >
                    <Text>{option.name}</Text>
                </TouchableOpacity>
            ))}
            </>
        )
    }
      
    return (
    <View style={styles.container}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
        {props.title}:
      </Text>
      <TouchableOpacity onPress={toggleModal}>
        <View
          style={{
            borderWidth: 1,
            borderColor: 'gray',
            padding: 10,
            borderRadius: 5,
          }}
        >
          <Text>{selectedValue || 'Select an option'}</Text>
        </View>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={toggleModal}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}
        >
          <View
            style={{
              backgroundColor: 'white',
              padding: 20,
              borderRadius: 10,
            }}
          >
            <ScrollView style={styles.scrollView}>
                {getOptions()}
            </ScrollView>
            <TouchableOpacity onPress={toggleModal}>
              <Text style={{ color: 'blue', textAlign: 'center', marginTop: 10 }}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
  
  const styles = StyleSheet.create({
    container: {
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 20,
      flex: 1,
    },
    title: {
        alignSelf: 'center',
        fontSize: 20,
    },
    picker: {
        width: 200,
        // backgroundColor: '#000',
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
  

  export default DropdownForm;