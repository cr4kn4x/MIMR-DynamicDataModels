import typing
import dspy
from pydantic import BaseModel, Field, create_model








import sys
sys.exit(0)


class dspy_signature(dspy.Signature): 
    """
    Prompt... 
    """
    msg: str = dspy.InputField()
    sentiment: typing.Literal["positive", "negative", "neutral"] = dspy.OutputField() 


def create_dspy_signature_class(class_name, input_fields, output_fields):
    """
    Dynamisch eine dspy.Signature-Klasse erzeugen.
    input_fields: List[Tuple[str, type]]
    output_fields: List[Tuple[str, type]]
    """
    namespace = dict()
    annotations = dict()
    for name, typ in input_fields:
        namespace[name] = dspy.InputField()
        annotations[name] = typ
    for name, typ in output_fields:
        namespace[name] = dspy.OutputField()
        annotations[name] = typ
    namespace['__annotations__'] = annotations
    return type(class_name, (dspy.Signature,), namespace)


# Beispielhafte Nutzung:
input_fields = [("msg", str)]
output_fields = [("sentiment", typing.Literal["positive", "negative", "neutral"])]
DynamicSignature = create_dspy_signature_class("DynamicSignature", input_fields, output_fields)






print(dspy_signature.output_fields)
print(DynamicSignature.output_fields)





model = create_model(
    "ModelName",
    name=(str, Field())
)








