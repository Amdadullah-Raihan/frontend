# Octopi Digital LMS




## Client Architecture


The project follows a structured and modular architecture to ensure scalability, maintainability, and clarity. The folder organization is designed to separate global elements from page-specific components, following a clear hierarchy.


### Global Folders


The following folders are **global** and contain files or components that are reused throughout the entire application:


1. **`components/`**  
   This folder contains reusable UI components that can be used across multiple pages or sections of the application. Examples include buttons, form inputs, modals, and shared UI elements.
   
   Example:
   ```bash
   src/
   └── components/
       ├── Button.js
       ├── TextInput.js
       ├── Modal.js
   ```


2. **`contexts/`**  
   This folder contains Context API providers and consumers that manage global state, such as authentication, user roles, and theme (e.g., dark mode).


   Example:
   ```bash
   src/
   └── contexts/
       ├── AuthContext.js
       ├── ThemeContext.js
   ```


3. **`hooks/`**  
   Contains custom React hooks used across the application. These hooks handle logic that can be shared across components, such as `useTitle`, `useScrollToTop`, or `useFetch`.


   Example:
   ```bash
   src/
   └── hooks/
       ├── useAuth.js
       ├── useDarkMode.js
       ├── useTitle.js
   ```


4. **`utils/`**  
   A collection of utility functions and helper methods, such as formatting dates, API requests, or other reusable logic.


   Example:
   ```bash
   src/
   └── utils/
       ├── formatDate.js
       ├── api.js
       ├── validation.js
   ```


5. **`assets/`**  
   This folder holds static assets like images, icons, and fonts.


   Example:
   ```bash
   src/
   └── assets/
       ├── logo.png
       ├── banner.jpg
       ├── icons/
   ```


### Page-Specific Folders


The **`pages/`** folder contains the structure for all individual pages in the application, such as dashboards, course pages, certificates, etc. Each page has its own folder, which can also contain **page-specific components** or **sub-pages**.


Example structure:
```bash
src/
└── pages/
    ├── dashboard/
    │   ├── admin/
    │   │   ├── AdminDashboard.js
    │   │   ├── ManageCourses.js
    │   │   └── components/  # Components specific to admin dashboard
    │   │       ├── AdminChart.js
    │   │       ├── CourseCard.js
    │   ├── UserDashboard.js  # User dashboard related page
    │   ├── Profile.js        # User profile page under dashboard
    │   └── components/       # Components shared by the dashboard pages
    │       ├── DashboardHeader.js
    │       ├── StatsCard.js
    ├── courses/
    │   ├── CoursesList.js
    │   ├── CourseDetails.js
    │   ├── components/       # Components specific to the courses pages
    │       ├── CourseCard.js
    │       ├── LessonItem.js
    ├── certificates/
    │   ├── CertificatesList.js
    │   ├── CertificateDetails.js
    │   └── components/       # Components specific to the certificates pages
    │       ├── CertificateItem.js
    │       ├── DownloadButton.js
```


### Folder Structure Explanation


1. **Page Folder** (`pages/`)  
   Each page (like Dashboard, Courses, Certificates) gets its own folder under `pages/`. Each folder represents a high-level feature or view of the application.
   
   - **User vs. Admin Pages**: If a page has both user-specific and admin-specific views (like the dashboard), it will have sub-folders separating the admin and user pages. For example, `dashboard/admin/` contains admin-related dashboard pages, while pages outside the `admin/` folder (like `UserDashboard.js`) are user-specific.


2. **Components Inside Page Folders**  
   Components that are only relevant to a specific page are placed inside the page’s folder under `components/`. These are not globally reused but are specific to the page’s functionality.
   
   For example:
   - `src/pages/dashboard/components/DashboardHeader.js` is a header component used only within the dashboard pages.
   - `src/pages/courses/components/CourseCard.js` is used specifically in course-related pages.


3. **Admin and User Separation**  
   Admin-specific pages and components are grouped inside their own folder (e.g., `dashboard/admin/`). This helps keep admin-related functionality distinct from user-specific functionality, ensuring clarity and separation of roles.


---


### Benefits of This Architecture


- **Modularity**: By separating global components from page-specific components, the architecture promotes reusability and maintainability.
- **Clarity**: Having dedicated folders for admin and user pages ensures that role-based views are clear and easy to manage.
- **Scalability**: New pages or features can easily be added by following the existing folder structure, keeping the codebase clean and organized.
- **Separation of Concerns**: Each page handles its own specific logic, while global elements (e.g., authentication) are handled in the global folders.


---



# Octopi LMS Front-End Setup Guide

Follow these steps to set up the front-end project for **Octopi LMS** on your local machine:

### 1. Create a Project Folder

First, create a folder named `octopi-lms` on your machine where the project will be stored.

```bash
mkdir octopi-lms
cd octopi-lms
```

### 2. Clone the Repository

Within the `octopi-lms` folder, clone the front-end repository from GitHub by running:

```bash
git clone https://github.com/octopdigital24/solar-lms-client.git
```

This will download the front-end codebase into a folder named `solar-lms-client`.

### 3. Navigate to the Project Folder

Move into the project directory:

```bash
cd solar-lms-client
```

### 4. Install Dependencies

To install all the necessary dependencies, run the following command:

```bash
npm install
```

This will install all the required packages and libraries based on the `package.json` file.

### 5. Run the Development Server

To start the development server and run the project locally, execute:

```bash
npm run dev
```

This will open the app in your default browser at `http://localhost:5173`, allowing you to see the local version of the LMS front-end.

### 6. Test Production Build

If you want to create a production build and preview it, follow these steps:

1. **Create the Production Build:**

   ```bash
   npm run build
   ```

   This will bundle the application and output it to the `dist` directory.

2. **Preview the Production Build:**

   After building the project, you can preview the production version locally by running:

   ```bash
   npm run preview
   ```

   This will serve the production build locally so you can test it.

---

### Enjoy Coding!

You are now ready to start coding in **Octopi LMS**. Open the `solar-lms-client` folder in your favorite code editor, and you’re good to go!

Happy coding!






