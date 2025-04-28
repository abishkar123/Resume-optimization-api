import pdf from "pdf-parse";
import mammoth from "mammoth";

export const extractTextFromFile = async (fileBuffer, contentType) => {
  try {
    // Log contentType to debug the issue
    console.log("Content-Type received:", contentType);

    // If contentType is missing but we have a buffer, try to guess based on file signature
    if (!contentType && fileBuffer) {
      // PDF files start with "%PDF-"
      if (fileBuffer.toString("ascii", 0, 5) === "%PDF-") {
        console.log("Detected PDF by signature");
        contentType = "application/pdf";
      }
      // Other file types could be detected here
    }

    // Handle PDF files
    if (contentType === "application/pdf" || contentType?.includes("pdf")) {
      const data = await pdf(fileBuffer);
      return data.text;
    }

    // Handle Word documents
    if (
      contentType === "application/msword" ||
      contentType ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      contentType?.includes("word") ||
      contentType?.includes("docx")
    ) {
      const result = await mammoth.extractRawText({ buffer: fileBuffer });
      return result.value;
    }

    // Handle unsupported file formats
    throw new Error(`Unsupported file format: ${contentType}`);
  } catch (error) {
    console.error("Error extracting text:", error);
    throw new Error(`Text extraction failed: ${error.message}`);
  }
};
