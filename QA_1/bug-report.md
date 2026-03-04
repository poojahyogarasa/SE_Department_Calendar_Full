
Testing - Student Dashboard
-----------------------------------------

Bug ID: BUG_007
Module: Student Dashboard
Type: UI / Role Permission Issue
Date: 2026-03-04
Reported By: Kisothana (QA)

Title:
"+ New" button visible on Student dashboard though not included in design

Description:
According to the approved UI design, the Student dashboard should not contain a "+ New" button because students do not have permission to create events. However, when logged in as a Student, the dashboard displays a "+ New" button in the top navigation bar.

Steps to Reproduce:
1. Login using a Student account
2. Navigate to Dashboard
3. Observe the top-right section of the page

Expected Result:
Student dashboard should not display the "+ New" button.

Actual Result:
"+ New" button is visible on the Student dashboard.

Severity:
Medium

Status:
Open

Comments:
Role-based UI control may not be implemented correctly for student users.
-----------------------------------------

-----------------------------------------

Bug ID: BUG_008
Module: Dashboard
Type: Functional Issue
Date: 2026-03-04
Reported By: Kisothana (QA)

Title:
Export button on dashboard is not functioning

Description:
The dashboard contains an "Export" button that is expected to export calendar or event data. However, clicking the button does not perform any action such as downloading a file or displaying export options.

Steps to Reproduce:
1. Login to the system
2. Navigate to Dashboard
3. Click the "Export" button

Expected Result:
The system should export the calendar/event data (e.g., CSV, Excel, or PDF download).

Actual Result:
No action occurs when clicking the "Export" button.

Severity:
Medium

Status:
Open

Comments:
Export functionality may not be implemented or connected to backend API.
-----------------------------------------

-----------------------------------------

Bug ID: BUG_009
Module: Dashboard – Help & Support
Type: Functional / UI Issue
Date: 2026-03-04
Reported By: Kisothana (QA)

Title:
"Help & Support" button on dashboard is not functioning

Description:
The "Help & Support" option is visible in the left sidebar of the dashboard. 
However, when clicking this option, the system does not navigate to any page 
or display any help information.

Steps to Reproduce:
1. Login to the system
2. Navigate to Dashboard
3. Click "Help & Support" in the left sidebar

Expected Result:
The system should open a Help & Support page or display user guidance 
(e.g., FAQ, contact support, or documentation).

Actual Result:
Clicking the "Help & Support" button performs no action.

Severity:
Low

Status:
Open

Comments:
The navigation route or page for Help & Support may not be implemented.
-----------------------------------------

-----------------------------------------

Bug ID: BUG_010
Module: User Profile / Settings
Type: Functional Issue
Date: 2026-03-04
Reported By: Kisothana (QA)

Title:
Incorrect profile information displayed in Settings page

Description:
The profile avatar and initials displayed in the Settings page do not match the currently logged-in user.

Steps to Reproduce:
1. Login using a valid user account
2. Navigate to the Settings page
3. Observe the profile icon in the top-right corner

Expected Result:
The profile icon and initials should represent the currently logged-in user.

Actual Result:
Different initials ("US") are displayed instead of the correct user profile.

Severity:
Medium

Status:
Open

Comments:
User profile data may not be properly retrieved from session or backend API.
-----------------------------------------

-----------------------------------------

Bug ID: BUG_011
Module: User Profile Menu
Type: UI / Functional Issue
Date: 2026-03-04
Reported By: Kisothana (QA)

Title:
Profile avatar button is not clickable in Settings page

Description:
The user profile avatar is displayed in the top-right corner of the Settings page. 
However, clicking the avatar does not trigger any action such as opening the profile menu or user options.

Steps to Reproduce:
1. Login to the system
2. Navigate to Settings page
3. Click the profile avatar in the top-right corner

Expected Result:
A dropdown menu or profile options should appear.

Actual Result:
No action occurs when clicking the profile avatar.

Severity:
Low

Status:
Open

Comments:
Profile dropdown functionality may not be implemented or event handler missing.
-----------------------------------------

-----------------------------------------

Bug ID: BUG_012
Module: Settings Page – Notification Icon
Type: UI / Functional Issue
Date: 2026-03-04
Reported By: Kisothana (QA)

Title:
Notification bell icon in Settings page is not functioning

Description:
The notification bell icon is displayed in the top-right corner of the Settings page. 
However, clicking the notification icon does not perform any action such as opening a notification panel or redirecting to a notification page.

Steps to Reproduce:
1. Login to the system
2. Navigate to Settings page
3. Click the notification bell icon

Expected Result:
The system should display the user notifications panel or redirect to the notifications page.

Actual Result:
No action occurs when clicking the notification bell icon.

Severity:
Low

Status:
Open

Comments:
If notification functionality is not implemented on this page, the icon should either be connected to the notification module or removed from the UI.
-----------------------------------------

-----------------------------------------

Bug ID: BUG_013
Module: Settings – Calendar Management
Type: UI / Feature Mismatch
Date: 2026-03-04
Reported By: Kisothana (QA)

Title:
Calendar Management option appears in Settings though not included in design

Description:
The Settings sidebar contains a "Calendar Management" option. 
When clicked, the page displays "Coming Soon – This section is under development." 
However, this feature was not included in the approved UI design.

Steps to Reproduce:
1. Login to the system
2. Navigate to Settings
3. Click "Calendar Management" in the sidebar

Expected Result:
Only features defined in the approved design should appear in the Settings menu.

Actual Result:
"Calendar Management" option is visible and shows a "Coming Soon" placeholder.

Severity:
Low

Status:
Open

