import { AIProductCategorizer } from "../lib/ai-categorizer"

async function runDryRun() {
  console.log("🤖 Starting AI Product Categorization - DRY RUN MODE")
  console.log("=".repeat(60))

  const categorizer = new AIProductCategorizer()

  try {
    const results = await categorizer.runCategorizationPipeline(true)

    console.log("\n📊 CATEGORIZATION RESULTS:")
    console.log("=".repeat(60))

    results.forEach((result, index) => {
      console.log(`\n${index + 1}. ${result.productName}`)
      console.log(`   Current: ${result.currentCategory || "None"}`)
      console.log(`   Suggested: ${result.suggestedCategory} (${result.confidence}% confidence)`)
      console.log(`   New Category: ${result.needsNewCategory ? "Yes" : "No"}`)
      console.log(`   Reasoning: ${result.reasoning}`)
    })

    // Export results
    const jsonExport = categorizer.exportResults(results, "json")
    const csvExport = categorizer.exportResults(results, "csv")

    console.log("\n💾 EXPORT DATA:")
    console.log("=".repeat(60))
    console.log("JSON format ready for download")
    console.log("CSV format ready for download")

    // Show summary stats
    const needsNewCategory = results.filter((r) => r.needsNewCategory).length
    const highConfidence = results.filter((r) => r.confidence >= 80).length
    const lowConfidence = results.filter((r) => r.confidence < 50).length

    console.log("\n📈 SUMMARY STATISTICS:")
    console.log("=".repeat(60))
    console.log(`Total products analyzed: ${results.length}`)
    console.log(`High confidence (≥80%): ${highConfidence}`)
    console.log(`Low confidence (<50%): ${lowConfidence}`)
    console.log(`Need new categories: ${needsNewCategory}`)

    console.log("\n✅ Dry run completed successfully!")
    console.log("Review the results above before running in apply mode.")
  } catch (error) {
    console.error("❌ Error during dry run:", error)
    process.exit(1)
  }
}

runDryRun()
