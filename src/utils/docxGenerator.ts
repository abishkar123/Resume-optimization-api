import {
  Document,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  UnderlineType,
  Packer,
} from "docx";

export const createDocx = async (formattedContent: string): Promise<Buffer> => {
  const sections = parseResumeContent(formattedContent);

  // Create document with the sections
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: generateDocumentElements(sections),
      },
    ],
  });

  // Return document as buffer
  return await Packer.toBuffer(doc);
};

function parseResumeContent(content: string) {
  // Split content by lines
  const lines = content.split("\n").filter((line) => line.trim().length > 0);

  // Simple parser to identify sections
  const parsedSections = {
    header: {
      name: lines[0] || "",
      contactInfo: lines.slice(1, 3).join("\n") || "",
    },
    summary: "",
    skills: "",
    experience: "",
    education: "",
    certifications: "",
    projects: "",
    references: "",
  };

  let currentSection = "header";
  let lineIndex = 3; // Start after header

  while (lineIndex < lines.length) {
    const line = lines[lineIndex];

    // Check for section headers (usually capitalized or with colons)
    if (line.toUpperCase() === line && line.trim().length > 0) {
      // Identify which section based on keywords
      if (line.includes("SUMMARY") || line.includes("PROFILE")) {
        currentSection = "summary";
      } else if (line.includes("SKILL")) {
        currentSection = "skills";
      } else if (line.includes("EXPERIENCE") || line.includes("EMPLOYMENT")) {
        currentSection = "experience";
      } else if (line.includes("EDUCATION")) {
        currentSection = "education";
      } else if (line.includes("CERTIFICATION")) {
        currentSection = "certifications";
      } else if (line.includes("PROJECT")) {
        currentSection = "projects";
      } else if (line.includes("REFERENCE")) {
        currentSection = "references";
      }

      lineIndex++;
      continue;
    }

    // Add content to the current section
    parsedSections[currentSection] += line + "\n";
    lineIndex++;
  }

  return parsedSections;
}

/**
 * Generate document elements from parsed sections
 */
function generateDocumentElements(sections) {
  const elements = [];

  // Add header (name and contact info)
  elements.push(
    new Paragraph({
      text: sections.header.name,
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      spacing: {
        after: 200,
      },
    })
  );

  elements.push(
    new Paragraph({
      text: sections.header.contactInfo,
      alignment: AlignmentType.CENTER,
      spacing: {
        after: 400,
      },
    })
  );

  // Add other sections if they exist
  if (sections.summary) {
    elements.push(createSectionHeading("PROFESSIONAL SUMMARY"));
    elements.push(createTextParagraph(sections.summary));
  }

  if (sections.skills) {
    elements.push(createSectionHeading("SKILLS"));
    elements.push(createTextParagraph(sections.skills));
  }

  if (sections.experience) {
    elements.push(createSectionHeading("WORK EXPERIENCE"));
    elements.push(createTextParagraph(sections.experience));
  }

  if (sections.education) {
    elements.push(createSectionHeading("EDUCATION"));
    elements.push(createTextParagraph(sections.education));
  }

  if (sections.certifications) {
    elements.push(createSectionHeading("CERTIFICATIONS"));
    elements.push(createTextParagraph(sections.certifications));
  }

  if (sections.projects) {
    elements.push(createSectionHeading("PROJECTS"));
    elements.push(createTextParagraph(sections.projects));
  }

  if (sections.references) {
    elements.push(createSectionHeading("REFERENCES"));
    elements.push(createTextParagraph(sections.references));
  }

  return elements;
}

/**
 * Create a section heading paragraph
 */
function createSectionHeading(text: string) {
  return new Paragraph({
    text: text,
    heading: HeadingLevel.HEADING_2,
    spacing: {
      before: 400,
      after: 200,
    },
    border: {
      bottom: {
        color: "auto",
        space: 1,
        style: "single",
        size: 6,
      },
    },
  });
}

/**
 * Create a standard text paragraph
 */
function createTextParagraph(text: string) {
  return new Paragraph({
    children: [
      new TextRun({
        text: text,
        size: 22, // 11pt
      }),
    ],
    spacing: {
      after: 200,
    },
  });
}
