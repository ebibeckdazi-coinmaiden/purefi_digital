"use client";

import SmartsuppTrigger from "@/app/components/smartsupp/SmartsuppTrigger";
import RiIcon from "@/app/components/ui/RiIcon";
import { api } from "@/convex/_generated/api";
import { useForm } from "@tanstack/react-form";
import { type } from "arktype";
import { useMutation } from "convex/react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const SupportNameSchema = type("string >= 2").and(type("string <= 80"));
const SupportEmailSchema = type("string.email");
const SupportSubjectSchema = type("string >= 1").and(type("string <= 80"));
const SupportMessageSchema = type("string >= 10").and(type("string <= 2000"));

const SUPPORT_SUBJECTS = [
  "General Inquiry",
  "Technical Support",
  "Billing Issue",
  "Feature Request",
] as const;

export default function SupportPage() {
  const [activeQuestion, setActiveQuestion] = useState<number | null>(null);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubjectOpen, setIsSubjectOpen] = useState(false);
  const subjectDropdownRef = useRef<HTMLDivElement>(null);

  const submitSupportMessage = useMutation(api.user.submitSupportMessage);

  const faqs = [
    {
      id: 1,
      question: "How do I reset my password?",
      answer:
        "You can reset your password by going to the Settings page > Security tab. If you're logged out, click 'Forgot Password' on the login screen.",
    },
    {
      id: 2,
      question: "What are the daily transfer limits?",
      answer:
        "Standard accounts have a daily transfer limit of $5,000. Premium members can transfer up to $25,000 daily. You can view your specific limits in Account Details.",
    },
    {
      id: 3,
      question: "How long do transfers take?",
      answer:
        "Internal transfers are instant. External transfers typically take 1-3 business days. Wire transfers are usually processed within 24 hours.",
    },
    {
      id: 4,
      question: "Is Purefi secure?",
      answer:
        "Yes, we use bank-grade encryption and 24/7 fraud monitoring to protect your data and money. We also support 2FA for added security.",
    },
  ];

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      subject: SUPPORT_SUBJECTS[0] as string,
      message: "",
    },
    onSubmit: async ({ value }) => {
      setSubmitStatus("idle");
      setSubmitError(null);
      try {
        await submitSupportMessage({
          name: value.name,
          email: value.email,
          subject: value.subject,
          message: value.message,
        });
        setSubmitStatus("success");
      } catch (error) {
        setSubmitStatus("error");
        setSubmitError(
          error instanceof Error ? error.message : "Something went wrong",
        );
      }
    },
  });

  useEffect(() => {
    if (submitStatus !== "success") return;
    form.setFieldValue("name", "");
    form.setFieldValue("email", "");
    form.setFieldValue("subject", SUPPORT_SUBJECTS[0] as string);
    form.setFieldValue("message", "");
  }, [form, submitStatus]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!subjectDropdownRef.current) return;
      if (!subjectDropdownRef.current.contains(event.target as Node)) {
        setIsSubjectOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <main className="p-6 md:p-12 max-w-7xl mx-auto w-full pb-24 md:pb-12">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <div className="w-14 h-14 bg-db-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
          <RiIcon className="ri-customer-service-2-line text-2xl text-zinc-900" />
        </div>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-3 text-zinc-900">
          How can we help you?
        </h1>
        <p className="text-zinc-500 mb-8 max-w-2xl mx-auto">
          Find answers to common questions or get in touch with our dedicated
          support team.
        </p>

        <div className="max-w-xl mx-auto relative">
          <RiIcon className="ri-search-line absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search for help..."
            className="w-full bg-white border border-zinc-200 rounded-xl py-3.5 pl-12 pr-4 text-zinc-900 placeholder-zinc-400 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900/20 outline-none transition-colors"
          />
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Cards */}
        <div className="space-y-6 lg:order-2">
          <div className="bg-white border border-zinc-200 rounded-2xl p-6">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4 border border-blue-200">
              <RiIcon className="ri-chat-1-line text-2xl text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-zinc-900">
              Live Chat
            </h3>
            <p className="text-zinc-500 text-sm mb-4">
              Chat with our support team in real-time. Available 24/7.
            </p>
            <SmartsuppTrigger />
          </div>

          <div className="bg-white border border-zinc-200 rounded-2xl p-6">
            <div className="w-12 h-12 bg-db-primary/10 rounded-xl flex items-center justify-center mb-4 border border-db-primary/40">
              <RiIcon className="ri-mail-line text-2xl text-zinc-900" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-zinc-900">
              Email Support
            </h3>
            <p className="text-zinc-500 text-sm mb-4">
              Send us an email and we&apos;ll get back to you within 24 hours.
            </p>
            <button className="w-full py-2 bg-db-primary/10 text-zinc-900 border border-db-primary/40 rounded-lg hover:bg-db-primary/20 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-db-primary/30">
              support@purefidigital.com
            </button>
          </div>

          {/* <div className="bg-white border border-zinc-200 rounded-2xl p-6">
            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-4 border border-emerald-200">
              <RiIcon className="ri-phone-line text-2xl text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-zinc-900">Phone Support</h3>
            <p className="text-zinc-500 text-sm mb-4">Call us directly for urgent matters. Mon-Fri 9am-6pm EST.</p>
            <button className="w-full py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-emerald-200">
              +1 (404) 423-0829
            </button>
          </div> */}
        </div>
        <div className="lg:col-span-2 space-y-10 lg:order-1">
          {/* FAQ Section */}
          <div>
            <h2 className="text-xl font-semibold mb-6 text-zinc-900 tracking-tight">
              Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              {faqs.map((faq) => (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border border-zinc-200 rounded-2xl overflow-hidden"
                >
                  <button
                    onClick={() =>
                      setActiveQuestion(
                        activeQuestion === faq.id ? null : faq.id,
                      )
                    }
                    className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-zinc-50 transition-colors"
                  >
                    <span className="font-medium text-zinc-900">
                      {faq.question}
                    </span>
                    <RiIcon
                      className={`ri-arrow-down-s-line text-xl transition-transform ${activeQuestion === faq.id ? "rotate-180 text-zinc-900" : "text-zinc-400"}`}
                    />
                  </button>
                  <AnimatePresence>
                    {activeQuestion === faq.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="px-6 pb-6 text-zinc-500 leading-relaxed border-t border-zinc-100 pt-4 text-sm">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 md:p-8">
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-zinc-900 tracking-tight">
                Send us a Message
              </h2>
              <p className="text-zinc-500 text-sm mt-1.5">
                Tell us what&apos;s going on and we&apos;ll respond within 24
                hours.
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
              }}
              className="space-y-6"
            >
              <AnimatePresence>
                {submitStatus === "success" ? (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 flex items-center gap-2"
                  >
                    <RiIcon className="ri-checkbox-circle-line text-lg" />
                    Message received. We&apos;ll be in touch shortly.
                  </motion.div>
                ) : null}
              </AnimatePresence>

              <AnimatePresence>
                {submitStatus === "error" && submitError ? (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 flex items-center gap-2"
                  >
                    <RiIcon className="ri-error-warning-line text-lg" />
                    {submitError}
                  </motion.div>
                ) : null}
              </AnimatePresence>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <form.Field
                  name="name"
                  validators={{
                    onChange: ({ value }) => {
                      const trimmed = value.trim();
                      if (!trimmed) return "Name is required";
                      const result = SupportNameSchema(trimmed);
                      if (result instanceof type.errors)
                        return "Use 2–80 characters";
                      return undefined;
                    },
                  }}
                >
                  {(field) => (
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-zinc-500 uppercase tracking-widest pl-1">
                        Name
                      </label>
                      <div className="relative">
                        <RiIcon className="ri-user-line absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                        <input
                          type="text"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          placeholder="Your name"
                          className="bg-white border border-zinc-200 rounded-xl px-4 pl-11 py-3 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900/20 transition-colors"
                        />
                      </div>
                      {field.state.meta.errors?.length ? (
                        <p className="text-xs text-red-600 pl-1">
                          {field.state.meta.errors.join(", ")}
                        </p>
                      ) : null}
                    </div>
                  )}
                </form.Field>
                <form.Field
                  name="email"
                  validators={{
                    onChange: ({ value }) => {
                      const trimmed = value.trim();
                      if (!trimmed) return "Email is required";
                      const result = SupportEmailSchema(trimmed);
                      if (result instanceof type.errors)
                        return "Enter a valid email";
                      return undefined;
                    },
                  }}
                >
                  {(field) => (
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-zinc-500 uppercase tracking-widest pl-1">
                        Email
                      </label>
                      <div className="relative">
                        <RiIcon className="ri-mail-line absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                        <input
                          type="email"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          placeholder="you@domain.com"
                          className="bg-white border border-zinc-200 rounded-xl px-4 pl-11 py-3 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900/20 transition-colors"
                        />
                      </div>
                      {field.state.meta.errors?.length ? (
                        <p className="text-xs text-red-600 pl-1">
                          {field.state.meta.errors.join(", ")}
                        </p>
                      ) : null}
                    </div>
                  )}
                </form.Field>
              </div>
              <form.Field
                name="subject"
                validators={{
                  onChange: ({ value }) => {
                    const trimmed = value.trim();
                    if (!trimmed) return "Subject is required";
                    const result = SupportSubjectSchema(trimmed);
                    if (result instanceof type.errors)
                      return "Use 1–80 characters";
                    return undefined;
                  },
                }}
              >
                {(field) => (
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-zinc-500 uppercase tracking-widest pl-1">
                      Subject
                    </label>
                    <div className="relative z-40" ref={subjectDropdownRef}>
                      <RiIcon className="ri-price-tag-3-line absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                      <button
                        type="button"
                        onClick={() => setIsSubjectOpen((v) => !v)}
                        onBlur={field.handleBlur}
                        className="w-full bg-white border border-zinc-200 rounded-xl px-4 pl-11 py-3 text-zinc-900 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900/20 transition-colors appearance-none text-left hover:bg-zinc-50"
                      >
                        {field.state.value}
                      </button>
                      <button
                        type="button"
                        aria-hidden="true"
                        tabIndex={-1}
                        onClick={() => setIsSubjectOpen((v) => !v)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-lg hover:bg-zinc-50 transition-colors"
                      >
                        <RiIcon
                          className={`ri-arrow-down-s-line text-zinc-400 transition-transform duration-200 ${isSubjectOpen ? "rotate-180" : ""}`}
                        />
                      </button>

                      <AnimatePresence>
                        {isSubjectOpen ? (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.18 }}
                            className="absolute top-full left-0 w-full mt-2 bg-white border border-zinc-200 rounded-xl overflow-hidden"
                          >
                            <div className="p-1">
                              {SUPPORT_SUBJECTS.map((s) => {
                                const selected = field.state.value === s;
                                return (
                                  <button
                                    key={s}
                                    type="button"
                                    onClick={() => {
                                      field.handleChange(s);
                                      setIsSubjectOpen(false);
                                    }}
                                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors text-left ${
                                      selected
                                        ? "bg-zinc-100 text-zinc-900"
                                        : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                                    }`}
                                  >
                                    <span className="text-sm font-medium">
                                      {s}
                                    </span>
                                    {selected ? (
                                      <RiIcon className="ri-check-line text-zinc-900" />
                                    ) : null}
                                  </button>
                                );
                              })}
                            </div>
                          </motion.div>
                        ) : null}
                      </AnimatePresence>
                    </div>
                    {field.state.meta.errors?.length ? (
                      <p className="text-xs text-red-600 pl-1">
                        {field.state.meta.errors.join(", ")}
                      </p>
                    ) : null}
                  </div>
                )}
              </form.Field>

              <form.Field
                name="message"
                validators={{
                  onChange: ({ value }) => {
                    const trimmed = value.trim();
                    if (!trimmed) return "Message is required";
                    const result = SupportMessageSchema(trimmed);
                    if (result instanceof type.errors)
                      return "Use 10–2000 characters";
                    return undefined;
                  },
                }}
              >
                {(field) => (
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-zinc-500 uppercase tracking-widest pl-1">
                      Message
                    </label>
                    <div className="relative">
                      <RiIcon className="ri-pencil-line absolute left-4 top-4 text-zinc-400" />
                      <textarea
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        rows={5}
                        placeholder="What can we help with?"
                        className="w-full bg-white border border-zinc-200 rounded-xl px-4 pl-11 py-3 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900/20 transition-colors resize-none"
                      ></textarea>
                    </div>
                    {field.state.meta.errors?.length ? (
                      <p className="text-xs text-red-600 pl-1">
                        {field.state.meta.errors.join(", ")}
                      </p>
                    ) : null}
                  </div>
                )}
              </form.Field>

              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
              >
                {([canSubmit, isSubmitting]) => (
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={!canSubmit || isSubmitting}
                    className="w-full py-3.5 bg-db-primary hover:bg-[#8dd860] text-zinc-900 font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <RiIcon className="ri-loader-4-line animate-spin text-lg" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <RiIcon className="ri-arrow-right-line" />
                      </>
                    )}
                  </motion.button>
                )}
              </form.Subscribe>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
