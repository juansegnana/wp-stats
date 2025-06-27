import { type NextRequest, NextResponse } from "next/server"
import { spawn } from "child_process"
import { writeFile, unlink } from "fs/promises"
import { join } from "path"
import { tmpdir } from "os"
import { createGunzip } from "zlib"
import { pipeline } from "stream/promises"
import { Readable } from "stream"

export async function POST(request: NextRequest) {
  try {
    const contentEncoding = request.headers.get('content-encoding')
    let fileContent: string

    if (contentEncoding === 'gzip') {
      // Handle compressed data
      const compressedData = await request.arrayBuffer()
      const gunzip = createGunzip()
      const readable = Readable.from(Buffer.from(compressedData))
      
      const chunks: Buffer[] = []
      await pipeline(
        readable,
        gunzip,
        async function* (source) {
          for await (const chunk of source) {
            chunks.push(chunk)
          }
        }
      )
      
      fileContent = Buffer.concat(chunks).toString('utf-8')
    } else {
      // Handle regular form data (fallback)
      const formData = await request.formData()
      const file = formData.get("file") as File

      if (!file) {
        return NextResponse.json({ error: "No file provided" }, { status: 400 })
      }

      fileContent = await file.text()
    }

    // Create a temporary file
    const tempFilePath = join(tmpdir(), `whatsapp-${Date.now()}.txt`)
    await writeFile(tempFilePath, fileContent, 'utf-8')

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
