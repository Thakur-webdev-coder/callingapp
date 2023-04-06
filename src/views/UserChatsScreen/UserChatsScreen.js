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
  _getUpdatedChatMessage,
  _sendChatMessage,
  _sendChatRoomDetail,
  _sendloadMoreChatData,
  getSocket,
  privateChatID,
} from "../../utils/socketManager";
import { useSelector } from "react-redux";
const UserChatsScreen = ({ navigation, route }) => {
  const [messageInput, onChangeMessageInput] = useState("");

  const [state, setState] = useState({
    callModal: false,
    arr: [],
  });

  const tempArr = [];

  const [array, setArray] = useState([]);

  let receiverID = route.params.callData;
  let socket = null;
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
    _getUpdatedChatMessage();

    // socket.on("chat", (data) => {
    //   console.log("_getUpdatedChatMessage=======>", data);
    //   //tempArr.push("manjot");
    //   setArray([...array, data]);
    // });
  }, []);

  // console.log("tempppppppppppppppp->>", tempArr);

  //  console.log("arrayyayaytwtewtewtewtewtewtwet=>>>>", array, array.length);

  // const _getUpdatedChatMessage = () => {
  //   console.log("chat_on_event");

  //   socket.on("chat", (data) => {
  //     console.log("_getUpdatedChatMessage=======>", data);

  //     tempArr.push(data);

  //     // setArray([...array, data]);

  //     // setState((prev) => {
  //     //   return {
  //     //     ...prev,
  //     //     arr: [...state.arr, data],
  //     //   };
  //     // });

  //     // state.arr.push(data);

  //     // const state = Store.getState();
  //     // console.log("state====>", state);
  //     // const { chatMessage = [], chatRoom } = state.sliceReducer;
  //     // console.log("chatRoom====>", chatRoom);
  //     // // const room = chatRoom;
  //     // const newChat = [...chatMessage];
  //     // newChat.unshift(data);
  //     // console.log("newChat====>", newChat);

  //     //  const findIndex = newChat.findIndex((findItem) => findItem.id === data.id);
  //     //  console.log("_getUpdatedChatMessage findIndex",findIndex)
  //     // if (room === data.documentID) {
  //     //   // validate received data should be corresponding to selected room
  //     // if (findIndex === -1) {
  //     //   newChat.unshift(data);
  //     // }
  //     // else {
  //     //     if (!data?.deleted) {
  //     //       newChat[findIndex] = data;
  //     //     } else {
  //     //       Store.dispatch(setDeleteChatData(data));
  //     //     }
  //     //   }
  //     // }

  //     // Store.dispatch(setChatMessage(newChat));
  //   });
  // };

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
    const { msg } = item;
    // console.log("item------>>>>>>>>>>>>>>>>>>>>>>>>&&&&&&&&&&&&&&&", item);
    var msgStyle;
    var textStyle;
    // let uniq = userDetails.email;
    // const local = item.email === uniq;

    // if (local) {
    msgStyle = {
      marginLeft: 50,
      marginRight: 8,
      marginTop: 5,
      borderRadius: 8,
      alignSelf: "flex-end",
    };
    textStyle = {
      color: "white",
      paddingVertical: 5,
      paddingHorizontal: 10,
      fontSize: 16,
      borderRadius: 8,
      textAlign: "left",
    };
    // }
    // else {
    //   msgStyle = {
    //     marginRight: 50,
    //     marginLeft: 8,
    //     borderRadius: 8,
    //     alignSelf: "flex-start",
    //   };
    //   textStyle = {
    //     color: "white",
    //     paddingVertical: 5,
    //     paddingHorizontal: 10,
    //     textAlign: "left",
    //     fontSize: 16,
    //     borderRadius: 8,
    //   };
    // }

    return (
      <View style={[msgStyle, { marginTop: 20 }]}>
        {item.sid !== senderID ? (
          <View
            style={{
              // alignSelf: local ? "flex-end" : "flex-start",
              flexDirection: "row",
              alignItems: "center",
              marginTop: 10,
            }}
          >
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

              {/* </Hyperlink> */}
            </View>
          </View>
        ) : (
          <View
            style={{
              // alignSelf: local ? "flex-end" : "flex-start",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
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
        <View style={styles.dateBg}>
          <Text style={{ color: colors.black, fontWeight: "bold" }}>
            Thu , 12 Jan 2023
          </Text>
        </View>
        <FlatList
          inverted
          data={chatMessage}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          style={{ height: hp(70) }}
        />
        <View style={styles.sendMessageImg}>
          <View style={styles.searchTnputStyle}>
            <TextInput
              style={styles.searchTnputStyleee}
              placeholder="Type  message here"
              placeholderTextColor={colors.searchBarTxt}
              onChangeText={(text) => onChangeMessageInput(text)}
              value={messageInput}
            />

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
