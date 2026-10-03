const projectId = "smart-water-planting";
const uid = "INSERT_UID_HERE"; // We can actually just write to a test document first to check if the DB is reachable

async function checkDatabase() {
  console.log("Testing Firestore REST API connection...");
  
  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/users/test_connection?updateMask.fieldPaths=role`;
  
  try {
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fields: {
          role: { stringValue: "admin" }
        }
      })
    });
    
    const data = await response.json();
    console.log("Response Status:", response.status);
    console.log("Response Data:", JSON.stringify(data, null, 2));
    
  } catch (error) {
    console.error("Fetch failed:", error);
  }
}

checkDatabase();
