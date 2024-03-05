// src/fetchData.ts
async function fetchData(protocol, host, path, body = null, file) {
  const options = {
    method: protocol
  };
  if (file instanceof FormData) {
    options.body = file;
  } else if (body) {
    options.headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(body);
  }
  let data;
  try {
    let response = await fetch(`${host}${path}`, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}, status text: ${response.statusText}`);
    }
    data = await response.json();
  } catch (error) {
    if (host !== "http://localhost:8000") {
      console.error("There was a problem with the fetch operation: ", error);
    }
    if (host === "http://localhost:8000") {
      try {
        host = "http://127.0.0.1:8000";
        let response = await fetch(`${host}${path}`, options);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}, status text: ${response.statusText}`);
        }
        data = await response.json();
      } catch (error2) {
        console.error("There was a problem with the fetch operation: ", error2);
        throw error2;
      }
    } else {
      throw error;
    }
  }
  return data;
}
var fetchData_default = fetchData;

// src/nodes/datasets/GetPublicDatasetList.ts
function getPublicDatasetListPluginNode(rivet) {
  const getPublicDatasetListImpl = {
    // This should create a new instance of your node type from scratch.
    create() {
      const node = {
        id: rivet.newId(),
        data: {},
        title: "Get Public Datasets (TLab)",
        type: "getPublicDatasetList",
        visualData: {
          x: 0,
          y: 0,
          width: 300
        }
      };
      return node;
    },
    getUIData() {
      return {
        contextMenuTitle: "Get Public Datasets (TLab)",
        group: "Datasets (TLab)",
        infoBoxBody: "Retrieves all public datasets available in Transformer Labs.",
        infoBoxTitle: "Get Public Datasets"
      };
    },
    getInputDefinitions() {
      return [];
    },
    getOutputDefinitions() {
      return [
        {
          id: "models",
          dataType: "object[]",
          title: "response"
        }
      ];
    },
    getEditors() {
      return [];
    },
    getBody(data) {
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
        data = await fetchData_default("GET", host, "/data/gallery");
      } catch (error) {
        console.error("There was a problem with the fetch operation: ", error);
        throw error;
      }
      return {
        ["models"]: {
          type: "object[]",
          value: data
        }
      };
    }
  };
  const getPublicDatasetListNode = rivet.pluginNodeDefinition(
    getPublicDatasetListImpl,
    "Get Public Datasets (TLab)"
  );
  return getPublicDatasetListNode;
}

// src/nodes/datasets/GetDatasetList.ts
function getDatasetListPluginNode(rivet) {
  const getDatasetListImpl = {
    // This should create a new instance of your node type from scratch.
    create() {
      const node = {
        id: rivet.newId(),
        data: {},
        title: "Get Datasets (TLab)",
        type: "getDatasetList",
        visualData: {
          x: 0,
          y: 0,
          width: 300
        }
      };
      return node;
    },
    getUIData() {
      return {
        contextMenuTitle: "Get Datasets (TLab)",
        group: "Datasets (TLab)",
        infoBoxBody: "Retrieves all datasets that have been added to Transformer Labs.",
        infoBoxTitle: "Get Datasets"
      };
    },
    getInputDefinitions() {
      return [];
    },
    getOutputDefinitions() {
      return [
        {
          id: "models",
          dataType: "object[]",
          title: "response"
        }
      ];
    },
    getEditors() {
      return [];
    },
    getBody(data) {
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
        data = await fetchData_default("GET", host, "/data/list");
      } catch (error) {
        console.error("There was a problem with the fetch operation: ", error);
        throw error;
      }
      return {
        ["models"]: {
          type: "object[]",
          value: data
        }
      };
    }
  };
  const getDatasetListNode = rivet.pluginNodeDefinition(
    getDatasetListImpl,
    "Get Dataset List (TLab)"
  );
  return getDatasetListNode;
}

