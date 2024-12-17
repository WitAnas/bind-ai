import React, { useEffect } from "react";
import { useSelector } from "react-redux";

const CanvasCodeOutput = () => {
  const { output, loading, error } = useSelector((state) => state.code);

  const isURL = (str) => {
    const pattern = new RegExp(
      "^(https?:\\/\\/)" +
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|" +
        "((\\d{1,3}\\.){3}\\d{1,3}))" +
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" +
        "(\\?[;&a-z\\d%_.~+=-]*)?" +
        "(\\#[-a-z\\d_]*)?$",
      "i"
    );
    return !!pattern.test(str);
  };

  const renderOutput = (text) => {
    if (isURL(text)) {
      return (
        <a href={text} target="_blank" className="text-blue-500">
          {text}
        </a>
      );
    }
    return <pre>{text}</pre>;
  };

  return (
    <div className="dark:text-white text-primary">
      <h2 className="text-[15px] dark:font-normal dark:text-white p-3 font-[600] text-primary">
        OUTPUT
      </h2>
      <div
        className="border-b-2 dark:border-darkPrimary border-lightBorder"
        style={{
          width: "100%",
          backgroundColor: "#3A4363",
        }}
      ></div>
      <div className="m-3 text-[15px] font-normal max-h-[110px] overflow-auto custom-scrollbar">
        {loading ? (
          <div className="loading">Running...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <>
            {output.status && (
              <div className="text-red-500">{output?.error}</div>
            )}
            {output.stdout && renderOutput(output.stdout)}
            {output.stderr && (
              <div className="text-red-500">{output.stderr}</div>
            )}
            {output.exception && (
              <div className="text-red-500">
                <strong>Exception:</strong>
                <pre>{output.exception}</pre>
              </div>
            )}
          </>
        )}
      </div>
      <style>{`
        .loading {
          color: #34d399; 
          font-family: monospace;
          font-size: 16px;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background-color: transparent; 
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #E4E5EA;
          border-radius: 3px solid;
          border: 6px
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color:#E4E5EA; 
        }
      `}</style>
    </div>
  );
};

export default CanvasCodeOutput;
