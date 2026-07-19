import { AuthProvider } from "./context/AuthContext";
import { ChatProvider } from "./context/ChatContext";
import AppRoutes from "./routes/AppRoutes";

export default function App() {
    return (
        <AuthProvider>
            <ChatProvider>
                <AppRoutes />
            </ChatProvider>
        </AuthProvider>
    );
}