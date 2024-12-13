// MessageList.js start
import React from "react";
import PropTypes from 'prop-types';

import { MessageShape } from "./MessageUtils";

import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View, Alert, } from "react-native";
import MapView, { Marker } from 'react-native-maps';

const keyExtractor = item => `${item.id}`;

export default class MessageList extends React.Component {
    static propTypes = {
        messages: PropTypes.arrayOf(MessageShape).isRequired,
        onPressMessage: PropTypes.func,
    };

    static defaultProps = {
        onPressMessage: () => {},
    };

    renderMessageItem = ({ item }) => {
        const { onPressMessage } = this.props;
        return (
            <View style={styles.messageRow}>
                <TouchableOpacity onPress={() => onPressMessage(item)}>
                    {this.renderMessageBody(item)}
                </TouchableOpacity>
            </View>
        );
    };

    renderMessageBody = ({ type, text, uri, coordinate }) => {
        switch (type) {
            case 'text':
                return (
                    <View style={styles.messageBubble}>
                        <Text style={styles.text}>{text}</Text>
                    </View>
                );

            case 'image':
                return (
                    <TouchableOpacity onPress={() => this.props.onPressImage(uri)}>
                        <Image style={styles.image} source={{ uri }} />
                    </TouchableOpacity>
                );
            
            case 'location':
                return (
                    
                    <MapView 
                        style={styles.map} 
                        initialRegion={{
                            ...coordinate,
                            latitudeDelta: 0.08,
                            longitudeDelta: 0.04,
                        }}
                    >
                        <Marker coordinate={coordinate} />
                    </MapView>
                    
                );

            default:
                return null;
        }
    };

    render() {
        const { messages } = this.props;
        return (
            <FlatList
                style={styles.container}
                data={messages}
                renderItem={this.renderMessageItem}
                keyExtractor={keyExtractor}
                keyboardShouldPersistTaps='handled'
                extraData={messages}
            />
        );
    }
}

const styles = StyleSheet.create({
    container: {
        marginTop: 1,
        flex: 1,
        paddingLeft: 10,
    },

    messageRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginLeft: 60,
        marginBottom: 10,
    },
    messageBubble: {
        marginTop: 7,
        marginHorizontal: 7,
        paddingVertical: 8,
        borderRadius: 10,
        backgroundColor: '#c8edfd', 
        marginLeft: 20,
        alignSelf: 'flex-end',
    },
    text: {
        color: '#333',
        fontSize: 16,
        fontWeight: '500',
        paddingLeft: 10,
        paddingRight: 10,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 8,
        marginBottom: 5,
    },
    map: {
        width: 200,
        height: 200,
        borderRadius: 8,
        marginBottom: 5,
    },
});
// MessageList.js end