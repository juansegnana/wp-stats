import { type NextRequest, NextResponse } from "next/server"
import { spawn } from "child_process"
import { writeFile, unlink } from "fs/promises"
import { join } from "path"
import { tmpdir } from "os"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Create a temporary file
    const tempFilePath = join(tmpdir(), `whatsapp-${Date.now()}.txt`)
    const buffer = Buffer.from(await file.arrayBuffer())
    await writeFile(tempFilePath, buffer)

    try {
      // Run the Python analysis script
      const result = await runPythonScript(tempFilePath)

      // Clean up the temporary file
      await unlink(tempFilePath)

      return NextResponse.json(result)
    } catch (error) {
      // Clean up the temporary file in case of error
      await unlink(tempFilePath).catch(() => {}) // Ignore cleanup errors
      throw error
    }
  } catch (error) {
    console.error("Error analyzing chat:", error)
    return NextResponse.json({ error: "Failed to analyze chat file" }, { status: 500 })
  }
}

function runPythonScript(filePath: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const scriptPath = join(process.cwd(), "scripts", "analyze_chat.py")
    const python = spawn("python3", [scriptPath, filePath])

    let stdout = ""
    let stderr = ""

    python.stdout.on("data", (data) => {
      stdout += data.toString()
    })

    python.stderr.on("data", (data) => {
      stderr += data.toString()
    })

    python.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(`Python script failed: ${stderr}`))
        return
      }

      try {
        const result = JSON.parse(stdout)
        resolve(result)
      } catch (error) {
        reject(new Error(`Failed to parse Python script output: ${error}`))
      }
    })

    python.on("error", (error) => {
      reject(new Error(`Failed to start Python script: ${error.message}`))
    })
  })
}
