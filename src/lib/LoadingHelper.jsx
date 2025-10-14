export const LoadingHelper = () => (
  <div className="h-[80vh]">
    <div className="absolute top-0 left-0 h-[85vh] z-[9999] w-screen bg-slate-500/50 flex justify-center items-center cursor-wait">
      <figure className="w-[15rem] rounded-lg overflow-hidden">
        <img
          src="https://i.pinimg.com/originals/e6/8c/c3/e68cc33983bed347554ce23fe2bd08bd.gif"
          alt="Logo"
          className=" w-full object-contain mix-blend-multiply animate-pulse"
        ></img>
      </figure>
    </div>
  </div>
);
