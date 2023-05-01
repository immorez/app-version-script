import { FormEvent, useCallback, useState } from "react";

import { AppData } from "./types";
import Sheet from "./Sheet";

function App() {
  const [, setError] = useState<string>("");
  const [id] = useState("");
  const [data, setData] = useState<AppData>();

  const fetchAppByIdFromItunes = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      try {
        if (id.length) {
          const script = document.createElement("script");
          script.src = `https://itunes.apple.com/lookup?id=${id}&callback=handleResponse`;
          document.head.appendChild(script);

          (window as any).handleResponse = function (response: AppData) {
            setData(response);
          };
        }
      } catch (error: any) {
        if (error instanceof SyntaxError) {
          setError("Invalid JSON in response");
        } else {
          setError(error.message as string);
        }
      }
    },
    [id]
  );

  return (
    <div dir="rtl" className="container mx-auto p-4 font-sans">
      <h1 className="text-xl font-black uppercase mb-6">انبارداری آی‌اپس</h1>

      <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
        <h3 className="text-xs font-bold mb-2">
          محل آپلود شیت اپ‌هایی که ورژن آنها را میخواهید:
        </h3>
        <Sheet />
      </div>
    </div>
  );
}

export default App;
