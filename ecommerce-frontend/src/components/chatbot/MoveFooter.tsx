import { useChatStore } from "../../store/useChatStore";
import "./MoveFooter.css";

function MoveFooter() {
  const isTextboxTop = useChatStore((s) => s.isTextboxTop);
  const toggleTextboxPosition = useChatStore((s) => s.toggleTextboxPosition);

  return (
    <div className="move-textbox-footer" onClick={toggleTextboxPosition}>
      {isTextboxTop ? "Move textbox to bottom" : "Move textbox to top"}
    </div>
  );
}

export default MoveFooter;
