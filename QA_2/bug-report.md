Testing – Student (Final Update)

-----------------------------------------

Bug ID: BUG_021
Module: Notifications / Header
Type: Functional Bug
Date: 2026-03-04
Reported By: Kisothana (QA)

Title:
Notification bell count does not update after clicking "Mark as read"

Description:
After clicking the "Mark as read" button in the Notifications page, notifications appear visually marked as read. However, the notification bell icon in the header still shows the unread count (e.g., 2), which is incorrect.

Steps to Reproduce:
1. Login to the system
2. Navigate to Notifications page
3. Click "Mark as read"
4. Observe the notification bell icon in the header

Expected Result:
The notification bell counter should update to reflect zero unread notifications.

Actual Result:
The notification bell still shows the previous unread count (e.g., 2).

Severity:
Medium

Status:
Open

Comments:
The notification counter may not be synchronized with the read status or backend state after updating.

-----------------------------------------

-----------------------------------------

Bug ID: BUG_022
Module: Help & Support – Contact Admin
Type: Enhancement Request
Date: 2026-03-04
Reported By: Kisothana (QA)

Title:
Contact Admin section should include administrator email

Description:
The "Contact Admin" section in the Help & Support page only shows general text and does not provide a direct contact method such as an email address.

Steps to Reproduce:
1. Login to the system
2. Navigate to Help & Support
3. Observe the Contact Admin section

Expected Result:
The section should include a clickable administrator email (e.g., admin@eng.jfn.ac.lk) or a contact form.

Actual Result:
No direct contact information is available.

Severity:
Low

Status:
Open

Comments:
Providing an email link would improve usability and help users quickly contact the administrator.

-----------------------------------------

-----------------------------------------

Bug ID: BUG_023
Module: Settings – Sidebar
Type: UI / Design Mismatch
Date: 2026-03-04
Reported By: Kisothana (QA)

Title:
"Help & Support" option appears in Settings though not included in design

Description:
The Settings sidebar contains a "Help & Support" option. However, according to the approved UI design, this option should not appear in the Settings module.

Steps to Reproduce:
1. Login to the system
2. Navigate to Settings
3. Observe the sidebar menu

Expected Result:
The Settings sidebar should display only the required options defined in the design.

Actual Result:
"Help & Support" option is visible in the Settings sidebar.

Severity:
Low

Status:
Open

Comments:
If Help & Support is already available in the main sidebar, it should not be duplicated inside Settings.

-----------------------------------------

-----------------------------------------

Bug ID: BUG_024
Module: Tasks – Layout
Type: UI / Design Mismatch
Date: 2026-03-04
Reported By: Kisothana (QA)

Title:
Unnecessary second sidebar appears in Tasks module

Description:
In the Tasks module, an additional (second) sidebar appears showing options like "My Day", "Important", "Planned", and "Tasks". According to the approved UI design, only the main sidebar should be displayed and this second sidebar is not required.

Steps to Reproduce:
1. Login to the system
2. Navigate to Tasks module
3. Observe the left section of the layout

Expected Result:
Only the main sidebar should be visible, matching the approved design.

Actual Result:
An extra second sidebar is displayed with task filter options.

Severity:
Low

Status:
Open

Comments:
This creates unnecessary visual clutter and does not match the design specification.

-----------------------------------------

-----------------------------------------

Bug ID: BUG_025
Module: Header / Profile UI
Type: UI Consistency Issue
Date: 2026-03-04
Reported By: Kisothana (QA)

Title:
Profile section appears inconsistent between Dashboard and Settings pages

Description:
The profile section in the header shows differently across pages.  
On the Dashboard page, it displays the profile avatar, full name, and role label ("Student").  
However, on the Settings page, only the avatar (initials) is displayed without the name and role label.

Steps to Reproduce:
1. Login to the system
2. Observe the profile section on the Dashboard page
3. Navigate to the Settings page
4. Compare the profile section in both pages

