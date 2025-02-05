"use client";

import { SectionTitle } from "./SectionTitle";
import { useState } from "react";

export function ContactSection() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Form submitted:", formData);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <section id="contact">
      <SectionTitle>Contact</SectionTitle>
      
      {/* Map Section */}
      <div className="mb-12 w-full h-[400px] rounded-lg overflow-hidden">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15349.387950054843!2d23.837399584287164!3d61.450409040860716!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x468edfb1098a7c41%3A0x5bc20ec2638a0d0!2sHervanta%2C%20Tampere%2C%20Finland!5e0!3m2!1sen!2sfi!4v1710271923154!5m2!1sen!2sfi"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Location Map"
          className="grayscale"
        ></iframe>
      </div>

      {/* Contact Form */}
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Full name"
              className="w-full px-4 py-3 bg-zinc-800/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all"
              required
              aria-label="Full name"
            />
          </div>
          <div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email address"
              className="w-full px-4 py-3 bg-zinc-800/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all"
              required
              aria-label="Email address"
            />
          </div>
          <div>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Your Message"
              rows={6}
              className="w-full px-4 py-3 bg-zinc-800/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all resize-none"
              required
              aria-label="Your message"
            ></textarea>
          </div>
          <div className="text-right">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-500 text-black font-medium rounded-lg hover:bg-yellow-400 transition-colors"
              aria-label="Send message"
            >
              <span>Send Message</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>
        </div>
      </form>
    </section>
  );
} 