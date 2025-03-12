'use client'

import { Section, TextField, Button } from '@/components/ui'
import { useState } from 'react'
import { ContactFormData, SubmitStatus } from './types'
import { MailIcon, UserIcon, MessageSquareIcon, SendIcon, MapPinIcon } from 'lucide-react'

export function ContactSection() {
  const [formData, setFormData] = useState<ContactFormData>({
    fullName: '',
    email: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus({})

    try {
      const response = await fetch('https://formspree.io/f/mgvojjnk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSubmitStatus({
          success: true,
          message: 'Thank you! Your message has been sent successfully.',
        })
        // Reset form
        setFormData({
          fullName: '',
          email: '',
          message: '',
        })
      } else {
        setSubmitStatus({
          success: false,
          message: 'There was a problem sending your message. Please try again.',
        })
      }
    } catch (error) {
      setSubmitStatus({
        success: false,
        message: 'There was a problem connecting to the server. Please try again later.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <Section title='Contact Me'>
      <div className='flex flex-col gap-8'>
        {/* Contact Info */}
        <div className='card-base p-6'>
          <h3 className='mb-4 text-lg font-semibold text-yellow-500'>Contact Information</h3>

          {/* Contact details and map in a responsive layout */}
          <div className='grid gap-6 md:grid-cols-2'>
            {/* Contact details */}
            <div className='flex flex-col space-y-4'>
              {/* Email Contact Info */}
              <div className='flex items-center gap-3'>
                {/* [Icon Container] Round background for icon */}
                <div className='rounded-full bg-zinc-700 p-2'>
                  <MailIcon size={18} className='text-yellow-500' />
                </div>
                <div>
                  <p className='text-sm text-zinc-400'>Email</p>
                  <a href='mailto:timo.hanski@gmail.com' className='link-style'>
                    timo.hanski@gmail.com
                  </a>
                </div>
              </div>

              {/* Location Contact Info */}
              <div className='flex items-center gap-3'>
                {/* [Icon Container] Round background for icon */}
                <div className='rounded-full bg-zinc-700 p-2'>
                  <MapPinIcon size={18} className='text-yellow-500' />
                </div>
                <div>
                  <p className='text-sm text-zinc-400'>Location</p>
                  <p className='text-zinc-200'>Tampere, Finland</p>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className='h-40 overflow-hidden rounded-lg border border-zinc-700/50 md:h-auto'>
              <iframe
                src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15349.387950054843!2d23.837399584287164!3d61.450409040860716!2m3!1f0!2f0!3f0!3m2!1i1024!1i768!4f13.1!3m3!1m2!1s0x468edfb1098a7c41%3A0x5bc20ec39365330d!2sTampere%2C%20Finland!5e0!3m2!1sen!2sfi!4v1678179809534!5m2!1sen!2sfi'
                width='100%'
                height='100%'
                style={{ border: 0, minHeight: '200px' }}
                allowFullScreen={false}
                loading='lazy'
                referrerPolicy='no-referrer-when-downgrade'
                title='Map showing Tampere, Finland'
                className='brightness-75 contrast-125 grayscale filter'
              />
            </div>
          </div>
        </div>

        {/* Contact Form - Now below the contact info */}
        <div className='card-base p-6'>
          <h3 className='mb-4 text-lg font-semibold text-yellow-500'>Send Me a Message</h3>

          <form onSubmit={handleSubmit}>
            <TextField
              id='fullName'
              label='Full Name'
              value={formData.fullName}
              onChange={handleInputChange}
              required
              icon={<UserIcon size={16} />}
              placeholder='Your name'
            />

            <TextField
              id='email'
              label='Email'
              type='email'
              value={formData.email}
              onChange={handleInputChange}
              required
              icon={<MailIcon size={16} />}
              placeholder='your.email@example.com'
            />

            <TextField
              id='message'
              label='Message'
              type='textarea'
              value={formData.message}
              onChange={handleInputChange}
              required
              icon={<MessageSquareIcon size={16} />}
              placeholder='Your message here...'
            />

            <div className='mt-6'>
              <Button type='submit' isLoading={isSubmitting} disabled={isSubmitting} icon={<SendIcon size={16} />}>
                Send Message
              </Button>

              {submitStatus.message && (
                <div
                  className={`mt-4 rounded-md p-3 ${
                    /* [Alert styles] Conditional styling based on success/error state */
                    submitStatus.success ? 'bg-green-800/30 text-green-300' : 'bg-red-800/30 text-red-300'
                  }`}
                >
                  {submitStatus.message}
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </Section>
  )
}
