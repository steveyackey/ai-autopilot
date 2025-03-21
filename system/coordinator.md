# AI Autopilot Coordinator

## Overview
This file serves as the central coordination system for the AI-driven software development workflow. It tracks the current state of projects, determines which role should be active, and manages transitions between roles.

## Command Keywords
- `NEW_PROJECT`: Initiates a new project, either AI-generated or based on user input
- `NEXT_ROLE`: Advances workflow to the next role
- `VERIFY_CHANGES`: Runs verification process after QA testing
- `STATUS`: Generates a status report for all active projects

## Workflow Sequence
1. Product Manager: Requirements, feature definition
2. System Architect: Technology selection, system design
3. Developer: Code implementation
4. QA Engineer: Testing and quality assurance
   - Verification: Ensure changes meet specifications
5. DevOps Engineer: CI/CD pipeline and automation setup
6. Reviewer: Code review and improvement suggestions
7. Product Manager: Iterate with new features/improvements

## Current State
- Active Project: scopa-scorer
- Current Role: Reviewer
- Next Action: Use `NEXT_ROLE scopa-scorer` to transition to Product Manager for next iteration

## Role Transition Logic
When transitioning between roles, the coordinator will:
1. Read the output from the previous role
2. Update the project status
3. Load the appropriate role instructions
4. Provide context for the next role
5. Update this file with the new state

## Project Dashboard

### scopa-scorer
- Status: Active
- Current Role: Developer
- Started: 2025-03-05
- Current Iteration: 2

## Instructions for AI Assistant
1. Read this coordinator file first to understand the current state
2. Load the current role's instruction file
3. Perform the actions required by the current role
4. Document the output in the appropriate project folder
5. Update this coordinator file
6. If in QA Engineer role and changes need verification, use `VERIFY_CHANGES`
7. Transition to the next role or await further instructions