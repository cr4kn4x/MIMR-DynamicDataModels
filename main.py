import typing
import dspy
from pydantic import BaseModel, Field

key = "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"
llm = dspy.LM(model="openai/qwen/qwen3-8b:free", base_url="https://openrouter.ai/api/v1", api_key=key)





class Person(BaseModel): 
    name: str 
    alter: int
    hooby: str



# LLM PROGRAM
class sampleSignature(dspy.Signature):
    """Extrahier falls vorhanden die Information zu der Person aus dem Text"""
    text: str = dspy.InputField() 
    person: typing.Optional[Person] = dspy.OutputField()

# finalze initialisierung
program = dspy.Predict(sampleSignature)


# text = "Peter ist eine Person die 23 Jahre alt ist und gerne Fußball spielt."
text = "Hallo Welt!"

with dspy.settings.context(lm=llm):
    pred = program(text=text)

person = pred.person
print(person)

