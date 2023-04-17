import moment from "moment";

export function showErrorMessage(Message) {
  alert(Message);
}
export function dateFormater(date) {
  return moment.utc(date).local().format("DD MMM YYYY");
}

export function generateRandomString() {
  let result = "";
  const characters = "0123456789";
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
  const options = { hour: "numeric", minute: "numeric", hour12: true };
  const localTime = date.toLocaleString("en-US", options);
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
    const options = { hour: "numeric", minute: "numeric", hour12: true };
    return date.toLocaleString("en-US", options);
  } else if (date.toDateString() === new Date(now - 86400000).toDateString()) {
    // timestamp is from yesterday, so show "yesterday"
    return "Yesterday";
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
  var hDisplay = h > 0 ? h : "00";
  var mDisplay = m > 0 ? m : "00";
  var sDisplay = s;
  if (hDisplay === "00")
    return (
      String(mDisplay).padStart(2, "0") +
      ":" +
      String(sDisplay).padStart(2, "0")
    );
  return (
    String(hDisplay).padStart(2, "0") +
    ":" +
    String(mDisplay).padStart(2, "0") +
    ":" +
    String(sDisplay).padStart(2, "0")
  );
}

export function omitSpecialCharacters(text) {
  const regExp = new RegExp(/^0+|\W*/g);
  return (text || "").replace(regExp, "");
}

export function generateRandomId() {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < 10; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export async function uriToFile(uri) {
  const fileUri = FileSystem.documentDirectory + "filename.ext";
  try {
    await FileSystem.downloadAsync(uri, fileUri);
    console.log("myUriiii", uri);
    return fileUri;
  } catch (error) {
    console.error(error);
  }
}
