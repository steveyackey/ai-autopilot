#!/bin/bash

# AI Autopilot Git Operations Script
# This script manages git operations for the AI autopilot system

# Function to create a new branch for a project iteration
create_branch() {
  local project_name=$1
  local iteration=$2
  
  # Format: iteration-N-project_name (e.g., iteration-1-scopa-scorer)
  local branch_name="iteration-${iteration}-${project_name}"
  branch_name=$(echo "$branch_name" | tr '[:upper:]' '[:lower:]')
  
  echo "Creating branch: $branch_name"
  
  # Check if we're already on this branch
  current_branch=$(git branch --show-current)
  if [ "$current_branch" = "$branch_name" ]; then
    echo "Already on branch $branch_name"
    return 0
  fi
  
  # Check if branch exists
  if git show-ref --quiet "refs/heads/$branch_name"; then
    # Branch exists locally, switch to it
    git checkout "$branch_name"
  else
    # Check if branch exists on remote
    if git ls-remote --heads origin "$branch_name" | grep -q "$branch_name"; then
      git checkout -b "$branch_name" "origin/$branch_name"
    else
      # Create a new branch
      git checkout -b "$branch_name"
    fi
  fi
  
  echo "Now working on branch: $branch_name"
  return 0
}

# Function to commit changes for a role
commit_changes() {
  local project_name=$1
  local role=$2
  local iteration=$3
  
  echo "Committing changes for $project_name - $role (Iteration $iteration)"
  
  # Check if there are changes to commit
  if ! git status --porcelain | grep -q .; then
    echo "No changes to commit"
    return 0
  fi
  
  # Add all changes
  git add .
  
  # Create commit message
  commit_msg="[$project_name] $role changes for iteration $iteration"
  
  # Commit changes
  git commit -m "$commit_msg"
  
  echo "Changes committed: $commit_msg"
  return 0
}

# Function to push changes to remote
push_changes() {
  local branch_name=$(git branch --show-current)
  
  echo "Pushing changes to origin/$branch_name"
  git push -u origin "$branch_name"
  
  return $?
}

# Function to create a pull request
create_pull_request() {
  local project_name=$1
  local iteration=$2
  local branch_name=$(git branch --show-current)
  
  echo "Creating pull request for $project_name (Iteration $iteration)"
  
  # Create PR title and body
  pr_title="[$project_name] Changes for Iteration $iteration"
  pr_body="This PR contains changes for Iteration $iteration of $project_name.\n\nPlease review and approve."
  
  # Create PR using gh CLI
  pr_url=$(gh pr create --title "$pr_title" --body "$pr_body" --base main)
  
  if [ $? -eq 0 ]; then
    echo "Pull request created: $pr_url"
    # Store PR URL in project status file
    pr_number=$(echo "$pr_url" | grep -oP '(?<=pull/)\d+')
    sed -i "s|^- \*\*Current PR:\*\*.*$|- \*\*Current PR:\*\* #$pr_number ($pr_url)|" "projects/$project_name/project_status.md"
    return 0
  else
    echo "Failed to create pull request"
    return 1
  fi
}

# Function to merge a pull request
merge_pull_request() {
  local project_name=$1
  
  # Extract PR number from project status file
  pr_info=$(grep -oP '(?<=\*\*Current PR:\*\* #)\d+' "projects/$project_name/project_status.md" || echo "")
  
  if [ -z "$pr_info" ]; then
    echo "No open pull request found for $project_name"
    return 1
  fi
  
  echo "Merging pull request #$pr_info for $project_name"
  
  # Merge PR using gh CLI
  gh pr merge "$pr_info" --merge --delete-branch
  
  if [ $? -eq 0 ]; then
    echo "Pull request #$pr_info merged successfully"
    # Update PR status in project file
    sed -i "s|^- \*\*Current PR:\*\*.*$|- \*\*Current PR:\*\* None|" "projects/$project_name/project_status.md"
    
    # Checkout main branch
    git checkout main
    git pull
    
    return 0
  else
    echo "Failed to merge pull request #$pr_info"
    return 1
  fi
}

# Main script logic based on command
case "$1" in
  "create-branch")
    if [ -z "$2" ] || [ -z "$3" ]; then
      echo "Usage: $0 create-branch <project_name> <iteration>"
      exit 1
    fi
    create_branch "$2" "$3"
    ;;
  
  "commit")
    if [ -z "$2" ] || [ -z "$3" ] || [ -z "$4" ]; then
      echo "Usage: $0 commit <project_name> <role> <iteration>"
      exit 1
    fi
    commit_changes "$2" "$3" "$4"
    ;;
    
  "push")
    push_changes
    ;;
    
  "create-pr")
    if [ -z "$2" ] || [ -z "$3" ]; then
      echo "Usage: $0 create-pr <project_name> <iteration>"
      exit 1
    fi
    create_pull_request "$2" "$3"
    ;;
    
  "merge-pr")
    if [ -z "$2" ]; then
      echo "Usage: $0 merge-pr <project_name>"
      exit 1
    fi
    merge_pull_request "$2"
    ;;
    
  *)
    echo "Unknown command: $1"
    echo "Available commands: create-branch, commit, push, create-pr, merge-pr"
    exit 1
    ;;
esac

exit $?
