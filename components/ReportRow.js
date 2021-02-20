import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {TouchableHighlight} from "react-native-web";
import {FontAwesome5} from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const ReportRow = (props) => {
    const navigation = useNavigation();
    const report = props.report;

    return (
        <TouchableHighlight activeOpacity={0.6} underlayColor="#264576" style={{width: '75vw'}} onPress={() => navigation.navigate('View Report Modal', {
            title: report.title,
            description: report.description,
            category: report.category,
        })}>
            <View style={{flex: 1, backgroundColor: '#182b49', color: 'white', marginBottom: '0.5rem', padding: 12, width: '100%'}}>
                <Text style={styles.text}>
                    <FontAwesome5 name="binoculars" color="white"/>
                    {' '}
                    {report.title}
                </Text>
                <Text style={styles.text}>
                    <FontAwesome5 name="thumbs-up" color="white"/>
                    {' '}
                    {report.upvotes}
                </Text>
                <Text style={styles.text}>
                    <FontAwesome5 name="thumbs-down" color="white"/>
                    {' '}
                    {report.downvotes}
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