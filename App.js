/* ---------- MODULES ---------- */
/* ----- Native ----- */
import {StatusBar} from 'expo-status-bar';
import React, {useEffect, useState} from 'react';
import {FlatList, Image, SafeAreaView, StyleSheet, Text, View} from 'react-native';

/* ----- External Back-end ----- */
import {Loader} from "@googlemaps/js-api-loader"
import * as Location from 'expo-location';
import firebase from 'firebase';
import 'react-native-get-random-values';
import {v4 as uuidv4} from 'uuid';

/* ----- External Front-end ----- */
import {FontAwesome5} from '@expo/vector-icons';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack'
import {Field, Formik} from 'formik';

/* ----- Custom ----- */
import {CustomImageField, CustomSelectField, CustomTextareaField, CustomTextField} from './components/CustomFormFields';
import ReportRow from "./components/ReportRow";

/* ---------- CONSTANTS ---------- */
let reports = [];

/* ---------- FUNCTIONS ---------- */
function storeReport(report) {
    firebase.database().ref('reports/' + uuidv4()).set({
        title: report.title,
        description: report.description,
        image: report.image,
        category: report.category,
        lat: report.lat,
        lng: report.lng,
        likes: 0,
        dislikes: 0,
        date: new Date().toUTCString()
    });
}

function getReports() {
    const mostLiked = firebase.database().ref('reports').orderByChild('likes');
    mostLiked.once('value', (snapshot) => {
        let reportsArray = [];
        snapshot.forEach((childSnapshot) => {
            let report = childSnapshot.val();
            report.id = childSnapshot.key;
            reportsArray.push(report);
        });

        console.log(reportsArray);
        reports = reportsArray;

        return reportsArray;
    });
}

/* ---------- CONFIGURATION / INITIALIZATION ---------- */
/* ----- Firebase ----- */
const firebaseConfig = {
    apiKey: "AIzaSyDKONPXXmii6ukk84Uioc-B5h1dEzO39YM",
    authDomain: "streetspot-51164.firebaseapp.com",
    databaseURL: 'https://streetspot-51164-default-rtdb.firebaseio.com/',
    projectId: "streetspot-51164",
    storageBucket: "streetspot-51164.appspot.com",
    messagingSenderId: "728748622177",
    appId: "1:728748622177:web:004b25e63a2febe5124520",
    measurementId: "G-C2M0SNTY49"
};
firebase.initializeApp(firebaseConfig);

const mostLiked = firebase.database().ref('reports').orderByChild('likes');
mostLiked.once('value', (snapshot) => {
    snapshot.forEach((childSnapshot) => {
        reports.push(Object.assign(childSnapshot.val(), {id: childSnapshot.key}));
    });
});

/* ----- Maps JavaScript API ----- */
const loader = new Loader({
    apiKey: "AIzaSyBTr78_4r6yBFhOE41l3Xb-6cTc8ogUv0I",
    libraries: ['places'],
    version: "weekly",
});

/* ---------- VIEWS ---------- */
class HomeScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            autocomplete: null,
            lat: 0,
            lng: 0,
            useCurrentLocation: false
        }
    }

    componentDidMount() {
        (async () => {
            let {status} = await Location.requestPermissionsAsync();
            if (status !== 'granted') {
                return;
            }

            const location = await Location.getCurrentPositionAsync({});
            this.state.lat = location.coords.latitude;
            this.state.lng = location.coords.longitude;

            const input = document.getElementsByName("location")[0];

            loader.load().then(() => {
                this.state.autocomplete = new google.maps.places.Autocomplete(input);
                this.state.autocomplete.setFields(['geometry']);
            })
        })();
    }

    render() {
        return (
            <View style={styles.container}>
                <FontAwesome5 name="binoculars" size={48} color="#182b49"/>
                <Text style={[styles.h1, styles.textNavy]}>Streetspot</Text>
                <Text style={[{marginBottom: '2rem', textAlign: 'center'}, styles.textNavy]}>
                    Spot and report local infrastructure issues in your area to improve your city!
                </Text>
                <Formik initialValues={{location: ''}} onSubmit={values => {
                    const place = this.state.autocomplete.getPlace();

                    console.log(place.geometry);
                    this.props.navigation.navigate('Live Map', {lat: place.geometry.location.lat(), lng: place.geometry.location.lng()});
                }}>
                    {({handleSubmit}) => (
                        <div style={{textAlign: 'center'}}>
                            <Field name="location" placeholder="Search for a location" component={CustomTextField}/>
                            <FontAwesome5.Button name="search" backgroundColor="#182b49" onPress={handleSubmit}>
                                Search
                            </FontAwesome5.Button>
                        </div>
                    )}
                </Formik>
                <br/>
                <Text>OR</Text>
                <br/>
                <FontAwesome5.Button name="map-marker-alt" backgroundColor="#006a96"
                                     onPress={() => this.props.navigation.navigate('Live Map', {lat: this.state.lat, lng: this.state.lng})}>
                    Use Current Location
                </FontAwesome5.Button>
                <br/>
                <br/>
                <FontAwesome5.Button name="list" backgroundColor="#182b49"
                                     onPress={() => this.props.navigation.navigate('Reports')}>
                    List of Local Reports
                </FontAwesome5.Button>
                <StatusBar style="auto"/>
            </View>
        );
    }
}

