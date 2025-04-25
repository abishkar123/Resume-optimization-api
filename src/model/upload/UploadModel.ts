import userSchema from "./userSchema";

export function postResume(obj: string) {
  const resume = new userSchema(obj);
  return resume.save();
}

export const getuserbygmail = (email: string) => {
  return userSchema.findOne({ email });
};
