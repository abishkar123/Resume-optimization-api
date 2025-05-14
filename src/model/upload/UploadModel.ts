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

export const getUserById = (id: string) => {
  return userSchema.findById(id);
};

export const getUserByEmail = (email: string) => {
  return userSchema.findOne({ email });
};

export const getResumeForDownload = async (email: string) => {
  const user = await userSchema.findOne({ email });

  if (!user) {
    throw new Error("User not found and eamil is invalid");
  }

  const latestOptimization =
    user.optimizationHistory[user.optimizationHistory.length - 1];

  return {
    fullname: user.fullname,
    email: user.email,
    originalText: latestOptimization.originalText,
    optimizedText: latestOptimization.optimizedText,
  };
};
