import userSchema from "./userSchema";

export function postResume(obj) {
  const resume = new userSchema(obj);
  return resume.save();
}

export const getuserbygmail = (email) => {
  return userSchema.findOne({ email });
};

export const updateUserOptimizationHistory = async (
  email,
  originalText,
  optimizedText
) => {
  const user = await userSchema.findOne({ email });

  if (!user) {
    throw new Error("User not found");
  }

  user.optimizationHistory.push({
    date: new Date(),
    originalText,
    optimizedText,
  });

  return user.save();
};
