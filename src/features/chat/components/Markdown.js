import React, { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";
import remarkMath from "remark-math";
import supersub from "remark-supersub";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import remarkRehype from "remark-rehype";
import CodeBlock from "./CodeBlock";

const table = React.memo(({ children }) => {
  return (
    <div className="overflow-auto rounded-lg my-[20px] border-collapse border-[1px] border-[#E4E5EA] border-solid custom-table">
      <table className="w-full"> {children}</table>
    </div>
  );
});

const p = React.memo(({ children }) => {
  return <p className="mb-1 mt-2 whitespace-pre-wrap">{children}</p>;
});

p.displayName = "MemoizedParagraph";
table.displayName = "CustomTable";

const rehypePlugins = [
  [rehypeKatex, { output: "mathml" }],
  [
    rehypeHighlight,
    {
      detect: true,
      ignoreMissing: true,
      subset: [
        "python",
        "javascript",
        "java",
        "go",
        "bash",
        "c",
        "cpp",
        "csharp",
        "css",
        "diff",
        "graphql",
        "json",
        "kotlin",
        "less",
        "lua",
        "makefile",
        "markdown",
        "objectivec",
        "perl",
        "php",
        "php-template",
        "plaintext",
        "python-repl",
        "r",
        "ruby",
        "rust",
        "scss",
        "shell",
        "sql",
        "swift",
        "typescript",
        "vbnet",
        "wasm",
        "xml",
        "yaml",
      ],
    },
  ],
  [rehypeRaw],
];

const remarkPlugins = [
  supersub,
  remarkGfm,
  [remarkMath, { singleDollarTextMath: true }],
  [remarkRehype, { allowDangerousHtml: true }],
];

const Markdown = React.memo(({ markdownText }) => {
  const code = React.memo(({ inline, className, children }) => {
    const match = /language-(\w+)/.exec(className || "");
    const lang = match && match[1];

    if (!match) {
      return <code className={className}>{children}</code>;
    } else {
      return (
        <CodeBlock
          lang={lang || "text"}
          codeChildren={children}
        />
      );
    }
  });

  code.displayName = "Code";

  const components = useMemo(
    () => ({
      code,
      p,
      table,
    }),
    []
  );

  return (
    <>
      <div className="markdown">
        <ReactMarkdown
          remarkPlugins={remarkPlugins}
          rehypePlugins={rehypePlugins}
          components={components}
        >
          {markdownText}
        </ReactMarkdown>
      </div>
      <style>{`
       .markdown tr {
         border-bottom: 1px solid rgb(237, 238, 241);
       }
       
       .markdown th {
         padding: 10px; 
         background-color: #E4E5EA; 
         text-align: left; 
         color: #1c274c; 
         font-size: 14px; 
         font-family: 'Inter', sans-serif; 
         font-weight: 500; 
         border: none;
       }
       
       .markdown td {
         padding: 10px; 
         text-align: left;
         color: #1c274c; 
         font-size: 14px; 
         font-family: 'Inter', sans-serif; 
         font-weight: 400; 
         border: none;
       }
       
       .markdown ol {
        counter-reset:list-number;
        display:flex;
        flex-direction:column;
        list-style-type:none;
        padding-left:0
      }
      .markdown ol>li {
        counter-increment:list-number;
        display:block;
        margin-bottom:0;
        margin-top:0;
        min-height:28px;
        position:relative;
        padding-left:1rem
      }
      .markdown ol>li:before {
        --tw-translate-x:-100%;
        --tw-numeric-spacing:tabular-nums;
        --tw-text-opacity:1;
        color:rgba(142,142,160,var(--tw-text-opacity));
        content:counters(list-number,".") ".";
        font-variant-numeric:var(--tw-ordinal) var(--tw-slashed-zero) var(--tw-numeric-figure) var(--tw-numeric-spacing) var(--tw-numeric-fraction);
        padding-right:.5rem;
        position:absolute;
        -webkit-transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
        transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))
      }
      .markdown ul li {
       display:block;
       margin:0;
       position:relative
      }
      .markdown ul li:before {
       content:"•";
       font-size:.875rem;
       line-height:1.25rem;
       margin-left:-1rem;
       position:absolute
      }
      
      .markdown {
       max-width:none
      }
      .markdown h1,
      .markdown h2 {
       font-weight:600
      }
      .markdown h2 {
       margin-bottom:1rem;
       margin-top:2rem
      }
      .markdown h3 {
       font-weight:600
      }
      .markdown h3,
      .markdown h4 {
       margin-bottom:.5rem;
       margin-top:1rem
      }
      .markdown h4 {
       font-weight:400
      }
      .markdown h5 {
       font-weight:600
      }
      .markdown blockquote {
       --tw-border-opacity:1;
       border-color:rgba(142,142,160,var(--tw-border-opacity));
       border-left-width:2px;
       line-height:1rem;
       padding-left:1rem
      }
      .markdown ol,
      .markdown ul {
       display:flex;
       flex-direction:column;
       padding-left:1rem
      }
      .markdown ol li,
      .markdown ol li>p,
      .markdown ol ol,
      .markdown ol ul,
      .markdown ul li,
      .markdown ul li>p,
      .markdown ul ol,
      .markdown ul ul {
       margin:0
      }

      .dark td{
        color:#ffffff
       }

      .markdown a {
        text-decoration-line:underline;
        color: #2964aa; 
        text-underline-offset:2px
       }

       .custom-table::-webkit-scrollbar {
        height: 5px;
        // width: 0.5rem;
      }

      .custom-table::-webkit-scrollbar-thumb {
        background-color: rgba(0, 0, 0, 0.1);
        border-radius: 9999px;
      }

     .custom-table ::-webkit-scrollbar-track {
        background-color: transparent;
        border-radius: 9999px;
      }

      `}</style>
    </>
  );
});

Markdown.displayName = "MemoizedMarkdown";

export default Markdown;
