import React, { useState, useEffect } from "react";
import Image from "next/image";
import RadioButton from "@/components/ui/RadioButton";
import { ModelCategory } from "@/features/chat/constants";
import ModelSelectorContainer from "./ModelSelectorContainer";
import { useDispatch } from "react-redux";
import { hidePopup } from "@/redux/reducers/commonReducer";
import MobileHeader from "../MobileHeader";
import { useClientMediaQuery } from "@/features/hooks";

const ModelCategoryContainer = ({ category, onModelChange }) => {
  const [selectedModel, setSelectedModel] = useState(null);
  const [modelList, setModelList] = useState([]);
  const dispatch = useDispatch();
  const isMobile = useClientMediaQuery("(max-width: 600px)");

  useEffect(() => {
    if (category) {
      setModelList(getModelListByCategory(category?.value));
      handleChange({
        target: { name: category?.name, value: category?.value },
      });
    }
  }, []);

  const handleChange = (event) => {
    setSelectedModel(event.target);
  };

  const getModelListByCategory = (category) => {
    if (category === "all") {
      return ModelCategory.flatMap((item) =>
        item?.botList?.length > 0 ? item.botList : []
      );
    }
    const selectedCategory = ModelCategory.find(
      (item) => item?.value === category
    );
    return selectedCategory?.botList || [];
  };

  const categoryList = ModelCategory;

  return (
    <>
      {isMobile && (
        <>
          <MobileHeader onClick={() => dispatch(hidePopup())} />
          <hr />
        </>
      )}
      {modelList && modelList.length > 0 ? (
        <div className={`cursor-pointer`}>
          <div className="flex items-center justify-between px-4 py-2 md:py-2.5">
            {isMobile && <p className="py-5 font-medium">Select model</p>}
            <div
              className="flex items-center justify-center p-3 rounded-lg text-sm text-gray-800"
              style={{ backgroundColor: "rgb(248, 248, 252)" }}
              onClick={() => setModelList([])}
            >
              {selectedModel?.name ? selectedModel.name : "Pick Models"}
              <Image
                src="/images/selector.png"
                className="ml-1.5"
                alt="Pick Models"
                width={17}
                height={17}
              />
            </div>
            {!isMobile && (
              <Image
                src="/images/cross.png"
                alt="close"
                width={17}
                height={17}
                onClick={() => dispatch(hidePopup())}
              />
            )}
          </div>
          <hr />
          <div className="pl-4 h-3/5 overflow-scroll bg-white md:rounded-lg">
            {modelList.map((model, index) => (
              <div key={index}>
                <ModelSelectorContainer
                  model={model}
                  onModelChange={onModelChange}
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className={`cursor-pointer rounded-2xl pb-14`}>
          <div className="flex items-center justify-between px-6">
            <div className="flex items-center">
              <Image
                src="/images/chevron-left.png"
                className="mr-4"
                alt="back"
                width={7}
                height={12}
                onClick={() => dispatch(hidePopup())}
              />
              <p className="py-5 font-medium">Select type</p>
            </div>
            {!isMobile && (
              <Image
                src="/images/cross.png"
                alt="close"
                width={17}
                height={17}
                onClick={() => dispatch(hidePopup())}
              />
            )}
          </div>
          <hr />
          {categoryList.map((radio, index) => (
            <div
              key={index}
              onClick={() => {
                handleChange({
                  target: { name: radio.label, value: radio.value },
                });
                setModelList(getModelListByCategory(radio.value));
              }}
            >
              <RadioButton
                id={radio.id}
                name={radio.label}
                label={radio.label}
                value={radio.value}
                selectedChecked={
                  selectedModel?.value === radio.value ? true : false
                }
                onChange={handleChange}
              />
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default ModelCategoryContainer;
