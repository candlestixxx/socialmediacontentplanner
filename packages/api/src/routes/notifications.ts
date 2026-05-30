import { Router } from 'express';

const router = Router();

// Mock store for notifications
let mockNotifications = [
  { id: 'notif_1', message: 'Your campaign "Summer Sale" ends in 2 days.', read: false, createdAt: new Date(Date.now() - 3600000).toISOString() },
  { id: 'notif_2', message: 'Best posting time recommendation: Try posting at 6 PM on Thursdays.', read: false, createdAt: new Date(Date.now() - 7200000).toISOString() },
  { id: 'notif_3', message: 'Post successfully published to Facebook.', read: true, createdAt: new Date(Date.now() - 86400000).toISOString() },
];

// GET /notifications
router.get('/', (req, res) => {
  res.json(mockNotifications);
});

// POST /notifications (Internal / Webhook use)
router.post('/', (req, res) => {
  const { message } = req.body;
  const newNotif = {
    id: `notif_${Date.now()}`,
    message,
    read: false,
    createdAt: new Date().toISOString()
  };
  mockNotifications.unshift(newNotif);
  res.status(201).json(newNotif);
});

// PATCH /notifications/:id/read
router.patch('/:id/read', (req, res) => {
  const notif = mockNotifications.find(n => n.id === req.params.id);
  if (!notif) return res.status(404).json({ error: 'Notification not found' });
  notif.read = true;
  res.json(notif);
});

// PATCH /notifications/read-all
router.patch('/read-all', (req, res) => {
  mockNotifications.forEach(n => n.read = true);
  res.json({ success: true });
});

export const notificationsRouter = router;
