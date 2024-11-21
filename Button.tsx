import React, { useCallback, useRef, useState } from 'react';
import {
  Animated,
  TouchableWithoutFeedback,
  StyleSheet,
  Text,
  Dimensions,
  NativeModules,
  ToastAndroid,
} from 'react-native';

interface SwitchAction {
    props: {
        name: string;
        value: string;
        UpdateState:(arg:boolean) => void
    }
  }

const { height } = Dimensions.get('window');
const { BluetoothModule } = NativeModules;

const Button:React.FC<SwitchAction> = ({props}) => {
  const scaleValue = useRef(new Animated.Value(1)).current;
  const [loader, setLoader] = useState<boolean>(false);

  const handlePressIn = useCallback(() => {
    Animated.spring(scaleValue, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  },[]);

  const handlePressOut = useCallback(() => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  },[]);

  const animatedStyle = {
    transform: [{ scale: scaleValue }],
  };

  const sendCommand = useCallback(() => {
    setLoader(true);
    BluetoothModule.write(props.value)
      .then((response:string) => {
        console.log(`response`, response); // "Command sent: AT+COMMAND"
        setLoader(false);
      })
      .catch((error:any) => {
        props.UpdateState(false);
        ToastAndroid.show(error?.message, ToastAndroid.LONG);
        setLoader(false);
      })
  },[props]);

  return (
      <TouchableWithoutFeedback onPressIn={handlePressIn} onPressOut={handlePressOut} disabled={loader} onPress={sendCommand}>
        <Animated.View style={[styles.button, animatedStyle]}>
          <Text style={styles.buttonText}>{loader ? 'sending' :props.name}</Text>
        </Animated.View>
      </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent:'center',
    alignItems:'center',
    backgroundColor: '#6200EE',
    borderRadius: 100,
    margin:10,
    marginLeft:'10%',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    height:height /6,
    width: height /6,
    elevation: 5,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default React.memo(Button);
