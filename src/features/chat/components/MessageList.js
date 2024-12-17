import React, { memo, useEffect, useRef, useState } from "react";
import Image from "next/image";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import Markdown from "./Markdown";
import Icon from "@/components/common/Icon";
import { useDispatch, useSelector } from "react-redux";
import { handleEditorOpen, isCodePartPresent } from "@/utils/chat";
import copy from "copy-to-clipboard";

const MessageList = memo(({ botId, history, status, botName }) => {
  const [isCopied, setIsCopied] = useState(null);
  const darkMode = useSelector((state) => state.theme.darkMode);
  const dispatch = useDispatch();

  const bottomEl = useRef(null);

  const scrollToBottom = () => {
    const resizeObserver = new ResizeObserver(() => {
      bottomEl?.current?.scrollIntoView({ behavior: "auto" });
    });

    const scrollableElement = bottomEl.current?.parentElement;
    if (scrollableElement) {
      resizeObserver.observe(scrollableElement);
    }

    return () => {
      if (scrollableElement) {
        resizeObserver.unobserve(scrollableElement);
      }
    };
  };

  useEffect(() => {
    setTimeout(() => {
      scrollToBottom();
    }, 50);
  }, [botId]);
  return (
    <div className="flex flex-col">
      {history.map((item, index) => (
        <div key={index} className="break-words">
          {item.type === "human" ? (
            <div className="msg rounded-lg my-2">
              <div className="flex gap-2 items-center text-sm">
                <div className="bg-primary rounded-full w-7 h-7 flex justify-center items-center">
                  <Image
                    src="/images/person.png"
                    alt=""
                    width={14}
                    height={14}
                  />
                </div>
                <h6 className="text-primary font-[Inter,sans-serif] font-[600] dark:text-darkPrimary">
                  You
                </h6>
              </div>
              <p className="mt-2 text-[15px] font-[400] text-primary font-[Inter,sans-serif] dark:text-white">
                {item.content}
              </p>
            </div>
          ) : (
            <div className="pb-6 pt-2 rounded-lg my-2">
              <div className="flex gap-2 items-center text-sm">
                <Image
                  src={`/images/${darkMode ? "darkBindGpt" : "bindGpt"}.png`}
                  alt=""
                  width={23}
                  height={23}
                />
                <h6 className="text-primary font-[600] font-[Inter,sans-serif] dark:text-darkPrimary">
                  {botName}
                </h6>
              </div>
              <p className="mt-2 text-[15px] font-[400] text-primary font-[Inter,sans-serif] dark:text-white">
                {status === 1 && item.type === "loading" && !item?.content ? (
                  <LoadingSkeleton key={index} />
                ) : (
                  <Markdown key={item?.content} markdownText={item?.content} />
                )}
              </p>

              {item.type !== "loading" && item?.content && (
                <div
                  className={`flex items-center ${
                    isCodePartPresent(item?.content)
                      ? "justify-end"
                      : "justify-between"
                  } mt-4`}
                >
                  {!isCodePartPresent(item?.content) && (
                    <div className="flex items-center cursor-pointer gap-1">
                      <Icon
                        type="open-editor"
                        fill={darkMode && "#F2F3F4"}
                        className="block ml-[1px]"
                      />
                      <p
                        className="text-secondary dark:text-[#F2F3F4] text-sm font-medium"
                        onClick={() => {
                          handleEditorOpen(item?.content, dispatch);
                        }}
                      >
                        {isCodePartPresent(item?.content)
                          ? "Open in code editor"
                          : "Open in Editor"}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-center gap-3 mr-4">
                    <div
                      className="cursor-pointer"
                      onClick={() => {
                        const content = item?.content;
                        if (content) {
                          setIsCopied(index);
                          copy(content);
                          setTimeout(() => {
                            setIsCopied(null);
                          }, 3000);
                        }
                      }}
                    >
                      {isCopied === index ? (
                        <Image
                          src="/svgs/checkmark.svg"
                          alt="checkmark"
                          width={16}
                          height={16}
                        />
                      ) : (
                        <Image
                          src="/svgs/copy.svg"
                          alt="copy"
                          width={16}
                          height={16}
                        />
                      )}
                    </div>
                    <div className="cursor-pointer">
                      <Image
                        src="/svgs/like.svg"
                        alt="like"
                        width={16}
                        height={16}
                      />
                    </div>
                    <div className="cursor-pointer">
                      <Image
                        src="/svgs/dislike.svg"
                        alt="dislike"
                        width={16}
                        height={16}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
      <div ref={bottomEl} />
    </div>
  );
});

MessageList.displayName = "MessageList";

export default MessageList;
