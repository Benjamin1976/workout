type EmojiPropTypes = {
  symbol: string;
  label?: string;
  // style?: React.HTMLAttributes<HTMLSpanElement>;
};

const Emoji = ({ symbol, label }: EmojiPropTypes) => (
  <span
    className="emoji p-0 m-0 g-0"
    style={{ fontSize: "0.9em" }}
    // style={style ? style : { fontSize: "1.5em" }}
    role="img"
    aria-label={label ? label : ""}
    aria-hidden={label ? "false" : "true"}
  >
    {symbol}
  </span>
);

export default Emoji;
