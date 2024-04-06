# Course Management System API

This API provides functionality for managing users, courses, and course enrollments in a course management system.

## Table of Contents
1. [User APIs](#user-apis)
2. [Course APIs](#course-apis)
3. [User Enrollment APIs](#user-enrollment-apis)
4. [Filters and Pagination](#filters-and-pagination)
5. [Database and Email Integration](#database-and-email-integration)
6. [Security and Authentication](#security-and-authentication)
7. [Error Handling and Logging](#error-handling-and-logging)

## User APIs

### User Registration
- Endpoint: `/api/user/register`
- Method: POST
- Description: Allows users to register by providing necessary details such as name, email, and password. Implements validation for email uniqueness and password strength.

### User Profile
- Endpoint: `/api/user/profile`
- Methods: 
  - GET: Allows users to view their profile information.
  - PUT: Allows users to update their profile information, including name, email, profile picture, etc.

## Course APIs

### Get Courses
- Endpoint: `/api/courses`
- Method: GET
- Description: Provides an API endpoint to fetch courses available on the platform. Implements filtering options based on parameters such as category, level, popularity, etc. Enables pagination to handle large datasets efficiently.

### CRUD Operations for Superadmin
- Endpoints:
  - Create: `/api/courses`
  - Read: `/api/courses/{courseId}`
  - Update: `/api/courses/{courseId}`
  - Delete: `/api/courses/{courseId}`
- Methods: 
  - POST: Create a new course.
  - GET: Retrieve details of a specific course.
  - PUT: Update details of a specific course.
  - DELETE: Delete a course.
- Description: Implements Create, Read, Update, and Delete operations for courses. Only superadmin users have permission to perform these operations.

## User Enrollment APIs

### Course Enrollment
- Endpoint: `/api/user/enroll`
- Method: POST
- Description: Allows users to enroll in courses they are interested in. Implements validation to prevent users from enrolling in the same course multiple times.

### View Enrolled Courses
- Endpoint: `/api/user/enrolled-courses`
- Method: GET
- Description: Provides an API endpoint for users to view the courses they have enrolled in.

## Filters and Pagination

### Filtering Options
- Parameters: 
  - category
  - level
  - popularity
- Description: Implements filtering options for the courses API to enable users to refine their search based on criteria such as category, level, etc.

### Pagination
- Parameters:
  - page
  - limit
- Description: Enables pagination to limit the number of results returned per request and improve performance when dealing with large datasets.

## Database and Email Integration

- Database: Utilizes the free tier of neon.tech database for storing user information, course details, and enrollment data.
- Email Service: Integrates with resend.com's free tier for handling email communications, such as user registration confirmation, password reset requests, and course enrollment notifications.

## Security and Authentication

- Authentication: Implements secure authentication mechanisms, such as JWT (JSON Web Tokens), to authenticate users for accessing protected endpoints.
- Password Security: Ensures sensitive data, such as passwords, is securely hashed before storage in the database.

## Error Handling and Logging

- Error Handling: Implements robust error handling mechanisms to provide meaningful error messages to clients.
- Logging: Utilizes logging to track API requests, responses, and any potential errors or exceptions for debugging purposes.
