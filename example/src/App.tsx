import * as React from 'react'
import { StyleSheet, View } from 'react-native'
import Fabs from 'react-native-fabs'
import Icon from 'react-native-vector-icons/Ionicons'

const App = () => {
  return (
    <View style={{ flex: 1, backgroundColor: '#f3f3f3' }}>
      {/* Rest of the app comes ABOVE the action button component !*/}
      <Fabs.ActionButton
        buttonColor='rgba(231,76,60,1)'
        fixNativeFeedbackRadius={true}
      >
        <Fabs.ActionButtonItem
          buttonColor='#9b59b6'
          title='New Task'
          elevation={0}
          onPress={() => console.log('notes tapped!')}
          fixNativeFeedbackRadius={true}
          hideShadow
        >
          <Icon name='md-create' style={styles.actionButtonIcon} />
        </Fabs.ActionButtonItem>
        <Fabs.ActionButtonItem
          buttonColor='#3498db'
          title='Notifications'
          onPress={() => {}}
          fixNativeFeedbackRadius={true}
          hideShadow
        >
          <Icon name='md-notifications' style={styles.actionButtonIcon} />
        </Fabs.ActionButtonItem>
        <Fabs.ActionButtonItem
          buttonColor='#1abc9c'
          title='All Tasks'
          onPress={() => {}}
          fixNativeFeedbackRadius={true}
          hideShadow
        >
          <Icon name='md-checkmark-done' style={styles.actionButtonIcon} />
        </Fabs.ActionButtonItem>
      </Fabs.ActionButton>
    </View>
  )
}

const styles = StyleSheet.create({
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
})

export default App
