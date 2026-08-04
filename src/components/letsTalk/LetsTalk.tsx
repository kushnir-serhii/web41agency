"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";

const inputClass =
  "w-full h-16 px-6 py-[18px] rounded bg-white text-lg text-black placeholder:text-[#868686] outline-none focus:ring-2 focus:ring-black/10";

export const LetsTalk = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // TODO: connect to the contact endpoint once the back end is ready.
    console.log(form);
  };

  return (
    <section className="w-full max-w-[1440px] mx-auto px-4 lg:px-20 pb-20">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10 overflow-hidden p-6 lg:p-12 rounded-lg bg-bg_item">
        <div className="flex flex-col items-start w-full lg:w-[369px] gap-6">
          <h2 className="text-4xl lg:text-6xl font-semibold text-left text-black">
            Let&rsquo;s Talk
          </h2>
          <p className="text-lg text-left text-black">
            Ready to bring your vision to life? Get in touch, and let&rsquo;s
            build something great together.
          </p>
          <a
            href="mailto:hello@web41.agency"
            className="text-[26px] font-bold text-left text-black hover:underline"
          >
            hello@web41.agency
          </a>
          <a
            href="mailto:hello@web41.agency"
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
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Name"
            required
            className={inputClass}
          />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Contact email"
            required
            className={inputClass}
          />
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Type your message"
            rows={5}
            className={`${inputClass} h-[147px] resize-none`}
          />
          <p className="text-sm text-left text-black/70">
            By filling out the form I agree to Privacy Policy and Terms of Use
          </p>
          <button
            type="submit"
            className="flex justify-center items-center w-full gap-1 px-6 py-4 rounded-[100px] bg-black text-lg font-bold text-white cursor-pointer transition-opacity hover:opacity-90"
          >
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
};
