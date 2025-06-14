CREATE TABLE users (
    -- firebase user id
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL -- UNIQUE
);


CREATE TABLE projects (
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    -- project_id
    id UUID PRIMARY KEY,
    -- project attributes
    name TEXT NOT NULL,

    -- CONSTRAINTs
    CONSTRAINT unique_user_project_name UNIQUE (user_id, name)
);


CREATE TABLE data_models (
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    -- data_model id
    id UUID PRIMARY KEY,
    -- data_model_attributes
    name TEXT NOT NULL,

    -- CONSTRAINTs
    CONSTRAINT unique_project_data_model_name UNIQUE (project_id, name)
);


CREATE TABLE data_model_fields (
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    data_model_id UUID NOT NULL REFERENCES data_models(id) ON DELETE CASCADE,
    -- data_model_field id
    id UUID NOT NULL PRIMARY KEY,
    -- data_model attributes
    name TEXT NOT NULL, 
    type TEXT NOT NULL,
    description TEXT,

    -- CONSTRAINTs
    CONSTRAINT unique_data_model_field_name UNIQUE (data_model_id, name)
);



CREATE TABLE workflows (
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    -- workflow id 
    id UUID PRIMARY KEY,
    -- workflow attributes
    name TEXT NOT NULL,
    input_data_model UUID NOT NULL REFERENCES data_models(id),
    output_data_model UUID NOT NULL REFERENCES data_models(id),

    -- CONSTRAINTs
    CONSTRAINT unique_project_workflow_name UNIQUE (project_id, name)
);