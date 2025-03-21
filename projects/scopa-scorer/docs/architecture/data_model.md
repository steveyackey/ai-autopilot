# Data Model

## User Feedback
- id: string (unique identifier)
- user_id: string (identifier of the user submitting the feedback)
- feedback_text: string (text of the feedback)
- created_at: date (date and time the feedback was submitted)

## Code Review Metrics
- id: string (unique identifier)
- reviewer_id: string (identifier of the reviewer)
- pull_request_id: string (identifier of the pull request)
- time_spent: number (time spent on the code review)
- issues_found: number (number of issues found during the code review)
- created_at: date (date and time the code review was completed)
