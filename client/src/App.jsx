import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import AppRoutes from "./routes/AppRoutes";
import AuthProvider from "./store/AuthProvider";

const queryClient = new QueryClient();

function App() {
  return (
    <>
      <Toaster position="top-right" richColors />
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
