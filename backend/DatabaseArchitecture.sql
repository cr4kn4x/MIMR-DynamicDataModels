CREATE TABLE users (
    id TEXT PRIMARY KEY  -- Firebase user id 
);

CREATE TABLE projects (
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    id UUID PRIMARY KEY,
    name TEXT NOT NULL
);


CREATE TABLE data_models (
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,

    id UUID PRIMARY KEY, 
    name TEXT NOT NULL
)
-- 




CREATE TABLE data_model_fields (
    data_model_field_id UUID PRIMARY KEY,
    data_model_id UUID NOT NULL REFERENCES data_models(data_model_id) ON DELETE CASCADE,
    field_name TEXT NOT NULL,
    field_type TEXT NOT NULL,
    field_description TEXT
);