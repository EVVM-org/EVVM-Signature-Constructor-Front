import React from "react";

export const TokenAddressInfo: React.FC = () => {
  const [showTooltip, setShowTooltip] = React.useState(false);
  const hideTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleShow = () => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    setShowTooltip(true);
  };
  const handleHide = () => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => setShowTooltip(false), 2000);
  };

  React.useEffect(() => {
    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, []);

  return (
    <div style={{ position: "relative", display: "inline-block", marginBottom: "1rem" }}>
      <span
        style={{
          textDecoration: "underline dotted",
          cursor: "pointer",
          color: "#0070f3",
          fontWeight: 500,
        }}
        tabIndex={0}
        onMouseEnter={handleShow}
        onFocus={handleShow}
        onMouseLeave={handleHide}
        onBlur={handleHide}
      >
        Most common token addresses
      </span>
      {showTooltip && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            top: "1.5rem",
            background: "#222",
            color: "#fff",
            padding: "0.75rem 1.25rem",
            borderRadius: 8,
            fontSize: 14,
            zIndex: 10,
            minWidth: 260,
            boxShadow: "0 2px 8px 0 rgba(0,0,0,0.12)",
            whiteSpace: "pre-line",
          }}
          role="tooltip"
        >
          <div>
            <strong>ETH</strong> address:
            <br />
            0x0000000000000000000000000000000000000000
          </div>
          <div style={{ marginTop: 8 }}>
            <strong>MATE</strong> address:
            <br />
            0x0000000000000000000000000000000000000001
          </div>
        </div>
      )}
    </div>
  );
};
