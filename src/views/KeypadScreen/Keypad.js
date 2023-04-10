import React, { useState } from "react";
import {
  FlatList,
  Image,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import colors from "../../../assets/colors";
import AppStyle from "../../components/AppStyle";
import styles from "./styles";
import CustomText from "../../components/CustomText";
import {
  ic_people,
  ic_backspace,
  ic_callrecive,
  ic_delete,
} from "../../routes/imageRoutes";
import LinearGradient from "react-native-linear-gradient";
import { CommonHeader } from "../../components";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Sip from "@khateeb00/react-jssip";
import { useSelector } from "react-redux";
import { Show_Toast } from "../../utils/toast";

const Keypad = ({ navigation }) => {
  // const [inputNumber, setInputNumber] = useState('')
  const { balanceDetail = {}, loginDetails = {} } = useSelector(
    (store) => store.sliceReducer
  );
  const [state, _setState] = useState({
    dialedNumber: "",
    // // country_code: 'cc',
    // // prefix,
    // selection: {
    //     start: 0,
    //     end: 0,
    // },
  });

  const DialerData = [
    { num: "1", char: " " },
    { num: "2", char: "ABC" },
    { num: "3", char: "DEF" },
    { num: "4", char: "GHI" },
    { num: "5", char: "JKL" },
    { num: "6", char: "MNO" },
    { num: "7", char: "PQRS" },
    { num: "8", char: "TUV" },
    { num: "9", char: "WXYZ" },
    { num: "*", char: "" },
    { num: "0", char: "+" },
    { num: "#", char: "" },
  ];

  const DialNumberMethod = (item) => {
    const { dialedNumber, selection } = state;

    const dialedNum = dialedNumber + item.num;
    if (dialedNum.length < 16) {
      _setState({ dialedNumber: dialedNumber + item.num });
    }
  };
  const BackSpaceMethod = () => {
    const { dialedNumber } = state;
    var newStr;
    newStr = dialedNumber.split(""); // or newStr = [...str];
    newStr.splice(-1);
    newStr = newStr.join("");
    _setState({ dialedNumber: newStr });
  };
  // console.log('inputNumber--', inputNumber)
  const RenderList = ({ item }) => {
    const { dialedNumber } = state;
    return (
      <TouchableOpacity
        onPress={() => DialNumberMethod(item)}
        onLongPress={() =>
          item.num == "0"
            ? _setState({ dialedNumber: dialedNumber + "+" })
            : null
        }
        style={[
          styles.dialerStyle,
          { paddingTop: item.num == "*" ? hp(2.5) : null },
        ]}
      >
        <CustomText
          textColor={colors.secondary}
          textAlign={"center"}
          text={item.num}
          fontWeight={"bold"}
          textSize={25}
        />
        <CustomText
          textColor={colors.secondary}
          textAlign={"center"}
          fontWeight={"500"}
          text={item.char}
          textSize={10}
        />
      </TouchableOpacity>
    );
  };
  const { dialedNumber } = state;
  return (
    <SafeAreaView
      style={[AppStyle.wrapper, { backgroundColor: colors.offWhite }]}
    >
      <View style={styles.secondWrapper}>
        <CommonHeader headerText={"Dialpad"} />

        <View style={styles.registerBox}>
          <CustomText
            textColor={colors.black}
            textAlign={"center"}
            text={"Registered"}
            fontWeight={"bold"}
            textSize={17}
          />
          <CustomText
            textColor={colors.black}
            textAlign={"center"}
            text={loginDetails.did}
            //fontWeight={"bold"}
            marginLeft={wp(2)}
            textSize={17}
          />
        </View>
        <TextInput
          style={styles.inputTxtBoxStyle}
          value={dialedNumber}
          showSoftInputOnFocus={false}
        />
      </View>
      <View style={styles.wrapper3}>
        <FlatList
          columnWrapperStyle={{ justifyContent: "space-between" }}
          data={DialerData}
          renderItem={RenderList}
          keyExtractor={(item, index) => item.num}
          numColumns={3}
        />
      </View>
      <View style={[styles.bottomRowStyle]}>
        <TouchableOpacity onPress={() => navigation.navigate("Contacts")}>
          <Image style={styles.bottomImgStyle} source={ic_people} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            console.log("dialedNumber=====", dialedNumber);
            if (balanceDetail.credit > 0) {
              Sip.makeCall(dialedNumber);
              navigation.navigate("CallingScreen", {
                callData: dialedNumber,
              });
            } else {
              Show_Toast("Insufficient balance. Please recharge your account.");
            }
          }}
        >
          <LinearGradient
            colors={[colors.greenTop, colors.greenMid, colors.greenMid]}
            style={styles.linearGradient}
          >
            <Image source={ic_callrecive} />
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => BackSpaceMethod()}>
          <Image style={styles.bottomImgStyle} source={ic_delete} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
export default Keypad;
