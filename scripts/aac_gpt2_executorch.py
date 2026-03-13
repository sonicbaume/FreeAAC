import torch
import transformers
from executorch.exir import EdgeCompileConfig, to_edge
from torch.export import export, Dim

class GPT2ExportWrapper(torch.nn.Module):
    def __init__(self, model):
        super().__init__()
        self.model = model

    def forward(self, input_ids):
        outputs = self.model(input_ids, return_dict=False)
        return outputs[0]

def export_model():
    modelname = "IntelLabs/aac_gpt2"

    print(f"Loading {modelname}...")
    hf_model = transformers.GPT2LMHeadModel.from_pretrained(modelname, use_safetensors=False)
    hf_model.eval()
    model = GPT2ExportWrapper(hf_model)
    dummy_seq_len = 10
    example_inputs = (
        torch.randint(0, hf_model.config.vocab_size, (1, dummy_seq_len), dtype=torch.long),
    )
    seq_len_dim = Dim("seq_len", min=1, max=hf_model.config.max_position_embeddings)
    dynamic_shape = (
        {1: seq_len_dim},
    )

    print("Tracing the model...")
    with torch.no_grad():
        traced_model = export(model, example_inputs, dynamic_shapes=dynamic_shape)

    print("Converting to ExecuTorch Edge IR...")
    edge_config = EdgeCompileConfig(_check_ir_validity=False)
    edge_manager = to_edge(traced_model, compile_config=edge_config)
    et_program = edge_manager.to_executorch()

    print("Saving to aac_gpt2.pte...")
    with open("aac_gpt2.pte", "wb") as file:
        file.write(et_program.buffer)
        
    print("Export successful!")

if __name__ == "__main__":
    export_model()