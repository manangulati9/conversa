import chroma from "chroma-js";
export default function Circle({
  letter,
  bgColor,
}: {
  letter: string;
  bgColor: string;
}) {
  const textColor =
    chroma.contrast(bgColor, "white") > 4.5 ? "white" : "#0f1729";

  const circleStyle = {
    backgroundColor: bgColor,
    color: textColor,
    width: "2.75rem",
    height: "2.75rem",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "24px",
    fontWeight: "bold",
  };

  return <div style={circleStyle}>{letter}</div>;
}
