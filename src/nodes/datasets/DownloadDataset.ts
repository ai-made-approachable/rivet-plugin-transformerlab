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
  Inputs,
} from "@ironclad/rivet-core";
import fetchData from "../../fetchData";

// This defines your new type of node.
export type downloadDatasetNode = ChartNode<
  "downloadDataset", 
  downloadDatasetPluginNodeData
>;

export type downloadDatasetPluginNodeData = {
  datasetName: string;
  useDatasetNameInput?: boolean;
};

export function downloadDatasetPluginNode(rivet: typeof Rivet) {
  // This is your main node implementation. It is an object that implements the PluginNodeImpl interface.
  const downloadDatasetImpl: PluginNodeImpl<downloadDatasetNode> = {
    // This should create a new instance of your node type from scratch.
    create(): downloadDatasetNode {
      const node: downloadDatasetNode = {
        id: rivet.newId<NodeId>(),
        data: {
          datasetName: "",
          useDatasetNameInput: false,
        },
        title:  "Download Datasets (TLab)",
        type: "downloadDataset",
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
        contextMenuTitle:  "Download Dataset (TLab)",
        group: "Datasets (TLab)",
        infoBoxBody: "Downloads a dataset from Huggingface.",
        infoBoxTitle: "Download Dataset",
      };
    },

    getEditors(
      _data: downloadDatasetPluginNodeData
    ): EditorDefinition<downloadDatasetNode>[] {
      return [
        {
          type: "string",
          dataKey: "datasetName",
          useInputToggleDataKey: "useDatasetNameInput",
          label: "Huggingface dataset name. Use \"copy\" button on Huggingface to get the dataset name.",
        },
      ];
    },

    getInputDefinitions(
      data: downloadDatasetPluginNodeData,
      _connections: NodeConnection[],
      _nodes: Record<NodeId, ChartNode>,
      _project: Project
    ): NodeInputDefinition[] {
      const inputs: NodeInputDefinition[] = [];

      if (data.useDatasetNameInput) {
        inputs.push({
          id: "datasetName" as PortId,
          dataType: "string",
          title: "Huggingface dataset",
        });
      }

      return inputs;
    },

    getOutputDefinitions() {
      return [];
    },

    getBody(
      data: downloadDatasetPluginNodeData
    ): string | NodeBodySpec | NodeBodySpec[] | undefined {
      return rivet.dedent`
        Huggingface dataset: ${data.useDatasetNameInput ? "(Using Input)" : (data.datasetName ? data.datasetName : "none.")}
      `;
    },

    async process(
      _data: downloadDatasetPluginNodeData, 
      _input: Inputs, 
      context) { 
      if (context.executor !== "nodejs") {
        throw new Error("This node can only be run using a nodejs executor.");
      }
      let host = context.getPluginConfig("host") || "http://localhost:8000";
      
      const datasetName = rivet.getInputOrData(
        _data,
        _input,
        "datasetName",
        "string"
      );
      console.error(datasetName)
      
      let data;
      try {
        data = await fetchData('GET', host, `/data/download?dataset_id=${datasetName}`);
      } catch (error) {
        console.error('There was a problem with the fetch operation: ', error);
        throw error;
      }
    
      return {
        ["status" as PortId]: {
          type: "object",
          value: data,
        },
      };
    },
  };

  const downloadDatasetNode = rivet.pluginNodeDefinition(
    downloadDatasetImpl,
     "Download Dataset (TLab)"
  );

  return downloadDatasetNode;
}
