#!/bin/bash

# AI Autopilot Master Control Script
# This script serves as the central interface for interacting with the AI autopilot system

# Make scripts executable
chmod +x initialize_project.sh next_role.sh generate_project_idea.sh verify_changes.sh git_operations.sh

# Function to display usage information
show_usage() {
  echo "AI Autopilot - Software Development Automation"
  echo "==============================================="
  echo "Usage: ./autopilot.sh [command] [options]"
  echo ""
  echo "Available commands:"
  echo "  new-project <name> [description]    Create a new project (with optional description)"
  echo "  generate-idea                       Generate project ideas"
  echo "  next-role <project_name>            Advance to next role for the specified project"
  echo "  verify-changes <project_name>       Verify changes meet specifications (after QA)"
  echo "  status [project_name]               Show status of all projects or a specific project"
  echo "  list-projects                       List all projects in the system"
  echo "  git <action> [args]                 Perform git operations (commit, push, create-pr, merge-pr)"
  echo "  help                                Display this help message"
  echo ""
  echo "Examples:"
  echo "  ./autopilot.sh new-project task-manager \"A web application for managing tasks\""
  echo "  ./autopilot.sh next-role task-manager"
  echo "  ./autopilot.sh verify-changes task-manager"
  echo "  ./autopilot.sh git commit task-manager \"Developer\" 1"
  echo "  ./autopilot.sh status"
}

# Function to list all projects
list_projects() {
  echo "Current projects in the system:"
  echo "=============================="
  
  if [ -d "./projects" ]; then
    # Check if projects directory exists and has subdirectories
    projects=$(find ./projects -maxdepth 1 -type d | grep -v "^./projects$" | sort)
    
    if [ -z "$projects" ]; then
      echo "No projects found. Create one with './autopilot.sh new-project <name>'"
    else
      for project in $projects; do
        project_name=$(basename "$project")
        
        # Extract current role and phase from project status file
        if [ -f "./projects/$project_name/project_status.md" ]; then
          role=$(grep -oP '(?<=\*\*Active Role:\*\* ).*' "./projects/$project_name/project_status.md" || echo "Unknown")
          phase=$(grep -oP '(?<=\*\*Current Phase:\*\* ).*' "./projects/$project_name/project_status.md" || echo "Unknown")
          iteration=$(grep -oP '(?<=\*\*Current Iteration:\*\* ).*' "./projects/$project_name/project_status.md" || echo "1")
          
          echo "- $project_name (Iteration: $iteration, Role: $role, Phase: $phase)"
        else
          echo "- $project_name (Status file not found)"
        fi
      done
    fi
  else
    echo "Projects directory not found. Create a project with './autopilot.sh new-project <name>'"
  fi
}

# Function to show project status
show_status() {
  local project=$1
  
  if [ -z "$project" ]; then
    # Show summary of all projects
    list_projects
  else
    # Show detailed status of a specific project
    if [ -f "./projects/$project/project_status.md" ]; then
      echo "Status for project: $project"
      echo "======================="
      cat "./projects/$project/project_status.md"
      
      echo ""
      echo "Available actions:"
      echo "- Progress to next role: ./autopilot.sh next-role $project"
    else
      echo "Error: Project '$project' not found or status file missing"
      exit 1
    fi
  fi
}

# Parse command-line arguments
case "$1" in
  "new-project")
    if [ -z "$2" ]; then
      echo "Error: Project name is required"
      echo "Usage: ./autopilot.sh new-project <project_name> [description]"
      exit 1
    fi
    
    project_name=$2
    project_desc=${3:-"No description provided"}
    
    echo "Creating new project: $project_name"
    ./initialize_project.sh "$project_name" "$project_desc"
    ;;
    
  "generate-idea")
    echo "Generating project ideas..."
    ./generate_project_idea.sh
    ;;
    
  "next-role")
    if [ -z "$2" ]; then
      echo "Error: Project name is required"
      echo "Usage: ./autopilot.sh next-role <project_name>"
      exit 1
    fi
    
    project_name=$2
    ./next_role.sh "$project_name"
    ;;
    
  "verify-changes")
    if [ -z "$2" ]; then
      echo "Error: Project name is required"
      echo "Usage: ./autopilot.sh verify-changes <project_name>"
      exit 1
    fi
    
    project_name=$2
    ./verify_changes.sh "$project_name"
    ;;

  "git")
    if [ -z "$2" ]; then
      echo "Error: Git action is required"
      echo "Usage: ./autopilot.sh git <action> [args]"
      echo "Available actions: commit, push, create-pr, merge-pr, create-branch"
      exit 1
    fi
    
    # Forward all arguments after "git" to the git_operations script
    shift
    ./git_operations.sh "$@"
    ;;
    
  "status")
    show_status "$2"
    ;;
    
  "list-projects")
    list_projects
    ;;
    
  "help"|"--help"|"-h")
    show_usage
    ;;
    
  "")
    show_usage
    ;;
    
  *)
    echo "Error: Unknown command '$1'"
    show_usage
    exit 1
    ;;
esac

exit 0