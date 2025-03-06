# AI Autopilot System Instructions

## System Overview
This repository contains an AI-driven software development system that simulates a complete software team. As an AI assistant, you should follow the established workflow and role system when helping with this project.

## Key Workflow Commands
When interacting with this repository, recognize and respond to these keyword commands:

- `NEW_PROJECT <name> "<description>"`: Initiate creation of a new project
- `NEXT_ROLE <project_name>`: Advance the project to the next role in the sequence
- `VERIFY_CHANGES <project_name>`: Run verification process after QA testing
- `STATUS <project_name>`: Show current project status
- `GIT <action> [args]`: Perform Git operations like commit, push, create-pr, merge-pr

## Git Workflow
The system uses Git branches and pull requests:
1. Each iteration works in a branch named `iteration-{N}-{role}`
2. Changes are committed and pushed after each role completes work
3. After QA verification, a pull request is automatically created
4. The DevOps Engineer reviews and enhances the PR
5. The Reviewer approves the PR or requests changes
6. When transitioning back to Product Manager, the PR is merged

## Role System
The system follows this role sequence:
1. Product Manager → 2. System Architect → 3. Developer → 4. QA Engineer → 5. DevOps Engineer → 6. Reviewer → (back to Product Manager)

When asked to work on a project, first check `system/coordinator.md` to determine the active role, then consult the appropriate role file in `system/roles/`.

## Project Structure
Projects in this system follow a standardized structure to maintain consistency and organization:

```
projects/
└── {project_name}/
    ├── docs/                      # All project documentation
    │   ├── product_vision.md     # Product vision and goals
    │   ├── requirements.md       # Detailed requirements
    │   ├── user_stories.md      # User stories and acceptance criteria
    │   ├── roadmap.md           # Project roadmap and timeline
    │   └── architecture/        # Architecture documentation
    │       ├── tech_stack.md    # Technology choices
    │       ├── system_design.md # System architecture
    │       ├── data_model.md    # Data models
    │       ├── api_contracts.md # API specifications
    │       └── technical_decisions.md
    │   └── dev/                 # Development documentation
    │       ├── setup.md         # Setup instructions
    │       ├── implementation_notes.md
    │       └── api_documentation.md
    ├── src/                     # Source code
    │   └── [project source code]
    ├── tests/                   # Test files
    │   ├── test_plan.md        # Test planning
    │   ├── test_cases.md       # Test case definitions
    │   ├── test_results.md     # Test execution results
    │   └── issues.md           # Issue tracking
    ├── devops/                 # DevOps configuration
    │   ├── configs/            # Configuration files
    │   └── external_resources.md
    ├── .github/                # GitHub specific files
    │   └── workflows/          # GitHub Actions workflows
    ├── reviews/               # Review documentation
    │   ├── code_review.md     # Code review notes
    │   ├── quality_assessment.md
    │   ├── recommendations.md
    │   └── iteration_summary.md
    ├── project_status.md      # Current project status
    └── README.md              # Project overview

## Development Guidelines
When working on this project:

1. **Documentation First**: Always update relevant documentation before making code changes
2. **Role Adherence**: Follow the specific guidelines for your current role
3. **Version Control**:
   - Commit after completing each role's tasks
   - Use descriptive commit messages with [project-name] prefix
   - Create pull requests after QA verification
4. **Quality Standards**:
   - Write clear, maintainable code
   - Include appropriate tests
   - Keep documentation up-to-date
   - Follow established coding conventions

## AI Optimization
This project is optimized for AI-driven development:

1. **Technology Choices**:
   - Prefer technologies with good documentation
   - Use strongly-typed languages when possible
   - Select frameworks with clear patterns
   - Choose tools with good CLI support

2. **Code Organization**:
   - Use consistent file naming
   - Maintain clear project structure
   - Keep related files close together
   - Use descriptive variable and function names

3. **Documentation Practices**:
   - Write clear, concise comments
   - Use markdown for documentation
   - Maintain up-to-date API docs
   - Document all key decisions

4. **Testing Strategy**:
   - Write automated tests where possible
   - Use clear test naming
   - Document test scenarios
   - Include setup instructions

## Iteration Process
Each iteration follows this process:

1. **Product Planning**:
   - Review previous iteration
   - Define new requirements
   - Update roadmap

2. **Technical Design**:
   - Update architecture if needed
   - Document technical decisions
   - Plan implementation

3. **Development**:
   - Implement features
   - Update documentation
   - Write tests

4. **Quality Assurance**:
   - Run tests
   - Document issues
   - Verify requirements

5. **DevOps**:
   - Update CI/CD if needed
   - Check infrastructure
   - Verify deployments

6. **Review**:
   - Code review
   - Quality assessment
   - Improvement suggestions

Remember to use the coordinator.md file as your primary guide for the current state and next actions in the development process.
