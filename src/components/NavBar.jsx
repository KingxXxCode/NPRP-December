import { downloadLog } from "../logging/DownloadLog";
import "./Components.css";

export function NavBar({
  activePages,
  viewOptions,
  setViewOptions,
  loggingObject,
}) {
  const handleNavClick = (pageName) => {
    if (pageName === viewOptions.page) return;

    if (pageName.includes("Questions")) {
      setViewOptions((prevViewOptions) => {
        return {
          ...prevViewOptions,
          titlePage: pageName.split(" Questions")[0],
        };
      });
      return;
    }

    setViewOptions((prevViewOptions) => {
      return { ...prevViewOptions, page: pageName };
    });
  };

  return (
    <header className="flex-row flex-center" logsource="NavBar">
      {activePages.map((page) => {
        return (
          <button
            key={page.title}
            className={page.title === viewOptions.page ? "active" : ""}
            onClick={(e) => handleNavClick(page.title)}
            disabled={!page.active}
            logsource="NavBar"
            logtype="button"
          >
            {page.buttonText ? page.buttonText : page.title}
          </button>
        );
      })}
      <button
        onClick={() => downloadLog(loggingObject)}
        logsource="NavBar"
        logtype="DownloadLog"
      >
        Download Log
      </button>
    </header>
  );
}
