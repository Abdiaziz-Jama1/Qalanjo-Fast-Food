import { useState } from 'react';
import { FiMapPin, FiPhone, FiMail, FiSend } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = (e) => { e.preventDefault(); toast.success('Message sent! We will get back to you soon.'); setForm({ name: '', email: '', subject: '', message: '' }); };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-32">
      <h1 className="text-3xl font-bold text-center mb-12">Contact <span className="text-primary">Us</span></h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6">
          <div className="bg-white border rounded-xl p-6 text-center">
            <FiMapPin className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold mb-1">Address</h3>
            <p className="text-gray-500 text-sm">123 Main Street, Kampala, Uganda</p>
          </div>
          <div className="bg-white border rounded-xl p-6 text-center">
            <FiPhone className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold mb-1">Phone</h3>
            <p className="text-gray-500 text-sm">+256 700 123 456</p>
          </div>
          <div className="bg-white border rounded-xl p-6 text-center">
            <FiMail className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold mb-1">Email</h3>
            <p className="text-gray-500 text-sm">info@qalanjo.com</p>
          </div>
        </div>
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white border rounded-xl p-6 space-y-4">
            <h3 className="font-semibold text-gray-900 text-lg">Send us a Message</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input name="name" value={form.name} onChange={handleChange} placeholder="Your Name" required className="border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary outline-none" />
              <input name="email" value={form.email} onChange={handleChange} type="email" placeholder="Your Email" required className="border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary outline-none" />
            </div>
            <input name="subject" value={form.subject} onChange={handleChange} placeholder="Subject" required className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary outline-none" />
            <textarea name="message" value={form.message} onChange={handleChange} placeholder="Your Message" rows={5} required className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary outline-none" />
            <button type="submit" className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors"><FiSend /> Send Message</button>
          </form>
        </div>
      </div>
    </div>
  );
}
