// Fetch and analyze the CSV file structure
async function fetchAndAnalyzeCSV() {
  try {
    console.log("Fetching CSV file...")
    const response = await fetch(
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/wc-product-export-15-7-2025-1752561703001-07AHdLRcnxx9KHHqBQbWedYdbrWtvg.csv",
    )
    const csvText = await response.text()

    console.log("CSV file size:", csvText.length, "characters")
    console.log("First 1000 characters:")
    console.log(csvText.substring(0, 1000))

    // Split into lines and analyze structure
    const lines = csvText.split("\n")
    console.log("Total lines:", lines.length)

    if (lines.length > 0) {
      console.log("Header row:")
      console.log(lines[0])

      console.log("First few data rows:")
      for (let i = 1; i < Math.min(6, lines.length); i++) {
        console.log(`Row ${i}:`, lines[i].substring(0, 200) + "...")
      }
    }

    // Try to detect delimiter
    const header = lines[0]
    const commaCount = (header.match(/,/g) || []).length
    const semicolonCount = (header.match(/;/g) || []).length
    const tabCount = (header.match(/\t/g) || []).length

    console.log("Delimiter analysis:")
    console.log("Commas:", commaCount)
    console.log("Semicolons:", semicolonCount)
    console.log("Tabs:", tabCount)

    return csvText
  } catch (error) {
    console.error("Error fetching CSV:", error)
    return null
  }
}

// Run the analysis
fetchAndAnalyzeCSV()
