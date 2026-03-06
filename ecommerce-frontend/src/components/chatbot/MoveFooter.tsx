import "./MoveFooter.css";
import type { Dispatch, SetStateAction } from "react";

type MoveFooterProps = {
  isTextboxTop: boolean;
  setIsTextboxTop: Dispatch<SetStateAction<boolean>>;
}

function MoveFooter({ isTextboxTop, setIsTextboxTop }: MoveFooterProps) {

  function handleClickFooter() {
    setIsTextboxTop((prev: boolean) => !prev);
  }

  return (
    <div className="move-textbox-footer" onClick={() => handleClickFooter()}>
      {isTextboxTop ? "Move textbox to bottom" : "Move textbox to top"}
    </div>
  );
}

export default MoveFooter;
