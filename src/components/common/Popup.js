import Button from "../ui/Button";
import { useDispatch } from "react-redux";

const Popup = ({
  messageData,
  open,
  classAdditions,
  contentDivStyle,
  closePopup,
}) => {
  const { title, description, content, btnArray } = messageData;

  return (
    <>
      {open && (
        <div
          role="presentation"
          className={`popup-wrapper justify-center items-center cursor-pointer flex fixed inset-0 z-50 outline-none focus:outline-none ${
            classAdditions && classAdditions.background
          }`}
          onClick={() => closePopup && closePopup()}
        >
          <div
            role="presentation"
            className={`${
              classAdditions ? classAdditions.popupContainer : "w-11/12"
            } ${
              classAdditions.additional ? classAdditions.additional : "relative"
            } popup-container z-60`}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <div
              className={`${
                classAdditions && classAdditions.popup
              } border-0 h-full w-11/12 shadow-lg relative flex flex-col mx-auto bg-white outline-none popup`}
            >
              <div className="flex justify-between">
                {/* <Icon
                  type={head ? "cross-icon-white" : "cross-icon"}
                  className={"mt-4 mr-4 cursor-pointer"}
                  onClick={() => {
                    dispatch<any>(hidePopup());
                  }}
                /> */}
              </div>
              <div
                className={`relative ${
                  classAdditions && classAdditions.contentDivStyle
                } flex-auto break-words ${
                  classAdditions && classAdditions.contentDiv
                }`}
              >
                {title && (
                  <p
                    className={`mb-8 text-primary text-lg font-bold ${
                      classAdditions && classAdditions.title
                    }`}
                  >
                    {title}
                  </p>
                )}

                {typeof description === "string" ? (
                  <p
                    className={`text-sm ${
                      classAdditions && classAdditions.description
                    } mt-4 text-center break-words`}
                  >
                    {description}
                  </p>
                ) : (
                  description
                )}
              </div>

              <div className="grid sm:grid-cols-1 gap-4 lg:grid-cols-2 md:grid-cols-2 mx-6">
                {content &&
                  content.map((data, index) => {
                    return (
                      <div className="flex-child" key={index.toString()}>
                        <span className="flex text-primary text-sm">
                          {data.label}
                        </span>
                        <span className="flex text-primary text-sm font-bold break-words">
                          {data.value}
                        </span>
                      </div>
                    );
                  })}
              </div>

              {btnArray?.length > 0 && (
                <div
                  className={`flex items-center p-6 ${
                    content && content.length > 0
                      ? "justify-center"
                      : "justify-evenly"
                  }  ${classAdditions && classAdditions.buttonContainer}`}
                >
                  {btnArray.map((value, index) => {
                    return (
                      <PopupButton
                        value={value}
                        closePopup={closePopup}
                        key={index.toString()}
                        buttonClass={classAdditions && classAdditions.button}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      <style jsx>{`
        .popup-wrapper {
          background-color: rgba(0, 0, 0, 0.3);
        }
        .popup-container {
          max-height: 700px;
          overflow-y: scroll;
          -ms-overflow-style: none; /* Internet Explorer 10+ */
          scrollbar-width: none; /* Firefox */
        }
        .popup-container::-webkit-scrollbar {
          display: none;
        }
        .popup {
          border-radius: 10px;
        }
        .flex-child {
          flex: 1;
        }
        .flex-child:first-child {
          margin-right: 20px;
        }
        .device-icon {
          width: 70px;
          height: 70px;
          border-radius: 50%;
        }
        @media screen and (max-width: 768px) {
          .popup-container {
            max-height: 100vh;
          }
        }
      `}</style>
    </>
  );
};

export const PopupButton = ({ value, buttonClass = "", closePopup }) => {
  const handleClick = () => {
    const onClick = value.onClick || closePopup;
    onClick && onClick();
  };

  return (
    <div className={`${buttonClass}`}>
      <Button
        className={value.className}
        type={value.type}
        onClick={handleClick}
        disabled={value.disabled}
        size={value.size}
        variant={value.variant}
        loading={value.loading}
      >
        {value.children}
      </Button>
    </div>
  );
};

export default Popup;
