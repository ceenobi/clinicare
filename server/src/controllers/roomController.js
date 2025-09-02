import tryCatchFn from "../utils/tryCatchFn.js";
import responseHandler from "../utils/responseHandler.js";
import roomService from "../services/room.service.js";
const { successResponse } = responseHandler;

export const createRoom = tryCatchFn(async (req, res, next) => {
  const room = await roomService.createRoom(req.body, next);
  if (!room) return;
  return successResponse(res, room, "Room created successfully", 201);
});

export const getRoomMeta = tryCatchFn(async (req, res, next) => {
  const roomMeta = await roomService.getRoomMeta();
  if (!roomMeta) return;
  return successResponse(res, roomMeta, "Room meta fetched", 200);
});

export const getAllRooms = tryCatchFn(async (req, res, next) => {
  const { page, limit, query, roomType, roomStatus } = req.query;
  const responseData = await roomService.getAllRooms(
    parseInt(page),
    parseInt(limit),
    query,
    roomType,
    roomStatus,
    next
  );
  if (!responseData) return;
  return successResponse(
    res,
    responseData,
    "Rooms data fetched successfully",
    200
  );
});

export const updateRoom = tryCatchFn(async (req, res, next) => {
  const { id: roomId } = req.params;
  const responseData = await roomService.updateRoom(roomId, req.body, next);
  if (!responseData) return;
  return successResponse(res, responseData, "Room updated successfully", 200);
});
