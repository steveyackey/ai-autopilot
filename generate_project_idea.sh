#!/bin/bash

# AI Autopilot Project Idea Generator
# This script helps the AI generate project ideas when the NEW_PROJECT keyword is used without a specific idea

echo "# AI Project Ideas Generation

## Project Types to Consider
1. Web Applications
   - Productivity tools
   - Content management systems
   - Social platforms
   - E-commerce solutions

2. Mobile Applications
   - Health and fitness
   - Productivity
   - Entertainment
   - Education

3. Developer Tools
   - Code generators
   - Development utilities
   - Testing frameworks
   - Documentation tools

4. Data Analysis Tools
   - Visualization tools
   - Data processing pipelines
   - Analytics dashboards

## Current Technology Trends
- Progressive Web Apps
- Serverless architecture
- AI/ML integrations
- Low-code/no-code platforms
- Edge computing
- Privacy-focused applications

## Market Needs to Address
- Remote work and collaboration
- Personal productivity
- Learning and education
- Health and wellness
- Environmental sustainability
- Accessibility solutions

## Evaluation Criteria
- Technical feasibility with free tools
- Scope appropriate for incremental development
- Clear user value proposition
- AI-friendly implementation patterns
- Potential for meaningful iterations

## Next Steps
1. Generate 3-5 specific project ideas
2. Evaluate each idea against the criteria
3. Select the most promising idea
4. Begin the Product Manager role for the selected project
"

echo "After generating project ideas, initialize the selected project with:"
echo "./initialize_project.sh <project_name> \"<project_description>\""