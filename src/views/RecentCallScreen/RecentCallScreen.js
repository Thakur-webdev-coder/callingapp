import React, { useEffect, useState } from "react";
import {
    FlatList,
    Image,
    SafeAreaView,
    Text,
    View
} from 'react-native';
import {
    ic_user,
    ic_recent,
    ic_contact_avatar,
    ic_recentcall_small
} from "../../routes/imageRoutes";
import styles from './styles'
import AppStyle from "../../components/AppStyle";
import LinearGradient from "react-native-linear-gradient";
import colors from "../../../assets/colors";
import { CommonHeader } from "../../components";
import { useSelector } from "react-redux";
import { hitGetCallDetailsApi } from "../../constants/APi";

const RecentCall = ({ navigation }) => {
    const [state, setState] = useState({
        callDetailRes: "",
        contacts: [],
      });
    
          
      useEffect(() => {
       hitCallDetail();
        const unsubscribe = navigation.addListener("focus", () => {
         hitCallDetail();
        });
        return unsubscribe;
      }, [navigation]);

      const { allContacts={},encrypt_detail,balanceDetail = {} } = useSelector((store) => store);
      const hitCallDetail = async () => {
        const data = new FormData();
        data.append("cust_id", encrypt_detail?.encryptUser);
        const myResponse = await hitGetCallDetailsApi(data);
    console.log('hitCallDetailApi----res----->>>',myResponse.data.msg)
        if (myResponse.data.result == "success") {
          setState({
            callDetailRes: myResponse.data.msg,
          });
        }
      };
    
    const renderItem = ({ item }) => (
        <View style={styles.flatListStyle}>
            <View
                style={styles.linearGradient}>
                <Image style={styles.imgstyle} source={ic_contact_avatar} />
            </View>
            <View style={styles.userDetailView}>
                <Text style={styles.nameTxtStyle}>{item.name}</Text>
                <View style={{ flexDirection: 'row' }}>
                    <Image source={ic_recent} />
                    <Text style={styles.dateTxtStyle}>{item.time}</Text>
                </View>
            </View>
                <Image 
                style={{alignSelf:'center'}}
                source={ic_recentcall_small}/>
        </View>

    );
    return (
        <SafeAreaView style={AppStyle.wrapper}>
        
            <View style={AppStyle.secondWrapper}>
            <CommonHeader
                headerText={"Recent Call"} />
            <FlatList
                style={styles.containerStyle}
                data={state?.callDetailRes}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item) => item.id}
            />
            </View>
        </SafeAreaView>
    )
}
export default RecentCall;
