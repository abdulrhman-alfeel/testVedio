import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Modal,
  StyleSheet,
  Dimensions,
  Text,
  Linking,
  Alert,
  Animated,
  Pressable,
} from 'react-native';
import Video from 'react-native-video';
import RNFS from 'react-native-fs';
import { PermissionsAndroid, Platform } from 'react-native';
import throttle from 'lodash.throttle';

const window = Dimensions.get('screen');

const requestPermissions = async () => {
  try {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission Needed',
          message: 'App needs access to your storage to download files',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } else {
      return true;
    }
  } catch (err) {
    console.warn(err);
    return false;
  }
};

const downloadFile = async (uri: string, setDownloadProgress: (progress: number) => void) => {
  const downloadPath = `${RNFS.DocumentDirectoryPath}/temp_video.mp4`;

  const downloadOptions = {
    fromUrl: uri,
    toFile: downloadPath,
    background: true,
    discretionary: true,
    progress: throttle((res) => {
      const progress = res.bytesWritten / res.contentLength;
      setDownloadProgress(progress);
    }, 500),
  };

  try {
    const result = await RNFS.downloadFile(downloadOptions).promise;
    if (result.statusCode === 200) {
      return downloadPath; // Return localUri directly
    } else {
      throw new Error('File download failed');
    }
  } catch (error) {
    console.error('Error downloading or saving video:', error);
    return '';
  }
};

export default function App() {
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [videoUri, setVideoUri] = useState('');
  const [showAnimation, setShowAnimation] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackPosition, setPlaybackPosition] = useState(0); // Track playback position

  const animationValue = useRef(new Animated.Value(0)).current;
  const videoRef = useRef<Video | null>(null); // Reference to Video component

  const videoUrl = 'https://storage.googleapis.com/demo_backendmoshrif_bucket-2/rn_image_picker_lib_temp_4f7df09f-d65d-4d58-ad95-3164e781c443.mp4';

  useEffect(() => {
    if (isPlaying) {
      const startDownload = async () => {
        const hasPermission = await requestPermissions();
        if (hasPermission) {
          const localVideoUri = await downloadFile(videoUrl, setDownloadProgress);
          setVideoUri(localVideoUri);
          setShowAnimation(true);
          Animated.sequence([
            Animated.timing(animationValue, {
              toValue: 1,
              duration: 1500,
              useNativeDriver: false,
            }),
            Animated.timing(animationValue, {
              toValue: 0,
              duration: 1500,
              useNativeDriver: false,
            }),
          ]).start();

          // Hide progress text after download finishes
          setTimeout(() => {
            setShowAnimation(false);
          }, 1500); // Hide after the animation duration
        }
      };

      startDownload();
    }
  }, [isPlaying]);

  const handlePlaybackStatusUpdate = (status: any) => {
    if (status.isPlaying && !isPlaying) {
      setIsPlaying(true);
    }
    if (status.didJustFinish) {
      setShowAnimation(false);
      setIsPlaying(false); // Stop playing after finishing
    }
    if (status.positionMillis) {
      setPlaybackPosition(status.positionMillis); // Track playback position
    }
  };

  const handleLoad = async () => {
    if (videoRef.current && playbackPosition) {
      await videoRef.current.seek(playbackPosition);
    }
  };

  const animationBackgroundColor = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['transparent', 'rgba(0, 255, 0, 0.3)'],
  });

  return (
    <View style={styles.container}>
      <Modal
        visible={true}  // Change this to `true` to display video directly
        onRequestClose={() => { /* Optionally handle close */ }}
        animationType="fade"
        transparent={true}  // Make the background transparent
      >
        <Pressable style={styles.centeredView}>
          <View style={styles.videoContainer}>
            {downloadProgress < 1 && (
              <Animated.View
                style={[
                  styles.progressBar,
                  {
                    width: `${(downloadProgress * 100).toFixed(2)}%`,
                    backgroundColor: 'rgba(0, 255, 0, 0.7)',
                  },
                ]}
              />
            )}
            <Video
              ref={videoRef}  // Set ref to Video component
              source={{ uri: videoUri || videoUrl }}
              style={styles.video}
              resizeMode="contain"
              controls={true}
              repeat={false} 
              onEnd={() => {
                setShowAnimation(false);
                setIsPlaying(false);
              }}
              onLoad={handleLoad}
              onProgress={handlePlaybackStatusUpdate}
            />
          </View>
          {showAnimation && (
            <Animated.View style={[styles.animationView, { backgroundColor: animationBackgroundColor }]} />
          )}
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
  },
  videoContainer: {
    width: 300, 
    height: 200, 
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: 'black',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  progressBar: {
    height: 4,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  progressText: {
    fontSize: 16,
    color: '#fff',
    margin: 10,
  },
  animationView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
});
