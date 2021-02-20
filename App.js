import {StatusBar} from 'expo-status-bar';
import React from 'react';
import {Button, FlatList, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {FontAwesome5} from '@expo/vector-icons';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack'
import {Field, Formik} from 'formik';
import CustomTextInput from './components/CustomTextInput';
import {CustomImageField, CustomSelectField, CustomTextareaField, CustomTextField} from './components/CustomFormFields';
import ReportRow from "./components/ReportRow";

const TEMP_EXAMPLE_DATA = [
    {
        id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
        title: 'Pothole Near Pizza Hut',
        description: 'Pothole in the right turn lane next to Pizza Hut',
        category: 'road',
        upvotes: 18,
        downvotes: 2
    },
    {
        id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
        title: 'Sidewalk Bump Near 99 Ranch',
        description: 'Large sidewalk bump on the right side of the road near 99 Ranch',
        category: 'sidewalk',
        upvotes: 8,
        downvotes: 3
    }
];

function HomeScreen({navigation}) {
    return (
        <View style={styles.container}>
            <FontAwesome5 name="binoculars" size={48} color="#182b49"/>
            <Text style={[styles.h1, styles.textNavy]}>Streetspot</Text>
            <Text style={[{marginBottom: '0.5rem', textAlign: 'center'}, styles.textNavy]}>
                Spot and report local infrastructure issues in your area to improve your city!
            </Text>
            <CustomTextInput placeholder={"Search for a location"}/>
            <FontAwesome5.Button name="map-marker-alt" backgroundColor="#006a96"
                                 onPress={() => navigation.navigate('Live Map')}>
                Use Current Location
            </FontAwesome5.Button>
            <br/>
            <FontAwesome5.Button name="list" backgroundColor="#182b49" onPress={() => navigation.navigate('Reports')}>
                List of Local Reports
            </FontAwesome5.Button>
            <StatusBar style="auto"/>
        </View>
    );
}

const renderReport = ({item}) => (
    <ReportRow report={item}/>
);

function ReportsScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <FontAwesome5 name="binoculars" size={48} color="#182b49"/>
            <Text style={[styles.h1, styles.textNavy]}>View Local Reports</Text>
            <Text style={[{marginBottom: '0.5rem', textAlign: 'center'}, styles.textNavy]}>
                Scroll through popular issues reported near you!
            </Text>

            <FlatList
                data={TEMP_EXAMPLE_DATA}
                renderItem={renderReport}
                keyExtractor={item => item.id}
            />
        </SafeAreaView>
    );
}

function LiveMapScreen({navigation}) {
    return (
        <View style={styles.container}>
            <FontAwesome5.Button name="plus" backgroundColor="#182b49"
                                 onPress={() => navigation.navigate('Create Report Modal')}>
                Report an Issue
            </FontAwesome5.Button>
        </View>
    );
}

function CreateReportModalScreen({navigation}) {
    return (
        <View style={styles.container}>
            <FontAwesome5 name="exclamation" size={48} color="#182b49"/>
            <Text style={[styles.h1, styles.textNavy]}>Report an Issue</Text>
            <Text style={[{marginBottom: '0.5rem', textAlign: 'center'}, styles.textNavy]}>
                Spot an infrastructure issue? Describe the issue you saw in detail to mark it on the map!
            </Text>

            <Formik initialValues={{title: '', description: '', category: 'road'}} onSubmit={values => {
                console.log(values);
                navigation.goBack();
            }}>
                {({handleSubmit}) => (
                    <div style={{textAlign: 'center'}}>
                        <Field name="title" placeholder="Title or Summary" component={CustomTextField}/>
                        <CustomImageField/>
                        <Field name="description" placeholder="Description" component={CustomTextareaField}/>
                        <Field name="category" as="select" component={CustomSelectField}>
                            <option value="road">Road</option>
                            <option value="sidewalk">Sidewalk</option>
                            <option value="off-road">Off-road</option>
                        </Field>

                        <FontAwesome5.Button name="check" backgroundColor="#182b49" onPress={handleSubmit}>
                            Submit
                        </FontAwesome5.Button>
                    </div>
                )}
            </Formik>
            <StatusBar style="auto"/>
        </View>
    );
}

function ViewReportModalScreen({route, navigation}) {
    const {title, description, category} = route.params;

    return (
        <View style={styles.container}>
            <FontAwesome5 name="info" size={48} color="#182b49"/>
            <Text style={styles.h1}>{title}</Text>
            <Text style={styles.h2}>Category: {category}</Text>
            <Text style={{marginBottom: '2rem', marginTop: '1.5rem'}}>{description}</Text>

            <FontAwesome5.Button name="arrow-left" backgroundColor="#182b49" onPress={() => navigation.goBack()}>
                Go back
            </FontAwesome5.Button>
        </View>
    );
}


const MainStack = createStackNavigator();
const RootStack = createStackNavigator();

function MainStackScreen() {
    return (
        <MainStack.Navigator screenOptions={{
            headerStyle: {
                backgroundColor: '#182b49'
            },
            headerTintColor: '#ffffff',
            headerTitleStyle: {
                color: '#ffffff'
            }
        }}>
            <MainStack.Screen name="Home" component={HomeScreen} options={{title: 'Streetspot'}}/>
            <MainStack.Screen name="Live Map" component={LiveMapScreen}/>
            <MainStack.Screen name="Reports" component={ReportsScreen}/>
        </MainStack.Navigator>
    );
}

export default function App() {
    return (
        <NavigationContainer>
            <RootStack.Navigator mode="modal" screenOptions={{
                headerStyle: {
                    backgroundColor: '#182b49'
                },
                headerTintColor: '#ffffff',
                headerTitleStyle: {
                    color: '#ffffff'
                }
            }}>
                <RootStack.Screen name="Main" component={MainStackScreen} options={{headerShown: false}}/>
                <RootStack.Screen name="Create Report Modal" component={CreateReportModalScreen}/>
                <RootStack.Screen name="View Report Modal" component={ViewReportModalScreen}/>
            </RootStack.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px'
    },
    field: {
        borderColor: '#006a96',
        borderRadius: 5,
        borderWidth: 1,
        padding: 12
    },
    h1: {
        fontSize: 'calc(1.375rem + 1.5vw)',
        fontWeight: 'bold',
        lineHeight: '1.2',
        marginBottom: '0.5rem'
    },
    h2: {
        fontSize: 'calc(1.325rem + 0.9vw)',
        fontWeight: 'bold',
        lineHeight: '1.2',
        marginBottom: '0.5rem'
    },
    textNavy: {
        color: '#182b49'
    },
    textBlue: {
        color: '#006a96'
    }
});
