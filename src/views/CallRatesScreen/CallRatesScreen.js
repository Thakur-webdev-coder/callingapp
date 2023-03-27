import { View, FlatList, TextInput, SafeAreaView } from "react-native";
import React, { useEffect, useState } from "react";
import colors from "../../../assets/colors";
import CustomText from "../../components/CustomText";
import styles from "./styles";
import { CommonHeader } from "../../components";
import { useSelector } from "react-redux";
import { isValidPhoneNumber, parsePhoneNumber } from "libphonenumber-js";
import { hitCallRatesApi, hitEncryptionApi } from "../../constants/APi";

const CallRatesScreen = () => {
  const [state, setState] = useState({
    ratesData: [],
  });
  let DATA = null;
  useEffect(() => {
    CallRatesMethod();
  }, []);
  const rateList = [
    {
      id: "1",
      prefix: "+1",
      destination: "USA Verizon",
      rate: "0.015",
    },
    {
      id: "2",
      prefix: "+1",
      destination: "USA Verizon",
      rate: "0.015",
    },
    {
      id: "3",
      prefix: "+1",
      destination: "USA Verizon",
      rate: "0.015",
    },
  ];
  const { encrypt_detail, loginDetails = {} } = useSelector(
    (store) => store.sliceReducer
  );
  const { encryptPassword, encryptUser } = encrypt_detail;
  const number = `+${loginDetails.username}`;
  console.log("----->>>>>", state.ratesData);

  const CallRatesMethod = async () => {
    const myResponse = await hitCallRatesApi();
    // console.log('---res-->>>>>',myResponse)
    if (myResponse.data.result == "success") {
      console.log("---sucess->>>>>", myResponse.data.rates);
      setState({ ratesData: myResponse.data.rates });
    } else {
      Show_Toast(myResponse.data.msg);
    }
  };

  const renderItem = ({ item }) => {
    console.log("item-------", item);
    // const {callprefix,dialprefix,rates}=item
    return (
      <View>
        <View style={styles.titleView}>
          <CustomText
            text={item.prefix}
            textSize={16}
            textColor={colors.white}
          />
          <CustomText
            text={item.destination}
            textSize={16}
            textColor={colors.white}
          />
          <CustomText text={item.rate} textSize={16} textColor={colors.white} />
        </View>
        <View style={styles.listHorizontalLine}></View>
      </View>
    );
  };
  return (
    <SafeAreaView style={styles.wrapper}>
      <CommonHeader headerText={"Call Rates"} paddingHorizontal={20} />
      <TextInput
        style={styles.searchTnputStyle}
        placeholder="Search Destination"
        placeholderTextColor={colors.searchBarTxt}
      />
      <View style={styles.listContainer}>
        <View style={styles.horizontalLine}></View>
        <View style={styles.titleView}>
          <CustomText
            text={"Prefix"}
            textSize={16}
            textColor={colors.darkGreenText}
          />
          <CustomText
            text={"Destination"}
            textSize={16}
            textColor={colors.darkGreenText}
          />
          <CustomText
            text={"Rate"}
            textSize={16}
            textColor={colors.darkGreenText}
          />
        </View>
        <View style={styles.horizontalLine}></View>

        <FlatList
          data={state?.ratesData}
          // keyExtractor={keyExtractor}
          renderItem={renderItem}
        />
      </View>
    </SafeAreaView>
  );
};

export default CallRatesScreen;
