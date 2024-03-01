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
export type createTrainingDataNode = ChartNode<
  "createTrainingData", 
  createTrainingDataPluginNodeData
>;

export type createTrainingDataPluginNodeData = {
  trainingData: object[];
  evalDataPercent: number;
  useEvalDataPercent: boolean;
  promptKey: string;
  usePromptKey: boolean;
  generationKey: string;
  useGenerationKey: boolean;
  instructionKey: string;
  useInstructionKey: boolean;
  shuffleData: boolean;
  useShuffleData: boolean;
  outputFormat: string;
  addInstructions: boolean;
  useAddInstructions: boolean;
  disjointEvaluation: boolean;
  useDisjointEvaluation: boolean;
};

export function createTrainingDataPluginNode(rivet: typeof Rivet) {
  // This is your main node implementation. It is an object that implements the PluginNodeImpl interface.
  const createTrainingDataImpl: PluginNodeImpl<createTrainingDataNode> = {
    // This should create a new instance of your node type from scratch.
    create(): createTrainingDataNode {
      const node: createTrainingDataNode = {
        id: rivet.newId<NodeId>(),
        data: {
          evalDataPercent: 20,
          useEvalDataPercent: false,
          trainingData: [],
          promptKey: "",
          usePromptKey: false,
          generationKey: "",
          useGenerationKey: false,
          instructionKey: "",
          useInstructionKey: false,
          shuffleData: true,
          useShuffleData: false,
          outputFormat: "jsonl",
          addInstructions: false,
          useAddInstructions: false,
          disjointEvaluation: true,
          useDisjointEvaluation: false,
        },
        title:  "Create Training Data",
        type: "createTrainingData",
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
        contextMenuTitle:  "Create Training Data",
        group: "Datasets (TLab)",
        infoBoxBody: "Turns your data into training data for finetuning a model.",
        infoBoxTitle: "Create Training Data",
      };
    },

    getEditors(
      _data: createTrainingDataPluginNodeData
    ): EditorDefinition<createTrainingDataNode>[] {
      return [
        {
          type: "number",
          dataKey: "evalDataPercent",
          useInputToggleDataKey: "useEvalDataPercent",
          label: "Percentage of data used as evaluation data (0-100%)",
          max: 100,
          min: 0
        },
        {
          type: "toggle",
          dataKey: "shuffleData",
          useInputToggleDataKey: "useShuffleData",
          label: "Shuffle the data before splitting it into training and evaluation data?",
        },
        {
          type: "toggle",
          dataKey: "disjointEvaluation",
          useInputToggleDataKey: "useDisjointEvaluation",
          label: "Use disjoint evaluation data? (If false, the evaluation data will be a random subset of the training data)",
        },
        {
          type: "dropdown",
          dataKey: "outputFormat",
          label: "outputFormat",
          options: [
            { value: "jsonl", label: "JSON Lines (.jsonl)" }
          ],
          defaultValue: "jsonl",
          helperMessage: "Output format for the training/evaluation data.  Currently only JSON Lines (.jsonl) is supported."
        },
        {
          type: "string",
          dataKey: "promptKey",
          useInputToggleDataKey: "usePromptKey",
          label: "Name of the key containing the prompt (e.g. question)",
        },
        {
          type: "string",
          dataKey: "generationKey",
          useInputToggleDataKey: "useGenerationKey",
          label: "Name of the key containing the expected answer of the LLM (e.g. answer)",
        },
        {
          type: "string",
          dataKey: "instructionKey",
          useInputToggleDataKey: "useInstructionKey",
          label: "Name of the key containing the instructions for the LLM (e.g. instructions)",
        },
        {
          type: "toggle",
          dataKey: "addInstructions",
          useInputToggleDataKey: "useAddInstructions",
          label: "Add instructions to the training data? (otherwise they will be left empty)",
        },
      ];
    },

    getInputDefinitions(
      data: createTrainingDataPluginNodeData,
      _connections: NodeConnection[],
      _nodes: Record<NodeId, ChartNode>,
      _project: Project
    ): NodeInputDefinition[] {
      const inputs: NodeInputDefinition[] = [];

      if(data.useEvalDataPercent){
        inputs.push({
          id: "evalDataPercent" as PortId,
          dataType: "number",
          title: "Evaluation data (%)",
        });
      }
      if(data.usePromptKey){
        inputs.push({
          id: "promptKey" as PortId,
          dataType: "string",
          title: "Prompt key",
        });
      }
      if(data.useGenerationKey){
        inputs.push({
          id: "generationKey" as PortId,
          dataType: "string",
          title: "Generation key",
        });
      }
      if(data.useInstructionKey){
        inputs.push({
          id: "instructionKey" as PortId,
          dataType: "string",
          title: "Instruction key",
        });
      }
      if(data.useShuffleData){
        inputs.push({
          id: "shuffleData" as PortId,
          dataType: "boolean",
          title: "Shuffle data",
        });
      }
      if(data.useAddInstructions){
        inputs.push({
          id: "addInstructions" as PortId,
          dataType: "boolean",
          title: "Add instructions",
        });
      }
      if(data.useDisjointEvaluation){
        inputs.push({
          id: "disjointEvaluation" as PortId,
          dataType: "boolean",
          title: "Disjoint Evaluation",
        });
      }
      inputs.push({
        id: "trainingData" as PortId,
        dataType: "object[]",
        title: "Training data",
      });

      return inputs;
    },

    getOutputDefinitions() {
      return [
        {
          id: "trainingData" as PortId,
          dataType: "string",
          title: "trainingData",
        },
        {
          id: "evalData" as PortId,
          dataType: "string",
          title: "evaluationData",
        },
      ];
    },

    getBody(
      data: createTrainingDataPluginNodeData
    ): string | NodeBodySpec | NodeBodySpec[] | undefined {
      return rivet.dedent`
        Evaluation data (%): ${data.useEvalDataPercent ? "(Using Input)" : (data.evalDataPercent ? data.evalDataPercent : "none.")}
        Shuffle Data: ${data.useShuffleData ? "(Using Input)" : (data.shuffleData ? "true" : "false")}
        Output Format: ${data.outputFormat}
      `;
    },

    async process(
      _data, 
      _input, 
      context) {
      // Check inputs for data
      const evalDataPercent = rivet.getInputOrData(
        _data,
        _input,
        "evalDataPercent",
        "number",
      );
      const promptKey = rivet.getInputOrData(
        _data,
        _input,
        "promptKey",
        "string",
      );
      const generationKey = rivet.getInputOrData(
        _data,
        _input,
        "generationKey",
        "string",
      );
      const instructionKey = rivet.getInputOrData(
        _data,
        _input,
        "instructionKey",
        "string",
      );
      const shuffleData = rivet.getInputOrData(
        _data,
        _input,
        "shuffleData",
        "boolean",
      );
      const addInstructions = rivet.getInputOrData(
        _data,
        _input,
        "addInstructions",
        "boolean",
      );
      const disjointEvaluation = rivet.getInputOrData(
        _data,
        _input,
        "disjointEvaluation",
        "boolean",
      );
      const outputFormat = rivet.getInputOrData(
        _data,
        _input,
        "outputFormat",
        "string",
      );

      // Always get trainingData from input
      const trainingData = rivet.coerceTypeOptional(
        _input["trainingData" as PortId],
        "object[]"
      );
      
      // Errors are thrown to the user as a message in the UI.
      if(!trainingData){
        throw new Error("Training Data is required.");
      }
      if(evalDataPercent === undefined || evalDataPercent === null){
        throw new Error("Evaluation Data Percent is required.");
      }
      if(!promptKey){
        throw new Error("Prompt Key is required.");
      }
      if(!generationKey){
        throw new Error("Generation Key is required.");
      }

      // #1: Shuffle the trainingData if shuffleData is true
      if(shuffleData){
        trainingData.sort(() => Math.random() - 0.5);
      }
      
      // #2: Create a new object with the target keys
      let trainingDataMapped = trainingData.map((item: any) => {
        return {
          prompt: item[promptKey],
          generation: item[generationKey],
          instruction: addInstructions && instructionKey !== undefined ? item[instructionKey] : "",
        };
      });

      // #3: Split the trainingData into training and evaluation data
      let trainingDataObject;
      let evalDataObject;
      if(disjointEvaluation){
        const evalData = trainingDataMapped.splice(0, Math.floor(trainingDataMapped.length * (evalDataPercent / 100)));
        trainingDataObject = {
          type: "object[]",
          value: trainingDataMapped,
        };
        evalDataObject = {
          type: "object[]",
          value: evalData,
        };
      } else {
        const evalData = trainingDataMapped.slice(0, Math.floor(trainingDataMapped.length * (evalDataPercent / 100)));
        trainingDataObject = {
          type: "object[]",
          value: trainingDataMapped,
        };
        evalDataObject = {
          type: "object[]",
          value: evalData,
        };
      }

      // #4: Convert the objects to JSONL if outputFormat is jsonl
      let trainingDataJSONL;
      let evalDataJSONL;
      if(outputFormat == "jsonl") {
        trainingDataJSONL = trainingDataObject.value.map((item: any) => {
          return JSON.stringify(item);
        }).join('\n');
        evalDataJSONL = evalDataObject.value.map((item: any) => {
          return JSON.stringify(item);
        }).join('\n');
      }

      // #5: Return the trainingData and evalData
      return {
        ["trainingData" as PortId]: {
          type: "string",
          value: trainingDataJSONL,
        } as any,
        ["evalData" as PortId]: {
          type: "string",
          value: evalDataJSONL,
        } as any,
      };
    },
  };

  const createTrainingDataNode = rivet.pluginNodeDefinition(
    createTrainingDataImpl,
     "Create Training Data"
  );

  return createTrainingDataNode;
}
