CREATE TABLE users (
    id TEXT PRIMARY KEY  -- Firebase user id 
);


CREATE TABLE projects (
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    id UUID PRIMARY KEY,
    name TEXT NOT NULL
);


CREATE TABLE data_models (
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,

    id UUID PRIMARY KEY,
    name TEXT NOT NULL
);


CREATE TABLE data_model_fields (
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    data_model_id UUID NOT NULL REFERENCES data_models(id) ON DELETE CASCADE, 

    id UUID NOT NULL PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    description TEXT
);