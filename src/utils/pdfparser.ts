import PDFParser from "pdf-parse";

export const extractTextFromPDF = async (pdfBuffer) => {
  try {
    const data = await PDFParser(pdfBuffer);
    return data.text;
  } catch (error) {
    console.error("PDF parsing error:", error);
    throw new Error("Failed to parse PDF resume");
  }
};
