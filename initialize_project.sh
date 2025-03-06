#!/bin/bash

# AI Autopilot Project Initialization Script

# Check if project name is provided
if [ -z "$1" ]; then
  echo "Error: Project name is required"
  echo "Usage: ./initialize_project.sh <project_name> [project_description]"
  exit 1
fi

PROJECT_NAME=$1
PROJECT_DESC=${2:-"No description provided"}

# Create project directories
echo "Creating project structure for '$PROJECT_NAME'..."

mkdir -p "projects/$PROJECT_NAME/docs/architecture"
mkdir -p "projects/$PROJECT_NAME/docs/dev"
mkdir -p "projects/$PROJECT_NAME/src"
mkdir -p "projects/$PROJECT_NAME/tests"
mkdir -p "projects/$PROJECT_NAME/devops/configs"
mkdir -p "projects/$PROJECT_NAME/.github/workflows"
mkdir -p "projects/$PROJECT_NAME/reviews"

# Initialize template files
echo "Initializing documentation templates..."

# Product Manager templates
cp "system/templates/product_vision_template.md" "projects/$PROJECT_NAME/docs/product_vision.md"
cp "system/templates/requirements_template.md" "projects/$PROJECT_NAME/docs/requirements.md"
cp "system/templates/user_stories_template.md" "projects/$PROJECT_NAME/docs/user_stories.md"
cp "system/templates/roadmap_template.md" "projects/$PROJECT_NAME/docs/roadmap.md"

# System Architect templates
cp "system/templates/technical_decisions_template.md" "projects/$PROJECT_NAME/docs/architecture/technical_decisions.md"

# DevOps templates
cp "system/templates/external_resources_template.md" "projects/$PROJECT_NAME/devops/external_resources.md"
cp "system/templates/github_workflow_template.yml" "projects/$PROJECT_NAME/.github/workflows/main.yml"

# Create a project status file
cat > "projects/$PROJECT_NAME/project_status.md" << EOL
# $PROJECT_NAME - Project Status

## Project Description
$PROJECT_DESC

## Current Status
- **Active Role:** Product Manager
- **Current Phase:** Initial Requirements
- **Next Steps:** Define product vision and requirements
- **Current PR:** None

## Timeline
- **Project Started:** $(date +"%Y-%m-%d")

## Iterations
- **Current Iteration:** 1
EOL

# Create a basic README in the project directory
cat > "projects/$PROJECT_NAME/README.md" << EOL
# $PROJECT_NAME

## Overview
$PROJECT_DESC

## Project Structure
- \`/docs\` - Project documentation
- \`/src\` - Source code
- \`/tests\` - Tests
- \`/devops\` - DevOps configurations
- \`/reviews\` - Review documents
- \`/.github/workflows\` - GitHub Actions CI/CD workflows

## Getting Started
*Setup instructions will be added by the Developer.*

## Current Status
*See project_status.md for current status.*
EOL

# Update main coordinator to include the new project
sed -i "/## Project Dashboard/a \\\n### $PROJECT_NAME\n- Status: Active\n- Current Role: Product Manager\n- Started: $(date +"%Y-%m-%d")" system/coordinator.md

# Make the first git commit for the new project
git add "projects/$PROJECT_NAME/"
git commit -m "[$PROJECT_NAME] Initialize project structure"
git push

# Create initial branch for iteration 1
chmod +x git_operations.sh
./git_operations.sh create-branch "$PROJECT_NAME" "Product Manager" "1"

echo "Project '$PROJECT_NAME' has been initialized!"
echo "Next step: The AI will assume the Product Manager role to define the product vision."