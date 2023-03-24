import moment from "moment";

export function showErrorMessage(Message) {
  alert(Message);
}
export function dateFormater(date) {
  return moment.utc(date).local().format("DD MMM YYYY");
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