Comments:
If the feature is not planned for the current version, the option should be removed from the UI.
-----------------------------------------

-----------------------------------------

Bug ID: BUG_014
Module: Settings – Event Defaults
Type: UI / Feature Mismatch
Date: 2026-03-04
Reported By: Kisothana (QA)

Title:
"Event Defaults" option appears in Settings though not included in design

Description:
The Settings sidebar contains an "Event Defaults" option. 
However, this feature is not present in the approved UI design for the system.

Steps to Reproduce:
1. Login to the system
2. Navigate to Settings
3. Observe the sidebar menu
4. Locate "Event Defaults"

Expected Result:
Only the features specified in the approved design should appear in the Settings menu.

Actual Result:
"Event Defaults" option is visible in the sidebar even though it is not defined in the design.

Severity:
Low

Status:
Open

Comments:
If the feature is not required for the current version, the option should be removed from the Settings menu.
-----------------------------------------

-----------------------------------------

Bug ID: BUG_015
Module: Settings – User Roles
Type: UI / Feature Mismatch
Date: 2026-03-04
Reported By: Kisothana (QA)

Title:
"User Roles" option appears in Settings though not included in design

Description:
The Settings sidebar contains a "User Roles" option. However, this feature was not included in the approved UI design for the system.

Steps to Reproduce:
1. Login to the system
2. Navigate to Settings
3. Observe the sidebar menu
4. Locate "User Roles"

Expected Result:
Only the features specified in the approved design should appear in the Settings menu.

Actual Result:
"User Roles" option is visible in the sidebar even though it is not part of the design.

Severity:
Low

Status:
Open

Comments:
If role management is not required for this version of the system, the option should be removed from the Settings menu.
-----------------------------------------

-----------------------------------------

Bug ID: BUG_016
Module: Settings – Integrations
Type: UI / Feature Mismatch
Date: 2026-03-04
Reported By: Kisothana (QA)

Title:
"Integrations" option appears in Settings though not included in design

Description:
The Settings sidebar contains an "Integrations" option. However, this feature is not included in the approved UI design for the system.

Steps to Reproduce:
1. Login to the system
2. Navigate to Settings
3. Observe the sidebar menu
4. Locate "Integrations"

Expected Result:
Only the features defined in the approved design should appear in the Settings menu.

Actual Result:
"Integrations" option is visible in the sidebar even though it is not part of the design.

Severity:
Low

Status:
Open

Comments:
If integration functionality is not required for the current version, the option should be removed from the Settings menu.
-----------------------------------------

-----------------------------------------

Bug ID: BUG_017
Module: Calendar – Week View
Type: UI Bug
Date: 2026-03-04
Reported By: Kisothana (QA)

Title:
12 AM time label is not clearly visible in the calendar week view

Description:
In the calendar week view, the first time label (12 AM) is partially hidden and not clearly visible to the user.

Steps to Reproduce:
1. Login to the system
2. Navigate to Calendar
3. Switch to Week view
4. Observe the timeline on the left side

Expected Result:
The "12 AM" time label should be fully visible and properly aligned.

Actual Result:
The "12 AM" label is partially hidden and not clearly readable.

Severity:
Low

Status:
Open

Comments:
This may be caused by incorrect padding or margin in the timeline header section.
-----------------------------------------

-----------------------------------------

Bug ID: BUG_018
Module: Calendar View
Type: Functional Bug
Date: 2026-03-04
Reported By: Kisothana (QA)

Title:
Filter button in Calendar view is not working

Description:
The filter icon/button in the Calendar Month view does not perform any action when clicked.

Steps to Reproduce:
1. Login to the system
2. Navigate to Calendar
3. Click the Filter icon on the top right

Expected Result:
A filter panel or options should appear allowing the user to filter events (e.g., Academic Calendar, Examinations, Seminars, Staff Meetings).

Actual Result:
Nothing happens when the Filter button is clicked.

Severity:
Medium

Status:
Open

Comments:
The filter functionality may not be implemented or the button may not be connected to the filtering logic.
-----------------------------------------

-----------------------------------------

Bug ID: BUG_019
Module: Calendar – Month View
Type: UI / Functional Bug
Date: 2026-03-04
Reported By: Kisothana (QA)

Title:
Help (?) button near Filter is not working

Description:
The Help icon (?) located next to the Filter button in the Calendar view does not perform any action when clicked.

Steps to Reproduce:
1. Login to the system
2. Navigate to Calendar
3. Click the Help (?) icon next to the Filter button

Expected Result:
The button should open a help guide, tooltip, or documentation related to the calendar features.

Actual Result:
Nothing happens when the Help button is clicked.

Severity:
Low

Status:
Open

Comments:
If help functionality is not implemented yet, the button should be removed from the UI to avoid confusing users.
-----------------------------------------

-----------------------------------------

Bug ID: BUG_025
Module: Notifications
Type: Functional Bug
Date: 2026-03-04
Reported By: Kisothana (QA)

Title:
"Mark as read" notification status does not persist after navigating to another page

Description:
When a notification is marked as read using the "Mark as read" button, it appears as read initially. However, after navigating to another page (e.g., Calendar or Dashboard) and returning to the Notifications page, the notification appears again as unread.

Steps to Reproduce:
1. Login to the system
2. Navigate to Notifications page
3. Click "Mark as read" on a notification
4. Navigate to another page (e.g., Calendar or Dashboard)
5. Return to the Notifications page

Expected Result:
The notification should remain marked as read.

Actual Result:
The notification status resets and appears as unread again.

Severity:
Medium

Status:
Open

Comments:
The read status may not be saved in the database or backend state.
-----------------------------------------