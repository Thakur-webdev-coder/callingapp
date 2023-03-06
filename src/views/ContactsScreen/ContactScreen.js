import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Platform,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import colors from "../../../assets/colors";
import AppStyle from "../../components/AppStyle";
import { ic_back, ic_user } from "../../routes/imageRoutes";
import styles from "./styles";
import ContactList from "react-native-contacts";
import { useSelector } from "react-redux";
import Sip from "@khateeb00/react-jssip";
import { Show_Toast } from "../../utils/toast";

import {
  request,
  RESULTS,
  PERMISSIONS,
} from 'react-native-permissions';


const Contacts = ({ navigation }) => {
  const [state,setState]=useState({
    contacts:[],
    
  })
  const [searchTxt, setSearchTxt] = useState("");
  const { balanceDetail = {} } = useSelector((store) => store);
  // useEffect(() => {
  //   checkPeermission();
  //   const unsubscribe = navigation.addListener("blur", () => {
  //     setSearchTxt("");
  //     filterContacts("");
  //   });
  //   return unsubscribe;
  // }, []);
  const permissions =
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.READ_CONTACTS
        : PERMISSIONS.ANDROID.READ_CONTACTS;

  const filterContacts = (txt) => {
    setSearchTxt(txt)
    ContactList?.getContactsMatchingString(txt)?.then((contact) => {
      setState({contacts:contact})
    });
  };

 


  const checkPeermission = () => {
    request(permissions)
    .then((result) => {
      switch (result) {
        case RESULTS.UNAVAILABLE:
          console.log('This feature is not available (on this device / in this context)');
          break;
        case RESULTS.DENIED:
          console.log('The permission has not been requested / is denied but requestable',RESULTS.DENIED);
          break;
        case RESULTS.LIMITED:
          console.log('The permission is limited: some actions are possible');
          break;
        case RESULTS.GRANTED:
          console.log('granted------');
          ContactList?.getAll()?.then((contact) => {
                    setState({contacts:contact})
                  })
          break;
        case RESULTS.BLOCKED:
          console.log('The permission is denied and not requestable anymore');
          break;
      }
    })
    .catch((error) => {
      console.log('errr----',error);
    });
  
  }




  const keyExtractor = (item, idx) => {
    return item?.recordID?.toString() || idx.toString();
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        if (balanceDetail.credit > 0) {
          Sip.makeCall(item?.phoneNumbers[0]?.number);
          navigation.navigate("CallingScreen", { callData: item });
        } else {
          Show_Toast("Insufficient balance. Please recharge your account.");
        }
      }}
    >
      <View style={styles.flatListStyle}>
        <LinearGradient
          colors={[colors.greenTop, colors.greenMid, colors.greenMid]}
          style={styles.linearGradient}
        >
          <Image
            style={styles.imgstyle}
            source={item?.hasThumbnail ? { uri: item?.thumbnailPath } : ic_user}
          />
        </LinearGradient>
        <View style={styles.nameTextColoumn}>
          <Text style={styles.nameTxtStyle}>{item?.givenName}</Text>
          <Text style={styles.nameTxtStyle}>
            {item?.phoneNumbers[0]?.number}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={AppStyle.wrapper}>
      <View style={{justifyContent:'center',flex:1}}>
      <Text style={{color:colors.black,textAlign:'center',fontSize:20}}>Not implemented yet</Text>
      </View>
      {/* <View style={AppStyle.secondWrapper}>
        <View style={styles.headerSearchBar}>
          <TouchableOpacity
            style={{ alignSelf: "center" }}
            onPress={() => navigation.goBack()}
          >
            <Image source={ic_back} />
          </TouchableOpacity>
          <TextInput
            style={styles.inputTxtBoxStyle}
            placeholder="Search Contact"
            onChangeText={(searchedText) => filterContacts(searchedText)}
            placeholderTextColor={colors.searchBarTxt}
            value={searchTxt}
          />
        </View>
        <FlatList
          style={styles.containerStyle}
          data={state.contacts}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          keyExtractor={keyExtractor}
          
        />
      </View> */}
    </SafeAreaView>
  );
};
export default Contacts;
