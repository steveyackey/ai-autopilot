#!/bin/bash

# AI Autopilot Role Transition Script

# Check if project name is provided
if [ -z "$1" ]; then
  echo "Error: Project name is required"
  echo "Usage: ./next_role.sh <project_name>"
  exit 1
fi

PROJECT_NAME=$1
PROJECT_STATUS_FILE="projects/$PROJECT_NAME/project_status.md"

# Check if the project exists
if [ ! -d "projects/$PROJECT_NAME" ]; then
  echo "Error: Project '$PROJECT_NAME' does not exist"
  exit 1
fi

# Read current role from project status file
CURRENT_ROLE=$(grep -oP '(?<=\*\*Active Role:\*\* ).*' "$PROJECT_STATUS_FILE")
CURRENT_ITERATION=$(grep -oP '(?<=\*\*Current Iteration:\*\* )\d+' "$PROJECT_STATUS_FILE")

# Define the role rotation sequence
declare -a ROLES=("Product Manager" "System Architect" "Developer" "QA Engineer" "DevOps Engineer" "Reviewer")

# Find the index of the current role
CURRENT_INDEX=-1
for i in "${!ROLES[@]}"; do
  if [ "${ROLES[$i]}" = "$CURRENT_ROLE" ]; then
    CURRENT_INDEX=$i
    break
  fi
done

if [ $CURRENT_INDEX -eq -1 ]; then
  echo "Error: Current role not found in the rotation sequence"
  exit 1
fi

# Calculate the next role index
NEXT_INDEX=$(( (CURRENT_INDEX + 1) % ${#ROLES[@]} ))
NEXT_ROLE=${ROLES[$NEXT_INDEX]}

# Commit current changes before transitioning (but don't push yet)
./git_operations.sh commit "$PROJECT_NAME" "$CURRENT_ROLE" "$CURRENT_ITERATION"

# Special handling for transitions
if [ "$CURRENT_ROLE" = "QA Engineer" ] && [ "$NEXT_ROLE" = "DevOps Engineer" ]; then
  # After QA, push changes and create a pull request for review
  ./git_operations.sh push
  ./git_operations.sh create-pr "$PROJECT_NAME" "$CURRENT_ITERATION"
  echo "Created pull request for review"
elif [ "$CURRENT_ROLE" = "Reviewer" ] && [ "$NEXT_ROLE" = "Product Manager" ]; then
  # After Review, merge the PR and update iteration count
  ./git_operations.sh merge-pr "$PROJECT_NAME"
  echo "Merged pull request for iteration $CURRENT_ITERATION"
  
  # Update iteration count if going back to Product Manager
  NEXT_ITERATION=$((CURRENT_ITERATION + 1))
  sed -i "s/\*\*Current Iteration:\*\* $CURRENT_ITERATION/\*\*Current Iteration:\*\* $NEXT_ITERATION/" "$PROJECT_STATUS_FILE"
  echo "Advancing to iteration $NEXT_ITERATION"
  
  # Create a new branch for the next iteration
  ./git_operations.sh create-branch "$PROJECT_NAME" "$NEXT_ROLE" "$NEXT_ITERATION"
else
  # For other transitions, just create a branch if one doesn't exist
  if [ "$CURRENT_ROLE" = "Product Manager" ] && [ "$NEXT_ROLE" = "System Architect" ]; then
    # When starting a new iteration, create a new branch
    ./git_operations.sh create-branch "$PROJECT_NAME" "$NEXT_ROLE" "$CURRENT_ITERATION"
  fi
fi

# Update the project status file
sed -i "s/\*\*Active Role:\*\* $CURRENT_ROLE/\*\*Active Role:\*\* $NEXT_ROLE/" "$PROJECT_STATUS_FILE"

# Update phase information
case "$NEXT_ROLE" in
  "Product Manager")
    PHASE="Requirements Definition"
    NEXT_STEPS="Update product vision and define requirements for the current iteration"
    ;;
  "System Architect")
    PHASE="System Design"
    NEXT_STEPS="Define or update technical architecture based on requirements"
    ;;
  "Developer")
    PHASE="Implementation"
    NEXT_STEPS="Implement features according to requirements and architecture"
    ;;
  "QA Engineer")
    PHASE="Testing"
    NEXT_STEPS="Test implementation and identify issues"
    ;;
  "DevOps Engineer")
    PHASE="CI/CD Setup"
    NEXT_STEPS="Set up CI/CD pipelines and automation for the project"
    ;;
  "Reviewer")
    PHASE="Review"
    NEXT_STEPS="Review code in the pull request and provide feedback"
    ;;
esac

sed -i "s/\*\*Current Phase:\*\* .*$/\*\*Current Phase:\*\* $PHASE/" "$PROJECT_STATUS_FILE"
sed -i "s/\*\*Next Steps:\*\* .*$/\*\*Next Steps:\*\* $NEXT_STEPS/" "$PROJECT_STATUS_FILE"

# Update coordinator.md
sed -i "/### $PROJECT_NAME/,/Started:/s/- Current Role: .*/- Current Role: $NEXT_ROLE/" system/coordinator.md

echo "Project '$PROJECT_NAME' has transitioned from '$CURRENT_ROLE' to '$NEXT_ROLE'"
echo "Next step: The AI will assume the $NEXT_ROLE role to $NEXT_STEPS"