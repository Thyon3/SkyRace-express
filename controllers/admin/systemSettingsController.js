const SystemSetting = require('../../models/SystemSetting');
const { logAdminAction } = require('../../services/admin/auditService');

exports.getAllSettings = async (req, res) => {
    try {
        const settings = await SystemSetting.find();
        res.json({ settings });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateSetting = async (req, res) => {
    try {
        const { key, value } = req.body;
        const setting = await SystemSetting.findOneAndUpdate({ key }, { value }, { new: true, upsert: true });
        await logAdminAction(req.user.id, 'UPDATE_SETTING', 'SystemSetting', setting._id, { key, value });
        res.json(setting);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
