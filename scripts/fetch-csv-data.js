// Fetch and analyze the CSV file structure
async function fetchAndAnalyzeCSV() {
  try {
    const response = await fetch(
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/wc-product-export-15-7-2025-1752561703001-tSahjkFoqxliHM32c8qntHFzPqybXT.csv",
    )
    const csvText = await response.text()

    console.log("CSV Content Preview:")
    console.log(csvText.substring(0, 1000)) // First 1000 characters

    // Parse CSV headers
    const lines = csvText.split("\n")
    const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""))

    console.log("\nCSV Headers:")
    console.log(headers)

    // Show first few data rows
    console.log("\nFirst 3 data rows:")
    for (let i = 1; i <= 3 && i < lines.length; i++) {
      const row = lines[i].split(",").map((cell) => cell.trim().replace(/"/g, ""))
      console.log(`Row ${i}:`, row.slice(0, 10)) // First 10 columns
    }

    return { headers, lines, csvText }
  } catch (error) {
    console.error("Error fetching CSV:", error)
  }
}

fetchAndAnalyzeCSV()
