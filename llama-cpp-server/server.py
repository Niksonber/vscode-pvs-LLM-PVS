import re
import time

from pydantic import BaseModel
from fastapi import FastAPI

from inference import generate_query_top_k

app = FastAPI()

previous_suggestons = {}

@app.get("/suggestions")
async def get_suggestion(sequent: str):
    global previous_suggestons
    def preprocess(text):
        return re.sub(r'^[\w ].*?:', '', sequent).strip() + '\n\nRule?'

    sequent = preprocess(sequent)
    print(f"Predicting commands for sequent:\n{sequent}")

    if sequent not in previous_suggestons:
        suggestions = generate_query_top_k(sequent, top_k=5, max_new_tokens=20)
        previous_suggestons[sequent] = suggestions
    else:
        suggestions = previous_suggestons[sequent]
        print("caching")
        time.sleep(0.5)

    print(suggestions)

    return suggestions
