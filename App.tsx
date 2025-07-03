import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { CameraView, useCameraPermissions, useMicrophonePermissions } from 'expo-camera';

export default function App() {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [microphonePermission, requestMicrophonePermission] = useMicrophonePermissions();
  const cameraRef = useRef<CameraView | null>(null);
  const [recordStarted, setRecordStarted] = useState(false);

  // Ask for camera permission on mount
  useEffect(() => {
    if (!cameraPermission?.granted) {
      requestCameraPermission();
    }
    if (!microphonePermission?.granted) {
      requestMicrophonePermission();
    }
  }, [cameraPermission, requestCameraPermission, microphonePermission, requestMicrophonePermission]);

  const [cameraReady, setCameraReady] = useState(false);

  // Once the camera ref is available, start recording a video
  useEffect(() => {
    if (cameraRef.current && !recordStarted && cameraReady) {
      setRecordStarted(true);
      console.log('Starting recording');

      cameraRef.current?.recordAsync().then((video) => {
        console.log('Recorded video:', video);
      }).catch((err) => {
        console.error('Recording error:', err);
      });

      setTimeout(() => {
        console.log('Stopping recording');
        cameraRef.current?.stopRecording();
        setRecordStarted(false);
      }, 3000);
    } else {
      console.log('Camera ref is not available');
    }
  }, [cameraReady]);  

  if (!cameraPermission || !cameraPermission.granted) {
    // You might want to display some UI prompting the user – keep it minimal for demo.
    return <View style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        onCameraReady={() => {
          console.log('Camera ready');
          setCameraReady(true);
        }}
        facing="front"
        mode="video" // ensure video mode
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
});
