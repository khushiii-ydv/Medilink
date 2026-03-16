import prisma from "../config/db.js";

export const getMyNotifications = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const notifications = await prisma.notification.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      status: "success",
      message: "Notifications fetched successfully",
      data: notifications,
    });
  } catch (error) {
    next(error);
  }
};

export const markNotificationAsRead = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { notificationId } = req.params;

    const notification = await prisma.notification.findUnique({
      where: {
        id: notificationId,
      },
    });

    if (!notification) {
      return res.status(404).json({
        status: "error",
        message: "Notification not found",
      });
    }

    if (notification.userId !== userId) {
      return res.status(403).json({
        status: "error",
        message: "You can only update your own notifications",
      });
    }

    const updatedNotification = await prisma.notification.update({
      where: {
        id: notificationId,
      },
      data: {
        isRead: true,
      },
    });

    return res.status(200).json({
      status: "success",
      message: "Notification marked as read",
      data: updatedNotification,
    });
  } catch (error) {
    next(error);
  }
};