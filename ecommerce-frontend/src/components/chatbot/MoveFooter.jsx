import "./MoveFooter.css";

function MoveFooter({ isTextboxTop, setIsTextboxTop }) {
  function handleClickFooter() {
    setIsTextboxTop((prev) => !prev);
  }

  return (
    <div className="move-textbox-footer" onClick={handleClickFooter}>
      {isTextboxTop ? "Move textbox to bottom" : "Move textbox to top"}
    </div>
  );
}

export default MoveFooter;
