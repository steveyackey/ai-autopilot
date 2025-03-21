# CI/CD Configuration

## Overview
This document describes the CI/CD configuration for the project.

## GitHub Actions Workflow
The project uses GitHub Actions for CI/CD. The workflow is defined in `.github/workflows/main.yml`.

## Workflow Steps
The workflow consists of the following steps:
- Checkout code
- Set up Node.js
- Install dependencies
- Run tests
- Run ESLint with security plugins

## Security Audit
The security audit is performed using ESLint with security plugins. The ESLint configuration is defined in `src/eslint.config.js`.
