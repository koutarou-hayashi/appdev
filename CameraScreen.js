import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';
import { useNavigation } from '@react-navigation/native';

const CameraScreen = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const cameraRef = useRef(null);
  const navigation = useNavigation();
  // const [ocrResult, setOcrResult] = useState(''); 
  useEffect(() => {
    getCameraPermission();
  }, []);

  const getCameraPermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === 'granted');
  };

  const onCameraReady = () => {
    console.log('カメラの初期化が完了しました。');
  };

  const onCameraError = (error) => {
    console.error('カメラエラー:', error);
  };

  const startCamera = async () => {
    if (hasPermission && cameraRef.current) {
      try {
        await cameraRef.current.resumePreview();
        console.log('カメラが起動しました。');
      } catch (e) {
        console.error('カメラの起動に失敗しました。', e);
      }
    }
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({ base64: true });
      processImage(photo);
    }
  };

  const processImage = async (photo) => {
    try {
      const processedImage = await ImageManipulator.manipulateAsync(
        photo.uri,
        [{ resize: { width: 800 } }],
        { compress: 0, format: 'png', base64: true }
      );
      performOCR(processedImage.base64);
    } catch (error) {
      console.error('画像の処理中にエラーが発生しました。', error);
    }
  };

  const performOCR = async (base64) => {
    //AIzaSyCRIxeMrMfIIlvIhRTxxAEv9t_ayC8HSJI
    const API_KEY = 'AIzaSyCRIxeMrMfIIlvIhRTxxAEv9t_ayC8HSJI';
    const API_URL = `https://vision.googleapis.com/v1/images:annotate?key=${API_KEY}`;

    const requestData = {
      requests: [
        {
          image: {
            content: base64,
          },
          features: [
            {
              type: 'TEXT_DETECTION',
            },
          ],
          imageContext: {
            languageHints: ['ja'],
          },
        },
      ],
    };

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const result = await response.json();
      console.log('OCR 結果:', result.responses[0]?.fullTextAnnotation?.text);

      navigation.navigate('Home', { ocrResult: result.responses[0]?.fullTextAnnotation?.text });
    } catch (error) {
      console.error('OCR リクエスト中にエラーが発生しました。', error);
    }
  };

  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={styles.camera}
        type={Camera.Constants.Type.back}
        onCameraReady={onCameraReady}
        onMountError={onCameraError}
      />
      <View style={styles.buttonContainer}>
        <Text style={styles.button} onPress={startCamera}>
          カメラ起動
        </Text>
        <Text style={styles.button} onPress={takePicture}>
          写真を撮る
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  buttonContainer: {
    backgroundColor: 'transparent',
    marginBottom: 20,
  },
  button: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 5,
    margin: 10,
  },
});

export default CameraScreen;
