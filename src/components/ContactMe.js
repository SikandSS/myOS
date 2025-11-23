import React, { useState } from 'react';
import './ContactMe.css';

// EmailJS - install with: npm install @emailjs/browser
// Then uncomment the line below:
// import emailjs from '@emailjs/browser';

const ContactMe = ({ onClose, onMinimize, onMaximize }) => {
  // EmailJS Configuration
  // Get these from https://www.emailjs.com/
  // 1. Sign up at https://www.emailjs.com/
  // 2. Create an email service (Gmail, Outlook, etc.)
  // 3. Create an email template
  // 4. Get your Public Key from Account > API Keys
  const EMAILJS_SERVICE_ID = 'service_4tf7xof'; // Replace with your EmailJS service ID
  const EMAILJS_TEMPLATE_ID = 'template_k7exoo4'; // Replace with your EmailJS template ID
  const EMAILJS_PUBLIC_KEY = '5TJ82uOU00tySooUt'; // Replace with your EmailJS public key
  const YOUR_EMAIL = 'sikandsandhu@gmail.com'; // Your email address

  const [formData, setFormData] = useState({
    to: YOUR_EMAIL,
    subject: '',
    message: '',
    from_name: '', // Sender's name (optional)
    from_email: '' // Sender's email (optional)
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Check if EmailJS is configured
      if (EMAILJS_SERVICE_ID === 'YOUR_SERVICE_ID' || 
          EMAILJS_TEMPLATE_ID === 'YOUR_TEMPLATE_ID' || 
          EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY') {
        throw new Error('EmailJS not configured. Please set up your EmailJS credentials in ContactMe.js');
      }

      // For now, simulate email sending
      // Uncomment the code below after installing EmailJS: npm install @emailjs/browser
      // and uncomment the import at the top of the file
      
      // Prepare template parameters for EmailJS
      const templateParams = {
        to_email: formData.to,
        subject: formData.subject,
        message: formData.message,
        from_name: formData.from_name || 'Anonymous',
        from_email: formData.from_email || 'noreply@example.com',
        reply_to: formData.from_email || formData.to
      };

      // TODO: Uncomment after installing EmailJS
      // const emailjs = await import('@emailjs/browser');
      // await emailjs.default.send(
      //   EMAILJS_SERVICE_ID,
      //   EMAILJS_TEMPLATE_ID,
      //   templateParams,
      //   EMAILJS_PUBLIC_KEY
      // );

      // Temporary: Simulate sending for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Email would be sent with:', templateParams);
      
      setSubmitStatus({ type: 'success', message: 'Message sent successfully!' });
      setFormData({
        to: YOUR_EMAIL,
        subject: '',
        message: '',
        from_name: '',
        from_email: ''
      });
    } catch (error) {
      console.error('EmailJS Error:', error);
      setSubmitStatus({ 
        type: 'error', 
        message: error.message || 'Failed to send message. Please check your EmailJS configuration and try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-me-window">
      <div className="contact-me-titlebar">
        <div className="contact-me-title">
          <span className="contact-me-icon">✉</span>
          Contact Me - Outlook
        </div>
        <div className="contact-me-controls">
          <button className="contact-me-minimize" onClick={onMinimize}>_</button>
          <button className="contact-me-maximize" onClick={onMaximize}>□</button>
          <button className="contact-me-close" onClick={onClose}>×</button>
        </div>
      </div>

      <div className="contact-me-menu">
        <div className="contact-me-menu-item">File</div>
        <div className="contact-me-menu-item">Edit</div>
        <div className="contact-me-menu-item">View</div>
        <div className="contact-me-menu-item">Insert</div>
        <div className="contact-me-menu-item">Format</div>
        <div className="contact-me-menu-item">Tools</div>
        <div className="contact-me-menu-item">Table</div>
        <div className="contact-me-menu-item">Help</div>
      </div>

      <div className="contact-me-toolbar">
        <button className="contact-me-toolbar-btn">Send</button>
        <button className="contact-me-toolbar-btn">Save</button>
        <div className="contact-me-toolbar-separator"></div>
        <button className="contact-me-toolbar-btn">Cut</button>
        <button className="contact-me-toolbar-btn">Copy</button>
        <button className="contact-me-toolbar-btn">Paste</button>
      </div>

      <div className="contact-me-content">
        <form onSubmit={handleSubmit} className="contact-me-form">
          <div className="contact-me-field">
            <label className="contact-me-label">To:</label>
            <input
              type="email"
              name="to"
              value={formData.to}
              onChange={handleChange}
              className="contact-me-input"
              required
              readOnly
            />
          </div>

          <div className="contact-me-field">
            <label className="contact-me-label">From Name:</label>
            <input
              type="text"
              name="from_name"
              value={formData.from_name}
              onChange={handleChange}
              className="contact-me-input"
              placeholder="Your name (optional)"
            />
          </div>

          <div className="contact-me-field">
            <label className="contact-me-label">From Email:</label>
            <input
              type="email"
              name="from_email"
              value={formData.from_email}
              onChange={handleChange}
              className="contact-me-input"
              placeholder="your.email@example.com (optional)"
            />
          </div>

          <div className="contact-me-field">
            <label className="contact-me-label">Subject:</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="contact-me-input"
              placeholder="Enter subject..."
              required
            />
          </div>

          <div className="contact-me-field contact-me-message-field">
            <label className="contact-me-label">Message:</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="contact-me-textarea"
              placeholder="Type your message here..."
              rows="12"
              required
            />
          </div>

          {submitStatus && (
            <div className={`contact-me-status ${submitStatus.type}`}>
              {submitStatus.message}
            </div>
          )}

          <div className="contact-me-actions">
            <button
              type="submit"
              className="contact-me-submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send'}
            </button>
            <button
              type="button"
              className="contact-me-cancel-btn"
              onClick={() => {
                setFormData({
                  to: YOUR_EMAIL,
                  subject: '',
                  message: '',
                  from_name: '',
                  from_email: ''
                });
                setSubmitStatus(null);
              }}
            >
              Clear
            </button>
          </div>
        </form>
      </div>

      <div className="resize-handle"></div>
    </div>
  );
};

export default ContactMe;

