import { useAuth } from "../providers/auth_provider";
import "./Scaffold.scss";
import Tabbar from "./Tabbar";
import Topbar from "./Topbar";

const Scaffold: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();

    return (
        <div className="scaffold">
            {user ? <Topbar /> : <></>}
            <div className="content">
                {children}
            </div>
            {user ? <Tabbar /> : <></>}
        </div>
    );
};

export default Scaffold;