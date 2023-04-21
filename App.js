import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import RootNavigation from "./src/NavigationContainer/RootNavigation";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { RootSiblingParent } from "react-native-root-siblings";
import SplashScreen from "react-native-splash-screen";
import CustomLoader from "./src/helpers/CustomLoader";
import Store, { persistor } from "./src/redux/store";
import { checkToken } from "./src/utils/notificationHandler";
import { MenuProvider } from "react-native-popup-menu";
import messaging from '@react-native-firebase/messaging';
const App = () => {
  useEffect(() => {
    SplashScreen.hide(); //hides the splash screen on app load.
    checkToken();
  }, []);

  // async function requestUserPermission() {
  //   const authStatus = await messaging().requestPermission();
  //   const enabled =
  //     authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
  //     authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  
  //   if (enabled) {
  //     console.log('Authorization status:', authStatus);
  //     checkToken();
  //   }
  // }
  return (
    <Provider store={Store}>
      <PersistGate loading={<CustomLoader />} persistor={persistor}>
        <MenuProvider>
          <RootSiblingParent>
            <NavigationContainer>
              <RootNavigation />
            </NavigationContainer>
          </RootSiblingParent>
        </MenuProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
