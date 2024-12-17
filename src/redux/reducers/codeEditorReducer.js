import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { updateRunCount } from "./userSubscriptionReducer";

const initialState = {
  code: "",
  dynamicText: "",
  language: "",
  output: {},
  loading: false,
  error: null,
  open: false,
  codeEditor: false,
  documentEditor: false,
  gptAgent: false,
  canvasOpen: false,
  isCreatingAgent: false,
};

export const executeCode = createAsyncThunk(
  "code/executeCode",
  async ({ code, language, stdin, userId }, { dispatch, rejectWithValue }) => {
    try {
      const lang = language
        ? language == "sql"
          ? "mysql"
          : language
        : "javascript";

      const response = await axios.post(
        process.env.NEXT_PUBLIC_ONE_COMPILER_ENDPOINT,
        {
          language: lang,
          stdin,
          files: [
            {
              name: `index.${
                lang === "python" ? "py" : lang === "javascript" ? "js" : lang
              }`,
              content: code,
            },
          ],
          ...(language == "html" && { flags: ["persist"] }),
        },
        {
          headers: {
            "X-RapidAPI-Host": process.env.NEXT_PUBLIC_RAPID_API_HOST,
            "X-RapidAPI-Key": process.env.NEXT_PUBLIC_RAPID_API_KEY,
            "Content-Type": "application/json",
          },
        }
      );

      const executeOutput = response?.data;

      try {
        let formData = new FormData();
        formData.append("user_id", userId);
        const runResponse = await axios.post(
          process.env.NEXT_PUBLIC_NEW_BACKEND_URL + "/run",
          formData
        );
        const runCount = runResponse?.data?.run;

        dispatch(updateRunCount(runCount));
      } catch (error) {
        console.log("Error updating run count", error);
      }

      return executeOutput;
    } catch (error) {
      console.error("Error executing code or running the code:", error);
      return rejectWithValue("Error executing code or running the code");
    }
  }
);

export const codeEditorReducer = createSlice({
  name: "codeEditor",
  initialState,
  reducers: {
    setCode: (state, action) => {
      state.code = action.payload;
    },
    setDynamicText: (state, action) => {
      state.dynamicText = action.payload;
    },
    clearCode: (state) => {
      state.code = "";
    },

    setLanguage: (state, action) => {
      state.language = action.payload == "jsx" ? "javascript" : action.payload;
    },
    clearLanguage: (state) => {
      state.language = "";
    },
    setOutput: (state, action) => {
      state.output = action.payload;
    },
    clearOutput: (state) => {
      state.output = {};
    },
    setOpen: (state, action) => {
      state.open = action.payload;
    },
    setCanvasOpen: (state, action) => {
      state.canvasOpen = action.payload;
      if (!action.payload) {
        state.codeEditor = false;
        state.documentEditor = false;
        state.gptAgent = false;
      }
    },
    setCodeEditor: (state, action) => {
      state.codeEditor = action.payload;
      state.documentEditor = false;
      state.gptAgent = false;

      state.canvasOpen = action.payload;
    },
    setDocumentEditor: (state, action) => {
      state.documentEditor = action.payload;
      state.codeEditor = false;
      state.gptAgent = false;
      state.canvasOpen = action.payload;
    },
    setGptAgent: (state, action) => {
      state.gptAgent = action.payload;
      state.codeEditor = false;
      state.documentEditor = false;
      state.canvasOpen = action.payload;
    },
    setIsCreatingAgent: (state, action) => {
      state.isCreatingAgent = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(executeCode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(executeCode.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.output = payload;
      })
      .addCase(executeCode.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });
  },
});

export const {
  setCode,
  clearCode,
  setLanguage,
  clearLanguage,
  setOutput,
  clearOutput,
  setDynamicText,
  setOpen,
  setCodeEditor,
  setDocumentEditor,
  setGptAgent,
  setCanvasOpen,
  setIsCreatingAgent,
} = codeEditorReducer.actions;

export default codeEditorReducer.reducer;
