import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';
import { Camera } from 'expo-camera';
import { useNavigation, useRoute } from '@react-navigation/native';
import codeData from './codeData';

const HomeScreen = () => {
  const navigation = useNavigation();
  const route = useRoute(); 
  const { params } = route; 
  const [inputValues, setInputValues] = useState(['', '', '', '', '', '']);
  const [cameraPermission, setCameraPermission] = useState(null);

  const getCameraPermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setCameraPermission(status === 'granted');
  };

  useEffect(() => {
    getCameraPermission();
    if (params?.ocrResult) {
      const updatedInputValues = [...inputValues];
      const ocrResultLines = params.ocrResult.split('\n'); 
      ocrResultLines.forEach((line) => {
        if (line.includes('組織コード')) {
          updatedInputValues[1] = line.split('組織コード')[1].trim(); 
        } else if (line.includes('細目名称')) {
          const index = ocrResultLines.indexOf(line) + 1;
          updatedInputValues[3] = ocrResultLines[index].trim(); 
        } else if (line.includes('資産番号/資産枝番')) {
          const assetNumbers = line.split('資産番号/資産枝番')[1].trim().split(' '); 
          updatedInputValues[4] = assetNumbers[0]; 
          updatedInputValues[5] = assetNumbers[1];
        } else if (line.includes('大中細目')) {
          const index = ocrResultLines.indexOf(line) + 1; 
          updatedInputValues[2] = ocrResultLines[index].trim(); 
        } else if (line.includes('-')) {
          updatedInputValues[0] = line.split('-')[0].trim(); 
        }
      });
      setInputValues(updatedInputValues);
    }
  }, [params]);

  const handleCameraPress = async () => {
    if (cameraPermission) {
      navigation.navigate('CameraScreen');
    } else {
      console.log('カメラの許可がありません。');
    }
  };

  const handleInputChange = (index, value) => {
    const newInputValues = [...inputValues];
    newInputValues[index] = value;
    setInputValues(newInputValues);
  };

  const handleSearch = () => {
    console.log('検索ボタンが押されました。');
    console.log('検索するデータ:', inputValues);

    const searchResults = inputValues.map((code, index) => ({
      label: getInputLabel(index),
      value: code,
      detail: getDataForCode(code),
    }));

    navigation.navigate('SearchResults', { searchResults, inputValues });
  };


  const getDataForCode = (code, index) => {
    if (!codeData[code]) {
      const assetCode = code.substring(0, 2); 
      const matchedData = codeData[assetCode]; 
      return matchedData || '';
    } else {
      return codeData[code] || '';
    }
  };

  const getInputLabel = (index) => {
    const labels = ['整理番号', '組織コード', '大中細目', '細目名称', '資産番号', '資産枝番'];
    return labels[index];
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SapA</Text>
      <View style={styles.subtitleContainer}>
        <Text style={styles.subtitle}>assetmanagement</Text>
        <TouchableOpacity style={styles.button} onPress={handleCameraPress}>
          <Text style={styles.buttonText}>写真を撮る</Text>
        </TouchableOpacity>
      </View>

      {inputValues.map((value, index) => (
        <View key={index} style={styles.inputContainer}>
          <Text style={styles.inputLabel}>{getInputLabel(index)}</Text>
          <TextInput
            style={styles.input}
            placeholder={`手入力${index + 1}`}
            value={value}
            onChangeText={(text) => handleInputChange(index, text)}
          />
        </View>
      ))}

      <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
        <Text style={styles.searchButtonText}>検索</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  subtitleContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 24,
    color: '#555',
  },
  button: {
    marginTop: 8,
    padding: 10,
    backgroundColor: '#3498db',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  inputContainer: {
    marginBottom: 8,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 4,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 8,
    paddingHorizontal: 8,
    width: 200,
  },
  searchButton: {
    marginTop: 16,
    padding: 10,
    backgroundColor: '#3498db',
    borderRadius: 5,
  },
  searchButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default HomeScreen;

