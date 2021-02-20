import React from 'react';
import { TextInput } from 'react-native';

const CustomTextInput = (props) => {
    const [value, onChangeText] = React.useState('');

    return (
        <TextInput
            style={{ width: '75%', height: 40, borderColor: '#006a96', borderRadius: 5, borderWidth: 1, marginBottom: '0.5rem', padding: 12 }}
            onChangeText={text => onChangeText(text)}
            placeholder={props.placeholder}
            value={value}
        />
    );
}

export default CustomTextInput;