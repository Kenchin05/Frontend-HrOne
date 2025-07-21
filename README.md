# JSON Schema Builder

A dynamic, interactive, and user-friendly interface for building complex, nested JSON schemas in real-time. This project was built as a frontend hiring task for HROne.

**[Live Demo](https://frontend-assignment-two-mu.vercel.app)** 
##  Screenshot

_A screenshot of the final application with the side-by-side view and nested fields._
![JSON Schema Builder Screenshot](/public/final-look.png) 

---

##  Features

This project not only fulfills all the core requirements of the task but also includes several enhancements to improve user experience.

### Core Requirements

* **Dynamic Field Management**: Users can add, edit, and delete fields at any level of the schema.
* **Nested Objects**: Full support for creating deeply nested objects recursively. The UI clearly indents nested levels.
* **Data Types**: Supports `String`, `Number`, and `Nested` data types.
* **Live JSON Preview**: A side-by-side panel shows the generated JSON schema, which updates in real-time as the user makes changes.

### Enhanced Features

* ** Drag-and-Drop Reordering**: Users can easily reorder fields at any level using a smooth drag-and-drop interface, powered by `dnd-kit` library.
* ** Field Validation**: The "Field Name" input is validated to prevent empty submissions and ensure that all field names are unique within the same nesting level. Error messages are displayed clearly to the user.
* **📋 Copy to Clipboard**: A convenient "Copy" button allows the user to copy the generated JSON to their clipboard.

---

## 🛠️ Tech Stack

* **Framework**: [React](https://react.dev/)
* **Build Tool**: [Vite](https://vitejs.dev/)
* **Language**: [TypeScript](https://www.typescriptlang.org/)
* **UI Components**: [ShadCN/UI](https://ui.shadcn.com/) & [Tailwind CSS](https://tailwindcss.com/)
* **State Management**: [React Hook Form](https://react-hook-form.com/)
* **Drag & Drop**: [dnd-kit](https://dndkit.com/)
* **Icons**: [Lucide React](https://lucide.dev/)

---

## 🚀 Getting Started

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/en) (v18 or later) installed on your system.

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone [https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)
    ```

2.  **Navigate to the project directory:**
    ```sh
    cd your-repo-name
    ```

3.  **Install dependencies:**
    ```sh
    npm install
    ```

4.  **Run the development server:**
    ```sh
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

5.  **Build for production:**
    ```sh
    npm run build
    ```

---

## ⚙️ How It Works

The application is built around a few core concepts to manage its complex state and recursive nature efficiently.

### State Management with React Hook Form

The entire state of the schema builder is managed by **React Hook Form**. The `useFieldArray` hook is the main component here, allowing for the dynamic creation, deletion, and reordering `move` of fields.

### Recursive Component Structure

The ability to handle infinite nesting is achieved through a recursive component design.
* The `App` component renders the top-level `SchemaList`.
* `SchemaList` uses `useFieldArray` to manage and render a list of `SchemaRow` components.
* If a `SchemaRow`'s type is set to "Nested," it conditionally renders another `SchemaList` component for its children. This `SchemaList` -> `SchemaRow` -> `SchemaList` pattern allows the structure to repeat indefinitely.

### JSON Transformation

The data structure managed by React Hook Form is an array of objects optimized for the form state. A recursive `transformSchemaToJSON` function is used to convert this internal state into the clean, key-value JSON format displayed in the live preview panel and generated on submission.