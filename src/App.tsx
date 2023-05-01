import { ChangeEvent, FormEvent, useCallback, useState } from "react";
import { AppData } from "./types";
import Sheet from "./Sheet";

function App() {
  const [error, setError] = useState("");
  const [id, setId] = useState("");
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
          setError(error.message);
        }
      }
    },
    [id]
  );

  const onIdInputChangeHandler = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      e.preventDefault();
      setId(e.target.value);
    },
    []
  );

  return (
    <div dir="rtl" className="container mx-auto p-4 font-display">
      <h1 className="text-xs">انبارداری آی‌اپس</h1>
      {/* <p>برای جستجو میان چند اپ، آیدی آنها را با , از هم جدا کنید.</p>
      <form onSubmit={fetchAppByIdFromItunes}>
        <textarea
          name="appId"
          placeholder="آیدی اپ(ها)"
          onChange={onIdInputChangeHandler}
        />
        <button type="submit">جستجو</button>
      </form> */}
      <form onSubmit={fetchAppByIdFromItunes}>
        <h3>محل آپلود شیت اپ‌هایی که ورژن آنها را میخواهید:</h3>
        <Sheet />
      </form>

      {JSON.stringify(data)}
    </div>
  );
}

export default App;
