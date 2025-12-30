const Notification = require('../../models/Notification');
const { logAdminAction } = require('../../services/admin/auditService');

exports.getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find()
            .populate('sentBy', 'name email')
            .sort({ createdAt: -1 });
        res.json({ notifications });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.sendBroadcast = async (req, res) => {
    try {
        const { title, message, type, target } = req.body;
        const notification = new Notification({
            title,
            message,
            type,
            target,
            sentBy: req.user.id
        });

        await notification.save();

        // In a real app, you would trigger push notifications or socket events here
        // For now, we just save it to the database

        await logAdminAction(req.user.id, 'BROADCAST', 'Notification', notification._id, { title, target });

        res.status(201).json(notification);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteNotification = async (req, res) => {
    try {
        const notification = await Notification.findByIdAndDelete(req.params.id);
        if (!notification) return res.status(404).json({ message: 'Notification not found' });
        res.json({ message: 'Notification deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
