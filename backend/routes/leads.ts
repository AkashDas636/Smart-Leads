import { Router } from 'express';
import {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  getStats,
  exportLeads,
} from '../controllers/leadsController.js';
import { authenticate, adminOnly } from '../middleware/auth.js';
import {
  createLeadValidator,
  updateLeadValidator,
  leadsQueryValidator,
} from '../middleware/validators.js';

const router = Router();

// All lead routes require authentication
router.use(authenticate);

// GET /api/leads/stats
router.get('/stats', getStats);

// GET /api/leads/export  (Admin only)
router.get('/export', adminOnly, exportLeads);

// GET /api/leads
router.get('/', leadsQueryValidator, getLeads);

// GET /api/leads/:id
router.get('/:id', getLeadById);

// POST /api/leads
router.post('/', createLeadValidator, createLead);

// PUT /api/leads/:id
router.put('/:id', updateLeadValidator, updateLead);

// DELETE /api/leads/:id  (Admin only)
router.delete('/:id', adminOnly, deleteLead);

export default router;
