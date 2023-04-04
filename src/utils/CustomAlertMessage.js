import React, { useState } from "react";
import { Alert, Button, View } from "react-native";
import { PERMISSIONS, request, RESULTS } from "react-native-permissions";
import { useDispatch } from "react-redux";
import { startMeeting } from "../lib-jitsi-meet/actions";

const CustomAlert = ({ notificationdata }) => {
  const [showAlert, setShowAlert] = useState(false);
  const alertData = notificationdata;
  const permissions =
    Platform.OS === "ios" ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA;

  const dispatch = useDispatch();

  const handleOkClick = () => {
    setShowAlert(false);

    const checkPeermission = () => {
      request(permissions)
        .then((result) => {
          switch (result) {
            case RESULTS.UNAVAILABLE:
              console.log(
                "This feature is not available (on this device / in this context)"
              );
              break;
            case RESULTS.DENIED:
              console.log(
                "The permission has not been requested / is denied but requestable",
                RESULTS.DENIED
              );
              break;
            case RESULTS.LIMITED:
              console.log(
                "The permission is limited: some actions are possible"
              );
              break;
            case RESULTS.GRANTED:
              console.log("granted------");
              dispatch(startMeeting(alertData.data.Meeting_url));

              break;
            case RESULTS.BLOCKED:
              console.log(
                "The permission is denied and not requestable anymore"
              );
              break;
          }
        })
        .catch((error) => {
          console.log("errr----", error);
        });
    };
    // Do something when "Ok" button is clicked
  };

  const handleCancelClick = () => {
    setShowAlert(false);
    // Do something when "Cancel" button is clicked
  };

  return (
    <View>
      <Alert
        title={alertData.data.Subject}
        message={alertData.data.sender_phone + "Inviting you for a Video Call!"}
        buttons={[
          { text: "Join", onPress: handleOkClick },
          { text: "Cancel", onPress: handleCancelClick },
        ]}
      />
    </View>
  );
};

export default CustomAlert;
