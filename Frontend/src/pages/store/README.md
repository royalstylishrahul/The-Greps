# StockAlert — Custom Field Builder

A full-stack, multi-tenant custom field system with QR-powered document uploads.

---

## Project Structure

```
stockalert-custom-fields/
├── backend/
│   ├── server.js          # Express API + Mongoose models
│   ├── package.json
│   └── .env.example       # Copy to .env and fill in values
└── frontend/
    ├── src/
    │   ├── App.jsx                # Simple router
    │   ├── CustomFieldBuilder.jsx # Settings page (main UI)
    │   ├── UploadPortal.jsx       # Mobile QR upload page
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── package.json
    └── tailwind.config.js
```

---

## Quick Start

### 1. Backend Setup

```bash
cd backend
npm install

# Copy .env.example → .env and fill in your values
cp .env.example .env

npm run dev        # starts on port 4000
```

**Environment variables needed:**

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB connection string |
| `FRONTEND_URL` | Frontend URL (e.g. `http://localhost:5173`) — used inside QR codes |
| `CLOUDINARY_CLOUD_NAME` | From cloudinary.com (free tier works) |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev       # starts on port 5173
```

Open **http://localhost:5173** to see the Custom Field Builder.

---

## Features

### Custom Field Builder (Settings Page)
- **+ Add Field** → type picker → configure → save
- **4 field types:** Text, Dropdown (custom options), Date & Time, Document
- **Mandatory toggle** on every field
- **Inline QR viewer** for document fields — click the QR icon to re-download

### QR Dropbox Workflow (Document Fields)
1. Admin creates a Document field
2. QR code **auto-downloads** immediately after save
3. Admin prints the QR and places it anywhere (desk, shelf, shop)
4. Customer scans → lands on mobile-friendly Upload Portal
5. Customer uploads their file (photo or PDF)
6. File is saved to Cloudinary + linked in MongoDB to the exact field

### Multi-Tenancy
Every API route is scoped to `storeId`. Field lookups, updates, and deletes all require the matching `storeId`, so User X's fields can never interfere with User Y's.

---

## API Reference

| Method | Route | Description |
|---|---|---|
| GET | `/api/fields/:storeId` | List all fields |
| POST | `/api/fields/:storeId` | Create field (returns QR if document type) |
| PATCH | `/api/fields/:storeId/:fieldId` | Update field (e.g. toggle mandatory) |
| DELETE | `/api/fields/:storeId/:fieldId` | Delete field |
| GET | `/api/fields/qr/:uniqueMappingId` | Regenerate QR for a document field |
| GET | `/api/upload-portal/:uniqueMappingId` | Get field info for upload page |
| POST | `/api/upload/:uniqueMappingId` | Upload a file via the QR portal |
| GET | `/api/documents/:storeId` | List all uploaded documents for a store |

---

## Database Schema

### CustomField
```js
{
  storeId: String,            // tenant isolation
  label: String,
  fieldType: "text" | "dropdown" | "datetime" | "document",
  isMandatory: Boolean,
  dropdownOptions: [String],  // only for dropdown type
  uniqueMappingId: String,    // UUID, used in QR URL
  createdAt: Date
}
```

### UploadedDocument
```js
{
  storeId: String,
  fieldId: ObjectId → CustomField,
  uniqueMappingId: String,
  customerId: String,         // optional — link to a customer record
  fileUrl: String,            // Cloudinary URL
  fileName: String,
  uploadedAt: Date
}
```

---

## Integrating with Existing StockAlert Auth

Replace the hardcoded `STORE_ID` constant in `CustomFieldBuilder.jsx` with your auth context:

```jsx
// Before
const STORE_ID = "store_demo_001";

// After (example with a custom auth hook)
const { store } = useAuth();
const STORE_ID = store.id;
```

On the backend, extract `storeId` from your JWT middleware instead of the URL param for production security.

---

## Production Notes

- Use **nginx** or **Vercel** for the React frontend
- Enable Vite's `historyApiFallback` so `/upload/:id` routes work on direct visits
- Add file size limits to Multer (`limits: { fileSize: 10 * 1024 * 1024 }` for 10MB)
- Add rate limiting to the `/api/upload/` endpoint to prevent abuse
