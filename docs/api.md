# Workspace API Documentation

This document describes the REST API endpoints for the Workspace feature.

## Authentication

All API endpoints require session-based authentication via cookies. The middleware automatically sets anonymous session cookies for all requests.

## Base URL

All endpoints are prefixed with `/api`.

## Workspace APIs

### List Workspaces

**Endpoint:** `GET /api/workspaces`

**Description:** Retrieve all workspaces owned by the current user.

**Response:**
```json
[
  {
    "id": "string",
    "title": "string",
    "createdAt": "datetime",
    "_count": {
      "resources": number,
      "shares": number
    }
  }
]
```

### Create Workspace

**Endpoint:** `POST /api/workspaces`

**Description:** Create a new workspace.

**Request Body:**
```json
{
  "title": "string"
}
```

**Response:**
```json
{
  "id": "string",
  "title": "string",
  "createdAt": "datetime"
}
```

### Get Workspace Details

**Endpoint:** `GET /api/workspaces/[id]`

**Description:** Get detailed information about a specific workspace, including resources and annotations.

**Response:**
```json
{
  "id": "string",
  "title": "string",
  "ownerId": "string",
  "createdAt": "datetime",
  "resources": [
    {
      "id": "string",
      "title": "string",
      "url": "string",
      "type": "string",
      "tags": [],
      "data": {},
      "createdAt": "datetime",
      "annotations": [
        {
          "id": "string",
          "body": "string",
          "highlights": {},
          "createdAt": "datetime"
        }
      ]
    }
  ]
}
```

### Update Workspace

**Endpoint:** `PATCH /api/workspaces/[id]`

**Description:** Update workspace title.

**Request Body:**
```json
{
  "title": "string"
}
```

**Response:**
```json
{
  "id": "string",
  "title": "string",
  "createdAt": "datetime"
}
```

### Delete Workspace

**Endpoint:** `DELETE /api/workspaces/[id]`

**Description:** Delete a workspace and all associated resources, annotations, and share links.

**Response:**
```json
{
  "message": "Deleted"
}
```

## Resource APIs

### List Resources

**Endpoint:** `GET /api/workspaces/[id]/resources`

**Description:** Get all resources in a workspace.

**Response:**
```json
[
  {
    "id": "string",
    "workspaceId": "string",
    "title": "string",
    "url": "string",
    "type": "string",
    "tags": [],
    "data": {},
    "createdAt": "datetime",
    "annotations": [
      {
        "id": "string",
        "body": "string",
        "highlights": {},
        "createdAt": "datetime"
      }
    ]
  }
]
```

### Create Resource

**Endpoint:** `POST /api/workspaces/[id]/resources`

**Description:** Add a new resource to a workspace.

**Request Body:**
```json
{
  "title": "string",
  "url": "string (optional)",
  "notes": "string (optional)",
  "type": "string (optional)",
  "tags": ["string"] (optional),
  "data": {} (optional)
}
```

**Response:**
```json
{
  "id": "string",
  "workspaceId": "string",
  "title": "string",
  "url": "string",
  "type": "string",
  "tags": [],
  "data": {},
  "createdAt": "datetime"
}
```

## Annotation APIs

### List Annotations

**Endpoint:** `GET /api/resources/[id]/annotations`

**Description:** Get all annotations for a resource.

**Response:**
```json
[
  {
    "id": "string",
    "resourceId": "string",
    "body": "string",
    "highlights": {},
    "createdAt": "datetime"
  }
]
```

### Create Annotation

**Endpoint:** `POST /api/resources/[id]/annotations`

**Description:** Add an annotation to a resource.

**Request Body:**
```json
{
  "body": "string",
  "highlights": {} (optional)
}
```

**Response:**
```json
{
  "id": "string",
  "resourceId": "string",
  "body": "string",
  "highlights": {},
  "createdAt": "datetime"
}
```

## Share APIs

### List Share Links

**Endpoint:** `GET /api/workspaces/[id]/share`

**Description:** Get all share links for a workspace.

**Response:**
```json
[
  {
    "id": "string",
    "workspaceId": "string",
    "token": "string",
    "readOnly": true,
    "expiresAt": "datetime",
    "createdAt": "datetime"
  }
]
```

### Create Share Link

**Endpoint:** `POST /api/workspaces/[id]/share`

**Description:** Create a new share link for a workspace.

**Request Body:**
```json
{
  "expiresAt": "datetime (optional)"
}
```

**Response:**
```json
{
  "id": "string",
  "workspaceId": "string",
  "token": "string",
  "readOnly": true,
  "expiresAt": "datetime",
  "createdAt": "datetime"
}
```

## Share Page

**Endpoint:** `GET /share/[token]`

**Description:** Public read-only view of a shared workspace.

**Response:** HTML page displaying the workspace content.

## Error Responses

All endpoints may return the following error formats:

**400 Bad Request:**
```json
{
  "error": "Validation error message"
}
```

**403 Forbidden:**
```json
{
  "error": "Not authorized"
}
```

**404 Not Found:**
```json
{
  "error": "Resource not found"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Internal server error"
}
```

## Data Types

- `string`: String value
- `datetime`: ISO 8601 date string
- `number`: Integer value
- `boolean`: true/false
- `[]`: Array
- `{}`: Object


POST /api/workspaces - Create workspace (worked)
GET /api/workspaces - List workspaces (worked)
⏳ Remaining API Tests:

GET /api/workspaces/[id] - Get workspace details
PATCH /api/workspaces/[id] - Update workspace title
POST /api/workspaces/[id]/resources - Add resources
GET /api/workspaces/[id]/resources - List resources
POST /api/resources/[id]/annotations - Add annotations
GET /api/resources/[id]/annotations - List annotations
POST /api/workspaces/[id]/share - Create share links
GET /api/workspaces/[id]/share - List share links
GET /share/[token] - Test public share page
DELETE /api/workspaces/[id] - Delete workspace