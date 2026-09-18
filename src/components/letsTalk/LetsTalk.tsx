'use client';

import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { CONTACT_EMAIL } from '@/utils/site';
import Link from 'next/link';
import { useId, useState } from 'react';

const inputClass =
  'w-full h-16 px-6 py-[18px] rounded bg-white text-lg text-black placeholder:text-[#6b6b6b] outline-none focus-visible:ring-2 focus-visible:ring-black';

const labelClass = 'text-base font-medium text-black';

const fieldClass = 'flex flex-col w-full gap-2';

const RequiredMark = () => (
  <span aria-hidden="true" className="ml-0.5">
    *
  </span>
);

export const LetsTalk = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const fieldId = useId();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // TODO: connect to the contact endpoint once the back end is ready.
    console.log(form);
  };

  return (
    <section id="lets-talk" className="scroll-mt-24 w-full max-w-[1440px] mx-auto px-4 lg:px-20 pb-20">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10 overflow-hidden p-6 lg:p-12 rounded-lg bg-bg_item">
        <div className="flex flex-col items-start w-full lg:w-[369px] gap-6">
          <h2 className="text-4xl lg:text-6xl font-semibold text-left text-black">
            Let&rsquo;s Talk
          </h2>
          <p className="text-lg text-left text-black">
            Ready to bring your vision to life? Get in touch, and let&rsquo;s build something great
            together.
          </p>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-[26px] font-bold text-left text-black hover:underline"
          >
            {CONTACT_EMAIL}
          </a>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            aria-label="Send us an email"
            className="flex justify-center items-center w-20 h-20 rounded-full bg-accent border-4 border-bg_item transition-transform hover:scale-105"
          >
            <Icon id="icon-send" width={32} height={32} />
          </a>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-start w-full lg:w-[584px] gap-4"
        >
          <div className={fieldClass}>
            <label htmlFor={`${fieldId}-name`} className={labelClass}>
              Name
              <RequiredMark />
            </label>
            <input
              id={`${fieldId}-name`}
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Jane Smith"
              autoComplete="name"
              required
              className={inputClass}
            />
          </div>
          <div className={fieldClass}>
            <label htmlFor={`${fieldId}-email`} className={labelClass}>
              Email
              <RequiredMark />
            </label>
            <input
              id={`${fieldId}-email`}
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="jane@company.com"
              autoComplete="email"
              required
              className={inputClass}
            />
          </div>
          <div className={fieldClass}>
            <label htmlFor={`${fieldId}-message`} className={labelClass}>
              Message
            </label>
            <textarea
              id={`${fieldId}-message`}
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Tell us about your project"
              rows={5}
              className={`${inputClass} h-[147px] resize-none`}
            />
          </div>
          <p className="text-sm text-left text-black/80">
            <span aria-hidden="true">*</span> Required field
          </p>
          <p className="text-sm text-left text-black/80">
            By filling out the form I agree to the{' '}
            <Link href="/privacy-policy" className="text-black underline underline-offset-2">
              Privacy Policy
            </Link>{' '}
            and{' '}
            <Link href="/terms-of-use" className="text-black underline underline-offset-2">
              Terms of Use
            </Link>
            .
          </p>
          <Button text="Send Message" type="submit" className="w-full" />
        </form>
      </div>
    </section>
  );
};
