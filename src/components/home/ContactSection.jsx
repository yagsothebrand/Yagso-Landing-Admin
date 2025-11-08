import { Headphones, Mail, MessageCircle, PhoneCall } from "lucide-react";
import React from "react";

const ContactSection = () => {
  const contacts = [
    {
      icon: <PhoneCall />,
      title: "Phone",
      sub: "081 234 567 890",
    },
    {
      icon: <MessageCircle />,
      title: "SMS/Whatsapp",
      sub: "081 234 567 890",
    },
    {
      icon: <Mail />,
      title: "Email",
      sub: "support@yagso.com",
    },
  ];
  return (
    <div className="h-screen w-full mb-[4rem] grid grid-cols-1 md:grid-cols-2 gap-[2rem] items-center justify-center overflow-hidden px-[2rem] md:px-[4rem] lg:max-w-[1200px] mx-auto">
      <div className="flex flex-col gap-4 item-center justify-center">
        <h2 className="testiHeading text-[26px] md:text-[32px]">Contact Us</h2>

        {/* <div className="bg-[#debfad]/40 rounded-xl p-5 w-fit">
          <p className="text-[18px] text-[#133827] max-w-[70%]">
            Hi Fashionistas! We're always here to help you
          </p> */}

        <div className="flex flex-col gap-4 max-w-[80%] pt-[2rem]">
          {contacts.map((contact) => (
            <div className="flex flex-row items-center justify-start gap-4 bg-[#debfad] text-[#133827] rounded-xl p-4">
              {contact.icon}
              <div>
                <p className="font-[600]">{contact.title}</p>
                <p className="text-sm">{contact.sub}</p>
              </div>
            </div>
          ))}
        </div>
        {/* </div> */}
      </div>

      {/* Background video */}
      <div className="relative h-[450px] lg:h-[70%] w-full">
        <video
          className="absolute top-0 left-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          src="/media.mp4"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/40" />
        <div className="h-full relative z-10 flex flex-col items-center justify-center">
          <h3 className="text-[26px] lg:text-[34px] font-extrabold text-[#debfad]/40 uppercase">
            Contact us
          </h3>
        </div>
      </div>
    </div>
  );
};

export default ContactSection;
