import typing
import dspy
import os
from dotenv import load_dotenv
from typing import Annotated
from pydantic import BaseModel, Field, create_model, ValidationError, field_validator, StringConstraints


import uuid


while True:
    u = uuid.uuid4()
    if (len(str(u))) != 36: 
        print("WWWWWWWWWWW")


import sys
sys.exit(0)

load_dotenv("./secrets/.env")







class Person(BaseModel): 
    age: int = Field()

    @field_validator("age")
    def validate_age(cls, value): 
        raise ValueError("Value cannot be empty")




try: 
    t = Person(age=10)
except ValidationError as e: 
    print(e)
except ValueError as e: 
    print("VALUE ERROR!")
except Exception as e: 
    print("STH ELSE!")


import sys
sys.exit(0)







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