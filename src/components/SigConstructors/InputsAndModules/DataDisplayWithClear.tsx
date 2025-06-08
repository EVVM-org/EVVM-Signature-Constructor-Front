import React from "react";
import { DetailedData } from "@/components/SigConstructors/InputsAndModules/DetailedData";
import styles from "@/components/SigConstructors/SignatureConstructor.module.css";

interface DataDisplayWithClearProps {
  dataToGet: any;
  onClear: () => void;
  marginTop?: string;
}

export const DataDisplayWithClear: React.FC<DataDisplayWithClearProps> = ({
  dataToGet,
  onClear,
  marginTop = "2rem",
}) => {
  if (!dataToGet) return null;

  return (
    <div style={{ marginTop }}>
      <DetailedData dataToGet={dataToGet} />

      {/* Action buttons */}
      <div style={{ marginTop: "1rem" }}>
        <button
          className={styles.clearButton}
          onClick={onClear}
        >
          Clear
        </button>
      </div>
    </div>
  );
};