import { MantineProvider } from '@mantine/core';
import { Login } from './Components/Login';

const App = () => {

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <Login/>
    </MantineProvider>
  )
}

export default App
