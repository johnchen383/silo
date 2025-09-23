import "./Scaffold.scss";

const Scaffold: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="scaffold">
      <div className="content">
        {children}
      </div>
    </div>
  );
};

export default Scaffold;