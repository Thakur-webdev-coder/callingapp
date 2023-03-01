import React from "react";
import {
    FlatList,
    Image,
    SafeAreaView,
    Text,
    View
} from 'react-native';
import {
    ic_user,
    ic_recent
} from "../../routes/imageRoutes";
import styles from './styles'
import AppStyle from "../../components/AppStyle";
import LinearGradient from "react-native-linear-gradient";
import colors from "../../../assets/colors";
import { CommonHeader } from "../../components";

const RecentCall = ({ navigation }) => {
    const countries = [
        {
            id: '1',
            name: 'United States',
            time: '11:11 AM',
            date: '10 Dec 2022'
        },
        {
            id: '2',
            name: 'United Kingdom',
            time: '11:11 AM',
            date: '10 Dec 2022'
        },
        {
            id: '3',
            name: 'Israel',
            time: '11:11 AM',
            date: '10 Dec 2022'
        },
        {
            id: '4',
            name: 'India',
            time: '11:11 AM',
            date: '10 Dec 2022'
        },
        {
            id: '5',
            name: 'Nigeria',
            time: '11:11 AM',
            date: '10 Dec 2022'
        },
        {
            id: '6',
            name: 'Uganda',
            time: '11:11 AM',
            date: '10 Dec 2022'
        },
        {
            id: '7',
            name: 'Israel',
            time: '11:11 AM',
            date: '10 Dec 2022'
        },
        {
            id: '8',
            name: 'India',
            time: '11:11 AM',
            date: '10 Dec 2022'
        },
        {
            id: '9',
            name: 'Nigeria',
            time: '11:11 AM',
            date: '10 Dec 2022'
        },
        {
            id: '10',
            name: 'Uganda',
            time: '11:11 AM',
            date: '10 Dec 2022'
        },
        {
            id: '11',
            name: 'wakanda forever',
            time: '11:11 AM',
            date: '10 Dec 2022'

        },
    ];
    const renderItem = ({ item }) => (
        <View style={styles.flatListStyle}>
            <LinearGradient colors={[colors.greenTop, colors.greenMid, colors.greenMid]}
                style={styles.linearGradient}>
                <Image style={styles.imgstyle} source={ic_user} />
            </LinearGradient>
            <View style={styles.userDetailView}>
                <Text style={styles.nameTxtStyle}>{item.name}</Text>
                <View style={{ flexDirection: 'row' }}>
                    <Image source={ic_recent} />
                    <Text style={styles.dateTxtStyle}>{item.time}, {item.date}</Text>
                </View>
            </View>
        </View>

    );
    return (
        <SafeAreaView style={AppStyle.wrapper}>
            <View style={AppStyle.secondWrapper}>
            <CommonHeader
                headerText={"Recent Call"} />
            <FlatList
                style={styles.containerStyle}
                data={countries}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item) => item.id}
            />
            </View>
        </SafeAreaView>
    )
}
export default RecentCall;
