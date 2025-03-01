"use client";

import { SectionTitle } from "@/components/ui/SectionTitle";
import { useState } from "react";
import { ContactFormData, SubmitStatus } from "./types";
import { 
  MailIcon,
  UserIcon, 
  MessageSquareIcon, 
  SendIcon, 
  MapPinIcon 
} from "lucide-react";

export function ContactSection() {
  const [formData, setFormData] = useState<ContactFormData>({
    fullName: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({});
    
    try {
      const response = await fetch('https://formspree.io/f/mgvojjnk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        // Form submitted successfully
        setSubmitStatus({
          success: true,
          message: "Thank you! Your message has been sent successfully."
        });
        // Reset form
        setFormData({
          fullName: "",
          email: "",
          message: "",
        });
      } else {
        // Handle error
        const data = await response.json();
        throw new Error(data.error || "Something went wrong. Please try again.");
      }
    } catch (error) {
      setSubmitStatus({
        success: false,
        message: error instanceof Error ? error.message : "Failed to send message. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
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
      <div className="mb-12 w-full h-[400px] rounded-lg overflow-hidden relative">
        <div className="absolute top-4 left-4 z-10 bg-zinc-900/80 p-2 rounded-lg flex items-center gap-2">
          <MapPinIcon size={16} className="text-yellow-500" />
          <span className="text-sm text-white">Hervanta, Tampere, Finland</span>
        </div>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15349.387950054843!2d23.837399584287164!3d61.450409040860716!2m3!1f0!2f0!3f0!3m2!1i1024!1i768!4f13.1!3m3!1m2!1s0x468edfb1098a7c41%3A0x5bc20ec2638a0d0!2sHervanta%2C%20Tampere%2C%20Finland!5e0!3m2!1sen!2sfi!4v1710271923154!5m2!1sen!2sfi"
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
      <form onSubmit={handleSubmit} className="w-full">
        {submitStatus.message && (
          <div className={`mb-6 p-4 rounded-lg ${submitStatus.success ? 'bg-green-500/20 text-green-200' : 'bg-red-500/20 text-red-200'}`}>
            {submitStatus.message}
          </div>
        )}
        
        <div className="grid grid-cols-1 gap-6">
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
              <UserIcon size={18} />
            </div>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Full name"
              className="w-full pl-10 pr-4 py-3 bg-zinc-800/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all"
              required
              aria-label="Full name"
              disabled={isSubmitting}
            />
          </div>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
              <MailIcon size={18} />
            </div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email address"
              className="w-full pl-10 pr-4 py-3 bg-zinc-800/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all"
              required
              aria-label="Email address"
              disabled={isSubmitting}
            />
          </div>
          <div className="relative">
            <div className="absolute left-3 top-3 text-zinc-400">
              <MessageSquareIcon size={18} />
            </div>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Your Message"
              rows={6}
              className="w-full pl-10 pr-4 py-3 bg-zinc-800/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all resize-none"
              required
              aria-label="Your message"
              disabled={isSubmitting}
            ></textarea>
          </div>
          <div className="text-right">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-500 text-black font-medium rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              aria-label="Send message"
              disabled={isSubmitting}
            >
              <span>{isSubmitting ? "Sending..." : "Send Message"}</span>
              {!isSubmitting && <SendIcon size={18} />}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
} 