const renderReport = ({item}) => (
    <ReportRow report={item}/>
);

function ReportsScreen() {
    const [location, setLocation] = useState(null); // location.coords.latitude & location.coords.longitude

    useEffect(() => {
        (async () => {
            let {status} = await Location.requestPermissionsAsync();
            if (status !== 'granted') {
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
        })();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <FontAwesome5 name="binoculars" size={48} color="#182b49"/>
            <Text style={[styles.h1, styles.textNavy]}>View Local Reports</Text>
            <Text style={[{marginBottom: '0.5rem', textAlign: 'center'}, styles.textNavy]}>
                Scroll through popular issues reported near you!
            </Text>

            {location && <FlatList
                data={reports}
                renderItem={renderReport}
                keyExtractor={item => item.id}
            />}
            {!location && <Text>Loading - Be sure to enable your location to find nearby reports</Text>}
        </SafeAreaView>
    );
}

class LiveMapScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currLoc: null,
            lat: props.route.params.lat,
            lng: props.route.params.lng,
            reportMode: false
        }
    }

    componentDidMount() {
        const map = new google.maps.Map(document.getElementById("map"), {
            center: {lat: this.state.lat, lng: this.state.lng},
            zoom: 18,
        });

        google.maps.event.addListener(map, "click", (event) => {
            if (this.state.reportMode) {
                new google.maps.Marker({
                    position: event.latLng,
                    map: map,
                    draggable: true
                });
                this.props.navigation.navigate('Create Report Modal', {lat: event.latLng.lat(), lng: event.latLng.lng()});
            }
        });

        (async () => {
            let {status} = await Location.requestPermissionsAsync();
            if (status !== 'granted') {
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            this.setState({currLoc: location});
        })();

        const locationButton = document.createElement('button');
        locationButton.textContent = 'Pan to Current Location';
        locationButton.classList.add('custom-map-control-button');
        map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(locationButton);
        locationButton.addEventListener("click", () => {
            map.setCenter({lat: this.state.currLoc.coords.latitude, lng: this.state.currLoc.coords.longitude});
        });
    }

    render() {
        return (
            <View style={[styles.container, {justifyContent: 'flex-start', padding: 0}]}>
                <div id="map" style={{width: '100%', height: '90%', marginBottom: '0.5rem'}}>

                </div>
                <FontAwesome5.Button name="plus" backgroundColor="#182b49" className="reportButton"
                                     onPress={() => this.setState({reportMode: !this.state.reportMode})}>
                    Report an Issue
                </FontAwesome5.Button>
                {this.state.reportMode && <Text>Tap on the map to mark the location of the issue!</Text>}
            </View>
        );
    }
}

function CreateReportModalScreen({route, navigation}) {
    const {lat, lng} = route.params;

    return (
        <View style={styles.container}>
            <FontAwesome5 name="exclamation" size={48} color="#182b49"/>
            <Text style={[styles.h1, styles.textNavy]}>Report an Issue</Text>
            <Text style={[{marginBottom: '0.5rem', textAlign: 'center'}, styles.textNavy]}>
                Spot an infrastructure issue? Describe the issue you saw in detail to mark it on the map!
            </Text>

            <Formik initialValues={{title: '', image: '', description: '', category: 'road'}} onSubmit={values => {
                values.image = document.getElementById('image').value;
                values.lat = lat;
                values.lng = lng;
                storeReport(values);
                console.log(values);
                navigation.goBack();
            }}>
                {({handleSubmit}) => (
                    <div style={{textAlign: 'center'}}>
                        <Field name="title" placeholder="Title or Summary" component={CustomTextField}/>
                        <Field name="image" placeholder="N/A" component={CustomImageField}/>
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
    const {title, image, description, category, lat, lng, date, likes, dislikes} = route.params;

    return (
        <View style={[styles.container, {justifyContent: 'flex-start', alignItems: 'left'}]}>
            <Text style={styles.h1}>
                {title}
            </Text>
            <Text style={styles.h2}>Category: {category}</Text>
            <Text>Submitted: {date}</Text>
            <Image source={{uri: image}} style={{width: 200, height: 200, marginTop: '1rem'}}/>
            <Text style={{marginBottom: '1.5rem', marginTop: '1.5rem'}}>{description}</Text>
            <FontAwesome5.Button name="arrow-right" backgroundColor="#182b49" onPress={() => navigation.navigate('Live Map', {lat: lat, lng: lng})}>
                See Location
            </FontAwesome5.Button>
            <Text>
                <FontAwesome5 name="thumbs-up" color="#182b49"/>
                {' '}
                {likes}
                {'   '}
                <FontAwesome5 name="thumbs-down" color="#182b49"/>
                {' '}
                {dislikes}
            </Text>
            <br/>
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
                <RootStack.Screen name="Create Report Modal" component={CreateReportModalScreen}
                                  options={{title: 'Report an Issue'}}/>
                <RootStack.Screen name="View Report Modal" component={ViewReportModalScreen}
                                  options={{title: 'Report Details'}}/>
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
