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
export type getDatasetListNode = ChartNode<
  "getDatasetList", 
  {}
>;

export function getDatasetListPluginNode(rivet: typeof Rivet) {
  // This is your main node implementation. It is an object that implements the PluginNodeImpl interface.
  const getDatasetListImpl: PluginNodeImpl<getDatasetListNode> = {
    // This should create a new instance of your node type from scratch.
    create(): getDatasetListNode {
      const node: getDatasetListNode = {
        id: rivet.newId<NodeId>(),
        data: {},
        title: "Get Datasets (TLab)",
        type: "getDatasetList",
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
        contextMenuTitle: "Get Datasets (TLab)",
        group: "Datasets (TLab)",
        infoBoxBody: "Retrieves all datasets that have been added to Transformer Labs.",
        infoBoxTitle: "Get Datasets",
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
        data = await fetchData('GET', host, '/data/list');
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

  const getDatasetListNode = rivet.pluginNodeDefinition(
    getDatasetListImpl,
    "Get Dataset List (TLab)"
  );

  return getDatasetListNode;
}
