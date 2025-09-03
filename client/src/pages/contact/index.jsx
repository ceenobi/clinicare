import useMetaArgs from "@/hooks/useMeta";

export default function ContactUs() {
  useMetaArgs({
    title: "Contact Us - Clinicare",
    description: "Contact Us for any inquiries.",
    keywords: "Clinicare, contact us, inquiries",
  });
  return (
    <div className="container mx-auto py-5 px-4 min-h-dvh flex flex-col items-center justify-center text-center">
      <div className="grid grid-cols-12 gap-4 lg:gap-8">
        <div className="col-span-12 p-4">
          <img
            src="/Contact-us.svg"
            alt="contact-us"
            className="h-[300px] w-full mb-4"
          />
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Contact Us</h1>
          <div className="flex flex-col gap-1">
            <a
              href="mailto:clinicare@gmail.com"
              className="text-zinc-800 hover:text-blue-500 transition-all duration-300"
            >
              Email: clinicare@gmail.com
            </a>
            <a
              href="tel:+234123456789"
              className="text-zinc-800 hover:text-blue-500 transition-all duration-300"
            >
              Phone: +234 123 456 789
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
