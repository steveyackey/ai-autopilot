#!/bin/bash

# AI Autopilot Verification Script
# This script verifies that changes made after QA testing meet specifications

# Check if project name is provided
if [ -z "$1" ]; then
  echo "Error: Project name is required"
  echo "Usage: ./verify_changes.sh <project_name>"
  exit 1
fi

PROJECT_NAME=$1
PROJECT_DIR="projects/$PROJECT_NAME"

# Check if the project exists
if [ ! -d "$PROJECT_DIR" ]; then
  echo "Error: Project '$PROJECT_NAME' does not exist"
  exit 1
fi

echo "Verifying changes for project: $PROJECT_NAME"

# Look for verification report - if it exists, we're doing a re-verification
if [ -f "$PROJECT_DIR/tests/verification_report.md" ]; then
  echo "Previous verification report found. This is a re-verification."
else
  echo "First-time verification."
  
  # Create verification report template
  mkdir -p "$PROJECT_DIR/tests"
  
  cat > "$PROJECT_DIR/tests/verification_report.md" << EOL
# Verification Report: $PROJECT_NAME

## Overview
This report documents the verification of changes against specifications.

## Requirements Coverage Verification
| Requirement ID | Requirement | Verified | Notes |
|---------------|------------|----------|-------|
| | | | |

## Issue Resolution Verification
| Issue ID | Issue Description | Fixed | Verification Notes |
|----------|------------------|-------|-------------------|
| | | | |

## Architecture Compliance
- [ ] Implementation follows the architecture design
- [ ] Any deviations are documented and justified

## Quality Standards
- [ ] Code meets established quality standards
- [ ] Documentation is complete and accurate
- [ ] All acceptance criteria are satisfied

## Verification Result
- [ ] **PASSED**: All requirements verified, all issues resolved
- [ ] **FAILED**: Some verifications failed (see notes)

## Notes
- 

## Next Steps
- [ ] Proceed to Review phase
- [ ] Address verification failures before Review
EOL
fi

echo "Verification template created at: $PROJECT_DIR/tests/verification_report.md"
echo ""
echo "Instructions for AI:"
echo "1. Review requirements, reported issues, and implementation"
echo "2. Complete the verification report, filling in all sections"
echo "3. Mark the verification as PASSED or FAILED"
echo "4. If PASSED, proceed with 'NEXT_ROLE'"
echo "5. If FAILED, document issues and wait for fixes before using 'VERIFY_CHANGES'"

# Update the project status file to indicate verification in progress
sed -i "s/\*\*Current Phase:\*\* Testing/\*\*Current Phase:\*\* Verification/" "$PROJECT_DIR/project_status.md"
sed -i "s/\*\*Next Steps:\*\* .*/\*\*Next Steps:\*\* Complete verification of changes against specifications/" "$PROJECT_DIR/project_status.md"

echo "Project status updated. The AI will now perform verification."