// src/nodes/datasets/GetDatasetPreview.ts
function getDatasetPreviewPluginNode(rivet) {
  const getDatasetPreviewImpl = {
    // This should create a new instance of your node type from scratch.
    create() {
      const node = {
        id: rivet.newId(),
        data: {
          datasetId: "",
          useDatasetIdInput: false
        },
        title: "Get Dataset Preview (TLab)",
        type: "getDatasetPreview",
        visualData: {
          x: 0,
          y: 0,
          width: 300
        }
      };
      return node;
    },
    getUIData() {
      return {
        contextMenuTitle: "Get Dataset Preview (TLab)",
        group: "Datasets (TLab)",
        infoBoxBody: "Retrieves a preview for the contents of a dataset.",
        infoBoxTitle: "Get Dataset Preview"
      };
    },
    getEditors(_data) {
      return [
        {
          type: "string",
          dataKey: "datasetId",
          useInputToggleDataKey: "useDatasetIdInput",
          label: "Dataset ID of the dataset to preview"
        }
      ];
    },
    getInputDefinitions(data, _connections, _nodes, _project) {
      const inputs = [];
      if (data.useDatasetIdInput) {
        inputs.push({
          id: "datasetId",
          dataType: "string",
          title: "Dataset Id"
        });
      }
      return inputs;
    },
    getOutputDefinitions() {
      return [
        {
          id: "models",
          dataType: "object[]",
          title: "response"
        }
      ];
    },
    getBody(data) {
      return rivet.dedent`
        Dataset Id: ${data.useDatasetIdInput ? "(Using Input)" : data.datasetId ? data.datasetId : "none."}
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
        data = await fetchData_default("GET", host, `/data/preview?dataset_id=${datasetId}`);
      } catch (error) {
        console.error("There was a problem with the fetch operation: ", error);
        throw error;
      }
      return {
        ["models"]: {
          type: "object[]",
          value: data
        }
      };
    }
  };
  const getDatasetPreviewNode = rivet.pluginNodeDefinition(
    getDatasetPreviewImpl,
    "Get Dataset Preview (TLab)"
  );
  return getDatasetPreviewNode;
}

// src/nodes/datasets/DownloadDataset.ts
function downloadDatasetPluginNode(rivet) {
  const downloadDatasetImpl = {
    // This should create a new instance of your node type from scratch.
    create() {
      const node = {
        id: rivet.newId(),
        data: {
          datasetName: "",
          useDatasetNameInput: false
        },
        title: "Download Datasets (TLab)",
        type: "downloadDataset",
        visualData: {
          x: 0,
          y: 0,
          width: 300
        }
      };
      return node;
    },
    getUIData() {
      return {
        contextMenuTitle: "Download Dataset (TLab)",
        group: "Datasets (TLab)",
        infoBoxBody: "Downloads a dataset from Huggingface.",
        infoBoxTitle: "Download Dataset"
      };
    },
    getEditors(_data) {
      return [
        {
          type: "string",
          dataKey: "datasetName",
          useInputToggleDataKey: "useDatasetNameInput",
          label: 'Huggingface dataset name. Use "copy" button on Huggingface to get the dataset name.'
        }
      ];
    },
    getInputDefinitions(data, _connections, _nodes, _project) {
      const inputs = [];
      if (data.useDatasetNameInput) {
        inputs.push({
          id: "datasetName",
          dataType: "string",
          title: "Huggingface dataset"
        });
      }
      return inputs;
    },
    getOutputDefinitions() {
      return [];
    },
    getBody(data) {
      return rivet.dedent`
        Huggingface dataset: ${data.useDatasetNameInput ? "(Using Input)" : data.datasetName ? data.datasetName : "none."}
      `;
    },
    async process(_data, _input, context) {
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
      console.error(datasetName);
      let data;
      try {
        data = await fetchData_default("GET", host, `/data/download?dataset_id=${datasetName}`);
      } catch (error) {
        console.error("There was a problem with the fetch operation: ", error);
        throw error;
      }
      return {
        ["status"]: {
          type: "object",
          value: data
        }
      };
    }
  };
  const downloadDatasetNode = rivet.pluginNodeDefinition(
    downloadDatasetImpl,
    "Download Dataset (TLab)"
  );
  return downloadDatasetNode;
}

// src/nodes/datasets/DeleteDataset.ts
function deleteDatasetPluginNode(rivet) {
  const deleteDatasetImpl = {
    // This should create a new instance of your node type from scratch.
    create() {
      const node = {
        id: rivet.newId(),
        data: {
          datasetId: "",
          useDatasetIdInput: false
        },
        title: "Delete Datasets (TLab)",
        type: "deleteDataset",
        visualData: {
          x: 0,
          y: 0,
          width: 300
        }
      };
      return node;
    },
    getUIData() {
      return {
        contextMenuTitle: "Delete Dataset (TLab)",
        group: "Datasets (TLab)",
        infoBoxBody: "Deletes a dataset to the Transformer Lab server.",
        infoBoxTitle: "Delete Dataset"
      };
    },
    getEditors(_data) {
      return [
        {
          type: "string",
          dataKey: "datasetId",
          useInputToggleDataKey: "useDatasetIdInput",
          label: "Dataset ID of the public dataset to delete"
        }
      ];
    },
    getInputDefinitions(data, _connections, _nodes, _project) {
      const inputs = [];
      if (data.useDatasetIdInput) {
        inputs.push({
          id: "datasetId",
          dataType: "string",
          title: "Dataset Id"
        });
      }
      return inputs;
    },
    getOutputDefinitions() {
      return [
        {
          id: "models",
          dataType: "object",
          title: "response"
        }
      ];
    },
    getBody(data) {
      return rivet.dedent`
        Dataset Id: ${data.useDatasetIdInput ? "(Using Input)" : data.datasetId ? data.datasetId : "none."}
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
        data = await fetchData_default("GET", host, `/data/delete?dataset_id=${datasetId}`);
      } catch (error) {
        console.error("There was a problem with the fetch operation: ", error);
        throw error;
      }
      return {
        ["models"]: {
          type: "object",
          value: data
        }
      };
    }
  };
  const deleteDatasetNode = rivet.pluginNodeDefinition(
    deleteDatasetImpl,
    "Delete Dataset (TLab)"
  );
  return deleteDatasetNode;
}

