// import { Icon } from '@iconify/react';

import "./Scaffold.scss";

const Scaffold: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="scaffold">
            {/* <div className="topbar"><Icon icon="basil:book-outline" width="32" height="32" /></div> */}
            <div className="content">
                {children}
            </div>
        </div>
    );
};

export default Scaffold;