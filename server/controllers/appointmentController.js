import Appointment from '../models/Appointment.js';

export const createAppointment = async (req, res) => {
    const { name, email, phone, message } = req.body;

    try {
        console.log(`[Appointment Create] Request from ${email}`);

        if (!name || !email || !phone) {
            return res.status(400).json({ message: 'Name, email, and phone are required' });
        }

        const newAppointment = new Appointment({
            name,
            email,
            phone,
            message,
        });

        await newAppointment.save();
        console.log(`[Appointment Create] Success: ${newAppointment._id}`);

        res.status(201).json({
            message: 'Appointment request submitted successfully',
            appointment: newAppointment,
        });
    } catch (error) {
        console.error('[Appointment Create Error]:', error);
        res.status(500).json({ message: 'Server error creating appointment', error: error.message });
    }
};

export const getAppointments = async (req, res) => {
    try {
        console.log('[Appointment List] Fetching appointments');
        // Performance: Limit to 50 most recent to prevent payload bloat
        const appointments = await Appointment.find()
            .sort({ createdAt: -1 })
            .limit(50);

        res.json(appointments);
    } catch (error) {
        console.error('[Appointment List Error]:', error);
        res.status(500).json({ message: 'Server error fetching appointments', error: error.message });
    }
};

export const updateAppointmentStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        console.log(`[Appointment Update] ID: ${id}, Status: ${status}`);
        const appointment = await Appointment.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!appointment) {
            console.log(`[Appointment Update] Not Found: ${id}`);
            return res.status(404).json({ message: 'Appointment not found' });
        }

        res.json(appointment);
    } catch (error) {
        console.error('[Appointment Update Error]:', error);
        res.status(500).json({ message: 'Server error updating appointment', error: error.message });
    }
};
