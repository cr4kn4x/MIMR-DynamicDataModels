import typing
import dspy
import os
from dotenv import load_dotenv
from pydantic import BaseModel, Field, create_model
load_dotenv("./secrets/.env")


t = create_model(
    "model_name  g", # this is all user input from UI
    name=(str, Field(description="this is a name")), 
    age=(int, Field())
)


print(t.model_json_schema())



qwen = dspy.LM(model="openai/Qwen/Qwen3-14B", max_tokens=512, base_url="https://api.deepinfra.com/v1/openai", api_key=os.environ.get("DEEPINFRA_API"))



# 
t = create_model(
    "*",
    name=(str, Field(description="this is a name")), 
    age=(int, Field())
)



o = t(name="", age=2)
print(o)
print(t.model_json_schema())



class ExtractionSignature(dspy.Signature):
    text: str = dspy.InputField() 
    prediction: typing.List[t] = dspy.OutputField() 


program = dspy.Predict(ExtractionSignature)


text = "Tim is 10 years old. Sven is his father. He is 45 years old"
with dspy.settings.context(lm=qwen):
    pred = program(text=text)

print(pred.prediction)