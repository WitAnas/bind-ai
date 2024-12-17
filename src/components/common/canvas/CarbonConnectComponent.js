"use client";
import React from "react";
import { CarbonConnect } from "carbon-connect";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setOpen } from "@/redux/reducers/codeEditorReducer";
import { createUserCustomBot } from "@/utils";
import { fetchUserBots } from "@/redux/reducers/botReducer";

const CarbonConnectComponent = () => {
  const open = useSelector((state) => state.code.open);
  const bots = useSelector((state) => state.bot.bots);
  const currentUser = useSelector((state) => state.auth.currentUser);
  const darkMode = useSelector((state) => state.theme.darkMode);

  const dispatch = useDispatch();

  if (!currentUser?.uid) {
    return null;
  }

  const tokenFetcher = async () => {
    const response = await axios.post("/api/token", {
      customer_id: currentUser?.uid,
    });

    if (response?.data?.success == true) {
      // console.log("response", response?.data?.response);
      // {
      //   access_token: response?.data?.response;
      // }
      return response?.data?.response;
    }
  };

  const handleSuccess = async (data) => {
    if (!bots.some((bot) => bot?.bname === "Custom Bot")) {
      const botResponse = await createUserCustomBot(
        currentUser?.uid,
        "custom",
        "Custom Bot"
      );
      if (botResponse) {
        dispatch(fetchUserBots(currentUser?.uid));
      }
    }
  };

  return (
    <div>
      <CarbonConnect
        orgName="Bind ai"
        className={"carbon"}
        brandIcon={`/images/bind-icon.png`}
        tokenFetcher={tokenFetcher}
        embeddingModel="OPENAI_ADA_LARGE_3072"
        tags={{
          tag1: "tag1_value",
          tag2: "tag2_value",
          tag3: "tag3_value",
        }}
        maxFileSize={10000000}
        theme={`${darkMode ? "dark" : "light"}`}
        enabledIntegrations={[
          {
            id: "LOCAL_FILES",
            maxFileSize: 20000000,
            allowMultipleFiles: true,
            chunkSize: 1500,
            overlapSize: 50,
            maxFilesCount: 5,
            // allowedFileTypes: [
            //   {
            //     extension: "csv",
            //     chunkSize: 1500,
            //     overlapSize: 50,
            //   },
            //   {
            //     extension: "txt",
            //     chunkSize: 1500,
            //     overlapSize: 50,
            //   },
            //   {
            //     extension: "pdf",
            //     chunkSize: 1500,
            //     overlapSize: 50,
            //     // useOcr: true,
            //   },
            // ],
          },
          {
            id: "GOOGLE_DRIVE",
            chunkSize: 1500,
            overlapSize: 20,
          },
          {
            id: "GITHUB",
            chunkSize: 1500,
            overlapSize: 20,
            skipEmbeddingGeneration: false,
            generateSparseVectors: false,
            prependFilenameToChunks: false,
            syncFilesOnConnection: false,
            showFilesTab: true,
            syncSourceItems: false,
          },
        ]}
        onSuccess={handleSuccess}
        onError={(error) => console.log("Data on Error: ", error)}
        allowMultipleFiles={true}
        open={open}
        setOpen={(value) => dispatch(setOpen(value))}
        chunkSize={1500}
        overlapSize={20}
      />
      <style>
        {`
          .dark .cc-line-clamp-2 {
            color: #ffffff;
          }

          .dark tbody tr td p {
            color: #ffffff;
          }
        `}
      </style>
    </div>
  );
};

export default CarbonConnectComponent;
