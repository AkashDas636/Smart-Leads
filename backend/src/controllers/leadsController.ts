import type { Response } from 'express';
import mongoose from 'mongoose';
import { Lead } from '../models/Lead.js';
import { sendSuccess, sendError, sendCreated } from '../utils/response.js';
import type { AuthRequest, CreateLeadBody, UpdateLeadBody, LeadQuery } from '../types/index.js';

const DEFAULT_LIMIT = 10;

// ─── GET /api/leads ───────────────────────────────────────────────────────────

export async function getLeads(req: AuthRequest, res: Response): Promise<void> {
  try {
    const {
      status,
      source,
      search,
      sort = 'latest',
      page = '1',
      limit = String(DEFAULT_LIMIT),
    } = req.query as LeadQuery;

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    // Build filter
    const filter: Record<string, unknown> = {};

    // Role-based: Sales users only see their own leads
    if (req.user?.role === 'Sales') {
      filter.createdBy = new mongoose.Types.ObjectId(req.user.userId);
    }

    if (status && status !== 'All') filter.status = status;
    if (source && source !== 'All') filter.source = source;

    if (search?.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      filter.$or = [{ name: regex }, { email: regex }];
    }

    const sortOrder = sort === 'oldest' ? 1 : -1;

    const [leads, total] = await Promise.all([
      Lead.find(filter)
        .sort({ createdAt: sortOrder })
        .skip(skip)
        .limit(limitNum)
        .populate('createdBy', 'name email')
        .populate('assignedTo', 'name email')
        .lean(),
      Lead.countDocuments(filter),
    ]);

    const totalPages = Math.max(1, Math.ceil(total / limitNum));

    sendSuccess(res, leads, 'Leads fetched', 200, {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch leads';
    sendError(res, message, 500);
  }
}

// ─── GET /api/leads/:id ───────────────────────────────────────────────────────

export async function getLeadById(req: AuthRequest, res: Response): Promise<void> {
  try {
    const lead = await Lead.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email');

    if (!lead) {
      sendError(res, 'Lead not found', 404);
      return;
    }

    // Sales users can only view their own leads
    if (req.user?.role === 'Sales' && lead.createdBy.toString() !== req.user.userId) {
      sendError(res, 'Access denied', 403);
      return;
    }

    sendSuccess(res, lead);
  } catch (error) {
    sendError(res, 'Failed to fetch lead', 500);
  }
}

// ─── POST /api/leads ──────────────────────────────────────────────────────────

export async function createLead(req: AuthRequest, res: Response): Promise<void> {
  try {
    const body: CreateLeadBody = req.body;

    const lead = await Lead.create({
      ...body,
      createdBy: req.user?.userId,
    });

    await lead.populate('createdBy', 'name email');
    sendCreated(res, lead, 'Lead created successfully');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create lead';
    sendError(res, message, 500);
  }
}

// ─── PUT /api/leads/:id ───────────────────────────────────────────────────────

export async function updateLead(req: AuthRequest, res: Response): Promise<void> {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      sendError(res, 'Lead not found', 404);
      return;
    }

    // Sales users can only update their own leads
    if (req.user?.role === 'Sales' && lead.createdBy.toString() !== req.user.userId) {
      sendError(res, 'Access denied', 403);
      return;
    }

    const updates: UpdateLeadBody = req.body;
    const updated = await Lead.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');

    sendSuccess(res, updated, 'Lead updated successfully');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update lead';
    sendError(res, message, 500);
  }
}

// ─── DELETE /api/leads/:id ────────────────────────────────────────────────────

export async function deleteLead(req: AuthRequest, res: Response): Promise<void> {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      sendError(res, 'Lead not found', 404);
      return;
    }

    // Only Admins can delete any lead; Sales can delete their own
    if (req.user?.role === 'Sales' && lead.createdBy.toString() !== req.user.userId) {
      sendError(res, 'Only admins can delete other users\' leads', 403);
      return;
    }

    await Lead.findByIdAndDelete(req.params.id);
    sendSuccess(res, { id: req.params.id }, 'Lead deleted successfully');
  } catch (error) {
    sendError(res, 'Failed to delete lead', 500);
  }
}

// ─── GET /api/leads/stats ─────────────────────────────────────────────────────

export async function getStats(req: AuthRequest, res: Response): Promise<void> {
  try {
    const filter: Record<string, unknown> = {};
    if (req.user?.role === 'Sales') {
      filter.createdBy = new mongoose.Types.ObjectId(req.user.userId);
    }

    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const [statusCounts, total, thisWeek] = await Promise.all([
      Lead.aggregate([
        { $match: filter },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      Lead.countDocuments(filter),
      Lead.countDocuments({ ...filter, createdAt: { $gte: oneWeekAgo } }),
    ]);

    const statusMap: Record<string, number> = { New: 0, Contacted: 0, Qualified: 0, Lost: 0 };
    statusCounts.forEach((s: { _id: string; count: number }) => {
      statusMap[s._id] = s.count;
    });

    const qualified = statusMap.Qualified ?? 0;
    const conversionRate = total > 0 ? Math.round((qualified / total) * 100) : 0;

    sendSuccess(res, {
      total,
      new: statusMap.New,
      contacted: statusMap.Contacted,
      qualified,
      lost: statusMap.Lost,
      thisWeek,
      conversionRate,
    });
  } catch (error) {
    sendError(res, 'Failed to fetch stats', 500);
  }
}

// ─── GET /api/leads/export (CSV) ──────────────────────────────────────────────

export async function exportLeads(req: AuthRequest, res: Response): Promise<void> {
  try {
    const filter: Record<string, unknown> = {};
    if (req.user?.role === 'Sales') {
      filter.createdBy = new mongoose.Types.ObjectId(req.user.userId);
    }

    const leads = await Lead.find(filter).sort({ createdAt: -1 }).lean();

    const headers = ['ID', 'Name', 'Email', 'Status', 'Source', 'Phone', 'Notes', 'Created At'];
    const rows = leads.map((l) => [
      l._id,
      l.name,
      l.email,
      l.status,
      l.source,
      l.phone ?? '',
      (l.notes ?? '').replace(/,/g, ';'),
      new Date(l.createdAt).toISOString().split('T')[0],
    ]);

    const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(',')).join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=leads-export.csv');
    res.send(csv);
  } catch (error) {
    sendError(res, 'Failed to export leads', 500);
  }
}
