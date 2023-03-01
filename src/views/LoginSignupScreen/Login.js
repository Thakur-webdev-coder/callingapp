import { Image, SafeAreaView, Text, View } from "react-native";
import React from "react";
import AppStyle from "../../components/AppStyle";
import styles from "./styles";
import { ic_app_logo } from "../../routes/imageRoutes";
const Login = ({navigation}) => {
 

  return (
    <SafeAreaView style={styles.wrapper} >
    <View style={{flex:1}}>
        <Image source={ic_app_logo}/>
    </View> 
    <View style={styles.wrapper2}>
        
    </View> 
    </SafeAreaView>
  );
};

export default Login;
