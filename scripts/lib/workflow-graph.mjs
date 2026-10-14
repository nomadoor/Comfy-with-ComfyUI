// Reading a ComfyUI workflow JSON: shared by the Runpod profile builder and the authoring scripts.

// Widget values with these extensions name a model file. Mirrors MODEL_EXT in
// runpod/image/bootstrap/verify.py, which applies the same rule on the Pod.
export const MODEL_EXT = /\.(safetensors|gguf|ckpt|pt|pth|bin|sft)$/i;

// Every node of a workflow, including the nodes inside its subgraph definitions.
export const eachNode = function* (workflow) {
  yield* workflow.nodes ?? [];
  for (const subgraph of workflow.definitions?.subgraphs ?? []) yield* subgraph.nodes ?? [];
};
