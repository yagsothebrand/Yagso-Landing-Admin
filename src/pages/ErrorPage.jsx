import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const ErrorPage = ({ error, resetErrorBoundary }) => {
  const navigate = useNavigate();
  return (
    <div
      role="alert"
      className="flex flex-col gap-8 items-center justify-center h-screen w-full bg-[#c1c7cc]"
    >
      <h1 className="font-bold text-5xl">Something went wrong :</h1>
      <img
        src={LogOut}
        alt="Logo"
        className=" w-24 aspect-square object-contain mix-blend-multiply animate-pulse"
      ></img>
      <pre className="text-2xl">{error.message}</pre>
      <button
        onClick={() => {
          navigate("/");
          resetErrorBoundary();
        }}
        color="white"
      >
        Go back
      </button>
    </div>
  );
};
