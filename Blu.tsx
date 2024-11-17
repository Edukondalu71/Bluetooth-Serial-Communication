import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  NativeModules,
  Alert,
  ToastAndroid,
  StatusBar,
} from 'react-native';
const { BluetoothModule } = NativeModules;

interface Device {
    address: string;
    name: string;
}

interface Props {
    callBack:(state:boolean) => void
} 

const App1:React.FC<Props> = ({callBack}) => {
  const [devices, setDevices] = useState<Device[] | []>([]);
  const [connectedDevice, setSConnectedDevice] = useState<Device | null>(null);

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      const permissionsGranted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      ]);

      // Check if permissions are granted
      const allPermissionsGranted = Object.values(permissionsGranted).every((status) => status === 'granted');

      if (!allPermissionsGranted) {
        Alert.alert(
          'Permission Error', 
          'Please grant all necessary permissions to scan for BLE devices.', 
          [
            {
              text: 'CANCEL', // Button label
              onPress: () => null
            },
            {
              text: 'OK', // Button label
              onPress: () => requestPermissions()
            }
          ],
          { cancelable: true }
        );
      }else {
        enableBluetooth(); 
      }
    }
  };


  const connectToDevice = useCallback((item:Device) => {
    try {
      BluetoothModule.connectToDevice(item.address)
        .then((state:string) => {
            setSConnectedDevice(item);
            callBack(true);
        })
        .catch((error:any) => {
            callBack(false);
            ToastAndroid.show(error?.message, ToastAndroid.LONG);
        });
    }catch (error:any) {
        callBack(false);
        ToastAndroid.show(error?.message, ToastAndroid.LONG);
    }
  },[]);

  const enableBluetooth = useCallback(async () => {
    try{
      BluetoothModule.enableBluetooth()
        .then((state:string) => {
          console.log('Paired devices:', state);
          // devices is an array of objects with device names and addresses
          PairedDevices();
        })
        .catch(error => ToastAndroid.show(error?.message, ToastAndroid.LONG));
    }catch (error:any) {
        ToastAndroid.show(error?.message, ToastAndroid.LONG);
    }
  },[]);

  const PairedDevices = useCallback(async () => {
    try{
      BluetoothModule.getPairedDevices()
        .then((devices:Device[]|[]) => {
            devices.forEach((el:Device) => {
                if(el.name === 'ESP32_Switch'){
                    connectToDevice(el);
                    return
                }
            })
            setDevices(devices)
        })
        .catch(error => console.log(error));
    }catch (error:any) {
        ToastAndroid.show(error?.message, ToastAndroid.LONG);
    }
  },[])

  const renderDevice = useCallback(({item}) => (
    <TouchableOpacity style={styles.deviceItem} onPress={() => connectToDevice(item)}>
      <Text style={styles.deviceText}>{item.name || 'Unknown Device'}</Text>
      <Text style={styles.deviceText}>{item.address}</Text>
    </TouchableOpacity>
  ),[devices]);

  useEffect(() => {
    StatusBar.setHidden(false);
    requestPermissions();
  },[])

  return (
    <View style={styles.container}>
      <Text style={styles.title}>BLE Device Scanner</Text>
      <FlatList
        data={devices}
        keyExtractor={(item) => item.address}
        renderItem={renderDevice}
        style={styles.list}
      />

      <View style={{display:'flex', flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
        <Text>Connected to: {connectedDevice?.name}</Text>
        <Text onPress={requestPermissions} style={{color:'blue', fontWeight:'500'}}>Reconnect</Text>
      </View>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 20,
    color:'#000000'
  },
  list: {
    marginTop: 20,
  },
  deviceItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  deviceText: {
    fontSize: 16,
    color:'#000000',
    fontWeight:'500'
  },
  buttonContainer: {
    width: '100%',
    marginTop: 20,
  }
});

export default App1;
