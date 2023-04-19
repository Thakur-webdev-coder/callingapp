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

export const _sendChatMessage = (chatData) => {
  console.log("_sendChatMessage", chatData);
  socket.emit("chat", chatData);
  console.log("sucessful======");
};

export const _deleteChat = (data) => {
  console.log("_deleteChat", data);
  socket.emit("chat-list-delete", data);
  console.log("sucessful======_deleteChat");
};

export const _addGroup = (data) => {
  console.log("group-add__", data);
  socket.emit("group", data);
  console.log("sucessful======_group-add__");
};

export const _leaveGroup = (data) => {
  console.log("group-leave__", data);
  socket.emit("group-leave", data);
  console.log("sucessful======_group-leave__");
};

// const gettingChatHistory = (chatHistory) => {
//   console.log("_getHistoryChat", chatHistory);
//   socket.emit("chat-history", data);
//   console.log("history_sucessful======");
// };

export const getSocket = () => {
  return socket;
};
