import { useState } from "react";
import GptAgentsDashboard from "./GptAgentsDashboard";
import CreateGptAgent from "./CreateGptAgent";
import { useDispatch, useSelector } from "react-redux";
import { setIsCreatingAgent } from "@/redux/reducers/codeEditorReducer";

const GptAgents = () => {
  const [editingAgent, setEditingAgent] = useState(null);
  const dispatch = useDispatch();
  const isCreatingAgent = useSelector((state) => state.code.isCreatingAgent);

  const handleCreateAgent = () => {
    setEditingAgent(null);
    dispatch(setIsCreatingAgent(true));
  };

  const handleEditAgent = (agent) => {
    setEditingAgent(agent);
    dispatch(setIsCreatingAgent(true));
  };

  const handleComplete = () => {
    dispatch(setIsCreatingAgent(false));
    setEditingAgent(null);
  };

  const handleCancel = () => {
    dispatch(setIsCreatingAgent(false));
    setEditingAgent(null);
  };

  if (isCreatingAgent) {
    return (
      <CreateGptAgent
        initialData={editingAgent}
        mode={editingAgent ? "edit" : "create"}
        onComplete={handleComplete}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <GptAgentsDashboard
      onCreateAgent={handleCreateAgent}
      onEditAgent={handleEditAgent}
    />
  );
};

export default GptAgents;
