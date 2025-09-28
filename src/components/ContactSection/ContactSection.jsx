import { useState } from "react";
import SectionHeader from "../ui/SectionHeader";
import "./ContactSection.css";
import emailjs from "@emailjs/browser";
import { IoIosSend } from "react-icons/io";

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.message.trim()) newErrors.message = "Message is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus(null);

    if (!validateForm()) return;

    setIsSubmitting(true);

    emailjs
      .send(
        import.meta.env.VITE_SERVICE_ID,
        import.meta.env.VITE_TEMPLATE_ID,
        {
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message,
          to_email: import.meta.env.VITE_EMAIL,
        },
        import.meta.env.VITE_PUBLIC_KEY
      )
      .then(
        () => {
          setStatus("Message sent successfully!");
          setFormData({ name: "", email: "", message: "" });
        },
        (error) => {
          setStatus("Failed to send message. Please try again.");
          console.error("EmailJS error:", error);
        }
      )
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <>
      <div className="contact-bg"></div>
      <div id="contact" className="">
        <SectionHeader
          heading="Contact Me"
          description="Ready to bring your video vision to life? Fill out the form below to discuss your project needs, whether it's a dynamic montage, a sleek promotional video, or a compelling story. I'm excited to collaborate and create something extraordinary together!"
        />

        <div className="form w-full sm:w-fit p-5 mx-auto flex flex-col gap-5 mt-10 sm:mt-15">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="contact-details flex flex-col sm:flex-row gap-7">
              <div className="flex flex-col gap-3">
                <label htmlFor="name" className="text-sm font-medium">
                  Name <span className="text-red-500 text-sm">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input-field border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your name..."
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name}</p>
                )}
              </div>

              <div className="flex flex-col gap-3">
                <label htmlFor="email" className="text-sm font-medium">
                  Email <span className="text-red-500 text-sm">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your email..."
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email}</p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <label htmlFor="message" className="text-sm font-medium">
                Message <span className="text-red-500 text-sm">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="input-field border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your message..."
                rows={5}
              />
              {errors.message && (
                <p className="text-red-500 text-sm">{errors.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`btn font-medium sendMessage w-fit flex items-center gap-2 px-4 py-2 rounded-md transition ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <IoIosSend fill="#ffffff" />
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>

            {status && (
              <p
                className={`text-sm ${
                  status.includes("success") ? "text-green-500" : "text-red-500"
                }`}
              >
                {status}
              </p>
            )}
          </form>
        </div>
      </div>
    </>
  );
};

export default ContactSection;
