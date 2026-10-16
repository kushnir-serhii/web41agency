'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useId, useState } from 'react';

import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Link, usePathname } from '@/i18n/navigation';
import { trackEvent } from '@/utils/analytics';
import { CONTACT_EMAIL } from '@/utils/site';

import { RequiredMark } from './RequiredMark';

const inputClass =
  'w-full h-16 px-6 py-[18px] rounded bg-white text-lg text-black placeholder:text-[#6b6b6b] outline-none focus-visible:ring-2 focus-visible:ring-black';

const labelClass = 'text-base font-medium text-black';

const fieldClass = 'flex flex-col w-full gap-2';

const errorClass = 'text-sm text-left text-black';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type FieldKey = 'name' | 'email';
type FieldErrors = Partial<Record<FieldKey, 'nameRequired' | 'emailRequired' | 'emailInvalid'>>;
type SubmitError = 'rateLimited' | 'unavailable' | 'generic';
type Status =
  | { state: 'idle' }
  | { state: 'submitting' }
  | { state: 'success' }
  | { state: 'error'; error: SubmitError };

interface ContactErrorBody {
  error?: string;
  fields?: { name?: string; email?: string };
}

const emptyForm = { name: '', email: '', message: '', website: '' };

const validate = (form: { name: string; email: string }): FieldErrors => {
  const errors: FieldErrors = {};
  if (!form.name.trim()) errors.name = 'nameRequired';
  const email = form.email.trim();
  if (!email) errors.email = 'emailRequired';
  else if (!EMAIL_PATTERN.test(email)) errors.email = 'emailInvalid';
  return errors;
};

const fromServerFields = (fields: ContactErrorBody['fields']): FieldErrors => {
  const errors: FieldErrors = {};
  if (fields?.name) errors.name = 'nameRequired';
  if (fields?.email) errors.email = fields.email === 'invalid' ? 'emailInvalid' : 'emailRequired';
  return errors;
};

