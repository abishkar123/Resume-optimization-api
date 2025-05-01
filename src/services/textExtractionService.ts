import pdf from "pdf-parse";
import mammoth from "mammoth";

export const extractTextFromFile = async (fileBuffer, contentType) => {
  try {
    if (!contentType && fileBuffer) {
      if (fileBuffer.toString("ascii", 0, 5) === "%PDF-") {
        console.log("Detected PDF by signature");
        contentType = "application/pdf";
      }
    }

    if (contentType === "application/pdf" || contentType?.includes("pdf")) {
      const data = await pdf(fileBuffer);
      return data.text;
    }

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

    throw new Error(`Unsupported file format: ${contentType}`);
  } catch (error) {
    console.error("Error extracting text:", error);
    throw new Error(`Text extraction failed: ${error.message}`);
  }
};
