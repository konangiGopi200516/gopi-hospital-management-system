import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const Contact = () => {
  return (
    <div className="py-20 bg-[#0B1120] min-h-screen">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[#F8FAFC]">Contact Us</h1>
          <p className="text-[#94A3B8] max-w-2xl mx-auto text-lg">Get in touch with our support team or visit our main campus.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className="bg-[#141D31] p-8 rounded-2xl border border-white/5 flex gap-6 items-start">
              <div className="w-12 h-12 rounded-xl bg-[#18E0FF]/10 flex items-center justify-center text-[#18E0FF] shrink-0">
                <MapPin size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#F8FAFC] mb-2">Main Campus</h3>
                <p className="text-[#94A3B8] text-sm leading-relaxed">
                  123 Vision Avenue, Health District<br />
                  Metropolis, NY 10001
                </p>
              </div>
            </div>

            <div className="bg-[#141D31] p-8 rounded-2xl border border-white/5 flex gap-6 items-start">
              <div className="w-12 h-12 rounded-xl bg-[#18E0FF]/10 flex items-center justify-center text-[#18E0FF] shrink-0">
                <Clock size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#F8FAFC] mb-2">OPD Timings</h3>
                <p className="text-[#94A3B8] text-sm leading-relaxed">
                  Monday - Saturday: 8:00 AM - 8:00 PM<br />
                  Sunday: Emergency Only
                </p>
              </div>
            </div>

            <div className="bg-[#141D31] p-8 rounded-2xl border border-white/5 flex gap-6 items-start">
              <div className="w-12 h-12 rounded-xl bg-[#18E0FF]/10 flex items-center justify-center text-[#18E0FF] shrink-0">
                <Phone size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#F8FAFC] mb-2">Helpline</h3>
                <p className="text-[#94A3B8] text-sm leading-relaxed mb-1">Emergency: +1 (555) 911-0000</p>
                <p className="text-[#94A3B8] text-sm leading-relaxed">Appointments: +1 (555) 123-4567</p>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-[#141D31] p-8 rounded-2xl border border-white/5 shadow-2xl"
          >
            <h3 className="text-2xl font-bold text-[#F8FAFC] mb-6">Send a Message</h3>
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-sm font-bold text-[#94A3B8] mb-2 uppercase tracking-wider">Full Name</label>
                <input type="text" className="w-full bg-[#0B1120] border border-white/10 rounded-xl px-4 py-3 text-[#F8FAFC] focus:outline-none focus:border-[#18E0FF]/50 transition-colors" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#94A3B8] mb-2 uppercase tracking-wider">Email Address</label>
                <input type="email" className="w-full bg-[#0B1120] border border-white/10 rounded-xl px-4 py-3 text-[#F8FAFC] focus:outline-none focus:border-[#18E0FF]/50 transition-colors" placeholder="john@example.com" />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#94A3B8] mb-2 uppercase tracking-wider">Message</label>
                <textarea rows="4" className="w-full bg-[#0B1120] border border-white/10 rounded-xl px-4 py-3 text-[#F8FAFC] focus:outline-none focus:border-[#18E0FF]/50 transition-colors resize-none" placeholder="How can we help you?"></textarea>
              </div>
              <button className="w-full btn-primary py-4 rounded-xl font-bold tracking-widest uppercase text-sm">
                Send Message
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
