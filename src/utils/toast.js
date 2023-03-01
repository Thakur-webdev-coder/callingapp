import Toast from 'react-native-root-toast';

export function Show_Toast(Message, backgroundColor = 'black') {
  let toast = Toast.show(Message, {
    duration: Toast.durations.LONG,
    position: Toast.positions.BOTTOM,
    shadow: true,
    animation: true,
    hideOnPress: true,
    backgroundColor: backgroundColor,
    textColor: backgroundColor === 'white' ? 'black' : 'white',
    delay: 0,
    onShow: () => { },
    onShown: () => { },
    onHide: () => { },
    onHidden: () => { }
  });
  setTimeout(function () {
    Toast.hide(toast);
  }, 3000);
}