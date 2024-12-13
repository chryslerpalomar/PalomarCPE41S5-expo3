// App.js start
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, FlatList, ImageBackground, TouchableOpacity, Alert, Image, Modal, BackHandler } from 'react-native';
import React, { useState, useEffect } from 'react';
import Status from './components/Status';  
import MessageList from './components/MessageList';
import { createImageMessage, createLocationMessage, createTextMessage } from './components/MessageUtils';
import Toolbar from './components/Toolbar';

// added import HOA13 //
import * as Location from 'expo-location';

export default function App() {
  const [messages, setMessages] = useState([
    createTextMessage('World'),
    createImageMessage('https://unsplash.it/300/300'),  
    createTextMessage('World'),
    createTextMessage('Hello'),
    createLocationMessage({
      latitude: 37.78825,
      longitude: -122.4324,
    }),
  ]);
  
  const [inputText, setInputText] = useState('');

  const handleSendMessage = () => {
    if (inputText.trim()) {
      const newMessage = createTextMessage(inputText);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setInputText(''); 
    }
  };

  const handlePressMessage = (message) => {
    Alert.alert(
      "Delete Message",
      "Are you sure you want to delete this message?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => deleteMessage(message),
        },
      ],
      { cancelable: true }
    );
  };

  const deleteMessage = (messageToDelete) => {
    setMessages((prevMessages) => prevMessages.filter(message => message.id !== messageToDelete.id));
  };

  const [fullscreenImage, setFullscreenImage] = useState(null);
  
  const handleImagePress = (uri) => {
    console.log('Tapped image URI:', uri);  
    if (fullscreenImage === uri) {
      setFullscreenImage(null);
    } else {
      setFullscreenImage(uri);
    }
  };

  const dismissFullscreenImage = () => {
    setFullscreenImage(null); 
  };

  useEffect(() => {
    const backAction = () => {
      if (fullscreenImage) {
        setFullscreenImage(null); 
        return true;  
      }
      return false; 
    };

    BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', backAction);
    };
  }, [fullscreenImage]);

  handleSubmit = (inputText) => {
    if (inputText.trim()) {
      const newMessage = createTextMessage(inputText);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    }
  };

  handleCameraPress = () => {
    console.log("Camera pressed");
  };

  // modified code HOA13 start here
  handleLocationPress = async () => {
    console.log("Location pressed");
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Location permission is required to use this feature.');
      return;
    }
  
    const location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;
  
    setMessages((prevMessages) => [
      ...prevMessages,
      createLocationMessage({ latitude, longitude }),
    ]);
  };
  // modified code HOA13 end here

  return (
    <ImageBackground
      source={require('./assets/background.jpg')} 
      style={styles.container}
    > 
      <Status />  

      <View style={styles.status}></View>

      {fullscreenImage && (
        <Modal
          visible={!!fullscreenImage} 
          transparent={true} 
          onRequestClose={dismissFullscreenImage} 
        >
          <TouchableOpacity
            style={styles.fullscreenOverlay}
            onPress={dismissFullscreenImage} 
          >
            <Image
              source={{ uri: fullscreenImage }}
              style={styles.fullscreenImage}
              resizeMode="contain" 
            />
          </TouchableOpacity>
        </Modal>
      )}

      { /* render chats in message area */ }
      <View style={styles.messageList}> 
        <MessageList messages={messages}
          onPressMessage={handlePressMessage}
          onPressImage={handleImagePress} 
        />
      </View>

      {/* render toolbar with text entry and enter button */}
      <Toolbar
        isFocused={false}
        onChangeFocus={(focused) => console.log("Focus changed:", focused)}
        onSubmit={this.handleSubmit}
        value={inputText}
        onChangeText={(text) => setInputText(text)}  
        onPressCamera={this.handleCameraPress}
        onPressLocation={this.handleLocationPress}
      />

      <StatusBar style="auto" />
    </ImageBackground>
  );
}

// Styles for components
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0)',
  },

  status: {
    height: 35,
    backgroundColor: '#eeeeee',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    marginBottom: 10,
  },

  messageList: {
    flex: 1,
    backgroundColor: 'transparent', 
  },

  messageContainerLeft: {
    marginTop: 7,
    marginHorizontal: 7,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#c8edfd', 
    marginLeft: 20,
    alignSelf: 'flex-start',
  },

  messageContainerRight: {
    marginTop: 7,
    marginHorizontal: 7,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#c8edfd', 
    marginLeft: 20,
    alignSelf: 'flex-end',
  },

  messageText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '500',
    paddingLeft: 10,
    paddingRight: 10,
  },

  toolbar: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.01)',
    backgroundColor: 'transparent',  
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.04)',
    flexDirection: 'row',  
    justifyContent: 'space-between',  
    alignItems: 'center',  
  },

  textInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 8,
    borderRadius: 5,
    backgroundColor: 'transparent', 
    flex: 1,  
    marginRight: 10,  
  },

  sendButton: {
    padding: 5,
    marginRight: 10,  
  },
  fullscreenImage: {
    width: '80%', 
    height: '80%', 
    resizeMode: 'contain', 
  },
  
  fullscreenOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },

});
// App.js end