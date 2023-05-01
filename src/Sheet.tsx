import { useEffect, useState } from "react";
import Papa from "papaparse";
import { AppData } from "./types";

function Sheet() {
  // State to store parsed data
  const [, setParsedData] = useState([]);

  //State to store table Column name
  const [tableRows, setTableRows] = useState([]);

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

        setInterval(() => {
          if (take < rowsWithIds.length) {
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
                  id: r.artistId,
                  version: r.version,
                })) as unknown[]
              );
            };
          }
        }, 20000);

        return responseData;
      },
    });
  };

  const [changedVersions, setChangedVersions] = useState<unknown[]>([]);
  useEffect(() => {
    if (responseData?.length > 0 && values?.length > 0) {
      setChangedVersions((prev: any) => [
        ...prev,
        responseData.find(
          (r: any) =>
            values.find((v) => Number(v[2]) === r.id) &&
            (values.find((v) => Number(v[2]) === r.id) as any)[0] !== r.version
        ),
      ]);
    }
  }, [responseData, values, values?.length]);

  return (
    <div>
      <p>
        پیشرفت: {`${progress} از ${values.length > 0 ? values.length : "-"}`}
      </p>
      <div style={{ display: "flex", background: "#e0e0e0" }}>
        <span
          style={{
            display: "flex",
            background: "blue",
            height: "20px",
            width: `${(progress / values.length) * 100}%`,
          }}
        />
      </div>

      <ul>
        {[...Array.from(new Set(changedVersions))].map((i: any) =>
          i ? (
            <a
              href={
                values.find((v) => Number(v[2]) === i.id)
                  ? values.find((v) => Number(v[2]) === i.id)?.[3]
                  : undefined
              }
              target="_blank"
            >
              <li key={i.id}>
                {JSON.stringify(values.find((v) => Number(v[2]) === i.id))}
              </li>
            </a>
          ) : null
        )}
      </ul>
      {/* File Uploader */}
      <input
        type="file"
        name="file"
        onChange={changeHandler}
        accept=".csv"
        style={{ display: "block", margin: "10px auto" }}
      />
      <br />
      <br />
      {/* Table */}
      <table>
        <thead>
          <tr>
            {tableRows.map((rows, index) => {
              return <th key={index}>{rows}</th>;
            })}
          </tr>
        </thead>
        <tbody>
          {values.map((value: any, index) => {
            return (
              <tr key={index}>
                {value.map((val: any, i: number) => {
                  return <td key={i}>{val}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Sheet;
