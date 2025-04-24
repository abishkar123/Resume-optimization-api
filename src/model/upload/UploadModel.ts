import uploadResumeSchema from "./uploadResumeSchema";

export function postResume(obj: any) {
  const resume = new uploadResumeSchema(obj);
  return resume.save();
}
