# Product Overview

This is a competitive shooting match result management system that handles PractiScore match data. The application allows users to upload, store, and view shooting match results with role-based access control.

## Core Features

- **Match Management**: Upload and view competitive shooting match results from PractiScore (.psc files)
- **User Authentication**: Email/password login with JWT tokens
- **Role-Based Access**: Regular users can view/upload matches, admins manage ranges and users
- **Range Filtering**: Filter matches by shooting range
- **Score Tracking**: View detailed participant scores and times for each match

## User Roles

- **Regular Users**: Can view matches, upload match data, register accounts
- **Admin Users**: Full access including range management, user management, and match data administration

## Data Sources

The system processes PractiScore (.psc) files which contain competitive shooting match data including shooter names, divisions, scores, and times.