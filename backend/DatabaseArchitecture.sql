CREATE TABLE public.projects (
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    id UUID PRIMARY KEY,
    name TEXT NOT NULL,

    CONSTRAINT unique_user_project_name UNIQUE (user_id, name)
);
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;


CREATE TABLE public.data_models (
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    id UUID PRIMARY KEY,
    name TEXT NOT NULL,

    CONSTRAINT unique_project_data_model_name UNIQUE (project_id, name)
);
ALTER TABLE public.data_models ENABLE ROW LEVEL SECURITY;


CREATE TABLE public.data_model_fields (
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    data_model_id UUID NOT NULL REFERENCES data_models(id) ON DELETE CASCADE,
    id UUID NOT NULL PRIMARY KEY,
    name TEXT NOT NULL, 
    type TEXT NOT NULL,
    description TEXT,

    CONSTRAINT unique_data_model_field_name UNIQUE (data_model_id, name)
);
ALTER TABLE public.data_model_fields ENABLE ROW LEVEL SECURITY;



CREATE TABLE public.workflows (
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    id UUID PRIMARY KEY,
    name TEXT NOT NULL,
    llm TEXT NOT NULL,
    input_data_model UUID NOT NULL REFERENCES data_models(id),
    output_data_model UUID NOT NULL REFERENCES data_models(id),
    active BOOLEAN NOT NULL,

    -- CONSTRAINTs
    CONSTRAINT unique_project_workflow_name UNIQUE (project_id, name)
);
ALTER TABLE public.workflows ENABLE ROW LEVEL SECURITY;





CREATE TABLE workflow_api_keys (
    id UUID PRIMARY KEY,
    workflow_id UUID NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    api_key TEXT NOT NULL,
    api_key_preview TEXT NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    last_used_at TIMESTAMP WITH TIME ZONE,
    last_refreshed_at TIMESTAMP WITH TIME ZONE,

    -- CONSTRAINTs
    CONSTRAINT unique_api_key UNIQUE (workflow_id, api_key),
    CONSTRAINT unique_api_key_name UNIQUE (workflow_id, name)
)
ALTER TABLE public.workflow_api_keys ENABLE ROW LEVEL SECURITY;







-- Row-Level Security aktivieren und Policies anlegen

-- projects





-- data_models
ALTER TABLE data_models ENABLE ROW LEVEL SECURITY;
CREATE POLICY data_models_rls ON data_models
  USING (user_id = current_setting('mimr.current_user'));

-- data_model_fields
ALTER TABLE data_model_fields ENABLE ROW LEVEL SECURITY;
CREATE POLICY data_model_fields_rls ON data_model_fields
  USING (user_id = current_setting('mimr.current_user'));


-- workflows
ALTER TABLE workflows ENABLE ROW LEVEL SECURITY;
CREATE POLICY workflows_rls ON workflows
  USING (user_id = current_setting('mimr.current_user'));

-- workflow_api_keys
ALTER TABLE workflow_api_keys ENABLE ROW LEVEL SECURITY;
CREATE POLICY workflow_api_keys_rls ON workflow_api_keys
  USING (user_id = current_setting('mimr.current_user'));

-- llms
ALTER TABLE llms ENABLE ROW LEVEL SECURITY;
CREATE POLICY llms_rls ON llms
  USING (user_id = current_setting('mimr.current_user'));


ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only view their own projects" 
ON public.projects 
FOR SELECT
USING (auth.uid() = user_id);
