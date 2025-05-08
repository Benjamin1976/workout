type IconProps = {
  icon: string;
};

const Icon = ({ icon }: IconProps) => {
  return (
    <span
      className="material-symbols-outlined"
      style={{ fontSize: "1.1rem", borderWidth: "0px" }}
      aria-label={icon}
    >
      {icon}
    </span>
  );
};

export default Icon;
