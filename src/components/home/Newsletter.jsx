import React from "react";

const Newsletter = () => {
  return (
    <div className="md:px-[4rem] lg:px-[2rem] pb-[80px] lg:max-w-[1200px] mx-auto">
      <div
        className="h-[600px] w-full bg-top bg-cover bg-no-repeat"
        style={{
          backgroundImage: `url("/News1.JPG")`,
        }}
      >
        <div className="w-full h-full flex justify-center items-center flex-col gap-[20px]">
          <div className="text-center">
            <h2 className="text-white text-[28px] lg:text-[32px] font-[700]">
              Exclusive access awaits.
            </h2>
            <h2 className="text-white mt-[-.75rem] text-[24px] lg:text-[28px] font-[700]">
              Subscribe to our newsletter
            </h2>
          </div>

          <div className="flex flex-col gap-[10px] items-center">
            <input
              className="h-[40px] w-[18rem] placeholder:text-[#9999] bg-[#eeee] rounded-[10px] p-[12px]"
              type="email"
              name=""
              id=""
              placeholder="name@gmail.com"
            />
            <button className="bg-[#debfad] w-[18rem] text-[#133827] font-semibold text-base rounded-[10px] p-[10px]">
              Email address
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Newsletter;
