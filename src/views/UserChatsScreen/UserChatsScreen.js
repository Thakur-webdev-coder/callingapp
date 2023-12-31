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
  Linking,
} from "react-native";
import React, { useEffect, useState } from "react";
import styles from "./styles";
import DocumentPicker from "react-native-document-picker";

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
  _addGroup,
  _deleteChat,
  _getMessageList,
  _leaveGroup,
  _sendChatMessage,
  _sendChatRoomDetail,
  _sendloadMoreChatData,
  getSocket,
} from "../../utils/socketManager";
import { useSelector } from "react-redux";
import {
  omitSpecialCharacters,
  saveBooleanValue,
  timestampToDate,
  timestampToLocalTime,
  uriToFile,
} from "../../utils/commonUtils";
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
  renderers,
} from "react-native-popup-menu";
import AppStyle from "../../components/AppStyle";

import {
  hitSendGroupChatPush,
  hitSendSingleChatPush,
} from "../../constants/APi";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import PushNotification from "react-native-push-notification";
import { PERMISSIONS, requestMultiple } from "react-native-permissions";
import NetInfo from "@react-native-community/netinfo";
const { Popover } = renderers;

const UserChatsScreen = ({ navigation, route }) => {
  const [messageInput, onChangeMessageInput] = useState("");
  const [groupedChats, setGroupedChats] = useState([]);

  console.log("groupedChatsssssssss", groupedChats);

  const socket = getSocket();

  const [state, setState] = useState({
    callModal: false,
    arr: [],
  });

  const [array, setArray] = useState([]);

  let receiverID = route.params;

  const {
    callData,
    Name,
    groupName,
    groupMembers,
    uniqueId,
    participants,
    added,
    created,
  } = route.params;

  console.log(callData, "===N", Name, "=====>", groupName, "====A", added);

  const { kokoaContacts = [], loginDetails = {} } = useSelector(
    (store) => store.sliceReducer
  );

  let senderID = loginDetails.username;

  console.log("myNUmberrrrrr", added);

  const cameraPermissions =
    Platform.OS == "ios" ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA;
  const micPermissions =
    Platform.OS == "ios"
      ? PERMISSIONS.IOS.MICROPHONE
      : PERMISSIONS.ANDROID.RECORD_AUDIO;
  useEffect(() => {
    if (added) {
      console.log("herererrerererrere");
      sendChatMethod("Added New Member");
    }

    if (created) {
      sendChatMethod("Craeted New Group");
    }
  }, [route]);

  console.log(
    "callData",
    callData ? receiverID.callData : participants,
    uniqueId
  );

  useFocusEffect(
    React.useCallback(() => {
      saveBooleanValue("isFocused", true);

      return () => {
        saveBooleanValue("isFocused", false);
      };
    }, [])
  );

  useEffect(() => {
    gettingChatHistory();
    onHistoryReceived();
    __getUpdatedChatMessage();
  }, []);

  const openAppSettings = () => {
    if (Platform.OS === "android") {
      Linking.openSettings();
    } else {
      Linking.openURL("app-settings:");
    }
  };

  const checkPeermission = (callType) => {
    console.log("checkPeermission------->>>");
    requestMultiple([cameraPermissions, micPermissions])
      .then((result) => {
        console.log(
          result[cameraPermissions],
          result[micPermissions],
          "result--------->>>",
          result
        );

        if (
          result[cameraPermissions] !== "granted" ||
          result[micPermissions] !== "granted"
        ) {
          Alert.alert(
            "Insufficient permissions!",
            "You need to grant camera and Microphone access permissions to use this app.",
            [{ text: "Okay", onPress: () => openAppSettings() }]
          );
          return false;
        } else {
          NetInfo.fetch().then((status) => {
            if (status.isConnected) {
              if (groupName) {
                callType == "voiceCall"
                  ? navigation.navigate("GroupCallScreen", {
                      voiceCall: true,
                      callData: participants,
                    })
                  : navigation.navigate("GroupCallScreen", {
                      voiceCall: false,
                      callData: participants,
                    });
              } else {
                callType == "voiceCall"
                  ? navigation.navigate("CallScreen", {
                      voiceCall: true,
                      callData: callData,
                    })
                  : navigation.navigate("CallScreen", {
                      voiceCall: false,
                      callData: callData,
                    });
              }
            } else {
              Show_Toast("Check your data connection and try again.");
            }
          });

          setState({ callModal: false });
        }
      })
      .catch((error) => {
        console.log("errr----", error);
      });
  };

  const reduceChat = (chatData) => {
    const groupedChats = chatData?.reduce((acc, chat) => {
      const date = new Date(chat.timestamp);
      const timestamp = date.toDateString();
      const group = acc.find((g) => g.timestamp === timestamp);
      if (group) {
        group.chats.push(chat);
      } else {
        acc.push({ timestamp, chats: [chat] });
      }
      return acc;
    }, []);

    console.log("previousstate", groupedChats);
    setGroupedChats(groupedChats);
  };

  const __getUpdatedChatMessage = () => {
    socket.on("chat", (data) => {
      console.log("_getUpdatedChatMessage=======>", data);

      setArray((array) => {
        const a = array.slice(0).reverse();
        a.push(data);
        const arrayReverse = a.reverse();
        reduceChat(arrayReverse);
        return arrayReverse;
      });
    });
  };

  const gettingChatHistory = () => {
    let data = null;

    if (receiverID.callData) {
      receiverID = omitSpecialCharacters(receiverID.callData);

      data = {
        rid: receiverID,
        sid: senderID,
      };
    } else {
      data = {
        type: "group",
        rid: uniqueId,
        sid: senderID,
        group_name: groupName,
      };
    }

    console.log("chat_history", data);

    socket.emit("chat-history", data);
  };

  const deleteChatHistory = () => {
    receiverID = omitSpecialCharacters(receiverID.callData);

    const data = {
      rid: receiverID,
      sid: senderID,
    };

    console.log("myyydeleteChatttt", data);

    console.log("deleteChatttt", data);

    _deleteChat(data);
  };

  const onHistoryReceived = () => {
    console.log("_getChatHistoryy=======>");

    socket.on("chat-history", (data) => {
      console.log("_getChatHistoryy=======>", data);
      const arrayReverse = data.slice().reverse();

      reduceChat(arrayReverse);

      setArray(arrayReverse);
    });
  };

  const leaveGroup = () => {
    const allParticipant = participants.filter((item) => item !== senderID);

    console.log("allParticipant", uniqueId, allParticipant);
    const data = {
      id: senderID,
      group_id: uniqueId,
      group_name: groupName,
      participants: allParticipant,
    };

    const myData = {
      sid: senderID,
      rid: uniqueId,
    };

    console.log("datattatatat", data);
    console.log("datattatatat", myData);

    _addGroup(data);
    _leaveGroup(myData);

    sendChatMethod(" Member leaved group");
  };

  const sendChatMethod = (message) => {
    if (!added) {
      if (message === "" || message == null) {
        Alert.alert(
          "Alert!",
          "Enter your message please...",
          [{ text: "Ok" }],
          {
            cancelable: false,
          }
        );
        return;
      }
    }

    let data = null;
    let data1 = null;

    // console.log("receiverarray-->>>", state.arr.concat(receiverID));
    if (receiverID.callData) {
      receiverID = omitSpecialCharacters(receiverID.callData);
      data = {
        msg: message,
        rid: receiverID,
        sid: senderID,
        type: "private",
      };

      data1 = {
        msg: message,
        rid: receiverID,
        sid: senderID,
      };
    } else {
      // const mapContact = participants?.map((str) => parseInt(str));
      const mapContact = participants?.join(", ");

      data = {
        msg: message,
        rid: uniqueId,
        sid: senderID,
        type: "group",
        group_name: groupName,
      };

      data1 = {
        msg: message,
        group_id: uniqueId,
        group_name: groupName,
        participants: mapContact,
      };
    }

    console.log("groupchatDatta", data1);

    _sendChatMessage(data);

    onChangeMessageInput("");
    if (uniqueId) {
      console.log("groupchatDatta222", data1);

      hitSendGroupChatPush(data1);
    } else {
      console.log("singleDatta222", data1, "=====dddddddddd");

      hitSendSingleChatPush(data1);
    }
  };

  const onInviteOptionSelect = (value) => {
    // console.log('item_________:)', item)

    if (value == 1) {
      if (uniqueId) {
        leaveGroup();
        navigation.goBack();
      } else {
        deleteChatHistory();
        setGroupedChats([]);
        navigation.goBack();
      }
    }
  };

  const uploadFile = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.images, DocumentPicker.types.video],
      });
      // const { uri, type, name, size } = result;

      // console.log("uploaded fileeee", result);
      // uriToFile(uri);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
      } else {
        console.error("Failed to pick a file", err);
      }
    }
  };

  const renderItem = ({ item }) => {
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
            {item.timestamp}
          </Text>
        </View>
        <FlatList
          inverted
          data={item.chats}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderNewItem}
        />
      </View>
    );
  };

  const renderNewItem = ({ item }) => {
    const { msg, timestamp } = item;
    const contact = kokoaContacts.find(
      (myItem) =>
        myItem?.phoneNumbers[0]?.number.replace(/[^0-9]/g, "") === item?.sid
    );

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
      marginTop: 8,
      borderRadius: 8,
      alignSelf: "flex-end",
    };

    receiverMsgStyle = {
      marginLeft: 15,
      marginRight: 50,
      marginTop: 8,
      borderRadius: 8,
    };
    textStyle = {
      color: "white",
      paddingVertical: 10,
      paddingHorizontal: 15,
      fontSize: 16,
      borderRadius: 8,
      textAlign: "left",
    };

    return (
      <View>
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

              {participants ? (
                contact ? (
                  <Text
                    style={{
                      paddingHorizontal: 10,
                      color: colors.white,
                      marginTop: 5,
                    }}
                  >
                    {contact?.givenName + " " + contact?.familyName}
                  </Text>
                ) : (
                  <Text
                    style={{
                      paddingHorizontal: 10,
                      color: colors.white,
                      marginTop: 5,
                    }}
                  >
                    {item.sid}
                  </Text>
                )
              ) : null}

              <Text style={textStyle}>
                {msg}
                {/* {typeof item.message==='string'?item.message:''} */}
              </Text>

              {/* <Text>{timestampToDate(timeStamp)}</Text> */}

              {/* </Hyperlink> */}
            </View>
            <Text
              style={{
                fontSize: 8,
                alignSelf: "flex-start",
                color: colors.blueBottom,
                fontWeight: "bold",
                marginBottom: 5,
              }}
            >
              {timestampToLocalTime(timestamp)}
            </Text>
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
            <Text
              style={{
                fontSize: 8,
                alignSelf: "flex-end",
                color: colors.blueBottom,
                fontWeight: "bold",
                marginBottom: 5,
              }}
            >
              {timestampToLocalTime(timestamp)}
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={AppStyle.wrapper}>
      <View style={AppStyle.homeMainView}>
        <View style={styles.toolBar}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={ic_back} />
          </TouchableOpacity>
          <View style={styles.headerBox}>
            <TouchableOpacity
              style={styles.nameContainer}
              onPress={() =>
                groupName
                  ? navigation.navigate("ParticipantsScreen", {
                      participants: participants,
                    })
                  : null
              }
            >
              <Text style={[styles.textStyleToolbar, { fontWeight: "700" }]}>
                {Name || callData ? (Name ? Name : callData) : groupName}
              </Text>
            </TouchableOpacity>
            <View style={styles.headerComponent}>
              {groupName ? (
                <TouchableOpacity
                  style={{ marginHorizontal: 35, padding: 10 }}
                  onPress={() => {
                    navigation.navigate("SelectScreen", {
                      groupName: groupName,
                      uniqueId: uniqueId,
                      participants: participants,
                    });
                  }}
                >
                  <Image source={ic_small_plus} />
                </TouchableOpacity>
              ) : (
                <View style={{ marginHorizontal: 35, padding: 10 }}></View>
              )}

              {/* <TouchableOpacity
              onPress={() => {
                deleteChatHistory();
                // leaveChat();
              }}
            >
              <Image source={ic_menu} />
            </TouchableOpacity> */}
              <Menu
                renderer={Popover}
                rendererProps={{ placement: "bottom" }}
                onSelect={(value) => onInviteOptionSelect(value)}
              >
                <MenuTrigger children={<Image source={ic_menu} />} />

                <MenuOptions>
                  <MenuOption value={1}>
                    <Text
                      style={{
                        fontSize: 14,
                        color: colors.black,
                        fontWeight: "bold",
                        padding: 5,
                      }}
                    >
                      {uniqueId ? "Leave Group" : "Delete chat"}
                    </Text>
                  </MenuOption>
                </MenuOptions>
              </Menu>
            </View>
          </View>
        </View>

        <ImageBackground style={{ flex: 1 }} source={ic_chat_bg}>
          {/* <View style={styles.dateBg}>
          <Text style={{ color: colors.black, fontWeight: "bold" }}>
            Thu , 12 Jan 2023
          </Text>
        </View> */}
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : null}
            style={{ flex: 1 }}
            keyboardVerticalOffset={65}
          >
            {groupedChats.length > 0 ? (
              <FlatList
                inverted
                data={groupedChats}
                renderItem={renderItem}
                keyExtractor={(group) => group.timestamp}
                style={{ flex: 1 }}
              />
            ) : (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    alignSelf: "center",
                    fontSize: 20,
                    color: colors.black,
                    fontWeight: "bold",
                  }}
                >
                  Start New Conversation!
                </Text>
              </View>
            )}
            <View style={styles.sendMessageImg}>
              <View style={styles.searchTnputStyle}>
                {/* <KeyboardAvoidingView
               behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{ flex: 1 }}
                keyboardVerticalOffset={64}
              >
                 */}
                <TextInput
                  multiline
                  style={styles.searchTnputStyleee}
                  placeholder="Type message here"
                  placeholderTextColor={colors.searchBarTxt}
                  onChangeText={(text) => onChangeMessageInput(text)}
                  value={messageInput}
                  numberOfLines={3}
                  ReturnKeyType="done"
                />
                {/* </KeyboardAvoidingView> */}

                <View style={{ flexDirection: "row" }}>
                  <TouchableOpacity
                    style={{ justifyContent: "center" }}
                    onPress={uploadFile}
                  >
                    <Image source={ic_chat_attach} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{ alignSelf: "center" }}
                    onPress={() => setState({ callModal: true })}
                  >
                    <Image source={ic_chat_call} />
                  </TouchableOpacity>
                </View>
              </View>
              <TouchableOpacity
                style={styles.arrowStyle}
                onPress={() => {
                  sendChatMethod(messageInput);
                }}
              >
                <Image
                  style={{
                    transform: [{ rotate: "180deg" }],
                    alignSelf: "center",
                  }}
                  source={ic_back}
                />
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
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
                if (callData || groupName) {
                  checkPeermission("voiceCall");
                }
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
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginLeft: -7,
              }}
              // onPress={() => {
              //   if (callData || groupName) {
              //     if (callData || groupName) {
              //       checkPeermission("videoCall");
              //     }
              //   }
              // }}
              onPress={() => {
                if (callData) {
                  checkPeermission("videoCall");
                } else {
                  return null;
                }
              }}>
              <Image source={ic_videocall} />
              <CustomText
                //fontWeight={"bold"}
                text={"Video Call"}
                textColor={colors.secondary}
                textSize={22}
                marginLeft={wp(0)}
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
      </View>
    </SafeAreaView>
  );
};

export default UserChatsScreen;