// src/nodes/datasets/AddDataset.ts
function addDatasetPluginNode(rivet) {
  const addDatasetImpl = {
    // This should create a new instance of your node type from scratch.
    create() {
      const node = {
        id: rivet.newId(),
        data: {
          datasetId: "",
          useDatasetIdInput: false,
          trainingData: "",
          evalData: ""
        },
        title: "Add Dataset (TLab)",
        type: "addDataset",
        visualData: {
          x: 0,
          y: 0,
          width: 300
        }
      };
      return node;
    },
    getUIData() {
      return {
        contextMenuTitle: "Add Dataset (TLab)",
        group: "Datasets (TLab)",
        infoBoxBody: "Adds a dataset to the Transformer Lab server.",
        infoBoxTitle: "Add Dataset"
      };
    },
    getEditors(_data) {
      return [
        {
          type: "string",
          dataKey: "datasetId",
          useInputToggleDataKey: "useDatasetIdInput",
          label: "Dataset ID of the public dataset to add"
        }
      ];
    },
    getInputDefinitions(data, _connections, _nodes, _project) {
      const inputs = [];
      if (data.useDatasetIdInput) {
        inputs.push({
          id: "datasetId",
          dataType: "string",
          title: "Dataset Id"
        });
      }
      inputs.push({
        id: "trainingData",
        dataType: "string",
        title: "Training Data (JSONL)"
      });
      inputs.push({
        id: "evalData",
        dataType: "string",
        title: "Evaluation Data (JSONL)"
      });
      return inputs;
    },
    getOutputDefinitions() {
      return [
        {
          id: "datasetId",
          dataType: "string",
          title: "datasetId"
        },
        {
          id: "trainingFile",
          dataType: "object",
          title: "trainingFile"
        },
        {
          id: "evalData",
          dataType: "object",
          title: "evalFile"
        }
      ];
    },
    getBody(data) {
      return rivet.dedent`
        Dataset Id: ${data.useDatasetIdInput ? "(Using Input)" : data.datasetId ? data.datasetId : "none."}
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
      const trainingData = rivet.coerceTypeOptional(
        _input["trainingData"],
        "string"
      );
      if (typeof trainingData === "undefined") {
        throw new Error("trainingData is undefined");
      } else if (!trainingData) {
        throw new Error("Training data is empty");
      }
      const fileBlobTraining = new Blob([trainingData], { type: "text/plain" });
      const formDataTraining = new FormData();
      formDataTraining.append("file", fileBlobTraining, `${datasetId}_train.jsonl`);
      const evalData = rivet.coerceTypeOptional(
        _input["evalData"],
        "string"
      );
      if (typeof evalData === "undefined") {
        throw new Error("evalData is undefined");
      } else if (!evalData) {
        throw new Error("Evaluation data is empty");
      }
      const fileBlobEval = new Blob([evalData], { type: "text/plain" });
      const formDataEval = new FormData();
      formDataEval.append("file", fileBlobEval, `${datasetId}_eval.jsonl`);
      try {
        await fetchData_default("GET", host, `/data/new?dataset_id=${datasetId}`);
      } catch (error) {
        console.error("There was a problem creating the dataset: ", error);
        throw error;
      }
      let dataTraining;
      try {
        dataTraining = await fetchData_default("POST", host, `/data/fileupload?dataset_id=${datasetId}`, null, formDataTraining);
      } catch (error) {
        console.error("There was a problem adding the file to the dataset: ", error);
        throw error;
      }
      let dataEval;
      try {
        dataEval = await fetchData_default("POST", host, `/data/fileupload?dataset_id=${datasetId}`, null, formDataEval);
      } catch (error) {
        console.error("There was a problem adding the file to the dataset: ", error);
        throw error;
      }
      return {
        ["datasetId"]: {
          type: "string",
          value: datasetId
        },
        ["trainingFile"]: {
          type: "string",
          value: dataTraining.filename
        },
        ["evalFile"]: {
          type: "string",
          value: dataEval.filename
        }
      };
    }
  };
  const addDatasetNode = rivet.pluginNodeDefinition(
    addDatasetImpl,
    "Add Dataset (TLab)"
  );
  return addDatasetNode;
}

// src/nodes/models/GetModels.ts
function getModelsPluginNode(rivet) {
  const getModelsImpl = {
    // This should create a new instance of your node type from scratch.
    create() {
      const node = {
        id: rivet.newId(),
        data: {},
        title: "Get Models (TLab)",
        type: "getModels",
        visualData: {
          x: 0,
          y: 0,
          width: 300
        }
      };
      return node;
    },
    getUIData() {
      return {
        contextMenuTitle: "Get Models (TLab)",
        group: "Models (TLab)",
        infoBoxBody: "Gets all the available models for the Chat endppoint.",
        infoBoxTitle: "Get Models"
      };
    },
    getInputDefinitions() {
      return [];
    },
    getOutputDefinitions() {
      return [
        {
          id: "models",
          dataType: "object[]",
          title: "response"
        }
      ];
    },
    getEditors() {
      return [];
    },
    getBody(data) {
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
        data = await fetchData_default("GET", host, "/model/list");
      } catch (error) {
        console.error("There was a problem with the fetch operation: ", error);
        throw error;
      }
      return {
        ["models"]: {
          type: "object[]",
          value: data
        }
      };
    }
  };
  const getModelsNode = rivet.pluginNodeDefinition(
    getModelsImpl,
    "Get Models (TLab)"
  );
  return getModelsNode;
}

// src/nodes/chat/Chat.ts
var chatPluginNode = (rivet) => {
  const impl = {
    create() {
      const node = {
        id: rivet.newId(),
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
          useUserInput: false
        },
        title: "Chat (TLab)",
        type: "chatPluginNode",
        visualData: {
          x: 0,
          y: 0,
          width: 250
        }
      };
      return node;
    },
    getInputDefinitions(data) {
      const inputs = [];
      inputs.push({
        id: "system-prompt",
        dataType: "string",
        title: "System Prompt",
        required: false
      });
      inputs.push({
        id: "messages",
        dataType: ["chat-message[]", "chat-message"],
        title: "Messages"
      });
      if (data.useModelInput) {
        inputs.push({
          id: "model",
          dataType: "string",
          title: "Model"
        });
      }
      if (data.useTemperatureInput) {
        inputs.push({
          id: "temperature",
          dataType: "number",
          title: "Temperature"
        });
      }
      if (data.useTopPInput) {
        inputs.push({
          id: "topP",
          dataType: "number",
          title: "top_p"
        });
      }
      if (data.useTopKInput) {
        inputs.push({
          id: "topK",
          dataType: "number",
          title: "top_k"
        });
      }
      if (data.useMaxTokensInput) {
        inputs.push({
          id: "maxTokens",
          dataType: "number",
          title: "max_tokens"
        });
      }
      if (data.usePresencePenaltyInput) {
        inputs.push({
          id: "presencePenalty",
          dataType: "number",
          title: "presence_penalty"
        });
      }
      if (data.useFrequencyPenaltyInput) {
        inputs.push({
          id: "frequencyPenalty",
          dataType: "number",
          title: "frequence_penalty"
        });
      }
      if (data.useUserInput) {
        inputs.push({
          id: "user",
          dataType: "string",
          title: "user"
        });
      }
      if (data.useStopInput) {
        inputs.push({
          id: "stop",
          dataType: "number",
          title: "stop"
        });
      }
      return inputs;
    },
    getOutputDefinitions(data) {
      let outputs = [
        {
          id: "output",
          dataType: "string",
          title: "Output"
        },
        {
          id: "messages-sent",
          dataType: "chat-message[]",
          title: "Messages Sent"
        },
        {
          id: "all-messages",
          dataType: "chat-message[]",
          title: "All Messages"
        }
      ];
      return outputs;
    },
    getEditors() {
      return [
        {
          type: "string",
          dataKey: "model",
          label: "Model",
          useInputToggleDataKey: "useModelInput",
          helperMessage: "The LLM model to use. Needs to be previously selected and run in Transformer Lab."
        },
        {
          type: "number",
          dataKey: "maxTokens",
          useInputToggleDataKey: "useMaxTokensInput",
          label: "max_tokens",
          helperMessage: "The maximum number of tokens to generate in the chat completion.",
          allowEmpty: false,
          defaultValue: 1024
        },
        {
          type: "number",
          dataKey: "temperature",
          useInputToggleDataKey: "useTemperatureInput",
          label: "Temperature",
          helperMessage: "The temperature of the model. Increasing the temperature will make the model answer more creatively. (Default: 0.8)",
          allowEmpty: true,
          defaultValue: 0.5
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
              helperMessage: "top_p value",
              min: 0,
              max: 1,
              step: 1,
              allowEmpty: true,
              defaultValue: 1
            },
            {
              type: "number",
              dataKey: "topK",
              useInputToggleDataKey: "useTopKInput",
              label: "top_k",
              helperMessage: "top_k value",
              min: -1,
              max: 1,
              step: 1,
              allowEmpty: true,
              defaultValue: -1
            },
            {
              type: "string",
              dataKey: "stop",
              useInputToggleDataKey: "useStopInput",
              label: "Stop",
              helperMessage: "Sets the stop sequences to use. When this pattern is encountered the LLM will stop generating text and return."
            },
            {
              type: "number",
              dataKey: "presencePenalty",
              useInputToggleDataKey: "usePresencePenaltyInput",
              label: "presence_penalty",
              helperMessage: "presence_penalty value",
              allowEmpty: true,
              defaultValue: 0
            },
            {
              type: "number",
              dataKey: "frequencyPenalty",
              useInputToggleDataKey: "useFrequencyPenaltyInput",
              label: "frequency_penalty",
              helperMessage: "frequency_penalty value",
              allowEmpty: true,
              defaultValue: 0
            },
            {
              type: "string",
              dataKey: "user",
              useInputToggleDataKey: "useUserInput",
              label: "user",
              helperMessage: "user value"
            }
          ]
        }
      ];
    },
    getBody(data) {
      return rivet.dedent`
          Model: ${data.useModelInput ? "(From Input)" : data.model || "Unset!"}
          Max tokens: ${data.maxTokens || 1024}
        `;
    },
    getUIData() {
      return {
        contextMenuTitle: "Chat (TLab)",
        group: "Chat (TLab)",
        infoBoxBody: "This is an Transformer Lab Chat node using /api/chat.",
        infoBoxTitle: "Chat Node (TLab)"
      };
    },
    async process(data, inputData, context) {
      let outputs = {};
      const host = context.getPluginConfig("host") || "http://localhost:8000";
      if (!host.trim()) {
        throw new Error("No host set!");
      }
      const model = rivet.getInputOrData(data, inputData, "model", "string");
      if (!model) {
        throw new Error("No model set!");
      }
      const systemPrompt = rivet.coerceTypeOptional(
        inputData["system-prompt"],
        "string"
      );
      const chatMessages = rivet.coerceTypeOptional(
        inputData["messages"],
        "chat-message[]"
      ) ?? [];
      const allMessages = systemPrompt ? [{ type: "system", message: systemPrompt }, ...chatMessages] : chatMessages;
      const inputMessages = allMessages.map((message) => {
        if (typeof message.message === "string") {
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
        user: rivet.getInputOrData(data, inputData, "user", "string")
      };
      let apiResponse;
      const requestBody = {
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
        user: parameters.user
      };
      try {
        apiResponse = await fetch(`${host}/v1/chat/completions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
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
      let response = await processStreamedResponse(reader, outputs, context);
      outputs["messages-sent"] = {
        type: "chat-message[]",
        value: allMessages
      };
      outputs["all-messages"] = {
        type: "chat-message[]",
        value: [
          ...allMessages,
          {
            type: "assistant",
            message: response,
            function_call: void 0,
            name: void 0
          }
        ]
      };
      return outputs;
    }
  };
  async function processStreamedResponse(reader, outputs, context) {
    let finalMessageContent = "";
    let finalResponse;
    let receivedData = false;
    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        break;
      }
      receivedData = true;
      const chunk = new TextDecoder().decode(value);
      const lines = chunk.split("\n");
      for (const line of lines) {
        if (line.startsWith("data: [DONE]")) {
          continue;
        }
        if (line.startsWith("data:")) {
          const jsonData = line.substring(5);
          try {
            const parsedData = JSON.parse(jsonData);
            if (!parsedData.done) {
              finalMessageContent += parsedData.choices[0].delta.content ?? "";
            } else {
              finalResponse = parsedData;
            }
            outputs["output"] = {
              type: "string",
              value: finalMessageContent
            };
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
    if (!receivedData) {
      throw new Error("No data received from Transformer Lab!");
    }
    return finalMessageContent;
  }
  return rivet.pluginNodeDefinition(impl, "Chat (TLab)");
};
function formatChatMessages(messages) {
  return messages.map((message) => ({
    role: message.type,
    content: message.message
  }));
}

// src/nodes/datasets/ObjectsToJSONLines.ts
function objectsToJSONLinesPluginNode(rivet) {
  const objectsToJSONLinesImpl = {
    // This should create a new instance of your node type from scratch.
    create() {
      const node = {
        id: rivet.newId(),
        data: {
          objects: []
        },
        title: "Object to JSON Lines",
        type: "objectsToJSONLines",
        visualData: {
          x: 0,
          y: 0,
          width: 300
        }
      };
      return node;
    },
    getUIData() {
      return {
        contextMenuTitle: "Object to JSON Lines",
        group: "Objects",
        infoBoxBody: "Converts object[] to JSON Lines (.jsonl)",
        infoBoxTitle: "Object to JSON Lines"
      };
    },
    getEditors(_data) {
      return [];
    },
    getInputDefinitions(data, _connections, _nodes, _project) {
      const inputs = [];
      inputs.push({
        id: "objects",
        dataType: "object[]",
        title: "object[]"
      });
      return inputs;
    },
    getOutputDefinitions() {
      return [
        {
          id: "jsonl",
          dataType: "string",
          title: "jsonl"
        }
      ];
    },
    getBody(data) {
      return rivet.dedent`
      `;
    },
    async process(_data, _input, context) {
      const objects = rivet.coerceTypeOptional(
        _input["objects"],
        "object[]"
      );
      let data = "";
      if (objects) {
        data = objects.map((obj) => JSON.stringify(obj)).join("\n");
      }
      return {
        ["jsonl"]: {
          type: "string",
          value: data
        }
      };
    }
  };
  const objectsToJSONLinesNode = rivet.pluginNodeDefinition(
    objectsToJSONLinesImpl,
    "Object to JSON Lines"
  );
  return objectsToJSONLinesNode;
}

// src/nodes/datasets/CreateTrainingData.ts
function createTrainingDataPluginNode(rivet) {
  const createTrainingDataImpl = {
    // This should create a new instance of your node type from scratch.
    create() {
      const node = {
        id: rivet.newId(),
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
          useDisjointEvaluation: false
        },
        title: "Create Training Data",
        type: "createTrainingData",
        visualData: {
          x: 0,
          y: 0,
          width: 300
        }
      };
      return node;
    },
    getUIData() {
      return {
        contextMenuTitle: "Create Training Data",
        group: "Datasets (TLab)",
        infoBoxBody: "Turns your data into training data for finetuning a model.",
        infoBoxTitle: "Create Training Data"
      };
    },
    getEditors(_data) {
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
          label: "Shuffle the data before splitting it into training and evaluation data?"
        },
        {
          type: "toggle",
          dataKey: "disjointEvaluation",
          useInputToggleDataKey: "useDisjointEvaluation",
          label: "Use disjoint evaluation data? (If false, the evaluation data will be a subset of the training data)"
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
          label: "Name of the key containing the prompt (e.g. question)"
        },
        {
          type: "string",
          dataKey: "generationKey",
          useInputToggleDataKey: "useGenerationKey",
          label: "Name of the key containing the expected answer of the LLM (e.g. answer)"
        },
        {
          type: "string",
          dataKey: "instructionKey",
          useInputToggleDataKey: "useInstructionKey",
          label: "Name of the key containing the instructions for the LLM (e.g. instructions)"
        },
        {
          type: "toggle",
          dataKey: "addInstructions",
          useInputToggleDataKey: "useAddInstructions",
          label: "Add instructions to the training data? (otherwise they will be left empty)"
        }
      ];
    },
    getInputDefinitions(data, _connections, _nodes, _project) {
      const inputs = [];
      if (data.useEvalDataPercent) {
        inputs.push({
          id: "evalDataPercent",
          dataType: "number",
          title: "Evaluation data (%)"
        });
      }
      if (data.usePromptKey) {
        inputs.push({
          id: "promptKey",
          dataType: "string",
          title: "Prompt key"
        });
      }
      if (data.useGenerationKey) {
        inputs.push({
          id: "generationKey",
          dataType: "string",
          title: "Generation key"
        });
      }
      if (data.useInstructionKey) {
        inputs.push({
          id: "instructionKey",
          dataType: "string",
          title: "Instruction key"
        });
      }
      if (data.useShuffleData) {
        inputs.push({
          id: "shuffleData",
          dataType: "boolean",
          title: "Shuffle data"
        });
      }
      if (data.useAddInstructions) {
        inputs.push({
          id: "addInstructions",
          dataType: "boolean",
          title: "Add instructions"
        });
      }
      if (data.useDisjointEvaluation) {
        inputs.push({
          id: "disjointEvaluation",
          dataType: "boolean",
          title: "Disjoint Evaluation"
        });
      }
      inputs.push({
        id: "trainingData",
        dataType: "object[]",
        title: "Training data"
      });
      return inputs;
    },
    getOutputDefinitions() {
      return [
        {
          id: "trainingData",
          dataType: "string",
          title: "trainingData"
        },
        {
          id: "evalData",
          dataType: "string",
          title: "evaluationData"
        }
      ];
    },
    getBody(data) {
      return rivet.dedent`
        Evaluation data (%): ${data.useEvalDataPercent ? "(Using Input)" : data.evalDataPercent ? data.evalDataPercent : "none."}
        Shuffle Data: ${data.useShuffleData ? "(Using Input)" : data.shuffleData ? "true" : "false"}
        Output Format: ${data.outputFormat}
      `;
    },
    async process(_data, _input, context) {
      const evalDataPercent = rivet.getInputOrData(
        _data,
        _input,
        "evalDataPercent",
        "number"
      );
      const promptKey = rivet.getInputOrData(
        _data,
        _input,
        "promptKey",
        "string"
      );
      const generationKey = rivet.getInputOrData(
        _data,
        _input,
        "generationKey",
        "string"
      );
      const instructionKey = rivet.getInputOrData(
        _data,
        _input,
        "instructionKey",
        "string"
      );
      const shuffleData = rivet.getInputOrData(
        _data,
        _input,
        "shuffleData",
        "boolean"
      );
      const addInstructions = rivet.getInputOrData(
        _data,
        _input,
        "addInstructions",
        "boolean"
      );
      const disjointEvaluation = rivet.getInputOrData(
        _data,
        _input,
        "disjointEvaluation",
        "boolean"
      );
      const outputFormat = rivet.getInputOrData(
        _data,
        _input,
        "outputFormat",
        "string"
      );
      const trainingData = rivet.coerceTypeOptional(
        _input["trainingData"],
        "object[]"
      );
      if (!trainingData) {
        throw new Error("Training Data is required.");
      }
      if (evalDataPercent === void 0 || evalDataPercent === null) {
        throw new Error("Evaluation Data Percent is required.");
      }
      if (!promptKey) {
        throw new Error("Prompt Key is required.");
      }
      if (!generationKey) {
        throw new Error("Generation Key is required.");
      }
      if (shuffleData) {
        trainingData.sort(() => Math.random() - 0.5);
      }
      let trainingDataMapped = trainingData.map((item) => {
        return {
          prompt: item[promptKey],
          generation: item[generationKey],
          instruction: addInstructions && instructionKey !== void 0 ? item[instructionKey] : ""
        };
      });
      let trainingDataObject;
      let evalDataObject;
      if (disjointEvaluation) {
        const evalData = trainingDataMapped.splice(0, Math.floor(trainingDataMapped.length * (evalDataPercent / 100)));
        trainingDataObject = {
          type: "object[]",
          value: trainingDataMapped
        };
        evalDataObject = {
          type: "object[]",
          value: evalData
        };
      } else {
        const evalData = trainingDataMapped.slice(0, Math.floor(trainingDataMapped.length * (evalDataPercent / 100)));
        trainingDataObject = {
          type: "object[]",
          value: trainingDataMapped
        };
        evalDataObject = {
          type: "object[]",
          value: evalData
        };
      }
      let trainingDataJSONL;
      let evalDataJSONL;
      if (outputFormat == "jsonl") {
        trainingDataJSONL = trainingDataObject.value.map((item) => {
          return JSON.stringify(item);
        }).join("\n");
        evalDataJSONL = evalDataObject.value.map((item) => {
          return JSON.stringify(item);
        }).join("\n");
      }
      return {
        ["trainingData"]: {
          type: "string",
          value: trainingDataJSONL
        },
        ["evalData"]: {
          type: "string",
          value: evalDataJSONL
        }
      };
    }
  };
  const createTrainingDataNode = rivet.pluginNodeDefinition(
    createTrainingDataImpl,
    "Create Training Data"
  );
  return createTrainingDataNode;
}

