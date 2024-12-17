import copy from "copy-to-clipboard";
import Image from "next/image";
import { InfoIcon } from "lucide-react";
import React, { useRef, useState } from "react";
import { useClientMediaQuery } from "@/features/hooks";
import {
  setCode,
  setCodeEditor,
  setLanguage,
} from "@/redux/reducers/codeEditorReducer";
import { useDispatch } from "react-redux";

export const cn = (...classNames) => classNames.filter(Boolean).join(" ");

const CodeBar = React.memo(({ lang, codeRef, error, plugin = null }) => {
  const [isCopied, setIsCopied] = useState(false);
  const dispatch = useDispatch();

  const capitalizeFirstLetter = (string) => {
    if (!string || typeof string !== "string") {
      return "";
    }
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  return (
    <div className="relative flex items-center  bg-gray-700 dark:bg-[#1C1C1D] rounded-tl-md rounded-tr-md px-4 py-2 text-xs text-gray-200 ">
      <span className="">{capitalizeFirstLetter(lang)}</span>
      {plugin ? (
        <InfoIcon className="ml-auto flex h-4 w-4 gap-2 text-white/50" />
      ) : (
        <>
          <button
            className={cn(
              "ml-auto flex gap-2",
              error ? "h-4 w-4 items-start text-white/50" : ""
            )}
            onClick={async () => {
              const codeString = codeRef.current?.textContent;
              if (codeString) {
                setIsCopied(true);
                copy(codeString);

                setTimeout(() => {
                  setIsCopied(false);
                }, 3000);
              }
            }}
          >
            {isCopied ? (
              <>
                <Image
                  src="/svgs/checkmark.svg"
                  alt="checkmark"
                  width={16}
                  height={16}
                />
              </>
            ) : (
              <>
                <Image src="/svgs/copy.svg" alt="copy" width={16} height={16} />
              </>
            )}
          </button>
          <button
            onClick={() => {
              const codeString = codeRef.current?.textContent;
              if (lang && codeString) {
                dispatch(setLanguage(lang));
                dispatch(setCode(codeString));
                dispatch(setCodeEditor(true));
              }
            }}
            className="ml-2"
          >
            <Image
              src="/svgs/openInBrowser.svg"
              alt="Open in Browser"
              width={18}
              height={18}
              className="block"
            />
          </button>
        </>
      )}
    </div>
  );
});

CodeBar.displayName = "CodeBar";

const CodeBlock = ({
  lang,
  codeChildren,
  classProp = "",
  plugin = null,
  error,
}) => {
  const codeRef = useRef(null);
  const language = plugin || error ? "json" : lang;
  const isMobile = useClientMediaQuery("(max-width: 600px)");

  return (
    <div
      className={`w-full rounded-md bg-gray-900 dark:bg-[#1C1C1D] text-xs text-white/80 ${
        isMobile && "max-w-[320px]"
      }`}
    >
      <CodeBar lang={lang} codeRef={codeRef} plugin={!!plugin} error={error} />
      <div className={cn(classProp, "overflow-y-auto p-4")}>
        <code
          ref={codeRef}
          className={cn(
            plugin || error
              ? "!whitespace-pre-wrap"
              : `hljs language-${language} !whitespace-pre`
          )}
        >
          {codeChildren}
        </code>
      </div>
      <style>
        {`
            code,
              pre {
                font-family: Consolas, Söhne Mono, Monaco, Andale Mono, Ubuntu Mono, monospace !important;
              }
            code[class='language-plaintext'] {
              white-space: pre-line;
            }
            code.hljs,
            code[class*='language-'],
            pre[class*='language-'] {
              word-wrap: normal;
              background: none;
              color: #fff;
              -webkit-hyphens: none;
              hyphens: none;
              font-size: .85rem;
              line-height: 1.5;
              tab-size: 4;
              text-align: left;
              white-space: pre;
              word-break: normal;
              word-spacing: normal;
              font-family: Consolas;
            }
            pre[class*='language-'] {
              border-radius: 0.3em;
              overflow: auto;
              font-family: Consolas;
            }
            :not(pre) > code.hljs,
            :not(pre) > code[class*='language-'] {
              border-radius: 0.3em;
              padding: 0.1em;
              white-space: normal;
              font-family: Consolas;
            }
            .hljs-comment {
              color: hsla(0, 0%, 100%, 0.5);
              font-family: Consolas;
            }
            .hljs-meta {
              color: hsla(0, 0%, 100%, 0.6);
              font-family: Consolas;
            }
            .hljs-built_in,
            .hljs-class .hljs-title {
              color: #e9950c;
              font-family: Consolas;
            }
            .hljs-doctag,
            .hljs-formula,
            .hljs-keyword,
            .hljs-literal {
              color: #2e95d3;
              font-family: Consolas;
            }
            .hljs-addition,
            .hljs-attribute,
            .hljs-meta-string,
            .hljs-regexp,
            .hljs-string {
              color: #00a67d;
              font-family: Consolas;
            }
            .hljs-attr,
            .hljs-number,
            .hljs-selector-attr,
            .hljs-selector-class,
            .hljs-selector-pseudo,
            .hljs-template-variable,
            .hljs-type,
            .hljs-variable {
              color: #df3079;
              font-family: Consolas;
            }
            .hljs-bullet,
            .hljs-link,
            .hljs-selector-id,
            .hljs-symbol,
            .hljs-title {
              color: #f22c3d;
              font-family: Consolas;
            }
        `}
      </style>
    </div>
  );
};

export default CodeBlock;
