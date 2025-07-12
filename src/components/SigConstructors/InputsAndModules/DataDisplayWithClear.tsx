import React from "react";
import { DetailedData } from "@/components/SigConstructors/InputsAndModules/DetailedData";
import styles from "@/components/SigConstructors/SignatureConstructor.module.css";

interface DataDisplayWithClearProps {
  dataToGet: any;
  onClear: () => void;
  marginTop?: string;
  executeAction?: () => void;
}

export const DataDisplayWithClear: React.FC<DataDisplayWithClearProps> = ({
  dataToGet,
  onClear,
  marginTop = "2rem",
  executeAction,
}) => {
  if (!dataToGet) return null;

  return (
    <div style={{ marginTop }}>
      <DetailedData dataToGet={dataToGet} />

      {/* Action buttons */}
      <div style={{ marginTop: "1rem" }}>
        <button className={styles.clearButton} onClick={onClear}>
          Clear
        </button>

        {executeAction && (
          <button
            style={{
              backgroundColor: "#4c5cafff",
              color: "white",
              padding: "0.5rem",
              margin: "0.5rem",
              borderRadius: "5px",
              border: "none",
              cursor: "pointer",
            }}
            onClick={executeAction}
          >
            Execute
          </button>
        )}
      </div>
    </div>
  );
};
