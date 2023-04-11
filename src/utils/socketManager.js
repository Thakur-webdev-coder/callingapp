import { io } from "socket.io-client";
// import { setAuthDetail, setChatMessage, setDeleteChatData, setGroupList, setGroupListLoader, setIsFetchingChatHistory, setNotificationData, setSocketInfo, setUserList, setUserListLoader } from '../../Modules/Chat/Slice';
import { Store } from "../redux";
import { setChatMessage, setChatRoom } from "../redux/reducer";
let socket = null;
let SOCKET_URL = "wss://dev.cap-tek.com:9095";
console.log("SOCKET_URL--------", SOCKET_URL);
export const _socketConnect = (paramObj) => {
  console.log("in manager--------", paramObj);
  socket = io(SOCKET_URL, {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 99999,
    transports: ["websocket"],
  });
  socket.on("connect", () => {
    console.log("CONNECT");
    // Store.dispatch(setSocketInfo(socket));
    if (socket.connected) {
      console.log("CONNECT connected----1-----", socket.connected);
      socket.emit("con", {
        ...paramObj,
      });

      console.log("CONNECT connected----2-----", socket.connected);
    }
  });
  socket.on("reconnect", (attempt) => {
    console.log("RECONNECT");
    if (socket.connected) {
      console.log("RECONNECT connected", socket.connected);
      socket.emit("con", {
        doc: {
          unique_token: paramObj.unique_token,
        },
      });
    }
  });

  socket.on("disconnect", (reason) => {
    console.log("disconnect--------", reason);
  });
  socket.on("connect_error", (error) => {
    console.log("connect_error", error);
    // socket.io.opts.transports = ["polling", "websocket"];
  });
  return socket;
};

export const _getVerifyTokenData = () => {
  socket.on("con", (doc) => {
    console.log("_getVerifyTokenData", doc);
    Store.dispatch(setAuthDetail(doc));
  });
};

export const _getUsers = () => {
  socket.on("users", (doc) => {
    console.log("_getUsers", doc);
    let Users = [...doc];
    Users = Users.filter((filterItem) => filterItem.user_active === true);
    store.dispatch(setUserList(Users));
    store.dispatch(setUserListLoader(false));
  });
};

export const _getGroups = () => {
  socket.on("groups", (data) => {
    const Groups = data.filter(
      (filterItem) => filterItem.group_active === true
    );
    store.dispatch(setGroupList(Groups));
    store.dispatch(setGroupListLoader(false));
  });
};

export const _userAdd = (userdata) => {
  socket.emit("user-add", {
    doc: userdata,
  });
};

export const _getUserAddedData = () => {
  socket.on("user-add", (data) => {
    const state = store.getState();
    const { userList } = state.chat;
    const newUsersList = [...userList];
    newUsersList.push(data);
    store.dispatch(setUserList(newUsersList));
  });
};

export const _userUpdate = (userdata) => {
  socket.emit("user-upd", {
    doc: userdata,
  });
};

export const _getUserUpdatedData = () => {
  socket.on("user-upd", (data) => {
    console.log("_getUserUpdatedData", data);
    const state = store.getState();
    const { userList } = state.chat;
    const { userCredentials } = state.user;
    const prevUsers = userList;
    let newUsersList = [...userList];
    if (userCredentials?.user_id === data?.user_id) {
      const userIndex = prevUsers.findIndex(
        //Get user index
        (obj) => obj.user_id === data.user_id
      );
      newUsersList[userIndex] = data; // update data
    } else {
      if (data.user_active === true) {
        const userIndex = prevUsers.findIndex(
          //Get user index
          (obj) => obj.user_id === data.user_id
        );
        if (userIndex === -1) {
          newUsersList.push(data);
        } else {
          newUsersList[userIndex] = data; // update data
        }
      } else {
        newUsersList = prevUsers.filter(
          // remove group from list
          (filterItem) => filterItem.user_id !== data.user_id
        );
      }
    }
    store.dispatch(setUserList(newUsersList));
  });
};

export const _userRemove = (userdata) => {
  socket.emit("user-rem", {
    doc: userdata,
  });
};

export const _getAfterUserRemovedData = () => {
  socket.on("user-rem", (data) => {
    const state = store.getState();
    const { userList } = state.chat;
    const prevUsersList = [...userList];
    const newUsersList = prevUsersList.filter(
      // remove user from list
      (filterItem) => filterItem.user_id !== data.user_id
    );
    store.dispatch(setUserList(newUsersList));
  });
};

export const _groupAdd = (groupdata) => {
  console.log("_groupAdd", groupdata);
  socket.emit("group-add", {
    doc: groupdata,
  });
};

export const _getGroupAddedData = (cb) => {
  socket.on("group-add", (data) => {
    console.log("_getGroupAddedData", data);
    const state = store.getState();
    const { groupList } = state.chat;
    const newGroupList = [...groupList];
    newGroupList.unshift(data); // added new group into list at first position
    store.dispatch(setGroupList(newGroupList));
  });
};

export const _groupUpdate = (groupdata) => {
  socket.emit("group-upd", {
    doc: groupdata,
  });
};

export const _getGroupUpdatedData = (cb) => {
  socket.on("group-upd", (data) => {
    console.log("_getGroupUpdatedData", data);
    const state = store.getState();
    const { groupList } = state.chat;
    let newGroupList = [...groupList];
    if (data.group_active === true) {
      const groupIndex = groupList.findIndex(
        // get index of group
        (obj) => obj.groupId === data.groupId
      );
      if (groupIndex === -1) {
        newGroupList.push(data);
      } else {
        newGroupList[groupIndex] = data; // update group data using index
      }
    } else {
      newGroupList = groupList.filter(
        // remove group from list
        (filterItem) => filterItem.groupId !== data.groupId
      );
    }
    store.dispatch(setGroupList(newGroupList));
  });
};

