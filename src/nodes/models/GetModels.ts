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
export type getModelsNode = ChartNode<
  "getModels", 
  {}
>;

export function getModelsPluginNode(rivet: typeof Rivet) {
  // This is your main node implementation. It is an object that implements the PluginNodeImpl interface.
  const getModelsImpl: PluginNodeImpl<getModelsNode> = {
    // This should create a new instance of your node type from scratch.
    create(): getModelsNode {
      const node: getModelsNode = {
        id: rivet.newId<NodeId>(),
        data: {},
        title: "Get Models (TLab)",
        type: "getModels",
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
        contextMenuTitle: "Get Models (TLab)",
        group: "Models (TLab)",
        infoBoxBody: "Gets all the available models for the Chat endppoint.",
        infoBoxTitle: "Get Models",
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
        data = await fetchData('GET', host, '/model/list');
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

  const getModelsNode = rivet.pluginNodeDefinition(
    getModelsImpl,
    "Get Models (TLab)"
  );

  return getModelsNode;
}
