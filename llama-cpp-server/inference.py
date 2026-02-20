import numpy as np
from llama_cpp import Llama


MERGED_MODEL = './models/2025.04.11-1-pvs-masked-clean-data-lora.Q8_0.gguf'
STOP = [")\n"]

model = Llama(
    model_path=MERGED_MODEL,
    n_ctx=2048,
    n_gpu_layers=99,
    verbose=False,
    logits_all=True
)


def generate_query(prompt):
    return model(
        prompt,
        max_tokens=6,
        stop=[")\n", "\n" " \""],
        temperature=1,
        top_k=1,
        top_p=.5,
        seed=42,
        # logits_all=True,
    )["choices"][0]["text"]


def generate_query_top_k(prompt, top_k=10, max_new_tokens=6, show=False):
    if prompt.endswith('Rule?'):
        prompt += ' ('

    logprobs = model(
        prompt,
        max_tokens=1,
        stop=STOP,
        temperature=1,
        top_k=1,
        top_p=.5,
        seed=42,
        logprobs=top_k,

    )["choices"][0]["logprobs"]["top_logprobs"][0]
    pred_tokens = sorted(logprobs.items(), key=lambda x: -x[1])

    responses = []
    if show:
        print(pred_tokens)

    for token, log_prob in pred_tokens:
        output = model.create_completion(
            prompt + token,
            max_tokens=max_new_tokens - 1,
            stop=STOP,
            temperature=1,
            top_k=1,
            top_p=.5,
            seed=42,
        )["choices"][0]
        completion = output["text"]
        prob = np.exp(log_prob).item()
        responses.append({'cmd': token + completion, 'prob': prob})

    return sorted(responses, key=lambda x: -x['prob'])
