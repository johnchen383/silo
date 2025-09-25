import { useAuth } from "../providers/auth_provider";
import "./Scaffold.scss";
import Topbar from "./Topbar";

const Scaffold: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const {user} = useAuth();

    return (
        <div className="scaffold">
            {user ? <Topbar /> : <></>}
            <div className="content">
                {children}
            </div>
        </div>
    );
};

export default Scaffold;