import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {TouchableHighlight} from "react-native-web";
import {FontAwesome5} from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const ReportRow = (props) => {
    const navigation = useNavigation();
    const report = props.report;

    return (
        <TouchableHighlight activeOpacity={0.6} underlayColor="#264576" style={{width: '85vw'}} onPress={() => navigation.navigate('View Report Modal', {
            title: report.title,
            image: report.image,
            description: report.description,
            category: report.category,
            date: report.date,
            lat: report.lat,
            lng: report.lng,
            likes: report.likes,
            dislikes: report.dislikes
        })}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#182b49', color: 'white', marginBottom: '0.5rem', padding: 12, width: '100%'}}>
                <Text style={[styles.text, {width: '33%'}]}>
                    <FontAwesome5 name="binoculars" color="white"/>
                    {' '}
                    {report.title}
                </Text>
                <Image source={{uri: report.image}} style={{width: 96, height: 96}}/>
                <Text style={styles.text}>
                    <FontAwesome5 name="thumbs-up" color="white"/>
                    {' '}
                    {report.likes}
                    {'  '}
                    <FontAwesome5 name="thumbs-down" color="white"/>
                    {' '}
                    {report.dislikes}
                </Text>
            </View>
        </TouchableHighlight>
    );
}

const styles = StyleSheet.create({
    h1: {
        color: 'white',
        fontSize: 'calc(1.375rem + 1.5vw)',
        fontWeight: 'bold',
        lineHeight: '1.2',
        marginBottom: '0.5rem'
    },
    h2: {
        color: 'white',
        fontSize: 'calc(1.325rem + 0.9vw)',
        fontWeight: 'bold',
        lineHeight: '1.2',
        marginBottom: '0.5rem'
    },
    text: {
        color: 'white'
    }
});

export default ReportRow;