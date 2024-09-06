const getCurrentTab = (jpIframeDocument: any) => {
  const dockPanel = jpIframeDocument.getElementsByClassName(
    "lm-DockPanel-tabBar"
  )[0];
  const topBarTabs = dockPanel.getElementsByTagName("li");

  const currentTab = Array.from(topBarTabs).find((tab) => {
    return (tab as HTMLElement).getAttribute("aria-selected") === "true";
  });

  return currentTab;
};

const getActiveCell = (jpIframeDocument: any) => {
  // main panel
  const jpMainPanel = jpIframeDocument.getElementById("jp-main-dock-panel");

  // 顶部tab
  const currentTab = getCurrentTab(jpIframeDocument);

  const allPanels = jpMainPanel.getElementsByClassName("jp-MainAreaWidget");

  const currentPanel = Array.from(allPanels).find((panel) => {
    return (
      (panel as HTMLElement).getAttribute("aria-labelledby") ===
      (currentTab as HTMLElement).getAttribute("id")
    );
  });

  // active cell
  const activeCell = (currentPanel as any).getElementsByClassName(
    "jp-mod-active jp-mod-selected"
  )[0];

  return { activeCell };
};

const getCellNumber = (jpIframeDocument: any) => {
  const { activeCell } = getActiveCell(jpIframeDocument);

  // all active cell prompt
  const cellPrompt = activeCell.getElementsByClassName(
    "jp-InputPrompt jp-InputArea-prompt"
  )[0];

  // cell prompt innerText
  const cellPromptText = (cellPrompt as HTMLElement).innerText;
  // cell number
  const cellNumber = Number(cellPromptText.replace(/[^0-9]/gi, ""));

  return cellNumber;
};

const getFromInfo = (jpIframeDocument: any) => {
  const currentTab = getCurrentTab(jpIframeDocument);

  const title = (currentTab as HTMLElement).getAttribute("title");
  const fileName = title
    ?.split("Path:")[0]
    .split("Name:")[1]
    ?.replace("\n", "")
    .trim();
  const path = title
    ?.split("Path:")[1]
    ?.split("Last")[0]
    ?.replace("\n", "")
    .trim();

  return { fileName, path };
};

const setStyle = (dom: HTMLElement, style: string) => {
  dom.setAttribute("style", `${dom.getAttribute("style")};${style}`);
};

export { getCellNumber, getFromInfo, getCurrentTab, getActiveCell, setStyle };
