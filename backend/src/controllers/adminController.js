import { districtAnalytics, setCommissionPercent, verifyUser } from '../services/adminService.js';
import prisma from '../prismaClient.js';

export const verifyPlatformUser = async (req, res, next) => {
  try {
    const user = await verifyUser(req.body);
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

export const updateCommission = async (req, res, next) => {
  try {
    const config = await setCommissionPercent(req.body);
    res.json({ success: true, data: config });
  } catch (error) {
    next(error);
  }
};

export const createCluster = async (req, res, next) => {
  try {
    const cluster = await prisma.cluster.create({
      data: {
        name: req.body.name,
        districtId: req.body.districtId,
        managerId: req.body.managerId
      }
    });

    res.status(201).json({ success: true, data: cluster });
  } catch (error) {
    next(error);
  }
};

export const getAnalytics = async (req, res, next) => {
  try {
    const analytics = await districtAnalytics();
    res.json({ success: true, data: analytics });
  } catch (error) {
    next(error);
  }
};
