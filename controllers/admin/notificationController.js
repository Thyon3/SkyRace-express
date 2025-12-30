const Notification = require('../../models/Notification');
const { logAdminAction } = require('../../services/admin/auditService');
const { notificationSchema } = require('../../middleware/validation');

exports.getNotifications = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const notifications = await Notification.find()
            .populate('sentBy', 'name email')
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });

        const total = await Notification.countDocuments();

        res.json({
            notifications,
            pagination: {
                total,
                page: parseInt(page),
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.sendBroadcast = async (req, res) => {
    try {
        const { error, value } = notificationSchema.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const notification = new Notification({
            ...value,
            sentBy: req.user.id
        });

        await notification.save();

        await logAdminAction(req.user.id, 'BROADCAST', 'Notification', notification._id, value);

        res.status(201).json(notification);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteNotification = async (req, res) => {
    try {
        const notification = await Notification.findByIdAndDelete(req.params.id);
        if (!notification) return res.status(404).json({ message: 'Notification not found' });

        await logAdminAction(req.user.id, 'DELETE', 'Notification', req.params.id, { title: notification.title });

        res.json({ message: 'Notification deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
