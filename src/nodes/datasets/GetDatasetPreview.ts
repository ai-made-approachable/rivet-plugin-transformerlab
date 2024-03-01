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
export type getDatasetPreviewNode = ChartNode<
  "getDatasetPreview", 
  getDatasetPreviewPluginNodeData
>;

export type getDatasetPreviewPluginNodeData = {
  datasetId: string;
  useDatasetIdInput?: boolean;
};

export function getDatasetPreviewPluginNode(rivet: typeof Rivet) {
  // This is your main node implementation. It is an object that implements the PluginNodeImpl interface.
  const getDatasetPreviewImpl: PluginNodeImpl<getDatasetPreviewNode> = {
    // This should create a new instance of your node type from scratch.
    create(): getDatasetPreviewNode {
      const node: getDatasetPreviewNode = {
        id: rivet.newId<NodeId>(),
        data: {
          datasetId: "",
          useDatasetIdInput: false,
        },
        title:  "Get Dataset Preview (TLab)",
        type: "getDatasetPreview",
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
        contextMenuTitle:  "Get Dataset Preview (TLab)",
        group: "Datasets (TLab)",
        infoBoxBody: "Retrieves a preview for the contents of a dataset.",
        infoBoxTitle: "Get Dataset Preview",
      };
    },

    getEditors(
      _data: getDatasetPreviewPluginNodeData
    ): EditorDefinition<getDatasetPreviewNode>[] {
      return [
        {
          type: "string",
          dataKey: "datasetId",
          useInputToggleDataKey: "useDatasetIdInput",
          label: "Dataset ID of the dataset to preview",
        },
      ];
    },

    getInputDefinitions(
      data: getDatasetPreviewPluginNodeData,
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

      return inputs;
    },

    getOutputDefinitions() {
      return [
        {
          id: "models" as PortId,
          dataType: "object[]",
          title: "response",
        },
      ];
    },

    getBody(
      data: getDatasetPreviewPluginNodeData
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
      
      let data;
      try {
        data = await fetchData('GET', host, `/data/preview?dataset_id=${datasetId}`);
      } catch (error) {
        console.error('There was a problem with the fetch operation: ', error);
        throw error;
      }
    
      return {
        ["models" as PortId]: {
          type: "object[]",
          value: data,
        },
      };
    },
  };

  const getDatasetPreviewNode = rivet.pluginNodeDefinition(
    getDatasetPreviewImpl,
     "Get Dataset Preview (TLab)"
  );

  return getDatasetPreviewNode;
}
