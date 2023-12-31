import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  ic_recent,
  ic_contact_avatar,
  ic_recentcall_small,
} from "../../routes/imageRoutes";
import styles from "./styles";
import AppStyle from "../../components/AppStyle";
import { CommonHeader } from "../../components";
import { useSelector } from "react-redux";
import { hitGetCallDetailsApi } from "../../constants/APi";
import { dateFormater } from "../../utils/commonUtils";
import { parsePhoneNumber } from "libphonenumber-js";
import { Show_Toast } from "../../utils/toast";
import Sip from "@khateeb00/react-jssip";
import NetInfo from "@react-native-community/netinfo";
import InCallManager from "react-native-incall-manager";
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

  const {
    allContacts = {},
    encrypt_detail,
    balanceDetail = {},
  } = useSelector((store) => store.sliceReducer);
  const hitCallDetail = async () => {
    const data = new FormData();
    data.append("cust_id", encrypt_detail?.encryptUser);
    const myResponse = await hitGetCallDetailsApi(data);
    console.log("hitCallDetailApi----res----->>>", myResponse.data.msg);
    if (myResponse.data.result == "success") {
      setState({
        callDetailRes: myResponse.data.msg,
      });
    }
  };

  const EmptyListMessage = ({ item }) => {
    return (
      // Flat List Item
      <Text style={styles.emptyListStyle}>No Data Found</Text>
    );
  };
  const renderItem = ({ item }) => (
    // const formatPhoneNumber = (phoneNumber) => {
    //   try {
    //     const parsedPhoneNumber = parsePhoneNumber(phoneNumber);
    //     if (parsedPhoneNumber && parsedPhoneNumber.isValid()) {
    //       return parsedPhoneNumber.formatInternational();
    //     }
    //     return "Invalid Phone Number";
    //   } catch (error) {
    //     console.error("Phone number parsing error:", error);
    //     return "Invalid Phone Number";
    //   }
    // };
    <View style={styles.flatListStyle}>
      <View style={styles.linearGradient}>
        <Image style={styles.imgstyle} source={ic_contact_avatar} />
      </View>
      <View style={styles.userDetailView}>
        <Text style={styles.nameTxtStyle}>
          {/*}  {" "}
  {parsePhoneNumber("+" + item.called_user).formatInternational()}*/}
          {/* {parsePhoneNumber("+" + item.called_user)}*/}
          {"+" + item.called_user || "Not Found"}
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image source={ic_recent} />
          <Text style={styles.dateTxtStyle}>{dateFormater(item.date)}</Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => {
          if (balanceDetail.credit > 0) {
            NetInfo.fetch().then((status) => {
              if (status.isConnected) {
                if (Sip.isRegistered) {
                  InCallManager.startRingback();
                  console.log("inhererrere------->>>><<<<<");
                  Sip.makeCall(item.called_user.replace(/ /g, ""));
                  navigation.navigate("CallingScreen", { callData: item });
                } else {
                  Show_Toast("Something went wrong. Please wait...");
                }
              } else {
                Show_Toast("Check your data connection and try again.");
              }
            });
          } else {
            Show_Toast("Insufficient balance. Please recharge your account.");
          }
        }}
      >
        <Image style={{ alignSelf: "center" }} source={ic_recentcall_small} />
      </TouchableOpacity>
    </View>
  );
  return (
    <SafeAreaView style={AppStyle.wrapper}>
      <View style={AppStyle.secondWrapper}>
        <CommonHeader
          headerText={"Recent Call"}
          onPress={() => navigation.goBack()}
        />
        <FlatList
          style={styles.containerStyle}
          data={state?.callDetailRes}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={EmptyListMessage}
        />
      </View>
    </SafeAreaView>
  );
};
export default RecentCall;
