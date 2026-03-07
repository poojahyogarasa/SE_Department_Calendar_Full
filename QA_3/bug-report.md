
Testing - Lecturer dashboard
-----------------------------------------

Bug ID: BUG_031
Module: Dashboard – Lecturer
Type: Functional
Date: 2026-03-04
Reported By: Kisothana (QA)

Title:
"Create Event" button is not working on Lecturer dashboard

Description:
The "Create Event" button on the Lecturer dashboard does not respond when clicked. No modal, page navigation, or action is triggered.

Steps to Reproduce:
1. Login to the system as Lecturer
2. Navigate to Dashboard
3. Click the "Create Event" button (top-right)

Expected Result:
User should be redirected to the event creation page or a modal form should open.

Actual Result:
No action occurs after clicking the button.

Severity:
High

Status:
Open

Comments:
Button appears clickable but has no functionality. Possibly missing click handler or route binding.

-----------------------------------------

-----------------------------------------

Bug ID: BUG_032
Module: Notifications – Lecturer Dashboard
Type: Functional / UI Consistency
Date: 2026-03-04
Reported By: Kisothana (QA)

Title:
Notification status mismatch between Dashboard and Notifications page

Description:
On the Dashboard, notifications appear as new/unread (highlighted with indicator).  
However, when navigating to the Notifications page, all notifications appear as already read.  
This creates inconsistency in notification status across the system.

Steps to Reproduce:
1. Login to system as Lecturer
2. Observe notifications on Dashboard (right-side panel)
3. Click Notifications from sidebar
4. Compare notification status

Expected Result:
Unread notifications should remain marked as unread on the Notifications page.

Actual Result:
All notifications appear as read on the Notifications page.

Severity:
Medium

Status:
Open

Comments:
Likely issue with unread state synchronization between dashboard widget and notifications page. May require consistent backend state handling.

-----------------------------------------

-----------------------------------------

Bug ID: BUG_033
Module: Header / Profile UI
Type: UI Consistency Issue
Date: 2026-03-06
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

Bug ID: BUG_034
Module: Dashboard – Sidebar (Lecturer)
Type: Functional
Date: 2026-03-06
Reported By: Kisothana (QA)

Title:
Some sidebar buttons are not working on Lecturer dashboard

Description:
Several sidebar options under the STAFF section (Attendance, Venues, Announcements, Reports) are visible but do not respond when clicked. No page navigation or action is triggered.

Steps to Reproduce:
1. Login to system as Lecturer
2. Navigate to Dashboard
3. Click the following sidebar options one by one:
   - Documents
   - Attendance
   - Venues
   - Announcements
   - Reports

Expected Result:
Each option should navigate to its respective module/page.

Actual Result:
No action occurs when clicking these sidebar options.

Severity:
High

Status:
Open

Comments:
Sidebar items appear interactive but have no functionality. Possibly missing routing configuration or click event binding.

-----------------------------------------

-----------------------------------------

Bug ID: BUG_035
Module: Settings – Display & Appearance
Type: Functional
Date: 2026-03-06
Reported By: Kisothana (QA)

Title:
All settings functionalities are not working in Display & Appearance section

Description:
All controls in the Display & Appearance settings section are not functioning. 
Toggles and dropdown selections do not respond when clicked, and no changes are applied.

Steps to Reproduce:
1. Login to system
2. Navigate to Settings → Display & Appearance
3. Try interacting with the following options:
   - Dark Mode toggle
   - Show Event Descriptions toggle
   - 24-Hour Clock toggle
   - First Day of Week dropdown

Expected Result:
Each setting should respond correctly and apply the selected configuration.

Actual Result:
No action occurs. Toggles and dropdown selections do not work.

Severity:
High

Status:
Open

Comments:
Likely missing event handling or backend integration for settings persistence.

-----------------------------------------

-----------------------------------------

Bug ID: BUG_036
Module: Profile Page
Type: Functional / UI
Date: 2026-03-06
Reported By: Kisothana (QA)

Title:
Settings icon on Profile page is not working

Description:
The settings (gear) icon displayed on the Profile page does not respond when clicked. 
No navigation, modal, or action is triggered.

Steps to Reproduce:
1. Login to the system
2. Open Profile page
3. Click the settings (gear) icon (top-right of profile card)

Expected Result:
User should be redirected to the Settings page or relevant profile settings interface.

Actual Result:
No action occurs after clicking the icon.

Severity:
Medium

Status:
Open

Comments:
If profile settings are not implemented yet, the icon should be removed to avoid confusion.

-----------------------------------------

-----------------------------------------

Bug ID: BUG_037
Module: Settings – Sidebar
Type: UI / Design Mismatch
Date: 2026-03-06
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

Bug ID: BUG_038
Module: Tasks – Layout
Type: UI / Design Mismatch
Date: 2026-03-06
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

Bug ID: BUG_039
Module: Profile Page
Type: Functional / UI
Date: 2026-03-06
Reported By: Kisothana (QA)

Title:
Settings icon on Profile page is not working

Description:
The settings (gear) icon displayed on the Profile page does not respond when clicked. 
No navigation, modal, or action is triggered.

Steps to Reproduce:
1. Login to the system
2. Open Profile page
3. Click the settings (gear) icon (top-right of profile card)

Expected Result:
User should be redirected to the Settings page or relevant profile settings interface.

Actual Result:
No action occurs after clicking the icon.

Severity:
Medium

Status:
Open

Comments:
- If profile settings are not implemented yet, the icon should be removed to avoid confusion.
- Recommend adding a **"Back" button** on the Profile page so users can easily return to the previous page for better navigation.

-----------------------------------------

-----------------------------------------

Bug ID: BUG_040
Module: Settings – Display & Appearance
Type: UI Consistency
Date: 2026-03-06
Reported By: Kisothana (QA)

Title:
"Show Event Descriptions" toggle appears inconsistent with other toggles

Description:
The "Show Event Descriptions" toggle button appears visually different from the other toggle controls 
(Dark Mode and 24-Hour Clock) in the same settings section. The style, alignment, or appearance is inconsistent.

Steps to Reproduce:
1. Login to system
2. Navigate to Settings → Display & Appearance
3. Compare the toggle appearance of:
   - Dark Mode
   - 24-Hour Clock
   - Show Event Descriptions

Expected Result:
All toggle controls should have consistent styling and alignment.

Actual Result:
"Show Event Descriptions" toggle looks visually different from the others.

Severity:
Low

Status:
Open

Comments:
Likely CSS/UI styling inconsistency. Recommend using the same toggle component for all settings options.

-----------------------------------------

-----------------------------------------

Bug ID: BUG_041
Module: Settings – Header
Type: UI / Design Mismatch
Date: 2026-03-06
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

Bug ID: BUG_042
Module: Help & Support – Contact Admin
Type: Enhancement Request
Date: 2026-03-06
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


