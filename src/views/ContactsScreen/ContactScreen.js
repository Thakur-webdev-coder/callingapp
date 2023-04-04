import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Platform,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  ic_contact_avatar,
  logo_contact_kokoa,
} from "../../routes/imageRoutes";
import styles from "./styles";
import ContactList from "react-native-contacts";
import { useSelector } from "react-redux";

import { request, RESULTS, PERMISSIONS } from "react-native-permissions";
import { CommonHeader } from "../../components";

const Contacts = ({ navigation }) => {
  const [state, setState] = useState({
    contacts: [],
  });
  const [searchTxt, setSearchTxt] = useState("");
  const { balanceDetail = {} } = useSelector((store) => store.sliceReducer);
  useEffect(() => {
    checkPeermission();
    const unsubscribe = navigation.addListener("blur", () => {
      setSearchTxt("");
      filterContacts("");
    });
    return unsubscribe;
  }, []);
  const permissions =
    Platform.OS === "ios"
      ? PERMISSIONS.IOS.READ_CONTACTS
      : PERMISSIONS.ANDROID.READ_CONTACTS;

  const filterContacts = (txt) => {
    setSearchTxt(txt);
    ContactList?.getContactsMatchingString(txt)?.then((contact) => {
      setState({ contacts: contact });
    });
  };

  const checkPeermission = () => {
    request(permissions)
      .then((result) => {
        switch (result) {
          case RESULTS.UNAVAILABLE:
            console.log(
              "This feature is not available (on this device / in this context)"
            );
            break;
          case RESULTS.DENIED:
            console.log(
              "The permission has not been requested / is denied but requestable",
              RESULTS.DENIED
            );
            break;
          case RESULTS.LIMITED:
            console.log("The permission is limited: some actions are possible");
            break;
          case RESULTS.GRANTED:
            console.log("granted------");
            ContactList?.getAll()?.then((contact) => {
              setState({ contacts: contact });
            });
            break;
          case RESULTS.BLOCKED:
            console.log("The permission is denied and not requestable anymore");
            break;
        }
      })
      .catch((error) => {
        console.log("errr----", error);
      });
  };

  const keyExtractor = (item, idx) => {
    return item?.recordID?.toString() || idx.toString();
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.flatListStyle}
      onPress={() => {
        // if (balanceDetail.credit > 0) {
        //   Sip.makeCall(item?.phoneNumbers[0]?.number);
        //   navigation.navigate("CallingScreen", { callData: item });
        // } else {
        //   Show_Toast("Insufficient balance. Please recharge your account.");
        // }
        navigation.navigate("CallDetailsScreen");
      }}
    >
      <View style={styles.imgBox}>
        <Image
          style={styles.imgstyle}
          source={
            item?.hasThumbnail
              ? { uri: item?.thumbnailPath }
              : ic_contact_avatar
          }
        />
      </View>
      <Text style={styles.nameTxtStyle}>{item?.givenName}</Text>
      <Image source={logo_contact_kokoa} />
      {/* <Text style={styles.nameTxtStyle}>
            {item?.phoneNumbers[0]?.number}
          </Text> */}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView>
      {/* <View style={{justifyContent:'center',flex:1}}>
      <Text style={{color:colors.black,textAlign:'center',fontSize:20}}>Not implemented yet</Text>
      </View> */}
      <CommonHeader headerText={"Contact"} />

      <FlatList
        style={styles.containerStyle}
        data={state.contacts}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        keyExtractor={keyExtractor}
      />
    </SafeAreaView>
  );
};
export default Contacts;
