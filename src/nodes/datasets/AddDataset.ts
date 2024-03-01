import type {
  ChartNode,
  EditorDefinition,
  NodeBodySpec,
  NodeConnection,
  NodeId,
  NodeInputDefinition,
  NodeUIData,
  PluginNodeImpl,
  PortId,
  Project,
  Rivet,
} from "@ironclad/rivet-core";
import fetchData from "../../fetchData";

// This defines your new type of node.
export type addDatasetNode = ChartNode<
  "addDataset", 
  addDatasetPluginNodeData
>;

export type addDatasetPluginNodeData = {
  datasetId: string;
  useDatasetIdInput?: boolean;
  trainingData: string;
  evalData: string;
};

export function addDatasetPluginNode(rivet: typeof Rivet) {
  // This is your main node implementation. It is an object that implements the PluginNodeImpl interface.
  const addDatasetImpl: PluginNodeImpl<addDatasetNode> = {
    // This should create a new instance of your node type from scratch.
    create(): addDatasetNode {
      const node: addDatasetNode = {
        id: rivet.newId<NodeId>(),
        data: {
          datasetId: "",
          useDatasetIdInput: false,
          trainingData: "",
          evalData: "",
        },
        title:  "Add Dataset (TLab)",
        type: "addDataset",
        visualData: {
          x: 0,
          y: 0,
          width: 300,
        },
      };
      return node;
    },

    getUIData(): NodeUIData {
      return {
        contextMenuTitle:  "Add Dataset (TLab)",
        group: "Datasets (TLab)",
        infoBoxBody: "Adds a dataset to the Transformer Lab server.",
        infoBoxTitle: "Add Dataset",
      };
    },

    getEditors(
      _data: addDatasetPluginNodeData
    ): EditorDefinition<addDatasetNode>[] {
      return [
        {
          type: "string",
          dataKey: "datasetId",
          useInputToggleDataKey: "useDatasetIdInput",
          label: "Dataset ID of the public dataset to add",
        }
      ];
    },

    getInputDefinitions(
      data: addDatasetPluginNodeData,
      _connections: NodeConnection[],
      _nodes: Record<NodeId, ChartNode>,
      _project: Project
    ): NodeInputDefinition[] {
      const inputs: NodeInputDefinition[] = [];

      if (data.useDatasetIdInput) {
        inputs.push({
          id: "datasetId" as PortId,
          dataType: "string",
          title: "Dataset Id",
        });
      }

      inputs.push({
        id: "trainingData" as PortId,
        dataType: "string",
        title: "Training Data (JSONL)",
      });

      inputs.push({
        id: "evalData" as PortId,
        dataType: "string",
        title: "Evaluation Data (JSONL)",
      });

      return inputs;
    },

    getOutputDefinitions() {
      return [
        {
          id: "datasetId" as PortId,
          dataType: "string",
          title: "datasetId",
        },
        {
          id: "trainingFile" as PortId,
          dataType: "object",
          title: "trainingFile",
        },
        {
          id: "evalData" as PortId,
          dataType: "object",
          title: "evalFile",
        },
      ];
    },

    getBody(
      data: addDatasetPluginNodeData
    ): string | NodeBodySpec | NodeBodySpec[] | undefined {
      return rivet.dedent`
        Dataset Id: ${data.useDatasetIdInput ? "(Using Input)" : (data.datasetId ? data.datasetId : "none.")}
      `;
    },

    async process(_data, _input, context) {
      if (context.executor !== "nodejs") {
        throw new Error("This node can only be run using a nodejs executor.");
      }
      let host = context.getPluginConfig("host") || "http://localhost:8000";
      const datasetId = rivet.getInputOrData(
        _data,
        _input,
        "datasetId",
        "string"
      );
      
      /** Handle training data */
      const trainingData = rivet.coerceTypeOptional(
        _input["trainingData" as PortId],
        "string"
      );
      
      // Convert the string content to a Blob
      if (typeof trainingData === 'undefined') {
        throw new Error('trainingData is undefined');
      } else if (!trainingData) {
        throw new Error('Training data is empty');
      }
      const fileBlobTraining = new Blob([trainingData], { type: 'text/plain' });

      // Prepare FormData with the file
      const formDataTraining = new FormData();
      formDataTraining.append('file', fileBlobTraining, `${datasetId}_train.jsonl`);

      /** Handle eval data */
      const evalData = rivet.coerceTypeOptional(
        _input["evalData" as PortId],
        "string"
      );
      
      // Convert the string content to a Blob
      if (typeof evalData === 'undefined') {
        throw new Error('evalData is undefined');
      } else if (!evalData) {
        throw new Error('Evaluation data is empty');
      }
      const fileBlobEval = new Blob([evalData], { type: 'text/plain' });

      // Prepare FormData with the file
      const formDataEval = new FormData();
      formDataEval.append('file', fileBlobEval, `${datasetId}_eval.jsonl`);

      try {
        // Step 1: Call the "add" route
        await fetchData('GET', host, `/data/new?dataset_id=${datasetId}`);
      } catch (error) {
        console.error('There was a problem creating the dataset: ', error);
        throw error;
      }
      let dataTraining;
      try {
        // Step 2: Upload training data
        dataTraining = await fetchData('POST', host, `/data/fileupload?dataset_id=${datasetId}`, null, formDataTraining);
      } catch (error) {
        console.error('There was a problem adding the file to the dataset: ', error);
        throw error;
      }
      let dataEval;
      try {
        // Step 3: Upload evaluation data
        dataEval = await fetchData('POST', host, `/data/fileupload?dataset_id=${datasetId}`, null, formDataEval);
      } catch (error) {
        console.error('There was a problem adding the file to the dataset: ', error);
        throw error;
      }

      // Return the "trainingFile" from the response
      return {
        ["datasetId" as PortId]: {
          type: "string",
          value: datasetId,
        },
        ["trainingFile" as PortId]: {
          type: "string",
          value: dataTraining.filename,
        },
        ["evalFile" as PortId]: {
          type: "string",
          value: dataEval.filename,
        },
      };
    },
  };

  const addDatasetNode = rivet.pluginNodeDefinition(
    addDatasetImpl,
     "Add Dataset (TLab)"
  );

  return addDatasetNode;
}
