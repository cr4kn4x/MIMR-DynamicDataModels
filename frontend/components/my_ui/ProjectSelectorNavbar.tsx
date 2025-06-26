import { ProjectSelectorCombobox } from "@/components/my_ui/ProjectSelectorCombobox"
import { useProject } from "@/context/ProjectContext"
import { useEffect, useState } from "react"
import { getAllProjects } from "@/lib/api/DataModelApi"
import { Project } from "@/lib/interfaces/DataModelInterfaces"

export function ProjectSelectorNavbar() {
  const { project, setProject } = useProject()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  async function refresh_projects_list() {
    setLoading(true)
    try {
      const res = await getAllProjects()
      setProjects(res.projects)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh_projects_list()
  }, [])

  return (
    <ProjectSelectorCombobox
      projects={projects}
      selected_project_id={project?.id ?? null}
      set_selected_project_id={id => {
        const selected = projects.find(p => p.id === id) || null
        setProject(selected)
      }}
      refresh_projects_list={refresh_projects_list}
    />
  )
}
