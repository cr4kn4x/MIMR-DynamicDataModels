"use client"

import { apiCallWrapper } from '@/lib/api/ApiCallWrapper'
import { getAllProjects, getDataModelsByProjectId } from '@/lib/api/DataModelApi'
import { getLlms } from '@/lib/api/WorkflowApi'
import { DataModel, Project } from '@/lib/interfaces/DataModelInterfaces'
import { LLM } from '@/lib/interfaces/LlmInterfaces'
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react'
import { toast } from 'sonner'
import { useSearchParams, useRouter } from "next/navigation"
import { Router } from 'lucide-react'


interface ProjectContextType {
    projects: Project[]
    refresh_projects: () => void

    selected_project_id: string | null
    set_selected_project_id: (id: string | null) => void
    selected_project: Project | null


    data_models: DataModel[]
    refresh_data_models: () => void

    llms: LLM[]
    refresh_llms: () => void
}


const ProjectContext = createContext<ProjectContextType | undefined>(undefined);


export const useProject = (): ProjectContextType => {
    const ctx = useContext(ProjectContext)
    if (!ctx) {
        throw new Error('useProject must be used within a ProjectProvider')
    }
    return ctx
}


interface ProjectProviderProps {
    children: ReactNode
}

export const ProjectProvider: React.FC<ProjectProviderProps> = ({ children }) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    // State management for projects, data models, and LLMs
    const [selected_project_id, set_selected_project_id] = useState<string | null>(null);
    const [projects, set_projects] = useState<Project[]>([]);
    const [data_models, set_data_models] = useState<DataModel[]>([]);
    const [llms, set_llms] = useState<LLM[]>([]);

    // Refresh functions for fetching data
    const refresh_llms = async () => {
        const res = await apiCallWrapper(getLlms(), toast, "Error while fetching LLMs");
        if (res) set_llms(res.llms);
    };

    const refresh_projects = async () => {
        const res = await apiCallWrapper(getAllProjects(), toast, "Error while fetching projects");
        if (res) set_projects(res.projects);
    };

    const refresh_data_models = async () => {
        if (selected_project_id) {
            const res = await apiCallWrapper(getDataModelsByProjectId(selected_project_id), toast, "Error while fetching DataModels");
            if (res) set_data_models(res.data_models);
            return;
        }
        set_data_models([]); // Clear data models if no project is selected
    };

    // Initial data fetch and URL parameter handling
    useEffect(() => {
        refresh_llms();
        refresh_projects();

        const url_project_id = searchParams.get("project_id");
        if (url_project_id) {
            set_selected_project_id(url_project_id);
        }
    }, []);

    // Fetch data models when the selected project changes
    useEffect(() => {
        if (selected_project_id) {
            refresh_data_models();
        }
    }, [selected_project_id]);

    // Derive the selected project from the list of projects
    const selected_project = projects.find((p) => p.id === selected_project_id) ?? null;

    return (
        <ProjectContext.Provider
            value={{
                projects,
                refresh_projects,
                selected_project_id,
                set_selected_project_id,
                selected_project,
                data_models,
                refresh_data_models,
                llms,
                refresh_llms,
            }}
        >
            {children}
        </ProjectContext.Provider>
    );
};
