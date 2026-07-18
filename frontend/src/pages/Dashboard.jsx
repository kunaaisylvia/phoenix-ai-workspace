import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import ChatArea from "../components/ChatArea";
import PromptInput from "../components/PromptInput";

export default function Dashboard() {
    return (
        <div className="h-screen bg-[#070B1A] text-white flex">

            <Sidebar />

            <div className="flex-1 flex flex-col">

                <Topbar />

                <ChatArea />

                <PromptInput />

            </div>

        </div>
    );
}