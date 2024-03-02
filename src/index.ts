import type { RivetPlugin, RivetPluginInitializer } from "@ironclad/rivet-core";
import { getPublicDatasetListPluginNode } from "./nodes/datasets/GetPublicDatasetList.js";
import { getDatasetListPluginNode } from "./nodes/datasets/GetDatasetList.js";
import { getDatasetPreviewPluginNode } from "./nodes/datasets/GetDatasetPreview.js";
import { downloadDatasetPluginNode } from "./nodes/datasets/DownloadDataset.js";
import { deleteDatasetPluginNode } from "./nodes/datasets/DeleteDataset.js";
import { addDatasetPluginNode } from "./nodes/datasets/AddDataset.js";
import { getModelsPluginNode } from "./nodes/models/GetModels.js";
import { chatPluginNode } from "./nodes/chat/Chat.js";
import { objectsToJSONLinesPluginNode } from "./nodes/datasets/ObjectsToJSONLines.js";
import { createTrainingDataPluginNode } from "./nodes/datasets/CreateTrainingData.js";

const plugin: RivetPluginInitializer = (rivet) => {
  const getPublicDatasetListNode = getPublicDatasetListPluginNode(rivet);
  const getDatasetListNode = getDatasetListPluginNode(rivet);
  const getDatasetPreviewNode = getDatasetPreviewPluginNode(rivet);
  const downloadDatasetNode = downloadDatasetPluginNode(rivet);
  const deleteDatasetNode = deleteDatasetPluginNode(rivet);
  const addDatasetNode = addDatasetPluginNode(rivet);
  const getModelsNode = getModelsPluginNode(rivet);
  const ChatNode = chatPluginNode(rivet);
  const objectsToJSONLinesNode = objectsToJSONLinesPluginNode(rivet);
  const createTrainingDataNode = createTrainingDataPluginNode(rivet);


  const transformerLabsPlugin: RivetPlugin = {
    id: "transformerlabs-plugin",
    name: "Transformer Lab",

    configSpec: {
      host: {
        type: "string",
        label: "host",
        description: "This is the host URL of Transformer Labs API. Default value his http://localhost:8000 (Note: You need to use the Node excecutor! If localhost does not work, try http://127.0.0.1:8000)",
        helperText: "This is the host URL of Transformer Labs API. Default value his http://localhost:8000 (Note: You need to use the Node excecutor! If localhost does not work, try http://127.0.0.1:8000)",
      }
    },

    contextMenuGroups: [
      {
        id: "TLabDatasets",
        label: "Datasets (TLab)",
      },
      {
        id: "TLabChat",
        label: "Chat (TLab)",
      },
      {
        id: "TLabModels",
        label: "Models (TLab)",
      },
    ],

    register: (register) => {
      /* Dataset nodes */
      register(getPublicDatasetListNode);
      register(getDatasetListNode);
      register(getDatasetPreviewNode);
      register(downloadDatasetNode);
      register(deleteDatasetNode);
      register(addDatasetNode);
      register(createTrainingDataNode);
      /* Object nodes */
      //register(objectsToJSONLinesNode);

      /* Model nodes */
      //register(getModelsNode);

      /* Chat nodes */
      register(ChatNode);
    },
  };
  return transformerLabsPlugin;
};

export default plugin;
