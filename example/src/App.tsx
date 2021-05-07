import React, { useEffect } from 'react'
import RNFabsModule, { Counter } from 'react-native-fabs'

const App = () => {
  useEffect(() => {
    console.log(RNFabsModule)
  })

  return <Counter />
}

export default App
