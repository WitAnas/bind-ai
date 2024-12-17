import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCode } from "@/redux/reducers/codeEditorReducer";
import Editor, { useMonaco } from "@monaco-editor/react";

const CanvasTabContent = ({ currentTab }) => {
  const darkMode = useSelector((state) => state.theme.darkMode);
  const { code, language } = useSelector((state) => state.code);
  const dispatch = useDispatch();
  const monaco = useMonaco();
  const [themeDefined, setThemeDefined] = useState(false);

  const handleCodeChange = (newCode) => {
    dispatch(setCode(newCode));
  };

  useEffect(() => {
    if (monaco) {
      monaco.editor.defineTheme("dark-custom", {
        base: "vs-dark",
        inherit: true,
        rules: [{ background: "#0F0F10" }],
        colors: {
          "editor.background": "#0F0F10",
        },
      });
      setThemeDefined(true);
    }
  }, [monaco]);

  return (
    <div className="p-3 dark:text-white font-[400] text-primary h-[350px]">
      {currentTab === "HOME" && <div>Home Content</div>}
      {currentTab === "CODE" && (
        <div className="h-full">
          {themeDefined && (
            <Editor
              height="100%"
              width="100%"
              language={language ? language : "javascript"}
              theme={darkMode ? "dark-custom" : "vs-light"}
              className="max-h-full dark:bg-darkCanvas"
              value={code}
              onChange={handleCodeChange}
              options={{
                selectOnLineNumbers: true,
                roundedSelection: false,
                readOnly: false,
                cursorStyle: "line",
                automaticLayout: true,
                wordWrap: "on",
                fontSize: 14,
                minimap: { enabled: false },
                lineNumbersMinChars: 3,
                scrollBeyondLastLine: false,
                scrollbar: {
                  verticalScrollbarSize: 10,
                  horizontalScrollbarSize: 10,
                },
                overviewRulerBorder: false,
                quickSuggestions: true,
                parameterHints: true,
                suggestOnTriggerCharacters: true,
                acceptSuggestionOnEnter: "on",
              }}
            />
          )}
        </div>
      )}
      {currentTab === "STDIN" && <div>STDIN Content</div>}
      {currentTab === "SYSTEM PARAMS" && <div>System Params Content</div>}
    </div>
  );
};

export default CanvasTabContent;
