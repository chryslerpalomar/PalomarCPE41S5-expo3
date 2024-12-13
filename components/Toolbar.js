// Toolbar.js start
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import PropTypes from "prop-types";
import React from "react";
  
const ToolbarButton = ({ title, onPress }) => (
    <TouchableOpacity onPress={onPress}>
        <Text style={styles.button}>{title}</Text>
    </TouchableOpacity>
);
  
ToolbarButton.propTypes = {
    title: PropTypes.string.isRequired,
    onPress: PropTypes.func.isRequired,
};
  
export default class Toolbar extends React.Component {
    static propTypes = {
        isFocused: PropTypes.bool.isRequired,
        onChangeFocus: PropTypes.func,
        onSubmit: PropTypes.func,
        onPressCamera: PropTypes.func,
        onPressLocation: PropTypes.func,
    };
  
    static defaultProps = {
        onChangeFocus: () => {},
        onSubmit: () => {},
        onPressCamera: () => {},
        onPressLocation: () => {},
    };

    state = {
        text: "",
    };
    
    handleChangeText = (text) => {
        this.setState({ text });
    };
    
    handleSubmitEditing = () => {
        const { onSubmit } = this.props;
        const { text } = this.state;
        if (text.trim()) {
            onSubmit(text);
            this.setState({ text: '' });
        }
    };

    setInputRef = (ref) => {
        this.input = ref;
    };

    componentWillReceiveProps(nextProps) {
        if (nextProps.isFocused !== this.props.isFocused) {
            if (nextProps.isFocused) {
                this.input.focus();
            } else {
                this.input.blur();
            }
        }
    }

    handleFocus = () => {
        const { onChangeFocus } = this.props;
        onChangeFocus(true);
    };
    
    handleBlur = () => {
        const { onChangeFocus } = this.props;
        onChangeFocus(false);
    };


  
    render() {
        const { onPressCamera, onPressLocation } = this.props;
        const { text } = this.state;
        
        return (
            <View style={styles.toolbar}>
                <TouchableOpacity onPress={onPressCamera}>
                    <Text style={styles.button}>📷</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onPressLocation}>
                    <Text style={styles.button}>📍</Text>
                </TouchableOpacity>
                <TextInput
                    style={styles.input}
                    placeholder="Type a message"
                    value={text}
                    onChangeText={this.handleChangeText}
                    onSubmitEditing={this.handleSubmitEditing}
                    blurOnSubmit={false}
                    onFocus={this.handleFocus} // added
                    onBlur={this.handleBlur} // added

                />
            </View>
        );
    }
}
  
const styles = StyleSheet.create({
    toolbar: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: 'white',
    },
    button: {
        fontSize: 24,
        marginRight: 10,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        padding: 10,
    },
});
// Toolbar.js end