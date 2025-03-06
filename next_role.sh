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
# Use a portable grep approach that works on both Linux and macOS
if grep -q '\*\*Active Role:\*\*' "$PROJECT_STATUS_FILE"; then
  # Extract role name and trim whitespace
  CURRENT_ROLE=$(grep '\*\*Active Role:\*\*' "$PROJECT_STATUS_FILE" | sed 's/^- \*\*Active Role:\*\* //')
  # Trim leading/trailing whitespace
  CURRENT_ROLE=$(echo "$CURRENT_ROLE" | sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//')
  echo "DEBUG: Current role found: '$CURRENT_ROLE'"
else
  echo "Error: Could not find Active Role in project status file"
  exit 1
fi

if grep -q '\*\*Current Iteration:\*\*' "$PROJECT_STATUS_FILE"; then
  CURRENT_ITERATION=$(grep '\*\*Current Iteration:\*\*' "$PROJECT_STATUS_FILE" | sed 's/\*\*Current Iteration:\*\* //' | tr -d -c '0-9')
else
  echo "Error: Could not find Current Iteration in project status file"
  exit 1
fi

# Define the role rotation sequence
declare -a ROLES=("Product Manager" "System Architect" "Developer" "QA Engineer" "DevOps Engineer" "Reviewer")

# Find the index of the current role
CURRENT_INDEX=-1
echo "DEBUG: Looking for role '$CURRENT_ROLE' in the rotation sequence"
echo "DEBUG: Available roles: ${ROLES[*]}"
for i in "${!ROLES[@]}"; do
  echo "DEBUG: Comparing with '${ROLES[$i]}'"
  if [ "$(echo "${ROLES[$i]}" | tr -d ' \t\n\r')" = "$(echo "$CURRENT_ROLE" | tr -d ' \t\n\r')" ]; then
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

# Commit current changes before transitioning
./git_operations.sh commit "$PROJECT_NAME" "$CURRENT_ROLE" "$CURRENT_ITERATION"

# Push changes after each role is complete to maintain history
./git_operations.sh push

# Special handling for transitions
if [ "$CURRENT_ROLE" = "QA Engineer" ] && [ "$NEXT_ROLE" = "DevOps Engineer" ]; then
  # After QA, create a pull request for review
  ./git_operations.sh create-pr "$PROJECT_NAME" "$CURRENT_ITERATION"
  echo "Created pull request for review"
elif [ "$CURRENT_ROLE" = "Reviewer" ] && [ "$NEXT_ROLE" = "Product Manager" ]; then
  # After Review, merge the PR and update iteration count
  ./git_operations.sh merge-pr "$PROJECT_NAME"
  echo "Merged pull request for iteration $CURRENT_ITERATION"
  
  # Update iteration count if going back to Product Manager
  NEXT_ITERATION=$((CURRENT_ITERATION + 1))
  sed -i.bak "s/\*\*Current Iteration:\*\* $CURRENT_ITERATION/\*\*Current Iteration:\*\* $NEXT_ITERATION/" "$PROJECT_STATUS_FILE" && rm -f "${PROJECT_STATUS_FILE}.bak"
  echo "Advancing to iteration $NEXT_ITERATION"
  
  # Create a new branch for the next iteration
  ./git_operations.sh create-branch "$PROJECT_NAME" "$NEXT_ITERATION"
else
  # For other transitions, check if we're at the beginning of an iteration
  if [ "$CURRENT_ROLE" = "Product Manager" ] && [ "$NEXT_ROLE" = "System Architect" ]; then
    # If branch doesn't already exist for this iteration, create one
    branch_name="iteration-${CURRENT_ITERATION}-${PROJECT_NAME}"
    branch_name=$(echo "$branch_name" | tr '[:upper:]' '[:lower:]')
    if ! git show-ref --quiet "refs/heads/$branch_name"; then
      ./git_operations.sh create-branch "$PROJECT_NAME" "$CURRENT_ITERATION"
    fi
  fi
fi

# Update the project status file
sed -i.bak "s/\*\*Active Role:\*\* $CURRENT_ROLE/\*\*Active Role:\*\* $NEXT_ROLE/" "$PROJECT_STATUS_FILE" && rm -f "${PROJECT_STATUS_FILE}.bak"

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

sed -i.bak "s/\*\*Current Phase:\*\* .*$/\*\*Current Phase:\*\* $PHASE/" "$PROJECT_STATUS_FILE" && rm -f "${PROJECT_STATUS_FILE}.bak"
sed -i.bak "s/\*\*Next Steps:\*\* .*$/\*\*Next Steps:\*\* $NEXT_STEPS/" "$PROJECT_STATUS_FILE" && rm -f "${PROJECT_STATUS_FILE}.bak"

# Update coordinator.md
sed -i.bak "/### $PROJECT_NAME/,/Started:/s/- Current Role: .*/- Current Role: $NEXT_ROLE/" system/coordinator.md && rm -f "system/coordinator.md.bak"

echo "Project '$PROJECT_NAME' has transitioned from '$CURRENT_ROLE' to '$NEXT_ROLE'"
echo "Next step: The AI will assume the $NEXT_ROLE role to $NEXT_STEPS"