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

// This defines your new type of node.
export type objectsToJSONLinesNode = ChartNode<
  "objectsToJSONLines", 
  objectsToJSONLinesPluginNodeData
>;

export type objectsToJSONLinesPluginNodeData = {
  objects: object[];
};

export function objectsToJSONLinesPluginNode(rivet: typeof Rivet) {
  // This is your main node implementation. It is an object that implements the PluginNodeImpl interface.
  const objectsToJSONLinesImpl: PluginNodeImpl<objectsToJSONLinesNode> = {
    // This should create a new instance of your node type from scratch.
    create(): objectsToJSONLinesNode {
      const node: objectsToJSONLinesNode = {
        id: rivet.newId<NodeId>(),
        data: {
          objects: []
        },
        title:  "Object to JSON Lines",
        type: "objectsToJSONLines",
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
        contextMenuTitle:  "Object to JSON Lines",
        group: "Objects",
        infoBoxBody: "Converts object[] to JSON Lines (.jsonl)",
        infoBoxTitle: "Object to JSON Lines",
      };
    },

    getEditors(
      _data: objectsToJSONLinesPluginNodeData
    ): EditorDefinition<objectsToJSONLinesNode>[] {
      return [];
    },

    getInputDefinitions(
      data: objectsToJSONLinesPluginNodeData,
      _connections: NodeConnection[],
      _nodes: Record<NodeId, ChartNode>,
      _project: Project
    ): NodeInputDefinition[] {
      const inputs: NodeInputDefinition[] = [];

      inputs.push({
        id: "objects" as PortId,
        dataType: "object[]",
        title: "object[]",
      });

      return inputs;
    },

    getOutputDefinitions() {
      return [
        {
          id: "jsonl" as PortId,
          dataType: "string",
          title: "jsonl",
        },
      ];
    },

    getBody(
      data: objectsToJSONLinesPluginNodeData
    ): string | NodeBodySpec | NodeBodySpec[] | undefined {
      return rivet.dedent`
      `;
    },

    async process(_data, _input, context) {

      const objects = rivet.coerceTypeOptional(
        _input["objects" as PortId],
        "object[]",
      );

      let data = '';
      if (objects) {
        data = objects.map((obj) => JSON.stringify(obj)).join('\n');
      }
    
      return {
        ["jsonl" as PortId]: {
          type: "string",
          value: data,
        },
      };
    },
  };

  const objectsToJSONLinesNode = rivet.pluginNodeDefinition(
    objectsToJSONLinesImpl,
     "Object to JSON Lines"
  );

  return objectsToJSONLinesNode;
}
