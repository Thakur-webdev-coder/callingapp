import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import RootNavigation from "./src/NavigationContainer/RootNavigation";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { RootSiblingParent } from "react-native-root-siblings";
import SplashScreen from "react-native-splash-screen";
import CustomLoader from "./src/helpers/CustomLoader";
import Store,{ persistor } from "./src/redux/store";


const App = () => {
  useEffect(() => {
    SplashScreen.hide(); //hides the splash screen on app load.
  }, []);
  return (
    <Provider store={Store}>
      <PersistGate loading={<CustomLoader />} persistor={persistor}>
        <RootSiblingParent>
          <NavigationContainer>
            <RootNavigation />
          </NavigationContainer>
        </RootSiblingParent>
      </PersistGate>
   </Provider>
  );
};

export default App;