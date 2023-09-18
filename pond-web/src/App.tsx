import { MantineProvider } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Login } from './Components/Login';

const queryClient = new QueryClient()

const App = () => {

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <QueryClientProvider client={queryClient}>
        <Login/>
      </QueryClientProvider>
      
    </MantineProvider>
  )
}

export default App
