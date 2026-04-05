import { createPortal } from "react-dom";
import React, { useEffect } from "react";

function Modal({ open, onClose, title, children, width = 520 }) {

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (open) window.addEventListener("keydown", handler);

    return () =>
      window.removeEventListener("keydown", handler);

  }, [open, onClose]);

  if (!open) return null;

  return createPortal(

<div
className="modal-overlay"
onClick={onClose}
>

<div
className="modal-box"
style={{ maxWidth: width }}
onClick={(e) => e.stopPropagation()}
>

<div
style={{
display: "flex",
alignItems: "center",
justifyContent: "space-between",
padding: "20px 24px",
borderBottom: "1.5px solid #eeeef8"
}}
>

<div
style={{
fontSize: 17,
fontWeight: 700,
color: "#111827"
}}
>
{title}
</div>

<button
onClick={onClose}
style={{
background: "none",
border: "none",
fontSize: 20,
cursor: "pointer",
color: "#6b7280"
}}
>
×
</button>

</div>

<div style={{ padding: "24px" }}>
{children}
</div>

</div>

</div>,

document.body

);
}

export default Modal;