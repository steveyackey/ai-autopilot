# API Contracts

## Feedback API

### POST /api/feedback
- Description: Submit user feedback.
- Request Body:
    - user_id: string (required)
    - feedback_text: string (required)
- Response:
    - 200 OK: Feedback submitted successfully.
    - 400 Bad Request: Invalid request body.

### GET /api/feedback
- Description: Get all user feedback.
- Response:
    - 200 OK: Array of user feedback objects.

## Code Review Metrics API

### POST /api/code_review_metrics
- Description: Submit code review metrics.
- Request Body:
    - reviewer_id: string (required)
    - pull_request_id: string (required)
    - time_spent: number (required)
    - issues_found: number (required)
- Response:
    - 200 OK: Code review metrics submitted successfully.
    - 400 Bad Request: Invalid request body.

### GET /api/code_review_metrics
- Description: Get all code review metrics.
- Response:
    - 200 OK: Array of code review metrics objects.
