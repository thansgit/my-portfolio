'use client'

import { NeuSection, NeuInput, NeuTextarea, NeuButton, NeuContainer, NeuIconButton } from '@/components/ui'
import { useState } from 'react'
import { ContactFormData, SubmitStatus } from './types'
import { MailIcon, UserIcon, MessageSquareIcon, SendIcon, MapPinIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

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
    <NeuSection title='Contact Me'>
      <div className='flex flex-col gap-8'>
        {/* Contact Info */}
        <NeuContainer withPadding>
          <h3 className='text-neu-accent mb-4 text-lg font-semibold'>Contact Information</h3>

          {/* Contact details and map */}
          <div className='grid gap-6 md:grid-cols-2'>
            {/* Contact details */}
            <div className='flex flex-col space-y-4'>
              {/* Email Contact Info */}
              <div className='flex items-center gap-3'>
                <div className='neu-icon'>
                  <MailIcon size={18} />
                </div>
                <div>
                  <p className='text-neu-textSecondary text-sm'>Email</p>
                  <a href='mailto:timo.hanski@gmail.com' className='neu-link'>
                    timo.hanski@gmail.com
                  </a>
                </div>
              </div>

              {/* Location Contact Info */}
              <div className='flex items-center gap-3'>
                <div className='neu-icon'>
                  <MapPinIcon size={18} />
                </div>
                <div>
                  <p className='text-neu-textSecondary text-sm'>Location</p>
                  <p className='text-neu-text'>Tampere, Finland</p>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className='rounded-neu-md border-neu-bgLight h-40 overflow-hidden border md:h-auto'>
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
        </NeuContainer>

        {/* Contact Form */}
        <NeuContainer withPadding>
          <h3 className='text-neu-accent mb-4 text-lg font-semibold'>Send Me a Message</h3>

          <form onSubmit={handleSubmit}>
            <NeuInput
              name='fullName'
              label='Full Name'
              value={formData.fullName}
              onChange={handleInputChange}
              required
              icon={<UserIcon size={16} />}
              placeholder='Your name'
            />

            <NeuInput
              name='email'
              label='Email'
              type='email'
              value={formData.email}
              onChange={handleInputChange}
              required
              icon={<MailIcon size={16} />}
              placeholder='your.email@example.com'
            />

            <NeuTextarea
              name='message'
              label='Message'
              value={formData.message}
              onChange={handleInputChange}
              required
              icon={<MessageSquareIcon size={16} />}
              placeholder='Your message here...'
            />

            <div className='mt-6'>
              <NeuButton
                variant='accent'
                type='submit'
                disabled={isSubmitting}
                pressed={isSubmitting}
                className='flex items-center gap-2'
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
                <SendIcon size={16} />
              </NeuButton>

              {submitStatus.message && (
                <div
                  className={cn(
                    'mt-4 rounded-md p-3',
                    submitStatus.success
                      ? 'border border-green-800/30 bg-green-900/20 text-green-300'
                      : 'border border-red-800/30 bg-red-900/20 text-red-300',
                  )}
                >
                  {submitStatus.message}
                </div>
              )}
            </div>
          </form>
        </NeuContainer>
      </div>
    </NeuSection>
  )
}
