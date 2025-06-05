

CREATE TABLE users (
    user_id TEXT PRIMARY KEY 
);


CREATE TABLE projects (
    project_id UUID PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    project_name TEXT NOT NULL
);

