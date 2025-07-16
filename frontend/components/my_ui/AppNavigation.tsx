"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { LogOutIcon, WorkflowIcon, DatabaseIcon } from "lucide-react"
import { getAuth, signOut } from "firebase/auth"
import firebaseApp from "@/lib/firebase"
import { cn } from "@/lib/utils"
import { ProjectSelectorCombobox } from "./ProjectSelectorCombobox"
import { Project } from "@/lib/interfaces/DataModelInterfaces"


async function handleLogout(router: any) {
  try {
    const auth = getAuth(firebaseApp)
    await signOut(auth)
    router.push("/Login")
  } catch (error) {
    console.error("Logout error:", error)
  }
}

interface AppNavigationProps {
  children?: React.ReactNode,

  selected_project_id: string | null, 
  projects: Project[],
  refresh_projects_list: () => void, 
  set_selected_project_id: (id: string | null) => void
}

export function AppNavigation({children, selected_project_id, projects, refresh_projects_list, set_selected_project_id}: AppNavigationProps) {
  const router = useRouter()
  const pathname = usePathname()

  const isWorkflowsActive = pathname.startsWith("/Workflows")
  const isDataModelsActive = pathname.startsWith("/DataModels")

  return (
    <header className="border-b px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">

          <ProjectSelectorCombobox 
            selected_project_id={selected_project_id}
            projects={projects}
            refresh_projects_list={refresh_projects_list}
            set_selected_project_id={set_selected_project_id}
            /> 
        </div>

        <div className="flex items-center space-x-3">
          {/* Navigation Links */}
          <nav className="flex items-center space-x-2">
            <Button
              variant={isWorkflowsActive ? "default" : "ghost"}
              size="sm"
              asChild
            >
              <Link href={selected_project_id ? `/Workflows?project_id=${selected_project_id}` : "/Workflows"}>
                <WorkflowIcon className="w-4 h-4 mr-2" />
                Workflows
              </Link>
            </Button>
            <Button
              variant={isDataModelsActive ? "default" : "ghost"}
              size="sm"
              asChild
            >
              <Link href={selected_project_id ? `/DataModels?project_id=${selected_project_id}` : "/DataModels"}>
                <DatabaseIcon className="w-4 h-4 mr-2" />
                Data Models
              </Link>
            </Button>
          </nav>

          <Separator orientation="vertical" className="h-6" />

          {/* Page-specific controls */}
          {children}

          <Separator orientation="vertical" className="h-6" />

          {/* Logout Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleLogout(router)}
          >
            <LogOutIcon className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  )
}
