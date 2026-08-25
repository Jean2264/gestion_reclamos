import "./BtnClose.css";

function BtnClose({onClick})
{
    return(
        <button
        className="btn-close"
        onClick={onClick}
        >
            X
        </button>
    )
}
export default BtnClose;