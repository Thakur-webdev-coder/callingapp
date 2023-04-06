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
import { _getMessageList, _getUpdatedChatMessage, _sendChatMessage, _sendChatRoomDetail, _sendloadMoreChatData, privateChatID } from "../../utils/socketManager";
import { useSelector } from "react-redux";
const UserChatsScreen = ({ navigation, route }) => {
  const [messageInput, onChangeMessageInput] = useState("");

  const [state, setState] = useState({
    callModal: false,
    arr: []
  });

  let receiverID = route.params.callData;
  const { loginDetails = {},chatMessage={} ,chatRoom} = useSelector((store) => store.sliceReducer);
  let senderID = loginDetails.username;
  let type='private';
   console.log('chatMessage==onscreen===>>>',receiverID,chatMessage)

  // useEffect(()=>{
  //   privateChatID([senderID, receiverID])

  // },[])


useEffect(() => {
  privateChatID([senderID, receiverID])
  console.log('chatRoom------>',chatRoom)
  if (chatRoom != '') {
    const chatRoomPayload = {
      company_id: 'kokoafone',
      documentID: chatRoom,
      user_id: senderID,
    };
    _sendChatRoomDetail(chatRoomPayload);
    _getMessageList(() => { }, senderID, chatRoom, false);
  }
}, [chatRoom]);
 

 
  
  
  
 

  const sendChatMethod = () => {
    if (messageInput === "" || messageInput == null) {
      Alert.alert("Alert!", "Enter your message please...", [{ text: "Ok" }], {
        cancelable: false,
      });
      return;
    }

    const data = {
      // senderId: username,
      // message: messageInput,
      // recieverId:callData

      senderID: senderID,
      message: messageInput,
      timestamp: Date.now(),
      receiverID:receiverID,
      // receiverID: Object.keys(replyMessage).length === 0 ? (type === 'private' ? receiverID : groupID) : replyMessage.senderID === senderID ?  replyMessage.receiverID : replyMessage.senderID,
       company_id: 'kokoafone',
      documentID: type === 'private' ? privateChatID([senderID, receiverID]) : groupID,
      type
    };

    _sendChatMessage(data);
    _getUpdatedChatMessage();
    onChangeMessageInput("");
  };

  const filteredChatList = () => {
    setState({arr:chatMessage})

    // const filteredList = chatList.filter((u) => u?.callData === callData);
    // return filteredList.reverse();
  };

  const renderItem = ({ item }) => {
    const {message} =item.doc
    console.log('item------',item);
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
              backgroundColor:  "#5C5D5F",
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
              <Text style={textStyle}>{message}
                {/* {typeof item.message==='string'?item.message:''} */}
                </Text>
              <Text
                style={{
                  fontSize: 10,
                  color: "white",
                 paddingBottom:5,
                 paddingHorizontal: 10,
                 
                 
                 
                  textAlign:"right"
                }}
              >
                text2
                {/* {moment(item.timestamp).format("DD MMM,  LT")} */}
              </Text>
            {/* </Hyperlink> */}
          </View>
        </View>
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
            Banoj Tri....
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
          }}>
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
                callData: callData?.callData,
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
                callData: callData?.callData,
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