// src/index.ts
var plugin = (rivet) => {
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
  const transformerLabsPlugin = {
    id: "transformerlabs-plugin",
    name: "Transformer Lab",
    configSpec: {
      host: {
        type: "string",
        label: "host",
        description: "This is the host URL of Transformer Labs API. Default value his http://localhost:8000 (Note: You need to use the Node excecutor! If localhost does not work, try http://127.0.0.1:8000)",
        helperText: "This is the host URL of Transformer Labs API. Default value his http://localhost:8000 (Note: You need to use the Node excecutor! If localhost does not work, try http://127.0.0.1:8000)"
      }
    },
    contextMenuGroups: [
      {
        id: "TLabDatasets",
        label: "Datasets (TLab)"
      },
      {
        id: "TLabChat",
        label: "Chat (TLab)"
      },
      {
        id: "TLabModels",
        label: "Models (TLab)"
      }
    ],
    register: (register) => {
      register(getPublicDatasetListNode);
      register(getDatasetListNode);
      register(getDatasetPreviewNode);
      register(downloadDatasetNode);
      register(deleteDatasetNode);
      register(addDatasetNode);
      register(createTrainingDataNode);
      register(ChatNode);
    }
  };
  return transformerLabsPlugin;
};
var src_default = plugin;
export {
  src_default as default
};
