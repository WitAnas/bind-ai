import React, { useEffect, useMemo, useRef, useState } from "react";

import dynamic from "next/dynamic";
import { useDispatch, useSelector } from "react-redux";
import { setDynamicText } from "@/redux/reducers/codeEditorReducer";
import Icon from "../Icon";
import { showToaster } from "@/redux/reducers/commonReducer";
const JoditEditor = dynamic(() => import("jodit-react"), {
  ssr: false,
});

const CanvasTextEditor = ({ handleDynamicTextChange }) => {
  const [showPopup, setShowPopup] = useState(false);

  const dynamicText = useSelector((state) => state.code.dynamicText);
  const darkMode = useSelector((state) => state.theme.darkMode);

  const dispatch = useDispatch();
  const copyPopupRef = useRef(null);
  const editor = useRef(null);

  const handleClickOutside = (event) => {
    if (copyPopupRef.current && !copyPopupRef.current.contains(event.target)) {
      setShowPopup(false);
    }
  };

  useEffect(() => {
    window.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleCopyClick = () => {
    setShowPopup(!showPopup);
  };

  const handleCopyContent = () => {
    const quillEditor = window.document.querySelector(".jodit-wysiwyg");
    if (quillEditor) {
      const range = document.createRange();
      range.selectNodeContents(quillEditor);

      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);

      document.execCommand("copy");

      selection.removeAllRanges();

      setShowPopup(false);
      dispatch(
        showToaster({
          variant: "success",
          title: "Successfully copied.",
          description: "",
        })
      );
    } else {
      console.error("Quill editor element not found");
    }
  };

  const handleClick = (action) => {
    if (action === "copyContent") {
      handleCopyContent();
    } else {
      console.log("click", action);
    }
  };

  const options = [
    "bold",
    "italic",
    "underline",
    "fontsize",
    "ul",
    "ol",
    "font",
    "image",
    "table",
  ];
  const config = useMemo(
    () => ({
      readonly: false,
      height: "90vh",
      toolbar: true,
      // theme: "default",
      placeholder: "",
      buttons: options,
      buttonsMD: options,
      buttonsSM: options,
      buttonsXS: options,
      statusbar: false,
      sizeLG: 900,
      sizeMD: 700,
      sizeSM: 400,
      toolbarAdaptive: false,
    }),
    []
  );
  return (
    <>
      <div className="relative markdown">
        <JoditEditor
          ref={editor}
          value={handleDynamicTextChange(dynamicText)}
          config={config}
          // onChange={(value) => dispatch(setDynamicText(value))}
          onBlur={(value) => dispatch(setDynamicText(value))}
        />
        <div ref={copyPopupRef}>
          <div
            onClick={handleCopyClick}
            className={`absolute right-2 top-2 rounded-lg header-button bg-white flex items-center justify-center py-2 pl-3 pr-11 dark:bg-darkBotPrimary text-label dark:text-white copy-button`}
          >
            <Icon
              type={"play-arrow"}
              fill={darkMode && "#F2F3F4"}
              className="block mr-2"
            />
            <p className="font-medium text-sm" style={{ whiteSpace: "nowrap" }}>
              Copy
            </p>
          </div>
          {showPopup && (
            <div>
              <div className="absolute right-2 top-12 bg-white shadow-lg rounded-lg py-2 w-48 dark:bg-darkBotPrimary ">
                <h1 className="text-sm font-medium text-primary dark:text-white py-2 px-4">
                  Recommended actions
                </h1>
                {/* <div
                className="flex items-center px-4 py-2 cursor-pointer text-primary text-sm font-normal hover:bg-gray-200 dark:hover:bg-darkSecondary dark:text-white"
                onClick={() => handleClick("save")}
              >
                <Icon
                  type={"save"}
                  // width={12}
                  // height={12}
                  fill={darkMode && "#F2F3F4"}
                  className="mr-2"
                />
                <span>Save</span>
              </div> */}
                <div
                  className="flex items-center px-4 py-2 cursor-pointer text-primary text-sm font-normal hover:bg-gray-200 dark:hover:bg-darkSecondary dark:text-white"
                  onClick={() => handleClick("copyContent")}
                >
                  <Icon
                    type={"copy-content"}
                    width={16}
                    height={16}
                    fill={darkMode && "#F2F3F4"}
                    className="mr-2 mt-1.5"
                  />
                  <span>Copy Content</span>
                </div>
                {/* <div
                className="flex items-center px-4 py-2 cursor-pointer text-primary text-sm font-normal hover:bg-gray-200 dark:hover:bg-darkSecondary dark:text-white"
                onClick={() => handleClick("download")}
              >
                <Icon
                  type={"download"}
                  fill={darkMode && "#F2F3F4"}
                  className="mr-2"
                />
                <span>Download</span>
              </div> */}
              </div>
            </div>
          )}
        </div>
      </div>
      <style>{`
        .markdown tr {
          border-bottom: 1px solid rgb(237, 238, 241);
        }

        .markdown th {
          padding: 10px;
          background-color: #e4e5ea;
          text-align: left;
          color: #1c274c;
          font-size: 14px;
          font-family: "Inter", sans-serif;
          font-weight: 500;
          border: none;
        }

        .markdown td {
          padding: 10px;
          text-align: left;
          color: #1c274c;
          font-size: 14px;
          font-family: "Inter", sans-serif;
          font-weight: 400;
          border: none;
        }

        .markdown ol {
          counter-reset: list-number;
          display: flex;
          flex-direction: column;
          list-style-type: none;
          padding-left: 0;
        }
        .markdown ol > li {
          counter-increment: list-number;
          display: block;
          margin-bottom: 0;
          margin-top: 0;
          min-height: 28px;
          position: relative;
          padding-left: 1rem;
        }
        .markdown ol > li:before {
          --tw-translate-x: -100%;
          --tw-numeric-spacing: tabular-nums;
          --tw-text-opacity: 1;
          color: rgba(142, 142, 160, var(--tw-text-opacity));
          content: counters(list-number, ".") ".";
          font-variant-numeric: var(--tw-ordinal) var(--tw-slashed-zero)
            var(--tw-numeric-figure) var(--tw-numeric-spacing)
            var(--tw-numeric-fraction);
          padding-right: 0.5rem;
          position: absolute;
          -webkit-transform: translate(
              var(--tw-translate-x),
              var(--tw-translate-y)
            )
            rotate(var(--tw-rotate)) skewX(var(--tw-skew-x))
            skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x))
            scaleY(var(--tw-scale-y));
          transform: translate(var(--tw-translate-x), var(--tw-translate-y))
            rotate(var(--tw-rotate)) skewX(var(--tw-skew-x))
            skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x))
            scaleY(var(--tw-scale-y));
        }
        .markdown ul li {
          display: block;
          margin: 0;
          position: relative;
        }
        .markdown ul li:before {
          content: "•";
          font-size: 0.875rem;
          line-height: 1.25rem;
          margin-left: -1rem;
          position: absolute;
        }

        .markdown {
          max-width: none;
        }
        .markdown h1,
        .markdown h2 {
          font-weight: 600;
        }
        .markdown h2 {
          margin-bottom: 1rem;
          margin-top: 2rem;
        }
        .markdown h3 {
          font-weight: 600;
        }
        .markdown h3,
        .markdown h4 {
          margin-bottom: 0.5rem;
          margin-top: 1rem;
        }
        .markdown h4 {
          font-weight: 400;
        }
        .markdown h5 {
          font-weight: 600;
        }
        .markdown blockquote {
          --tw-border-opacity: 1;
          border-color: rgba(142, 142, 160, var(--tw-border-opacity));
          border-left-width: 2px;
          line-height: 1rem;
          padding-left: 1rem;
        }
        .markdown ol,
        .markdown ul {
          display: flex;
          flex-direction: column;
          padding-left: 1rem;
        }
        .markdown ol li,
        .markdown ol li > p,
        .markdown ol ol,
        .markdown ol ul,
        .markdown ul li,
        .markdown ul li > p,
        .markdown ul ol,
        .markdown ul ul {
          margin: 0;
        }

        .dark .markdown td {
          color: #ffffff;
        }

        a {
          text-decoration-line: underline;
          color: #2964aa;
          text-underline-offset: 2px;
        }

        .jodit-toolbar__box {
          background-color: ${darkMode ? "#0F0F10" : "#F5F5FF"} !important;
          height: 50px;
          display: flex;
          align-items: center;
          border-bottom: 0px !important;
          padding-left: 10px;
        }

        .dark .jodit-toolbar-editor-collection:after {
          background-color: #0f0f10 !important;
        }

        .jodit-container:not(.jodit_inline) .jodit-wysiwyg {
          padding-left: 20px;
          padding-right: 20px;
          margin-top: 10px;
          margin-bottom: 10px;
        }

        .dark .jodit-workplace {
          background-color: #17181a !important;
        }

        .jodit-wysiwyg {
          color: ${darkMode && "white "};
          font-size: 15px;
        }

        .jodit-wysiwyg::-webkit-scrollbar {
          width: 8px;
        }

        .jodit-wysiwyg::-webkit-scrollbar-track {
          background: transparen;
        }

        .jodit-wysiwyg::-webkit-scrollbar-thumb {
          background: #e4e5ea;
          border-radius: 4px;
        }

        .jodit-wysiwyg::-webkit-scrollbar-thumb:hover {
          background: #e4e5ea;
        }

        .jodit-container {
          border: 0px !important;
        }

        .dark .jodit-icon,
        .dark .jodit-toolbar-button__trigger svg {
          fill: white;
        }

        .jodit-toolbar-button_addcolumn .jodit-toolbar-button__button,
        .jodit-toolbar-button_addrow .jodit-toolbar-button__button,
        .jodit-toolbar-button_delete .jodit-toolbar-button__button {
          display: none !important;
        }
      `}</style>
    </>
  );
};

export default CanvasTextEditor;
