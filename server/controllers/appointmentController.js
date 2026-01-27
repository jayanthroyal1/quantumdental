import Appointment from '../models/Appointment.js';

export const createAppointment = async (req, res) => {
    const { name, email, phone, message } = req.body;

    try {
        const newAppointment = new Appointment({
            name,
            email,
            phone,
            message,
        });

        await newAppointment.save();

        res.status(201).json({
            message: 'Appointment request submitted successfully',
            appointment: newAppointment,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const getAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find().sort({ createdAt: -1 });
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const updateAppointmentStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const appointment = await Appointment.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        res.json(appointment);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
