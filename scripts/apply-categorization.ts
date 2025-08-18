import { AIProductCategorizer } from "../lib/ai-categorizer"

async function runApply() {
  console.log("🚀 Starting AI Product Categorization - APPLY MODE")
  console.log("⚠️  WARNING: This will make changes to your database!")
  console.log("=".repeat(60))

  const categorizer = new AIProductCategorizer()

  try {
    const results = await categorizer.runCategorizationPipeline(false)

    console.log("\n✅ CATEGORIZATION APPLIED:")
    console.log("=".repeat(60))

    let appliedCount = 0
    let newCategoriesCount = 0

    results.forEach((result, index) => {
      console.log(`\n${index + 1}. ${result.productName}`)
      console.log(`   Applied: ${result.suggestedCategory}`)

      if (result.needsNewCategory) {
        newCategoriesCount++
        console.log(`   ✨ Created new category`)
      }
      appliedCount++
    })

    console.log("\n📊 APPLICATION SUMMARY:")
    console.log("=".repeat(60))
    console.log(`Products updated: ${appliedCount}`)
    console.log(`New categories created: ${newCategoriesCount}`)

    // Show logs
    const logs = categorizer.getLogs()
    const errorLogs = logs.filter((log) => log.action === "error")

    if (errorLogs.length > 0) {
      console.log("\n⚠️  ERRORS ENCOUNTERED:")
      console.log("=".repeat(60))
      errorLogs.forEach((log) => {
        console.log(`Product ${log.productId}: ${log.details.error}`)
      })
    }

    console.log("\n🎉 Categorization applied successfully!")
  } catch (error) {
    console.error("❌ Error during apply:", error)
    process.exit(1)
  }
}

runApply()