Expected Result:
The profile section should appear consistently across all pages (same layout, name, and role visibility).

Actual Result:
The profile section layout differs between Dashboard and Settings pages.

Severity:
Low

Status:
Open

Comments:
UI inconsistency may confuse users and should follow a uniform design system.

-----------------------------------------

-----------------------------------------

Bug ID: BUG_026
Module: Settings – Header
Type: UI / Design Mismatch
Date: 2026-03-04
Reported By: Kisothana (QA)

Title:
Notification bell icon appears in Settings though not required in design

Description:
The Settings page header includes a notification bell icon. However, according to the approved UI design, the notification bell should not be displayed in the Settings interface.

Steps to Reproduce:
1. Login to the system
2. Navigate to Settings page
3. Observe the top-right header section

Expected Result:
The notification bell icon should not be visible in the Settings page header.

Actual Result:
Notification bell icon is displayed in the Settings page header.

Severity:
Low

Status:
Open

Comments:
Removing unnecessary header elements will improve UI consistency and reduce visual clutter.

-----------------------------------------

-----------------------------------------

Bug ID: BUG_027
Module: Settings – Theme
Type: Functional
Date: 2026-03-04
Reported By: Kisothana (QA)

Title:
Dark Mode toggle is not working

Description:
The Dark Mode toggle in Settings does not apply the dark theme when enabled.

Steps to Reproduce:
1. Login to the system
2. Go to Settings
3. Turn ON the Dark Mode toggle

Expected Result:
System should switch to dark theme immediately.

Actual Result:
No change occurs after enabling Dark Mode.

Severity:
Medium

Status:
Open

Comments:
The toggle state changes visually but the theme is not applied. Possibly missing theme state handling or CSS theme switching logic.

-----------------------------------------

-----------------------------------------

Bug ID: BUG_028
Module: Settings – Calendar View
Type: Functional
Date: 2026-03-04
Reported By: Kisothana (QA)

Title:
"Show Event Descriptions" toggle is not working

Description:
Enabling "Show Event Descriptions" does not display event descriptions in calendar view.

Steps to Reproduce:
1. Login to system
2. Go to Settings
3. Enable "Show Event Descriptions"
4. Open Calendar view

Expected Result:
Event descriptions should be visible.

Actual Result:
Descriptions are not shown.

Severity:
Medium

Status:
Open

Comments:
The setting appears enabled but is not reflected in the calendar UI. May not be connected to calendar rendering logic.

-----------------------------------------

-----------------------------------------

Bug ID: BUG_029
Module: Settings – Time Format
Type: Functional
Date: 2026-03-04
Reported By: Kisothana (QA)

Title:
24-Hour Clock toggle is not working

Description:
Enabling the 24-Hour Clock setting does not change time format across the system.

Steps to Reproduce:
1. Login to system
2. Go to Settings
3. Enable 24-Hour Clock
4. Check event times

Expected Result:
Times should appear in 24-hour format.

Actual Result:
Time format remains unchanged.

Severity:
Medium

Status:
Open

Comments:
Time values continue to display in 12-hour format. Likely missing global format update or persistence logic.

-----------------------------------------

-----------------------------------------

Bug ID: BUG_030
Module: Settings – Calendar Preferences
Type: Functional
Date: 2026-03-04
Reported By: Kisothana (QA)

Title:
"First Day of Week" setting is not applied

Description:
Changing the "First Day of Week" setting does not update calendar layout.

Steps to Reproduce:
1. Login to system
2. Go to Settings
3. Change First Day of Week (e.g., Sunday → Monday)
4. Open Calendar view

Expected Result:
Calendar should update based on selected first day.

Actual Result:
Calendar remains unchanged.

Severity:
Medium

Status:
Open

Comments:
The selected option is saved visually but not applied to calendar layout. Possibly missing state refresh or calendar config binding.

-----------------------------------------