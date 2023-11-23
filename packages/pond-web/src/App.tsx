import { createTheme, MantineProvider, rem } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Fishing } from "./components/Fishing";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import { Notifications } from "@mantine/notifications";
import "./styles/fonts.css";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <Fishing />,
  },
]);

const theme = createTheme({
  colors: {
    pondTeal: [
      "#f1f9f8",
      "#e4efee",
      "#c3e0db",
      "#9fcfc8",
      "#82c1b7",
      "#6fb8ad",
      "#63b5a8",
      "#539e93",
      "#458d82",
      "#337a70",
    ],
  },
  headings: {
    sizes: {
      h1: { fontSize: rem(100) },
      h2: { fontSize: rem(70) },
      h3: { fontSize: rem(45) },
      h4: { fontSize: rem(30) },
      h5: { fontSize: rem(20) },
    },
  },
});

const App = () => {
  document.title = "Pond";

  return (
    <MantineProvider theme={theme}>
      <Notifications />
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </MantineProvider>
  );
};

export default App;
