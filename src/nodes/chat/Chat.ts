import type {
    ChartNode,
    ChatMessage,
    EditorDefinition,
    NodeId,
    NodeInputDefinition,
    NodeOutputDefinition,
    NodeUIData,
    Outputs,
    PluginNodeImpl,
    PortId,
    Rivet,
  } from "@ironclad/rivet-core";
  
  export type ChatNodeData = {
    model: string;
    useModelInput?: boolean;
  
    maxTokens?: number;
    useMaxTokensInput?: boolean;
  
    temperature?: number;
    useTemperatureInput?: boolean;

    topK?: number;
    useTopKInput?: boolean;
  
    topP?: number;
    useTopPInput?: boolean;

    stop: string;
    useStopInput?: boolean;
  
    presencePenalty?: number;
    usePresencePenaltyInput?: boolean;
  
    frequencyPenalty?: number;
    useFrequencyPenaltyInput?: boolean;
  
    user?: string;
    useUserInput?: boolean;
  };
  
  export type ChatNode = ChartNode<"chatPluginNode", ChatNodeData>;
  
  type TransformerLabStreamingFinalResponse = {
    model: string;
    created_at: string;
    message: {
      role: string;
      content: string;
    };
    done: true;
    total_duration: number;
    load_duration: number;
    prompt_eval_count: number;
    prompt_eval_duration: number;
    eval_count: number;
    eval_duration: number;
  };
  
  
  export const chatPluginNode = (rivet: typeof Rivet) => {
    const impl: PluginNodeImpl<ChatNode> = {
      create(): ChatNode {
        const node: ChatNode = {
          id: rivet.newId<NodeId>(),
          data: {
            model: "",
            useModelInput: false,
            temperature: 0.5,
            useTemperatureInput: false,
            topK: -1,
            useTopKInput: false,
            topP: 1,
            useTopPInput: false,
            stop: "",
            useStopInput: false,
            presencePenalty: 0,
            usePresencePenaltyInput: false,
            frequencyPenalty: 0,
            useFrequencyPenaltyInput: false,
            user: "",
            useUserInput: false,
          },
          title: "Chat (TLab)",
          type: "chatPluginNode",
          visualData: {
            x: 0,
            y: 0,
            width: 250,
          },
        };
        return node;
      },
  
      getInputDefinitions(data): NodeInputDefinition[] {
        const inputs: NodeInputDefinition[] = [];
  
        inputs.push({
          id: "system-prompt" as PortId,
          dataType: "string",
          title: "System Prompt",
          required: false,
        });
  
        inputs.push({
          id: "messages" as PortId,
          dataType: ["chat-message[]", "chat-message"],
          title: "Messages",
        });
  
        if (data.useModelInput) {
          inputs.push({
            id: "model" as PortId,
            dataType: "string",
            title: "Model",
          });
        }
  
        if (data.useTemperatureInput) {
          inputs.push({
            id: "temperature" as PortId,
            dataType: "number",
            title: "Temperature",
          });
        }
  
        if (data.useTopPInput) {
          inputs.push({
            id: "topP" as PortId,
            dataType: "number",
            title: "top_p",
          });
        }
  
        if (data.useTopKInput) {
          inputs.push({
            id: "topK" as PortId,
            dataType: "number",
            title: "top_k",
          });
        }
  
        if (data.useMaxTokensInput) {
          inputs.push({
            id: "maxTokens" as PortId,
            dataType: "number",
            title: "max_tokens",
          });
        }

        if (data.usePresencePenaltyInput) {
            inputs.push({
              id: "presencePenalty" as PortId,
              dataType: "number",
              title: "presence_penalty",
            });
          }

          if (data.useFrequencyPenaltyInput) {
            inputs.push({
              id: "frequencyPenalty" as PortId,
              dataType: "number",
              title: "frequence_penalty",
            });
          }

          if (data.useUserInput) {
            inputs.push({
              id: "user" as PortId,
              dataType: "string",
              title: "user",
            });
          }

          if (data.useStopInput) {
            inputs.push({
              id: "stop" as PortId,
              dataType: "number",
              title: "stop",
            });
          }
  
        return inputs;
      },
  
      getOutputDefinitions(data): NodeOutputDefinition[] {
        let outputs: NodeOutputDefinition[] = [
          {
            id: "output" as PortId,
            dataType: "string",
            title: "Output"
          },
          {
            id: "messages-sent" as PortId,
            dataType: "chat-message[]",
            title: "Messages Sent"
          },
          {
            id: "all-messages" as PortId,
            dataType: "chat-message[]",
            title: "All Messages"
          },
        ];
  
        return outputs;
      },
  
      getEditors(): EditorDefinition<ChatNode>[] {
        return [
          {
            type: "string",
            dataKey: "model",
            label: "Model",
            useInputToggleDataKey: "useModelInput",
            helperMessage: "The LLM model to use. Needs to be previously selected and run in Transformer Lab.",
          },
          {
            type: "number",
            dataKey: "maxTokens",
            useInputToggleDataKey: "useMaxTokensInput",
            label: "max_tokens",
            helperMessage:
              "The maximum number of tokens to generate in the chat completion.",
            allowEmpty: false,
            defaultValue: 1024,
          },
          {
            type: "number",
            dataKey: "temperature",
            useInputToggleDataKey: "useTemperatureInput",
            label: "Temperature",
            helperMessage:
              "The temperature of the model. Increasing the temperature will make the model answer more creatively. (Default: 0.8)",
            allowEmpty: true,
            defaultValue: 0.5,
          },
          {
            type: "group",
            label: "Parameters",
            editors: [
              {
                type: "number",
                dataKey: "topP",
                useInputToggleDataKey: "useTopPInput",
                label: "top_p",
                helperMessage:
                  "top_p value",
                min: 0,
                max: 1,
                step: 1,
                allowEmpty: true,
                defaultValue: 1,
              },
              {
                type: "number",
                dataKey: "topK",
                useInputToggleDataKey: "useTopKInput",
                label: "top_k",
                helperMessage:
                  "top_k value",
                min: -1,
                max: 1,
                step: 1,
                allowEmpty: true,
                defaultValue: -1,
              },
              {
                type: "string",
                dataKey: "stop",
                useInputToggleDataKey: "useStopInput",
                label: "Stop",
                helperMessage:
                  "Sets the stop sequences to use. When this pattern is encountered the LLM will stop generating text and return.",
              },
              {
                type: "number",
                dataKey: "presencePenalty",
                useInputToggleDataKey: "usePresencePenaltyInput",
                label: "presence_penalty",
                helperMessage:
                  "presence_penalty value",
                allowEmpty: true,
                defaultValue: 0,
              },
              {
                type: "number",
                dataKey: "frequencyPenalty",
                useInputToggleDataKey: "useFrequencyPenaltyInput",
                label: "frequency_penalty",
                helperMessage:
                  "frequency_penalty value",
                allowEmpty: true,
                defaultValue: 0,
              },
              {
                type: "string",
                dataKey: "user",
                useInputToggleDataKey: "useUserInput",
                label: "user",
                helperMessage:
                  "user value"
              },
        ]}
        ];
      },
  
      getBody(data) {
        return rivet.dedent`
          Model: ${data.useModelInput ? "(From Input)" : data.model || "Unset!"}
          Max tokens: ${data.maxTokens || 1024}
        `;
      },
  
      getUIData(): NodeUIData {
        return {
          contextMenuTitle: "Chat (TLab)",
          group: "Chat (TLab)",
          infoBoxBody: "This is an Transformer Lab Chat node using /api/chat.",
          infoBoxTitle: "Chat Node (TLab)",
        };
      },
  
      async process(data, inputData, context) {
        /*
        if (context.executor !== "nodejs") {
            throw new Error("This node can only be run using a nodejs executor.");
          }
          */

        let outputs: Outputs = {};
  
        const host = context.getPluginConfig("host") || "http://localhost:8000";
  
        if (!host.trim()) {
          throw new Error("No host set!");
        }
  
        const model = rivet.getInputOrData(data, inputData, "model", "string");
        if (!model) {
          throw new Error("No model set!");
        }
  
        const systemPrompt = rivet.coerceTypeOptional(
          inputData["system-prompt" as PortId],
          "string"
        );
  
        const chatMessages =
          rivet.coerceTypeOptional(
            inputData["messages" as PortId],
            "chat-message[]"
          ) ?? [];
        const allMessages: ChatMessage[] = systemPrompt
          ? [{ type: "system", message: systemPrompt} as ChatMessage, ...chatMessages]
          : chatMessages;
  
          const inputMessages: InputMessage[] = allMessages.map(message => {
            if (typeof message.message === 'string') {
              return { type: message.type, message: message.message };
            } else {
              return { type: message.type, message: JSON.stringify(message.message) };
            }
          }); 
  
        const openAiMessages = formatChatMessages(inputMessages);
  
        const parameters = {
            temperature: rivet.getInputOrData(data, inputData, "temperature", "number"),
            top_k: rivet.getInputOrData(data, inputData, "topK", "number"),
            top_p: rivet.getInputOrData(data, inputData, "topP", "number"),
            max_tokens: rivet.getInputOrData(data, inputData, "maxTokens", "number"),
            presence_penalty: rivet.getInputOrData(data, inputData, "presencePenalty", "number"),
            frequencyPenalty: rivet.getInputOrData(data, inputData, "frequencyPenalty", "number"),
            stop: rivet.getInputOrData(data, inputData, "stop", "string"),
            user: rivet.getInputOrData(data, inputData, "user", "string"),
        };
  
        let apiResponse: Response;
        
        type RequestBodyType = {
          model: string;
          messages: OutputMessage[];
          temperature: number;
          top_p: number;
          top_k?: number;
          n: number;
          max_tokens: number;
          stop?: string;
          stream: boolean;
          presence_penalty: number;
          frequency_penalty: number;
          user?: string;
        };
  
        const requestBody: RequestBodyType = {
            model,
            messages: openAiMessages,
            stream: true,
            temperature: parameters.temperature,
            top_p: parameters.top_p,
            top_k: parameters.top_k,
            n: 1,
            max_tokens: parameters.max_tokens,
            presence_penalty: parameters.presence_penalty,
            frequency_penalty: parameters.frequencyPenalty,
            stop: parameters.stop,
            user: parameters.user,
        };

        // Fetch
        try {
            apiResponse = await fetch(`${host}/v1/chat/completions`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(requestBody)
            });
        
          } catch (err) {
            throw new Error(`Error from Transformer Lab: ${rivet.getError(err).message}`);
          }
  
        if (!apiResponse.ok) {
          try {
            const error = await apiResponse.json();
            throw new Error(`Error from Transformer Lab: ${error.message}`);
          } catch (err) {
            throw new Error(`Error from Transformer Lab: ${apiResponse.statusText}`);
          }
        }
  
        const reader = apiResponse.body?.getReader();
  
        if (!reader) {
          throw new Error("No response body!");
        }
  
       let response =  await processStreamedResponse(reader, outputs, context);
  
        outputs["messages-sent" as PortId] = {
          type: "chat-message[]",
          value: allMessages,
        };

        outputs["all-messages" as PortId] = {
            type: "chat-message[]",
            value: [
              ...allMessages,
              {
                type: "assistant",
                message: response,
                function_call: undefined,
                name: undefined
              } as ChatMessage,
            ],
          };

        return outputs;
      },
    };

    async function processStreamedResponse(
        reader: ReadableStreamDefaultReader<Uint8Array>,
        outputs: any,
        context: any
      ) {
        let finalMessageContent = '';
        let finalResponse: TransformerLabStreamingFinalResponse | undefined;
        let receivedData = false; // Flag to track if any data was received
    
        while (true) {
            const { value, done } = await reader.read();
            if (done) {
                //console.log('Stream reading done.');
                break;
            }
    
            receivedData = true; // Data was received
            const chunk = new TextDecoder().decode(value);
            const lines = chunk.split("\n");
    
            for (const line of lines) {
                //console.log('Raw line:', line);
    
                if (line.startsWith('data: [DONE]')) {
                    // Handle the end of data signal
                    continue;
                }
    
                if (line.startsWith('data:')) {
                    const jsonData = line.substring(5); // Remove 'data:' prefix
                    try {
                        const parsedData = JSON.parse(jsonData);
    
                        if (!parsedData.done) {
                            finalMessageContent += parsedData.choices[0].delta.content ?? '';

                        } else {
                            // Here, capture the finalResponse data
                            finalResponse = parsedData; // Adjust to actual structure
                        }
    
                        // Update outputs within the streaming loop
                        outputs["output" as PortId] = {
                            type: "string",
                            value: finalMessageContent,
                        };
    
                        // Notify the system that partial outputs are available
                        context.onPartialOutputs?.(outputs);
    
                    } catch (err) {
                        if (err instanceof Error) {
                            console.error(`Error parsing JSON: ${err.message}`);
                        } else {
                            console.error("An unknown error occurred during JSON parsing.");
                        }
                    }
                }
            }
        }
    
        // Only throw an error if no data was received at all
        if (!receivedData) {
            throw new Error("No data received from Transformer Lab!");
        }
        return finalMessageContent;
    }
    
  
    return rivet.pluginNodeDefinition(impl, "Chat (TLab)");
  };
  
  type InputMessage = {
    type: string;
    message: string;
  };
  
  type OutputMessage = {
    role: string;
    content: string;
  };
  
  function formatChatMessages(messages: InputMessage[]): OutputMessage[] {
    return messages.map((message) => ({
      role: message.type,
      content: message.message,
    }));
  }