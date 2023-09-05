import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
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
import Contacts from "react-native-contacts";
import NetInfo from "@react-native-community/netinfo";

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

  const [cursorPosition, setCursorPosition] = useState(0);

  const cursorPositionRef = useRef(0);

  const inputWidthRef = useRef(null);

  const inputLayout = useRef(null); // Use useRef to initialize inputLayout

  const inputRef = useRef(null); // Reference to the TextInput

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
    const { dialedNumber } = state;
    let cursorPosition = cursorPositionRef.current; // Store the current cursor position

    console.log("cursorPosition--->>", cursorPosition);

    // Calculate the new cursor position after adding the digit
    const newCursorPosition = cursorPosition + 1;

    const newText =
      dialedNumber.substring(0, cursorPosition) +
      item.num +
      dialedNumber.substring(cursorPosition);

    // Update the input value and cursor position
    _setState({ dialedNumber: newText });

    // Set the cursor position to the new position
    cursorPositionRef.current = newCursorPosition;

    // Ensure the input is focused and set the cursor position
    inputRef.current.focus();
    inputRef.current.setSelection(newCursorPosition);
  };

  const BackSpaceMethod = () => {
    const { dialedNumber } = state;
    let cursorPosition = cursorPositionRef.current; // Store the current cursor position

    // Check if the cursor position is not at the beginning
    if (cursorPosition > 0) {
      // Calculate the new cursor position after removing a digit
      const newCursorPosition = cursorPosition - 1;

      const newText =
        dialedNumber.substring(0, cursorPosition - 1) +
        dialedNumber.substring(cursorPosition);

      // Update the input value and cursor position
      _setState({ dialedNumber: newText });

      // Set the cursor position to the new position
      cursorPositionRef.current = newCursorPosition;

      // Ensure the input is focused and set the cursor position
      inputRef.current.focus();
      inputRef.current.setSelection(newCursorPosition);
    }
  };

  // const BackSpaceMethod = () => {
  //   const { dialedNumber } = state;
  //   var newStr;
  //   newStr = dialedNumber.split(""); // or newStr = [...str];
  //   newStr.splice(-1);
  //   newStr = newStr.join("");
  //   _setState({ dialedNumber: newStr });
  // };

  const GetContacts = (phone) => {
    console.log("phone-----", phone);
    var newPerson = {
      phoneNumbers: [
        {
          label: "mobile",
          number: phone,
        },
      ],
    };
    Contacts.openContactForm(newPerson).then((contact) => {});
  };

  handleInputChange = (text) => {
    // Update the state when the text changes
    _setState({ dialedNumber: text });
    cursorPositionRef.current = text.length;
  };

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
    <SafeAreaView style={AppStyle.wrapper}>
      <View style={{ flex: 1, backgroundColor: colors.offWhite }}>
        <View style={styles.secondWrapper}>
          <CommonHeader
            headerText={"Dialpad"}
            onPress={() => navigation.goBack(null)}
          />

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
            ref={inputRef}
            style={styles.inputTxtBoxStyle}
            value={dialedNumber}
            onChangeText={this.handleInputChange}
            showSoftInputOnFocus={false}
            selectTextOnFocus={true}
            onSelectionChange={(event) => {
              // Update the cursor position when the selection changes
              cursorPositionRef.current = event.nativeEvent.selection.start;
            }}
            onLayout={(event) => {
              // Store the layout information when it becomes available
              inputLayout.current = event.nativeEvent.layout;
            }}
            onPressIn={(event) => {
              const { dialedNumber } = state;

              const layout = inputLayout.current; // Access the layout information

              if (!layout) {
                return; // Wait for layout information to become available
              }

              const tapX = event.nativeEvent.locationX;
              const inputWidth = layout.width;
              const textLength = dialedNumber.length;
              const newPosition = Math.floor((tapX / inputWidth) * textLength);
              cursorPositionRef.current = newPosition;

              // Set the cursor position when tapping
              inputRef.current.focus(); // Ensure the input is focused
              inputRef.current.setSelection(newPosition, newPosition);

              // Calculate the cursor position based on the tap position
              // const tapX = event.nativeEvent.locationX;
              // const textLength = dialedNumber.length;
              // const newPosition = Math.floor(
              //   (tapX / inputLayout.width) * textLength
              // );
              // cursorPositionRef.current = newPosition;

              // // Set the cursor position when tapping
              // inputRef.current.focus(); // Ensure the input is focused
              // inputRef.current.setSelection(newPosition);
            }}
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
          <TouchableOpacity onPress={() => GetContacts(state?.dialedNumber)}>
            <Image style={styles.bottomImgStyle} source={ic_people} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              // console.log("dialedNumber=====", dialedNumber);
              if (dialedNumber.length > 6) {
                if (balanceDetail.credit > 0) {
                  NetInfo.fetch().then((status) => {
                    if (status.isConnected) {
                      if (Sip.isRegistered) {
                        Sip.makeCall(dialedNumber);
                        navigation.navigate("CallingScreen", {
                          callData: dialedNumber,
                        });
                      } else {
                        Show_Toast("Something went wrong. Please wait...");
                      }
                    } else {
                      Show_Toast("Check your data connection and try again.");
                    }
                  });
                } else {
                  Show_Toast(
                    "Insufficient balance. Please recharge your account."
                  );
                }
              } else {
                Alert.alert("", "Please enter a valid number for call");
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
      </View>
    </SafeAreaView>
  );
};
export default Keypad;
