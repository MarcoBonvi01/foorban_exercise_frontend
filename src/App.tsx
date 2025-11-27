import { Routes, Route } from "react-router-dom";
import { CheckName } from "./pages/CheckName";
import { Home } from "./pages/Home";
import { QueryClient, QueryClientProvider } from "react-query";
import { CheckForm } from "./pages/chekForm/CheckForm";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import { Layout } from "./navigator/navigator";
import { NotFound } from "./navigator/404";

const queryClient = new QueryClient({});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="it">
        <Routes>
          <Route
            path="/"
            element={
              <Layout
                element={[
                  { label: "Home", path: "/" },
                  { label: "Check Name", path: "/check-name" },
                  { label: "Chekck Form", path: "/check-form" },
                ]}
              />
            }
          >
            <Route index element={<Home />} />
            <Route path="check-name" element={<CheckName />} />
            <Route path="check-form" element={<CheckForm />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </LocalizationProvider>
    </QueryClientProvider>
  );
}
