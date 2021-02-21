import React, {useState, useEffect} from 'react';
import {Button, Image, View, Platform} from 'react-native';
import {FontAwesome5} from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

export const CustomImageField = ({field, form, ...props}) => {
    const [image, setImage] = useState(null);

    useEffect(() => {
        (async () => {
            if (Platform.OS !== 'web') {
                const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    alert('Sorry, we need camera roll permissions to make this work!');
                }
            }
        })();
    }, []);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        console.log(result);

        if (!result.cancelled) {
            setImage(result.uri);
        }
    };

    return (
        <View style={{flex: 1, alignItems: 'left', justifyContent: 'center'}}>
            <FontAwesome5.Button name="camera" backgroundColor="#006a96"
                                 onPress={pickImage}>
                Choose or Take A Photo
            </FontAwesome5.Button>
            <input id="image" {...field} {...props} style={{display: 'none'}} value={(image) ? image : ''}/>
            {image && <Image source={{uri: image}} style={{width: 200, height: 200, marginTop: '0.5rem'}}/>}
        </View>
    );
}

export const CustomTextField = ({field, form, ...props}) => {
    return (
        <input {...field} {...props}
               style={{
                   font: '14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
                   fontSize: 14,
                   width: '100%',
                   boxSizing: 'border-box',
                   borderColor: '#006a96',
                   borderRadius: 5,
                   borderWidth: 1,
                   marginBottom: '0.5rem',
                   padding: 12
               }}
        />
    );
}

export const CustomTextareaField = ({field, form, ...props}) => {
    return (
        <textarea {...field} {...props}
                  style={{
                      font: '14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
                      fontSize: 14,
                      width: '100%',
                      boxSizing: 'border-box',
                      borderColor: '#006a96',
                      borderRadius: 5,
                      borderWidth: 1,
                      marginTop: '0.5rem',
                      marginBottom: '0.5rem',
                      padding: 12
                  }}
                  rows="4"/>
    );
}

export const CustomSelectField = ({field, form, ...props}) => {
    return (
        <select {...field} {...props}
                style={{
                    font: '14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
                    fontSize: 14,
                    width: '100%',
                    borderColor: '#006a96',
                    borderRadius: 5,
                    borderWidth: 1,
                    marginBottom: '0.5rem',
                    padding: 12
                }}
        />
    );
}
