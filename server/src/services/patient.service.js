import Patient from "../models/patient.js";
import User from "../models/user.js";
import responseHandler from "../utils/responseHandler.js";
const { errorResponse, notFoundResponse } = responseHandler;

const patientService = {
  register: async (userId, patientData, next) => {
    const patientExists = await Patient.findOne({ email: patientData.email });
    if (patientExists) {
      return next(errorResponse("Patient already exists", 400));
    }
    const patient = await Patient.create({
      userId,
      ...patientData,
    });
    //update and save user patient profile
    const user = await User.findById(userId);
    user.isCompletedOnboard = true;
    user.phone = patientData.phone;
    user.dateOfBirth = patientData.dateOfBirth;
    await user.save();
    return patient;
  },
};

export default patientService;
