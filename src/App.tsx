import Sheet from "./Sheet";

function App() {
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
