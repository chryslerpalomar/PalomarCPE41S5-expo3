// Status.js start
import React from 'react';
import { Animated, Platform, StatusBar, StyleSheet, Text, View } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

export default class Status extends React.Component {
  state = {
    isConnected: true,
    showBubble: false,
    fadeAnim: new Animated.Value(0),
  };

  componentDidMount() {
    this.unsubscribe = NetInfo.addEventListener(state => {
      this.setState({ isConnected: state.isConnected, showBubble: true });

      if (this.bubbleTimeout) {
        clearTimeout(this.bubbleTimeout);
      }

      Animated.timing(this.state.fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();

      this.bubbleTimeout = setTimeout(() => {
        Animated.timing(this.state.fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start(() => {
          this.setState({ showBubble: false });
        });
      }, 5000);
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
    if (this.bubbleTimeout) {
      clearTimeout(this.bubbleTimeout);
    }
  }

  render() {
    const { isConnected, showBubble, fadeAnim } = this.state;
    const backgroundColor = isConnected ? 'green' : 'red';
    const messageText = isConnected ? "Connected to the internet" : "No network connection";

    const statusBar = (
      <StatusBar
        backgroundColor={backgroundColor}
        barStyle={isConnected ? 'dark-content' : 'light-content'}
        animated={true}
      />
    );

    const messageContainer = showBubble && (
      <Animated.View style={[styles.messageContainer, { opacity: fadeAnim }]} pointerEvents="none">
        {statusBar}
        <View style={[styles.bubble, { backgroundColor }]}>
          <Text style={styles.text}>{messageText}</Text>
        </View>
      </Animated.View>
    );

    if (Platform.OS === 'ios') {
      return (
        <View style={[styles.status, { backgroundColor }]}>
          {messageContainer}
        </View>
      );
    }

    return messageContainer;
  }
}

const statusHeight = (Platform.OS === 'ios' ? Constants.statusBarHeight : 0);

const styles = StyleSheet.create({
    status: {
      zIndex: 1,
      height: statusHeight,
    },
    messageContainer: {
      zIndex: 1,
      position: 'absolute',
      top: statusHeight + 20,
      right: 0,
      left: 0,
      height: 80,
      alignItems: 'center',
    },
    bubble: {
      marginTop: 20,
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 20,
    },
    text: {
      color: 'white',
    },
});
// Status.js end