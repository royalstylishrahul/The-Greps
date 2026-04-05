import CustomFieldBuilder from "./CustomFieldBuilder";
import UploadPortal from "./UploadPortal";

// Simple client-side router (no react-router needed for this demo)
// In a real app, use react-router-dom v6
function App() {
  const path = window.location.pathname;

  if (path.startsWith("/upload/")) {
    const mappingId = path.replace("/upload/", "");
    return <UploadPortal mappingId={mappingId} />;
  }

  return <CustomFieldBuilder />;
}

export default App;
