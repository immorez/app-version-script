import { useEffect, useState } from "react";
import Papa from "papaparse";
import { CSVLink } from "react-csv";
import { AppData } from "./types";

function Sheet() {
  // State to store parsed data
  const [, setParsedData] = useState([]);

  //State to store table Column name
  const [, setTableRows] = useState([]);

  //State to store the values
  const [values, setValues] = useState([]);

  const [responseData, setResponseData] = useState<unknown[]>([]);

  const [progress, setProgress] = useState(0);

  const changeHandler = (event: any) => {
    // Passing file data (event.target.files[0]) to parse using Papa.parse
    Papa.parse(event.target.files[0], {
      header: true,
      skipEmptyLines: true,
      complete: function (results: any) {
        const rowsArray: any = [];
        const valuesArray: any = [];

        // Iterating data to get column name and their values
        results.data.map((d: any) => {
          rowsArray.push(Object.keys(d));
          valuesArray.push(Object.values(d));
        });

        // Parsed Data Response in array format
        setParsedData(results.data);

        // Filtered Column Names
        setTableRows(rowsArray[0]);

        // Filtered Values
        setValues(valuesArray);

        let ids: string[] = [];

        let take = 200;

        const responseData: any[] = [];

        const rowsWithIds = results.data.filter(
          (row: any) => row["ID"] && /^\d+$/.test(row["ID"])
        );

        const refreshId = setInterval(() => {
          if (take <= rowsWithIds.length) {
            console.log(take, rowsWithIds.length);
            ids = rowsWithIds.slice(take - 200, take).map((row: any) => {
              return row["ID"];
            });

            take = take + 200;

            setProgress((p) => p + 200);

            const script = document.createElement("script");
            script.src = `https://itunes.apple.com/lookup?id=${ids.join(
              ","
            )}&callback=handleResponse`;
            document.head.appendChild(script);
            (window as any).handleResponse = function (response: AppData) {
              setResponseData(
                response.results.map((r) => ({
                  id: r.trackId,
                  appStoreName: r.trackName,
                  newVersion: r.version,
                  name: valuesArray.find(
                    (v: any) => Number(v[2]) === r.trackId
                  )?.[1],
                  currentVersion: valuesArray.find(
                    (v: any) => Number(v[2]) === r.trackId
                  )?.[0],
                })) as unknown[]
              );
            };
          } else {
            clearInterval(refreshId);
          }
        }, 3000);

        return responseData;
      },
    });
  };

  const [changedVersions, setChangedVersions] = useState<unknown[]>([]);
  useEffect(() => {
    if (responseData?.length > 0 && values?.length > 0) {
      setChangedVersions((prev: any) => [
        ...prev,
        ...responseData.filter((r: any) => {
          const digitOnlyVersion = String(r.version).replace(/[^0-9.]/g, "");
          return (
            values.find((v) => String(v[2]) === String(r.id)) &&
            String(
              (values.find((v) => String(v[2]) === String(r.id)) as any)[0]
            ) !== String(digitOnlyVersion)
          );
        }),
      ]);
    }
  }, [responseData, values, values?.length]);

  console.log(changedVersions);

  return (
    <div className="bg-gray-100 p-4">
      <p className="text-sm text-gray-500 mb-2">
        پیشرفت: {`${progress} از ${values.length > 0 ? values.length : "-"}`}
      </p>
      <div className="h-2 bg-gray-300 rounded-md mb-4">
        <div
          className="h-full rounded-md bg-blue-500"
          style={{ width: `${(progress / values.length) * 100}%` }}
        ></div>
      </div>

      {changedVersions.length > 0 ? (
        <ul
          dir="ltr"
          className="bg-gray-900 rounded-xl p-2 overflow-y-auto max-h-[450px]"
        >
          {[...new Set(changedVersions)].map((i: any) =>
            i ? (
              <a
                href={
                  values.find((v) => Number(v[2]) === i.id)
                    ? values.find((v) => Number(v[2]) === i.id)?.[3]
                    : undefined
                }
                target="_blank"
                key={i.id}
              >
                <li className="text-green-400 py-1 text-xs font-mono">
                  {`[NEW VERSION!] ${
                    values.find((v) => Number(v[2]) === i.id)?.[1]
                  } | Version: ${
                    values.find((v) => Number(v[2]) === i.id)?.[0]
                  } | ID: ${values.find((v) => Number(v[2]) === i.id)?.[2]}`}
                </li>
              </a>
            ) : null
          )}
        </ul>
      ) : null}

      {/* File Uploader */}
      <div className="mt-4">
        <label className="text-sm font-medium text-gray-700">Upload File</label>
        <input
          type="file"
          name="file"
          onChange={changeHandler}
          accept=".csv"
          className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>

      {/* Table */}
      <div className="mt-8 flex flex-row w-full justify-end">
        <CSVLink
          className="bg-blue-500 text-white px-4 py-2 rounded-xl self-end"
          data={changedVersions as any}
          headers={[
            { label: "id", key: "id" },
            { label: "newVersion", key: "newVersion" },
            { label: "appStoreName", key: "appStoreName" },
            { label: "name", key: "name" },
            { label: "currentVersion", key: "currentVersion" },
          ]}
        >
          دانلود فایل خروجی
        </CSVLink>
      </div>
    </div>
  );
}

export default Sheet;
