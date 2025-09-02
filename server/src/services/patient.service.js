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
    const patientPhone = await Patient.findOne({ phone: patientData.phone });
    if (patientPhone) {
      return next(errorResponse("Phone already exists", 400));
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
  getAllPatients: async (
    page = 1,
    limit = 10,
    query = "",
    gender = "",
    bloodGroup = "",
    next
  ) => {
    const bloodGroupQuery = bloodGroup.replace(/[^\w+-]/gi, "");
    const sanitizeQuery = query
      ? query.toLowerCase().replace(/[^\w\s]/gi, "")
      : "";
    const [patients, total] =
      sanitizeQuery || gender || bloodGroup
        ? await Promise.all([
            Patient.find({
              $or: [{ fullname: { $regex: sanitizeQuery, $options: "i" } }],
              ...(gender && { gender: gender.toLowerCase() }),
              ...(bloodGroupQuery && { bloodGroup: bloodGroupQuery }),
            })
              .sort({ createdAt: -1 })
              .skip((page - 1) * limit)
              .limit(limit),
            Patient.countDocuments({
              $or: [{ fullname: { $regex: sanitizeQuery, $options: "i" } }],
              ...(gender && { gender: gender.toLowerCase() }),
              ...(bloodGroupQuery && { bloodGroup: bloodGroupQuery }),
            }),
          ])
        : await Promise.all([
            Patient.find()
              .sort({ createdAt: -1 })
              .skip((page - 1) * limit)
              .limit(limit),
            Patient.countDocuments(),
          ]);
    if (!patients) {
      return next(notFoundResponse("No patients found"));
    }
    return {
      meta: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        total,
        hasMore: (page - 1) * limit + patients.length < total,
        limit,
      },
      patients,
    };
  },
  getPatient: async (userId, next) => {
    const patient = await Patient.findOne({ userId: userId.toString() });
    if (!patient) {
      return next(notFoundResponse("No patient found"));
    }
    return patient;
  },
  updatePatient: async (patientId, patientData, next) => {
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return next(notFoundResponse("No patient found"));
    }
    for (const [key, value] of Object.entries(patientData)) {
      if (value) {
        patient[key] = value;
      }
    }
    const updatedPatient = await patient.save();
    return updatedPatient;
  },
};

export default patientService;
