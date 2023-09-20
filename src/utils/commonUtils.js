import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import notifee, { AndroidCategory } from '@notifee/react-native';
import InCallManager from 'react-native-incall-manager';

export function showErrorMessage(Message) {
  alert(Message);
}
export function dateFormater(date) {
  return moment.utc(date).local().format('DD MMM YYYY');
}

export function generateRandomString() {
  let result = '';
  const characters = '0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < 5; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export function timestampToDate(timeStamp) {
  const formattedDate = new Date(timeStamp).toDateString();
  return formattedDate;
}

export function timestampToLocalTime(timeStamp) {
  const date = new Date(timeStamp);
  const options = { hour: 'numeric', minute: 'numeric', hour12: true };
  const localTime = date.toLocaleString('en-US', options);
  return localTime;
}

export function timestampToDateInAnotherFormat(timeStamp) {
  const date = new Date(timeStamp);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const formattedDate = `${day}/${month}/${year}`;
  return formattedDate;
}

export function formatAccordingTimestamp(timestamp) {
  const now = new Date();
  const date = new Date(timestamp);

  if (date.toDateString() === now.toDateString()) {
    // timestamp is from today, so show time
    const options = { hour: 'numeric', minute: 'numeric', hour12: true };
    return date.toLocaleString('en-US', options);
  } else if (date.toDateString() === new Date(now - 86400000).toDateString()) {
    // timestamp is from yesterday, so show "yesterday"
    return 'Yesterday';
  } else {
    // timestamp is from another day, so show date only
    return date.toLocaleDateString();
  }
}

export function secondsToHMS(seconds) {
  seconds = Number(seconds);
  var h = Math.floor((seconds % (3600 * 24)) / 3600);
  var m = Math.floor((seconds % 3600) / 60);
  var s = Math.floor(seconds % 60);
  var hDisplay = h > 0 ? h : '00';
  var mDisplay = m > 0 ? m : '00';
  var sDisplay = s;
  if (hDisplay === '00')
    return (
      String(mDisplay).padStart(2, '0') +
      ':' +
      String(sDisplay).padStart(2, '0')
    );
  return (
    String(hDisplay).padStart(2, '0') +
    ':' +
    String(mDisplay).padStart(2, '0') +
    ':' +
    String(sDisplay).padStart(2, '0')
  );
}

export function omitSpecialCharacters(text) {
  const regExp = new RegExp(/^0+|\W*/g);
  return (text || '').replace(regExp, '');
}

export function generateRandomId() {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < 10; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export async function uriToFile(uri) {
  const fileUri = FileSystem.documentDirectory + 'filename.ext';
  try {
    await FileSystem.downloadAsync(uri, fileUri);
    console.log('myUriiii', uri);
    return fileUri;
  } catch (error) {
    console.error(error);
  }
}

export const setToken = async (token) => {
  try {
    await AsyncStorage.setItem('token', token);
    console.log('Token save successfully.');
  } catch (error) {
    console.log('Error setting token:', error);
  }
};
export const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    console.log('Token retrieved successfully:', token);
    return token;
  } catch (error) {
    console.log('Error retrieving token:', error);
  }
};

export const saveBooleanValue = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.log(error);
  }
};

export const getBooleanValue = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      return JSON.parse(value);
    }
    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const fromInActiveState = async (remoteMessage) => {

console.log('inactiivvv====>>>>>',remoteMessage);



  const channelId = await notifee.createChannel({
    id: "KILLSTATE",
    name: "Important Notifications",
    importance: 4,
  });
  await notifee.displayNotification({
    title: remoteMessage?.data?.title,
    body: remoteMessage?.data?.sender_phone,
    id: "KILLSTATE",
    data: remoteMessage.data,
    
    android: {
      category: AndroidCategory.CALL,
      channelId,
      color: "#1DAF98",
      loopSound: true,
      fullScreenAction: { id: "default" },
      pressAction: {
        id: "default",
        launchActivity: "default",
      },
      actions: [
        {
          title: '<p style="color: #8F0D0D ">Decline</p>',
          pressAction: { id: "decline" },
        },
        {
          title: '<p style="color: #112401;">Answer</p>',
          pressAction: { id: "accept", launchActivity: "default" },
        },
      ],
      ongoing:true
    },
     ios: {
    categoryId: 'post',
    
    
    

     
  },
  });
};
export const setCategories=async()=> {
  console.log("insidefunction--------");
  await notifee.setNotificationCategories([
    {
      id: 'post',
      actions: [
        {
          title: 'Decline',
           id: "decline" 
        },
        {
          title: 'Answer',
           id: "accept",
           foreground: true, 
        },
      ],
    },
  ]);
}
