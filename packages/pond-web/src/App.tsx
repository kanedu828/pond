import { MantineProvider } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Fishing } from './components/Fishing';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import { Notifications } from '@mantine/notifications';

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: '/',
    element: <Fishing/>
  }
]);

const App = () => {
  document.title = 'Pond';

  return (
    <MantineProvider>
      <Notifications/>
      <QueryClientProvider client={queryClient}> 
        <RouterProvider router={router}/>
      </QueryClientProvider>
    </MantineProvider>
  )
}

export default App
