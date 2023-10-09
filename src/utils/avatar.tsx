import React from "react";
import {
  Image,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { ic_avatar } from "../routes/imageRoutes";
// import { ImageCache, TextComponent } from "../../pages/native/components";
const DEFAULT_SIZE = 50;

interface PropsType {
  initials?: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
  url?: string;
  color?: string;
}

export default function Avatar({
  initials,
  size = DEFAULT_SIZE,
  style,
  url,
  color,
}: PropsType) {
  /**
   * Renders the default avatar.
   *
   * @returns {React$Element<*>}
   */
  function _renderDefaultAvatar(): React$Element<any> {
    return (
      // <View style={{height:'100%',width:"100%"}}>
      <Image
        source={ic_avatar}
        style={[styles.avatarContent(size), styles.staticAvatar]}
      />
    );
  }

  /**
   * Renders the initials-based avatar.
   *
   * @returns {React$Element<*>}
   */
  function _renderInitialsAvatar(): React$Element<any> {
    return (
      <View
        style={[
          styles.initialsContainer,
          {
            backgroundColor: color,
          },
        ]}
      >
        {/* <TextComponent style={styles.initialsText(size)}> {initials} </TextComponent> */}
        <Text style={styles.initialsText(size)}>{initials}</Text>
      </View>
    );
  }

  /**
   * Renders the url-based avatar.
   *
   * @returns {React$Element<*>}
   */
  function _renderURLAvatar(): React$Element<any> {
    return (
      // <ImageCache
      //     url={url || ''}
      //     resizeMode='cover'
      //     initials={initials}
      //     textStyle={styles.initialsText(size)}
      //     loaderSize={size / DEFAULT_SIZE <= 1.5 ? 'small' : 'large'}
      //     style={[styles.avatarContent(size), { backgroundColor: color }]}
      // />
      <View style={[{ backgroundColor: color, height: 200, width: 200 }]}>
        <Image
          source={{ uri: url || "" }}
          // resizeMode='cover'
          style={[styles.avatarContent(size), { backgroundColor: color }]}
        />
      </View>
    );
  }

  let avatar;

  if (url) {
    avatar = _renderURLAvatar();
  } else if (initials) {
    avatar = _renderInitialsAvatar();
  } else {
    avatar = _renderDefaultAvatar();
  }

  return <View style={[styles.avatarContainer(size), style]}>{avatar}</View>;
}

const styles = {
  avatarContainer: (size: number = DEFAULT_SIZE): StyleProp<ViewStyle> => {
    return {
      alignItems: "center",
      // borderRadius: size / 2,
      height: size,
      justifyContent: "center",
      overflow: "hidden",
      width: size,
    };
  },

  avatarContent: (size: number = DEFAULT_SIZE) => {
    return {
      height: size,
      width: size,
    };
  },

  badge: (size: number = DEFAULT_SIZE, status: string) => {
    let color;

    switch (status) {
      case "available":
        color = "rgb(110, 176, 5)";
        break;
      case "away":
        color = "rgb(250, 201, 20)";
        break;
      case "busy":
        color = "rgb(233, 0, 27)";
        break;
      case "idle":
        color = "rgb(172, 172, 172)";
        break;
    }

    return {
      backgroundColor: color,
      borderRadius: size / 2,
      bottom: 0,
      height: size * 0.3,
      position: "absolute",
      width: size * 0.3,
    };
  },

  badgeContainer: {
    ...StyleSheet.absoluteFillObject,
  },

  initialsContainer: {
    alignItems: "center",
    alignSelf: "stretch",
    flex: 1,
    justifyContent: "center",
  },

  initialsText: (size: number = DEFAULT_SIZE): StyleProp<TextStyle> => {
    return {
      color: "white",
      fontSize: size * 0.45,
      fontWeight: "100",
    };
  },

  staticAvatar: {
    backgroundColor: "#ABABAB",
    opacity: 0.4,
  },
};
