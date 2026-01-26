import React from "react";
import ChatBot from "react-chatbotify";

const DentistryChatbot = ({ isOpen, setIsOpen }) => {
    const flow = {
        start: {
            message: "Hello! Welcome to Quantum Digital Dentistry. How can I assist you today?",
            options: ["Book Appointment", "Services", "Pricing", "Location"],
            path: "process_option"
        },
        process_option: {
            transition: {
                duration: 0
            },
            path: (params) => {
                switch (params.userInput) {
                    case "Book Appointment":
                        return "book_appointment";
                    case "Services":
                        return "services";
                    case "Pricing":
                        return "pricing";
                    case "Location":
                        return "location";
                    default:
                        return "unknown_input";
                }
            }
        },
        book_appointment: {
            message: "I can help you with that! Please provide your full name.",
            function: (params) => {
                // In a real app, you'd save this to state/context
                console.log("Name captured:", params.userInput);
            },
            path: "ask_phone"
        },
        ask_phone: {
            message: "Great! Now, please provide your phone number so our team can reach you.",
            path: "confirm_booking"
        },
        confirm_booking: {
            message: "Thank you! We have received your request. Our receptionist will call you shortly to confirm your slot.",
            options: ["Back to Menu"],
            path: "process_option"
        },
        services: {
            message: "We offer futuristic dental treatments including:\n- Robotic Surgery\n- Laser Whitening\n- Preventive Gene Therapy\n- AI Smile Design",
            options: ["Back to Menu"],
            path: "process_option"
        },
        pricing: {
            message: "Our consultation starts at Rs.250. Detailed treatment plans are customized.",
            options: ["Back to Menu"],
            path: "process_option"
        },
        location: {
            message: "We are located at:3rd floor, Flat No: 33/A, Sri sai Govardhan Kunj, 7-1-397/101, 301/A, opposite Domino's Pizza, near Community hall, Hyderabad, Telangana 500038",
            options: ["Back to Menu"],
            path: "process_option"
        },
        unknown_input: {
            message: "I'm sorry, I didn't understand that. Please select an option from the menu.",
            options: ["Book Appointment", "Services", "Pricing", "Location"],
            path: "process_option"
        }
    };

    const settings = {
        general: {
            embedded: false,
            primaryColor: "#0ea5e9", // Tailwind cyan-500
            secondaryColor: "#000000",
            fontFamily: "Inter, sans-serif",
            showFooter: false
        },
        header: {
            title: "Quantum Assistant",
            avatar: "https://cdn-icons-png.flaticon.com/512/4712/4712035.png", // AI bot icon
        },
        chatButton: {
            icon: "https://cdn-icons-png.flaticon.com/512/4712/4712035.png",
        },
        tooltip: {
            mode: "hidden"
        }
    };

    // We only want to control the open state if passed
    // If not passed, we let the chatbot manage itself (but we want to use our button)

    return (
        <ChatBot
            flow={flow}
            settings={{
                ...settings,
                isOpen: isOpen,
            }}
            styles={{
                chatWindowStyle: {
                    zIndex: 9999
                }
            }}
        />
    );
};

export default DentistryChatbot;