export const LetsTalk = () => {
  const t = useTranslations('LetsTalk');
  const locale = useLocale();
  const pathname = usePathname();
  const [form, setForm] = useState(emptyForm);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>({ state: 'idle' });
  const fieldId = useId();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status.state === 'submitting') return;

    const errors = validate(form);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      setStatus({ state: 'idle' });
      return;
    }

    trackEvent({ name: 'lead_form_submit', props: { locale } });
    setStatus({ state: 'submitting' });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          message: form.message,
          locale,
          page: pathname,
          website: form.website,
        }),
      });

      if (response.ok) {
        setForm(emptyForm);
        setStatus({ state: 'success' });
        return;
      }

      const body: ContactErrorBody = await response.json().catch(() => ({}));
      if (response.status === 400 && body.error === 'validation') {
        setFieldErrors(fromServerFields(body.fields));
        setStatus({ state: 'idle' });
      } else if (response.status === 429) {
        setStatus({ state: 'error', error: 'rateLimited' });
      } else if (response.status === 502 || response.status === 503) {
        setStatus({ state: 'error', error: 'unavailable' });
      } else {
        setStatus({ state: 'error', error: 'generic' });
      }
    } catch {
      setStatus({ state: 'error', error: 'generic' });
    }
  };

  const isSubmitting = status.state === 'submitting';
  const showMailto =
    status.state === 'error' && (status.error === 'unavailable' || status.error === 'generic');

  const fieldProps = (key: FieldKey) => ({
    'aria-invalid': fieldErrors[key] ? true : undefined,
    'aria-describedby': fieldErrors[key] ? `${fieldId}-${key}-error` : undefined,
  });

  return (
    <section
      id="lets-talk"
      tabIndex={-1}
      className="scroll-mt-24 outline-none w-full max-w-[1440px] mx-auto px-4 lg:px-20 pb-20"
    >
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10 overflow-hidden p-6 lg:p-12 rounded-lg bg-bg_item">
        <div className="flex flex-col items-start w-full lg:w-[369px] gap-6">
          <h2 className="text-4xl lg:text-6xl font-semibold text-left text-black">
            {t('heading')}
          </h2>
          <p className="text-lg text-left text-black">{t('intro')}</p>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            onClick={() =>
              trackEvent({ name: 'email_click', props: { location: 'lets_talk_link', locale } })
            }
            className="text-[26px] font-bold text-left text-black hover:underline"
          >
            {CONTACT_EMAIL}
          </a>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            aria-label={t('emailAriaLabel')}
            onClick={() =>
              trackEvent({ name: 'email_click', props: { location: 'lets_talk_button', locale } })
            }
            className="flex justify-center items-center w-20 h-20 rounded-full bg-accent border-4 border-bg_item transition-transform hover:scale-105"
          >
            <Icon id="icon-send" width={32} height={32} />
          </a>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          aria-busy={isSubmitting}
          className="flex flex-col items-start w-full lg:w-[584px] gap-4"
        >
          <div className={fieldClass}>
            <label htmlFor={`${fieldId}-name`} className={labelClass}>
              {t('nameLabel')}
              <RequiredMark />
            </label>
            <input
              id={`${fieldId}-name`}
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder={t('namePlaceholder')}
              autoComplete="name"
              required
              maxLength={100}
              {...fieldProps('name')}
              className={inputClass}
            />
            {fieldErrors.name && (
              <p id={`${fieldId}-name-error`} className={errorClass}>
                {t(`validation.${fieldErrors.name}`)}
              </p>
            )}
          </div>
          <div className={fieldClass}>
            <label htmlFor={`${fieldId}-email`} className={labelClass}>
              {t('emailLabel')}
              <RequiredMark />
            </label>
            <input
              id={`${fieldId}-email`}
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder={t('emailPlaceholder')}
              autoComplete="email"
              required
              maxLength={200}
              {...fieldProps('email')}
              className={inputClass}
            />
            {fieldErrors.email && (
              <p id={`${fieldId}-email-error`} className={errorClass}>
                {t(`validation.${fieldErrors.email}`)}
              </p>
            )}
          </div>
          <div className={fieldClass}>
            <label htmlFor={`${fieldId}-message`} className={labelClass}>
              {t('messageLabel')}
            </label>
            <textarea
              id={`${fieldId}-message`}
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder={t('messagePlaceholder')}
              rows={5}
              maxLength={2000}
              className={`${inputClass} h-[147px] resize-none`}
            />
          </div>
          <div aria-hidden="true" className="sr-only">
            <input
              type="text"
              name="website"
              value={form.website}
              onChange={handleChange}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>
          <p className="text-sm text-left text-black/80">
            <span aria-hidden="true">*</span> {t('requiredNote')}
          </p>
          <p className="text-sm text-left text-black/80">
            {t.rich('consent', {
              privacy: (chunks) => (
                <Link href="/privacy-policy" className="text-black underline underline-offset-2">
                  {chunks}
                </Link>
              ),
              terms: (chunks) => (
                <Link href="/terms-of-use" className="text-black underline underline-offset-2">
                  {chunks}
                </Link>
              ),
            })}
          </p>
          <Button
            text={isSubmitting ? t('submitting') : t('submit')}
            type="submit"
            disabled={isSubmitting}
            className="w-full"
          />
          <div role="status" aria-live="polite" className="w-full">
            {status.state === 'success' && (
              <p className="text-base font-medium text-left text-black">{t('success')}</p>
            )}
          </div>
          <div role="alert" className="w-full">
            {status.state === 'error' && (
              <p className="text-base font-medium text-left text-black">
                {t(`errors.${status.error}`)}{' '}
                {showMailto &&
                  t.rich('errors.mailtoFallback', {
                    email: CONTACT_EMAIL,
                    mail: (chunks) => (
                      <a href={`mailto:${CONTACT_EMAIL}`} className="underline underline-offset-2">
                        {chunks}
                      </a>
                    ),
                  })}
              </p>
            )}
          </div>
        </form>
      </div>
    </section>
  );
};