export const _groupRemove = (groupdata) => {
  socket.emit("group-rem", {
    doc: groupdata,
  });
};

export const _getAfterGroupRemovedData = (cb) => {
  socket.on("group-rem", (data) => {
    console.log("_getAfterGroupRemovedData", data);
    const state = store.getState();
    const { groupList } = state.chat;
    let prevGroupList = [...groupList];
    const newGroupList = prevGroupList.filter(
      // remove group from list
      (filterItem) => filterItem.groupId !== data.groupId
    );
    store.dispatch(setGroupList(newGroupList));
  });
};

export const _sendChatMessage = (chatData) => {
  console.log("_sendChatMessage", chatData);
  socket.emit("chat", chatData);
  console.log("sucessful======");
};

// const gettingChatHistory = (chatHistory) => {
//   console.log("_getHistoryChat", chatHistory);
//   socket.emit("chat-history", data);
//   console.log("history_sucessful======");
// };

export const getSocket = () => {
  return socket;
};

export const _getUpdatedChatMessage = () => {
  console.log("chat_on_event");

  socket.on("chat", (data) => {
    console.log("_getUpdatedChatMessage=======>", data);

    const state = Store.getState();
    console.log("state====>", state);
    const { chatMessage = [], chatRoom } = state.sliceReducer;
    console.log("chatRoom====>", chatRoom);
    // const room = chatRoom;
    const newChat = [...chatMessage];
    newChat.unshift(data);
    console.log("newChat====>", newChat);

    //  const findIndex = newChat.findIndex((findItem) => findItem.id === data.id);
    //  console.log("_getUpdatedChatMessage findIndex",findIndex)
    // if (room === data.documentID) {
    //   // validate received data should be corresponding to selected room
    // if (findIndex === -1) {
    //   newChat.unshift(data);
    // }
    // else {
    //     if (!data?.deleted) {
    //       newChat[findIndex] = data;
    //     } else {
    //       Store.dispatch(setDeleteChatData(data));
    //     }
    //   }
    // }

    Store.dispatch(setChatMessage(newChat));
  });
};

export const _sendChatRoomDetail = (chatRoomData) => {
  console.log("_sendChatRoomDetail====>", chatRoomData);
  socket.emit("chat-list", {
    doc: chatRoomData,
  });
};

export const _getMessageList = (
  cb,
  user_unique_key,
  chatRoomDetail,
  off = false
) => {
  if (!off) {
    socket.on("chat-list", (data) => {
      console.log("_getMessageList socket debug===>", data);
      // if (data.length > 0) {
      //   if (chatRoomDetail === data[0].documentID) {
      //     // validate received data should be corresponding to selected room
      //     if (data[0].type === "private") {
      //       if (
      //         data[0].senderID === user_unique_key ||
      //         data[0].receiverID === user_unique_key
      //       ) {
      //         store.dispatch(setChatMessage(data));
      //       }
      //     } else {
      //       store.dispatch(setChatMessage(data));
      //     }
      //   }
      // } else {
      //   store.dispatch(setChatMessage(data));
      // }
    });
  } else {
    socket.removeAllListeners("chat-list");
    cb();
  }
};

export const _sendEvent = (eventData) => {
  socket.emit("event", {
    doc: eventData,
  });
};

export const _getEventList = () => {
  socket.on("event", (data) => {
    const state = store.getState();
    const { authDetail } = state.chat;
    if (data.event_type === "msg-notification") {
      if (data.type === "private") {
        if (data.receiverID === authDetail.user_id) {
          store.dispatch(setNotificationData(data));
        }
      } else {
        if (data.senderID !== authDetail.user_id) {
          store.dispatch(setNotificationData(data));
        }
      }
    }
  });
};

export const _getKeepAlive = () => {
  socket.on("keep-alive", (data) => {
    console.log("_getKeepAlive", data);
  });
};

export const _searchChatMessage = (chatData) => {
  console.log("_searchChatMessage ", chatData);
  socket.emit("chat-filter", {
    doc: chatData,
  });
};

export const _getSearchChatMessage = () => {
  socket.on("chat-filter", (data) => {
    console.log("_getSearchChatMessage", data);
    store.dispatch(setChatMessage(data));
  });
};

export const _deleteChatMessage = (chatData) => {
  socket.emit("chat-delete", {
    doc: chatData,
  });
};

export const _editChatMessage = (chatData) => {
  socket.emit("chat-edit", {
    doc: chatData,
  });
};

export const _sendloadMoreChatData = (data) => {
  console.log("_sendloadMoreChatData---------", data);
  socket.emit("chat-history", {
    doc: data,
  });
};

export const _getloadMoreChatData = () => {
  socket.on("chat-history", (data) => {
    console.log("_getloadMoreChatData", data);
    // const prevChatData = [...store.getState().chat.chatMessage];
    // prevChatData.push(...data);
    // store.dispatch(setChatMessage(prevChatData));
    // store.dispatch(setIsFetchingChatHistory(false));
  });
};

export const privateChatID = (obj) => {
  const sortAlphaNum = (a, b) => a.localeCompare(b, "en", { numeric: true });
  Store.dispatch(setChatRoom(obj.sort(sortAlphaNum).join("_")));
  return obj.sort(sortAlphaNum).join("_");
};
