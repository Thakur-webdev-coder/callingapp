import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  TextInput,
  ImageBackground,
  Modal,
  FlatList,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import styles from "./styles";
import {
  ic_audiocall,
  ic_back,
  ic_chat_attach,
  ic_chat_bg,
  ic_chat_call,
  ic_chat_search,
  ic_menu,
  ic_small_plus,
  ic_videocall,
} from "../../routes/imageRoutes";
import colors from "../../../assets/colors";
import CustomText from "../../components/CustomText";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import {
  _getMessageList,
  _sendChatMessage,
  _sendChatRoomDetail,
  _sendloadMoreChatData,
  getSocket,
  privateChatID,
} from "../../utils/socketManager";
import { useSelector } from "react-redux";
import { timestampToDate } from "../../utils/commonUtils";
const UserChatsScreen = ({ navigation, route }) => {
  const [messageInput, onChangeMessageInput] = useState("");

  const [state, setState] = useState({
    callModal: false,
    arr: [],
  });

  const [array, setArray] = useState([]);

  let receiverID = route.params.callData;
  let socket = null;
  let tempArray = [];

  const { callData } = route.params;
  const {
    loginDetails = {},
    chatMessage = {},
    chatRoom,
  } = useSelector((store) => store.sliceReducer);
  let senderID = loginDetails.username;
  let type = "private";

  console.log("callData", callData);

  // console.log("chatMessage==onscreen===>>>", receiverID, chatMessage);

  useEffect(() => {
    socket = getSocket();
    gettingChatHistory();
    onHistoryReceived();
    __getUpdatedChatMessage();
  }, []);

  const __getUpdatedChatMessage = () => {
    socket.on("chat", (data) => {
      console.log("_getUpdatedChatMessage=======>", data);

      setArray((array) => {
        const a = array.slice(0).reverse();
        a.push(data);
        console.log("arrrayy", array);
        return a.reverse();
      });
    });
  };

  const gettingChatHistory = () => {
    const data = {
      rid: receiverID,
      sid: senderID,
    };
    socket.emit("chat-history", data);
  };

  const onHistoryReceived = () => {
    socket.on("chat-history", (data) => {
      console.log("_getChatHistoryy=======>", data);

      setArray(data.reverse());
    });
  };

  const sendChatMethod = () => {
    if (messageInput === "" || messageInput == null) {
      Alert.alert("Alert!", "Enter your message please...", [{ text: "Ok" }], {
        cancelable: false,
      });
      return;
    }

    // console.log("receiverarray-->>>", state.arr.concat(receiverID));

    const data = {
      msg: messageInput,
      rid: receiverID,
      sid: senderID,
    };

    _sendChatMessage(data);

    onChangeMessageInput("");
  };

  const renderItem = ({ item }) => {
    const { msg, timestamp } = item;
    // console.log("item------>>>>>>>>>>>>>>>>>>>>>>>>&&&&&&&&&&&&&&&", item);
    var msgStyle;
    var textStyle;
    var receiverMsgStyle;

    // let uniq = userDetails.email;
    // const local = item.email === uniq;

    // if (local) {
    msgStyle = {
      marginLeft: 50,
      marginRight: 15,
      marginTop: 5,
      borderRadius: 8,
      alignSelf: "flex-end",
    };

    receiverMsgStyle = {
      marginLeft: 15,
      marginRight: 50,
      marginTop: 5,
      borderRadius: 8,
    };
    textStyle = {
      color: "white",
      paddingVertical: 5,
      paddingHorizontal: 10,
      fontSize: 16,
      borderRadius: 8,
      textAlign: "left",
    };

    return (
      <View>
        <View style={styles.dateBg}>
          <Text
            style={{
              color: colors.black,
              fontWeight: "bold",
              alignSelf: "center",
            }}
          >
            {timestampToDate(timestamp)}
          </Text>
        </View>
        {item.sid !== senderID ? (
          <View style={receiverMsgStyle}>
            <View
              style={{
                borderRadius: 8,
                // backgroundColor: local ? "#E21019" : "#5C5D5F",
                backgroundColor: colors.greenTop,
                alignSelf: "flex-start",
              }}
            >
              {/* <Hyperlink
              onPress={(url, text) => Linking.openURL(url)}
              linkStyle={{
                color: local ? "white" : "#2980b9",
                fontSize: 15,
                // textDecorationLine: "underline",
              }}
            > */}
              <Text style={textStyle}>
                {msg}
                {/* {typeof item.message==='string'?item.message:''} */}
              </Text>

              {/* <Text>{timestampToDate(timeStamp)}</Text> */}

              {/* </Hyperlink> */}
            </View>
          </View>
        ) : (
          <View style={msgStyle}>
            <View
              style={{
                borderRadius: 8,
                // backgroundColor: local ? "#E21019" : "#5C5D5F",
                backgroundColor: "#5C5D5F",
                alignSelf: "flex-start",
              }}
            >
              {/* <Hyperlink
              onPress={(url, text) => Linking.openURL(url)}
              linkStyle={{
                color: local ? "white" : "#2980b9",
                fontSize: 15,
                // textDecorationLine: "underline",
              }}
            > */}
              <Text style={textStyle}>
                {msg}
                {/* {typeof item.message==='string'?item.message:''} */}
              </Text>

              {/* <Text style={textStyle}>{timestampToDate(timestamp)}</Text> */}

              {/* </Hyperlink> */}
            </View>
          </View>
        )}
      </View>
    );
  };

  //const [callModal,setCallModal]=useState(false)
  return (
    <SafeAreaView>
      <View style={styles.toolBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={ic_back} />
        </TouchableOpacity>

        <View style={styles.nameContainer}>
          <Text style={[styles.textStyleToolbar, { fontWeight: "700" }]}>
            {callData}
          </Text>
          <Text style={styles.textStyleToolbar}>Last Seen</Text>
        </View>
        <View style={styles.headerComponent}>
          <TouchableOpacity>
            <Image source={ic_chat_search} />
          </TouchableOpacity>
          <TouchableOpacity
            style={{ marginHorizontal: 25 }}
            onPress={() => navigation.navigate("SelectScreen")}
          >
            <Image source={ic_small_plus} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image source={ic_menu} />
          </TouchableOpacity>
        </View>
      </View>

      <ImageBackground source={ic_chat_bg}>
        {/* <View style={styles.dateBg}>
          <Text style={{ color: colors.black, fontWeight: "bold" }}>
            Thu , 12 Jan 2023
          </Text>
        </View> */}
        <FlatList
          inverted
          data={array}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          style={{ height: hp(80) }}
        />
        <View style={styles.sendMessageImg}>
          <View style={styles.searchTnputStyle}>
            <KeyboardAvoidingView
              behavior="padding"
              style={{ flex: 1 }}
              keyboardVerticalOffset={64}
            >
              <TextInput
                style={styles.searchTnputStyleee}
                placeholder="Type  message here"
                placeholderTextColor={colors.searchBarTxt}
                onChangeText={(text) => onChangeMessageInput(text)}
                value={messageInput}
              />
            </KeyboardAvoidingView>

            <TouchableOpacity style={{ justifyContent: "center" }}>
              <Image source={ic_chat_attach} />
            </TouchableOpacity>
            <TouchableOpacity
              style={{ alignSelf: "center" }}
              onPress={() => setState({ callModal: true })}
            >
              <Image source={ic_chat_call} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.arrowStyle}
            onPress={() => {
              sendChatMethod();
            }}
          >
            <Image
              style={{ transform: [{ rotate: "180deg" }], alignSelf: "center" }}
              source={ic_back}
            />
          </TouchableOpacity>
        </View>
      </ImageBackground>
      <Modal
        animationIn="slideInUp"
        animationOut="slideOutDown"
        backdropColor={colors.white}
        transparent={true}
        visible={state.callModal}
      >
        <View style={styles.callModalStyle}>
          <TouchableOpacity
            style={styles.callBoxStyle}
            onPress={() => {
              navigation.navigate("CallScreen", {
                voiceCall: true,
                callData: callData,
              });
              setState({ callModal: false });
            }}
          >
            <Image source={ic_audiocall} />

            <CustomText
              //fontWeight={"bold"}
              text={"Voice Call"}
              textColor={colors.secondary}
              textSize={22}
              marginLeft={wp(6)}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{ flexDirection: "row", alignItems: "center" }}
            onPress={() => {
              navigation.navigate("CallScreen", {
                voiceCall: false,
                callData: callData,
              });
              setState({ callModal: false });
            }}
          >
            <Image source={ic_videocall} />
            <CustomText
              //fontWeight={"bold"}
              text={"Video Call"}
              textColor={colors.secondary}
              textSize={22}
              marginLeft={wp(3)}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{ alignItems: "flex-end" }}
            onPress={() => setState({ callModal: false })}
          >
            <CustomText
              //fontWeight={"bold"}
              text={"CANCEL"}
              textColor={colors.secondary}
              textSize={20}
              //textAlign={'center'}
              //marginLeft={wp(50)}
            />
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default UserChatsScreen;
