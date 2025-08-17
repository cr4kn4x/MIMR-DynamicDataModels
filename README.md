# MIMR — Make It Machine Readable

MIMR is a proof-of-concept platform that converts unstructured text into typed, machine-readable JSON using configurable data models and LLM-powered workflows. Build JSON-schema-style data models, chain them into workflows, secure access with API keys, and run extractions via an LLM.

![Login screenshot](https://github.com/user-attachments/assets/ffcb9a4e-9ef4-4746-b3da-275a0dc96ead)

## Key features

- User authentication and registration via Supabase (email confirmation required).
- Project-based organization for separating topics and datasets.
- Visual Data Model Editor: create typed JSON Schema-like models.
- Workflow builder: map input and output DataModels and run LLM-based extractions.
- API access: generate API keys in the UI to call workflows programmatically.
- Built-in LLM (default: Llama 3.1 8B instruct). Extensible to other models.
- Planned: universal metric / annotation pipeline and prompt optimization (DSPY / MIPROv2).

## Quick walkthrough

1. Register and confirm your email (Supabase handles auth and confirmation).
2. Create a Project.

   ![create project - step 1](https://github.com/user-attachments/assets/0a369f1a-ac62-4d12-9013-4997374c3bff)
   ![create project - step 2](https://github.com/user-attachments/assets/8c1a0409-9b26-4ab5-becb-30ae8521249d)

3. Define Data Models with the Data Model Editor:
   - Example: input model `Text` (raw text).
   - Example: output model `Person` with `name: string`, `age: integer`.

   ![data model editor - example 1](https://github.com/user-attachments/assets/c3e41961-112f-4fa5-a97b-528dcc7379a8)
   ![data model editor - example 2](https://github.com/user-attachments/assets/deadf4c3-5479-4840-bd52-95f36bb15118)

4. Switch to the Workflows tab and create your first Workflow based on your defined DataModels.

   ![workflows tab](https://github.com/user-attachments/assets/6826ec5d-e846-4c3b-8b07-e75762c8dc97)

5. Create a Workflow that links input and output models and configure parameters.

   ![workflow setup](https://github.com/user-attachments/assets/260bad43-7ff8-4642-a63e-2ae03666d40d)

6. Once the workflow is created you'll be redirected to the Workflow View Page to inspect settings and configurations.

   ![workflow view](https://github.com/user-attachments/assets/39ef450d-d54a-458b-99b3-1c0f22ca0cdf)

7. Create an API Key in **Access & Security** and call the workflow via HTTP. The request uses the input model in the `data` field and the response contains the model-conforming result in `pred`.

   ![api key manager](https://github.com/user-attachments/assets/e56c567a-91d0-441a-b096-8d437a323165)

Example curl (replace placeholders):

```bash
curl -X POST "https://<backend-host>/api/predict/<workflow-id>" \
  -H "Authorization: Bearer <API_KEY>" \
  -H "Content-Type: application/json" \
  -d '{"data": {"text": "Alice (30) likes hiking and chess."}}'
```

Example response (output matches the `Person` data model in `pred`):

```json
{
  "pred": { "name": "Alice", "age": 30 }
}
```

![example result](https://github.com/user-attachments/assets/75095aa1-d149-4fc6-9585-51b65ff1336f)

## Architecture & tech stack

- Frontend: Next.js + React + TypeScript (code in `frontend/`).
- Backend: Python (Flask) with a custom workflow engine (code in `backend/`).
- Auth & storage: Supabase (Postgres including RLS).
- LLM: Llama 3.1 8B instruct (default). Integration layer (litellm) allows swapping between various providers.
- Other: DSPY / MIPROv2 optimizers and an annotation / metric pipeline (work in progress).

## Development

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Backend:

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
# set required env vars (Supabase keys, LLM config)
flask --app app.py run --debug
```

Set Environment variables (Backend secrets/.env)):
`SUPABASE_POSTGRES_DSN` `DEEPINFRA_API` `SUPABASE_URL` `SUPABASE_ANON_KEY` `SUPABASE_SERVICE_KEY_SECRET`

## Roadmap & caveats

Planned improvements:
- Security improvements, Usage tracking, LLM Observability
- Unit Tests
- Universal evaluation metric and labeling UI (In Progress: Annotations / DataStudioWizard).
- Prompt & few-shot optimization via MIPROv2 / DSPY.

Caveats:
- Prototype — not production or security hardened

## Contributing
- Open issues for bugs and feature requests.
- Create PRs. Describe changes


## License
TBD
