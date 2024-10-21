import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

const Toaster = ({ ...props }) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: "group toast group-[.toaster]:border-none group-[.toaster]:shadow-lg group-[.toaster]:rounded-lg group-[.toaster]:px-4 group-[.toaster]:py-3 group-[.toaster]:transition-all group-[.toaster]:duration-300 group-[.toaster]:ease-in-out group-[.toaster]:hover:scale-105 group-[.toaster]:font-bold",
          description: "group-[.toast]:font-bold",
          actionButton:
            "group-[.toast]:font-semibold group-[.toast]:px-4 group-[.toast]:py-2 group-[.toast]:rounded-full group-[.toast]:transition-colors group-[.toast]:duration-200 group-[.toast]:ease-in-out",
          cancelButton:
            "group-[.toast]:bg-transparent group-[.toast]:font-medium group-[.toast]:underline group-[.toast]:transition-colors group-[.toast]:duration-200 group-[.toast]:ease-in-out",
          // สำหรับ success toast
          success: "group-[.toaster]:bg-gradient-to-r group-[.toaster]:from-indigo-500 group-[.toaster]:to-purple-600 group-[.toaster]:text-white",
          // สำหรับ error toast
          error: "group-[.toaster]:bg-gradient-to-r group-[.toaster]:from-red-500 group-[.toaster]:to-red-600 group-[.toaster]:text-white",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
