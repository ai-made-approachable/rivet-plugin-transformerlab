import type {
  ChartNode,
  NodeId,
  NodeUIData,
  PluginNodeImpl,
  PortId,
  Rivet,
  NodeBodySpec,
} from "@ironclad/rivet-core";
import fetchData from "../../fetchData";

// This defines your new type of node.
export type getPublicDatasetListNode = ChartNode<
  "getPublicDatasetList", 
  {}
>;

export function getPublicDatasetListPluginNode(rivet: typeof Rivet) {
  // This is your main node implementation. It is an object that implements the PluginNodeImpl interface.
  const getPublicDatasetListImpl: PluginNodeImpl<getPublicDatasetListNode> = {
    // This should create a new instance of your node type from scratch.
    create(): getPublicDatasetListNode {
      const node: getPublicDatasetListNode = {
        id: rivet.newId<NodeId>(),
        data: {},
        title:  "Get Public Datasets (TLab)",
        type: "getPublicDatasetList",
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
        contextMenuTitle:  "Get Public Datasets (TLab)",
        group: "Datasets (TLab)",
        infoBoxBody: "Retrieves all public datasets available in Transformer Labs.",
        infoBoxTitle: "Get Public Datasets",
      };
    },

    getInputDefinitions() {
      return [];
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

    getEditors() {
      return [];
    },

    getBody(
      data: {}
    ): string | NodeBodySpec | NodeBodySpec[] | undefined {
      return rivet.dedent`
      `;
    },

    async process(_data, _input, context) {
      if (context.executor !== "nodejs") {
        throw new Error("This node can only be run using a nodejs executor.");
      }
      let host = context.getPluginConfig("host") || "http://localhost:8000";
      
      let data;
      try {
        data = await fetchData('GET', host, '/data/gallery');
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

  const getPublicDatasetListNode = rivet.pluginNodeDefinition(
    getPublicDatasetListImpl,
     "Get Public Datasets (TLab)"
  );

  return getPublicDatasetListNode;
}
