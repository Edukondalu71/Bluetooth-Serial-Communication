import React, { useCallback, useMemo, useState } from 'react'
import { SafeAreaView, useColorScheme, StyleSheet, StatusBar, Modal} from 'react-native'
import App1 from './Blu'
import Button from './Button';

interface SwitchAction {
  name: string;
  value: string;
}

const App = () => {
  const theme = useColorScheme();
  const [screenState, setScreenState] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(true);

  const Switch_List: SwitchAction[] = useMemo(() => [
    {name: 'Turn LED ON', value: '1'},
    {name: 'Turn LED OFF', value: '0'},
    {name: 'Switch 1 ON', value: 'SWITCH_1_ON'},
    {name: 'Switch 1 OFF', value: 'SWITCH_1_OFF'},

    {name: 'Switch 2 ON', value: 'SWITCH_2_ON'},
    {name: 'Switch 2 OFF', value: 'SWITCH_2_OFF'},

    {name: 'Switch 3 ON', value: 'SWITCH_3_ON'},
    {name: 'Switch 3 OFF', value: 'SWITCH_3_OFF'},

    {name: 'Switch 4 ON', value: 'SWITCH_4_ON'},
    {name: 'Switch 4 OFF', value: 'SWITCH_4_OFF'}
  ], []);


  const UpdateState = useCallback((state:boolean) => {
    setModalVisible(!state);
    StatusBar.setHidden(true);
  }, []);

  return (
    <>
    <Modal animationType="fade" transparent={true} visible={modalVisible}>
      <App1 callBack={UpdateState}/>
    </Modal>
    
    <SafeAreaView style={[styles.container, {backgroundColor: theme === 'dark' ? "#000000" : "#FFFFFF"}]}>
      {Switch_List.map((item:SwitchAction) =>  <Button key={item.value} props={{...item,UpdateState}} />)}
    </SafeAreaView>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    overflow: 'scroll',
    padding: 10,
    width: '100%',
    flexDirection: 'row',
    flexGrow: 1,
    flexWrap: 'wrap',
  },
});

export default App
