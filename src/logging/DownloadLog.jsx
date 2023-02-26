import { useEffect } from "react";

export function downloadLog(objtodownload) {
  const blob = new Blob([JSON.stringify(objtodownload, null, 2)], {
    type: "application/json",
  });
  //let blob = new Blob([fileData], type:;
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "UILog.txt";
  link.click();
}

export function DownloadLog(objtodownload) {
  useEffect(() => {
    const blob = new Blob([JSON.stringify(objtodownload, null, 2)], {
      type: "application/json",
    });
    //let blob = new Blob([fileData], type:;
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "UILog.txt";
    link.click();
  }, []);

  return null;
}
