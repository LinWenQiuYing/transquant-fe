import { useStores as useAppStores } from "@transquant/app/hooks";
import { clsPrefix, PUBLICURL } from "@transquant/constants";
import { useUnmount } from "ahooks";
import { Empty, message, Modal, Tooltip } from "antd";
import { observer } from "mobx-react";
import { useEffect } from "react";
import { Else, If, Then, When } from "react-if";
import { useStores } from "../hooks";
import EnvPreviewModal from "./EnvPreviewModal";
import { fullScreenIconStr, logoIconStr } from "./iconstring";
import "./index.less";
import { setStyle } from "./utils";

// 判断iframe是否存在
export const isIframeExist = () => {
  const jpIframe = document.getElementById("jupyterlab");
  const jpIframeDocument = (jpIframe as any)?.contentWindow.document;

  const jpTopPanel = jpIframeDocument?.getElementById("jp-top-panel");
  const jpLeftSiderBar = jpIframeDocument?.getElementsByClassName(
    "jp-SideBar jp-mod-left"
  )[0];
  const jpRightSiderBar = jpIframeDocument?.getElementsByClassName(
    "jp-SideBar jp-mod-right"
  )[0];

  return {
    exist: !!jpTopPanel,
    jpTopPanel,
    jpIframeDocument,
    jpLeftSiderBar,
    jpRightSiderBar,
  };
};

export default observer(function Space() {
  const { imageStore } = useStores();
  const {
    iframePath,
    envPreview,
    onEnvPreviewVisibleChange,
    hasEnv,
    onIframePathChange,
    imageInstance,
    switchEnvEditor,
    checkVSCode,
  } = imageStore;
  const { collapsed } = useAppStores().appStore;

  const appendFullScreenButton = (parentDom: HTMLElement) => {
    const fullScreenDom = document.createElement("span");

    setStyle(
      fullScreenDom,
      `display: flex;
        align-items: center;
        width: 30px;
        position: absolute;
        top: 2px;
        right: 32px;
        height: 24px;
        cursor: pointer;
        z-index:1`
    );

    const img = document.createElement("img");
    img.src = fullScreenIconStr;

    img.style.width = "20px";
    img.style.marginLeft = "10px";

    const jupyterIframe = document.getElementById("jupyter-iframe");

    fullScreenDom.addEventListener("click", () => {
      if (document.fullscreenElement === null) {
        jupyterIframe?.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    });

    fullScreenDom.appendChild(img);
    parentDom.appendChild(fullScreenDom);
  };

  const clearLoading = () => {
    const loadingTimer: ReturnType<typeof setInterval> = setInterval(() => {
      const { exist } = isIframeExist();

      const jpIframe = document.getElementById("jupyterlab");

      if (!jpIframe) return;

      const jpIframeDocument = (jpIframe as any).contentWindow.document;

      const jpMain = jpIframeDocument.getElementById("main");

      if (jpMain) {
        clearInterval(loadingTimer);

        setTimeout(() => {
          const galaxy = jpIframeDocument.getElementById("galaxy");

          galaxy?.remove();
        });

        setTimeout(() => {
          // 删除遮罩
          const mask = jpIframeDocument.getElementById("jupyterlab-splash");
          mask?.remove();
        }, 500);
      }
      if (exist) {
        clearInterval(loadingTimer);
      }
    }, 10);
  };

  const onLoad = () => {
    if (iframePath.includes("/page/vscode") || iframePath.includes("/tqcode")) {
      return;
    }
    const jpIframe = document.getElementById("jupyterlab");
    const jpIframeDocument = (jpIframe as any).contentWindow.document;
    const jpBody = jpIframeDocument.getElementsByTagName("body")[0];

    const div = document.createElement("div");
    div.setAttribute("id", "jupyterlab-splash");
    div.style.zIndex = "10001";
    div.style.backgroundColor = "#ccc";
    const loadingDiv = document.createElement("div");
    const loadingSvg = document.createElement("img");
    loadingSvg.src =
      "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJ4TWlkWU1pZCBtZWV0IiB3aWR0aD0iODUwIiBoZWlnaHQ9IjUwMCIgdmlld0JveD0iMCAwIDg1MCA1MDAiIHN0eWxlPSJ3aWR0aDoxMDAlO2hlaWdodDoxMDAlIj48ZGVmcz48YW5pbWF0ZSByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIgZHVyPSIyLjcycyIgYmVnaW49IjBzIiB4bGluazpocmVmPSIjX1JfR19MXzBfR19EXzBfUF8wIiBmaWxsPSJmcmVlemUiIGF0dHJpYnV0ZU5hbWU9ImQiIGF0dHJpYnV0ZVR5cGU9IlhNTCIgZnJvbT0iTS0xNzAuNSAyNS41IEMtMTcwLjUsMjUuNSAtMTQ5LDI2IC0xNDUsMjYgQy0xNDEsMjYgLTEyOC41LDc0LjUgLTExNi41LDc0LjUgQy0xMDQuNSw3NC41IC05Ni41LC0yMy41IC03OCwtMjMuNSBDLTU5LjUsLTIzLjUgLTYxLjUsNDIuNSAtNDUuNSw0Mi41IEMtMjkuNSw0Mi41IC0yOSwtNjcuNSAtOSwtNjcuNSBDMTEsLTY3LjUgNSwxMTguNSAyNi41LDExOC41IEM0OCwxMTguNSA0NS41LC0yMS41IDY0LjUsLTIxLjUgQzgzLjUsLTIxLjUgODIsNzQuNSA5OSw3NC41IEMxMTYsNzQuNSAxMTcuNSwyNy41IDEyOS41LDI3LjUgQzE0MS41LDI3LjUgMTYyLDI3LjUgMTYyLDI3LjUgIiB0bz0iTS0xNzAuNSAyNS41IEMtMTcwLjUsMjUuNSAtMTQ5LDI2IC0xNDUsMjYgQy0xNDEsMjYgLTEyOC41LDc0LjUgLTExNi41LDc0LjUgQy0xMDQuNSw3NC41IC05Ni41LC0yMy41IC03OCwtMjMuNSBDLTU5LjUsLTIzLjUgLTYxLjUsMTIxIC00NS41LDEyMSBDLTI5LjUsMTIxIC0yOSwtNjcuNSAtOSwtNjcuNSBDMTEsLTY3LjUgNSwxMTguNSAyNi41LDExOC41IEM0OCwxMTguNSA0NS41LC0yMS41IDY0LjUsLTIxLjUgQzgzLjUsLTIxLjUgODIsNzQuNSA5OSw3NC41IEMxMTYsNzQuNSAxMTcuNSwyNy41IDEyOS41LDI3LjUgQzE0MS41LDI3LjUgMTYyLDI3LjUgMTYyLDI3LjUgIiBrZXlUaW1lcz0iMDswLjE0NzA1ODg7MC4yOTQxMTc2OzAuNDI2NDcwNjswLjU4ODIzNTM7MC43MzUyOTQxOzAuODgyMzUyOTsxIiB2YWx1ZXM9Ik0tMTcwLjUgMjUuNSBDLTE3MC41LDI1LjUgLTE0OSwyNiAtMTQ1LDI2IEMtMTQxLDI2IC0xMjguNSw3NC41IC0xMTYuNSw3NC41IEMtMTA0LjUsNzQuNSAtOTYuNSwtMjMuNSAtNzgsLTIzLjUgQy01OS41LC0yMy41IC02MS41LDQyLjUgLTQ1LjUsNDIuNSBDLTI5LjUsNDIuNSAtMjksLTY3LjUgLTksLTY3LjUgQzExLC02Ny41IDUsMTE4LjUgMjYuNSwxMTguNSBDNDgsMTE4LjUgNDUuNSwtMjEuNSA2NC41LC0yMS41IEM4My41LC0yMS41IDgyLDc0LjUgOTksNzQuNSBDMTE2LDc0LjUgMTE3LjUsMjcuNSAxMjkuNSwyNy41IEMxNDEuNSwyNy41IDE2MiwyNy41IDE2MiwyNy41IDtNLTE3MC41IDI1LjUgQy0xNzAuNSwyNS41IC0xNDksMjYgLTE0NSwyNiBDLTE0MSwyNiAtMTI4LjUsLTI5LjUgLTExNi41LC0yOS41IEMtOTMsLTI5LjUgLTk2LjUsMzYuNSAtNzgsMzYuNSBDLTU5LjUsMzYuNSAtNjEuNSwxNiAtNDUuNSwxNiBDLTI2LjUsMTYgLTMwLjUsOTggLTksOTggQzE0LDk4IDUsLTkgMjYuNSwtOSBDNjAuNSwtOSA0NS41LDQxLjUgNjQuNSw0MS41IEM4My41LDQxLjUgODIsLTE0IDk5LC0xNCBDMTE2LC0xNCAxMTcuNSwyNy41IDEyOS41LDI3LjUgQzE0MS41LDI3LjUgMTYyLDI3LjUgMTYyLDI3LjUgO00tMTcwLjUgMjUuNSBDLTE3MC41LDI1LjUgLTE0OSwyNiAtMTQ1LDI2IEMtMTQxLDI2IC0xMjguNSw1NC41IC0xMTYuNSw1NC41IEMtOTUsNTQuNSAtOTMuNSwtNzkgLTc1LC03OSBDLTQ3LjUsLTc5IC02MS41LDkyIC00NS41LDkyIEMtMjkuNSw5MiAtMjksNTIgLTksNTIgQzExLDUyIDUuNSwxMDMgMjcsMTAzIEM0OC41LDEwMyA0NS41LC0xOC41IDY0LjUsLTE4LjUgQzgzLjUsLTE4LjUgODIsODguNSA5OSw4OC41IEMxMTYsODguNSAxMTcuNSwyNy41IDEyOS41LDI3LjUgQzE0MS41LDI3LjUgMTYyLDI3LjUgMTYyLDI3LjUgO00tMTcwLjUgMjUuNSBDLTE3MC41LDI1LjUgLTE0OSwyNiAtMTQ1LDI2IEMtMTQxLDI2IC0xMjksLTkgLTExNywtOSBDLTkzLjUsLTkgLTk2LjUsOTUgLTc4LDk1IEMtNTkuNSw5NSAtNjAsLTg0IC00NCwtODQgQy0yOCwtODQgLTI5LDEwOC41IC05LDEwOC41IEMxMSwxMDguNSA0LjUsMzUgMjYsMzUgQzQ3LjUsMzUgNDUuNSwxMTIgNjQuNSwxMTIgQzgzLjUsMTEyIDUyLjUsLTE1LjUgOTksLTE1LjUgQzEyMi41LC0xNS41IDExNy41LDI3LjUgMTI5LjUsMjcuNSBDMTQxLjUsMjcuNSAxNjIsMjcuNSAxNjIsMjcuNSA7TS0xNzAuNSAyNS41IEMtMTcwLjUsMjUuNSAtMTQ5LDI2IC0xNDUsMjYgQy0xNDEsMjYgLTEzMC41LDYzLjUgLTExNi41LDYzLjUgQy04MS41LDYzLjUgLTEwNywtNTIuNSAtNzgsLTUyLjUgQy01OS41LC01Mi41IC01OC41LDU4LjUgLTQyLjUsNTguNSBDLTE1LDU4LjUgLTI5LDIxIC05LDIxIEMxMSwyMSA1LDExNi41IDI2LjUsMTE2LjUgQzQ4LDExNi41IDQ1LjUsLTY4IDY0LjUsLTY4IEM4My41LC02OCA4MCw3NSA5OSw3NSBDMTE4LDc1IDExNy41LDI3LjUgMTI5LjUsMjcuNSBDMTQxLjUsMjcuNSAxNjIsMjcuNSAxNjIsMjcuNSA7TS0xNzAuNSAyNS41IEMtMTcwLjUsMjUuNSAtMTQ5LDI2IC0xNDUsMjYgQy0xNDEsMjYgLTEzMC41LC0yOSAtMTE2LjUsLTI5IEMtODEuNSwtMjkgLTEwNywxMDkuNSAtNzgsMTA5LjUgQy01OS41LDEwOS41IC01OSw0IC00Myw0IEMtMTUuNSw0IC0yOSw3My41IC05LDczLjUgQzExLDczLjUgNC41LC05Mi41IDI2LC05Mi41IEM0Ny41LC05Mi41IDQ1LjUsODkgNjQuNSw4OSBDODMuNSw4OSA4MCwtMTkuNSA5OSwtMTkuNSBDMTE4LC0xOS41IDExNy41LDI3LjUgMTI5LjUsMjcuNSBDMTQxLjUsMjcuNSAxNjIsMjcuNSAxNjIsMjcuNSA7TS0xNzAuNSAyNS41IEMtMTcwLjUsMjUuNSAtMTQ5LDI2IC0xNDUsMjYgQy0xNDEsMjYgLTEzMCw5MS41IC0xMTgsOTEuNSBDLTEwNiw5MS41IC05Ni41LDEyNS41IC03OCwxMjUuNSBDLTU5LjUsMTI1LjUgLTYyLDQ1IC00Niw0NSBDLTMwLDQ1IC0yOSwxLjUgLTksMS41IEMxMSwxLjUgNC41LDQyLjUgMjYsNDIuNSBDNDcuNSw0Mi41IDQ1LDkwIDY0LDkwIEM4Myw5MCA4NC45NCw3My45NCAxMDEuOTQsNzMuOTQgQzExOC45NCw3My45NCAxMTcuNSwyNy41IDEyOS41LDI3LjUgQzE0MS41LDI3LjUgMTYyLDI3LjUgMTYyLDI3LjUgO00tMTcwLjUgMjUuNSBDLTE3MC41LDI1LjUgLTE0OSwyNiAtMTQ1LDI2IEMtMTQxLDI2IC0xMjguNSw3NC41IC0xMTYuNSw3NC41IEMtMTA0LjUsNzQuNSAtOTYuNSwtMjMuNSAtNzgsLTIzLjUgQy01OS41LC0yMy41IC02MS41LDEyMSAtNDUuNSwxMjEgQy0yOS41LDEyMSAtMjksLTY3LjUgLTksLTY3LjUgQzExLC02Ny41IDUsMTE4LjUgMjYuNSwxMTguNSBDNDgsMTE4LjUgNDUuNSwtMjEuNSA2NC41LC0yMS41IEM4My41LC0yMS41IDgyLDc0LjUgOTksNzQuNSBDMTE2LDc0LjUgMTE3LjUsMjcuNSAxMjkuNSwyNy41IEMxNDEuNSwyNy41IDE2MiwyNy41IDE2MiwyNy41ICIga2V5U3BsaW5lcz0iMC4zMzMgMCAwLjY2NyAxOzAuMzMzIDAgMC42NjcgMTswLjMzMyAwIDAuNjY3IDE7MC4zMzMgMCAwLjY2NyAxOzAuMzMzIDAgMC42NjcgMTswLjMzMyAwIDAuNjY3IDE7MC4zMzMgMCAwLjY2NyAxIiBjYWxjTW9kZT0ic3BsaW5lIi8+PGFuaW1hdGUgYXR0cmlidXRlVHlwZT0iWE1MIiBhdHRyaWJ1dGVOYW1lPSJvcGFjaXR5IiBkdXI9IjNzIiBmcm9tPSIwIiB0bz0iMSIgeGxpbms6aHJlZj0iI3RpbWVfZ3JvdXAiLz48L2RlZnM+PGcgaWQ9Il9SX0ciPjxnIGlkPSJfUl9HX0xfMV9HIiB0cmFuc2Zvcm09IiB0cmFuc2xhdGUoNDIzLCAyNTEpIHNjYWxlKDIuMTE2NzU5OTk5OTk5OTk5OCwgMi4xMTY3NTk5OTk5OTk5OTk4KSB0cmFuc2xhdGUoLTI2MCwgLTMwMCkiPjxwYXRoIGlkPSJfUl9HX0xfMV9HX0RfMF9QXzAiIGZpbGw9IiMxMTg2ZWYiIGZpbGwtb3BhY2l0eT0iMSIgZmlsbC1ydWxlPSJub256ZXJvIiBkPSIgTTMzNy4xOSAyOTUuNzMgQzMzNy4xOSwyOTUuNzMgMzQ5Ljk0LDI5Ni4yIDM0OS45NCwyOTYuMiBDMzU2LjAxLDI5Ni4yIDM2MC45NSwzMDEuMTMgMzYwLjk1LDMwNy4yMSBDMzYwLjk1LDMwNy40IDM2MC45NSwzMDcuNTggMzYwLjk0LDMwNy43NyBDMzYwLjkyLDMwOC4xNCAzNjAuODgsMzA4LjQ5IDM2MC44MywzMDguODQgQzM2MC44MywzMDguODkgMzYwLjgyLDMwOC45MyAzNjAuODEsMzA4Ljk3IEMzNTYuMDgsMzYwLjY1IDMxMi42Myw0MDEuMTQgMjU5LjcyLDQwMS4xNCBDMjIzLjM3LDQwMS4xNCAxOTEuNTEsMzgyLjA0IDE3My41NywzNTMuMzQgQzE2NS4yOCwzNDAuMDkgMTUxLjU1LDMzMS4yIDEzNi4wMiwzMjkuNDIgQzEzNi4wMiwzMjkuNDIgNjguMjUsMzIxLjcxIDY4LjI1LDMyMS43MSBDNjguMjUsMzIxLjcxIDE1OS4wNSwzMTEuMiAxNTkuMDUsMzExLjIgQzE3MC40NywzMDkuODggMTgxLjE3LDMxNi42MyAxODUuMiwzMjcuMzkgQzE5Ni41MSwzNTcuNTggMjI1LjY0LDM3OS4xMyAyNTkuNzIsMzc5LjEzIEMzMDEuMDgsMzc5LjEzIDMzNS4xNSwzNDcuNDIgMzM4LjkyLDMwNy4wMyBDMzM4LjkyLDMwNi45IDMzOC45MywzMDYuNzYgMzM4LjkzLDMwNi42NCBDMzM4LjkxLDMwNC42MSAzMzUuOTUsMzAyLjg4IDMzMy44NywzMDIuODggIi8+PHBhdGggaWQ9Il9SX0dfTF8xX0dfRF8xX1BfMCIgZmlsbD0iIzExODZlZiIgZmlsbC1vcGFjaXR5PSIxIiBmaWxsLXJ1bGU9Im5vbnplcm8iIGQ9IiBNMTc2LjMgMzA0LjE4IEMxNzYuMywzMDQuMTggMTY5LjUxLDMwMy45NCAxNjkuNTEsMzAzLjk0IEMxNjIuMzMsMzAzLjEzIDE1OC40OSwyOTguMDEgMTU4LjQ5LDI5MS45MiBDMTU4LjQ5LDI5MS43MiAxNTguNDksMjkxLjU0IDE1OC41LDI5MS4zNiBDMTU4LjUyLDI5MS4xNiAxNTguNTMsMjkwLjk4IDE1OC41NSwyOTAuNzkgQzE1OC41NiwyOTAuNiAxNTguNTksMjkwLjQxIDE1OC42MywyOTAuMjMgQzE1OC42MywyOTAuMiAxNTguNjQsMjkwLjE1IDE1OC42NCwyOTAuMTEgQzE2My4zOSwyMzguNDUgMjA2LjgzLDE5OCAyNTkuNzIsMTk4IEMyOTYuMDcsMTk4IDMyNy45NCwyMTcuMSAzNDUuODgsMjQ1LjggQzM1NC4xNywyNTkuMDUgMzY3LjksMjY3Ljk0IDM4My40MywyNjkuNzEgQzM4My40MywyNjkuNzEgNDUxLjE5LDI3Ny40MyA0NTEuMTksMjc3LjQzIEM0NTEuMTksMjc3LjQzIDM2MC4zOCwyODcuOTMgMzYwLjM4LDI4Ny45MyBDMzQ4Ljk3LDI4OS4yNSAzMzguMjcsMjgyLjUgMzM0LjI1LDI3MS43NCBDMzIyLjk0LDI0MS41NSAyOTMuOCwyMjAuMDEgMjU5LjcyLDIyMC4wMSBDMjE4LjM3LDIyMC4wMSAxODQuMywyNTEuNyAxODAuNTIsMjkyLjA5IEMxODAuMzIsMjk0LjI5IDE4Mi4wNywyOTYuMiAxODQuMjgsMjk2LjIgQzE4NC4yOCwyOTYuMiAxODUuNTYsMjk2LjIgMTg1LjU2LDI5Ni4yICIvPjwvZz48ZyBpZD0iX1JfR19MXzBfRyIgdHJhbnNmb3JtPSIgdHJhbnNsYXRlKDQzMSwgMjIyKSBzY2FsZSgxLjA5NDU3LCAxLjA5NDU3KSB0cmFuc2xhdGUoMCwgMCkiPjxwYXRoIGlkPSJfUl9HX0xfMF9HX0RfMF9QXzAiIHN0cm9rZT0iIzExODZlZiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBmaWxsPSJub25lIiBzdHJva2Utd2lkdGg9IjE4IiBzdHJva2Utb3BhY2l0eT0iMSIgZD0iIE0tMTcwLjUgMjUuNSBDLTE3MC41LDI1LjUgLTE0OSwyNiAtMTQ1LDI2IEMtMTQxLDI2IC0xMjguNSw3NC41IC0xMTYuNSw3NC41IEMtMTA0LjUsNzQuNSAtOTYuNSwtMjMuNSAtNzgsLTIzLjUgQy01OS41LC0yMy41IC02MS41LDQyLjUgLTQ1LjUsNDIuNSBDLTI5LjUsNDIuNSAtMjksLTY3LjUgLTksLTY3LjUgQzExLC02Ny41IDUsMTE4LjUgMjYuNSwxMTguNSBDNDgsMTE4LjUgNDUuNSwtMjEuNSA2NC41LC0yMS41IEM4My41LC0yMS41IDgyLDc0LjUgOTksNzQuNSBDMTE2LDc0LjUgMTE3LjUsMjcuNSAxMjkuNSwyNy41IEMxNDEuNSwyNy41IDE2MiwyNy41IDE2MiwyNy41ICIvPjwvZz48L2c+PGcgaWQ9InRpbWVfZ3JvdXAiLz48L3N2Zz4=";

    loadingSvg.style.width = "300px";
    loadingSvg.style.height = "150px";

    loadingDiv.style.width = "100%";
    loadingDiv.style.height = "100%";
    loadingDiv.style.background = "#000";
    loadingDiv.style.display = "flex";
    loadingDiv.style.alignItems = "center";
    loadingDiv.style.justifyContent = "center";
    loadingDiv.appendChild(loadingSvg);
    div.appendChild(loadingDiv);

    jpBody.appendChild(div);

    clearLoading();
  };

  useEffect(() => {
    const timer = setInterval(() => {
      const { exist, jpTopPanel, jpIframeDocument } = isIframeExist();
      if (exist) {
        clearInterval(timer);

        const img = document.createElement("img");
        img.src = logoIconStr;

        img.style.width = "20px";
        img.style.height = "20px";
        img.style.marginLeft = "10px";
        jpIframeDocument.getElementById("jp-MainLogo").innerHTML = "";
        jpIframeDocument.getElementById("jp-MainLogo").appendChild(img);
        jpTopPanel.style.border = "none";

        // appendRunButton(jpTopPanel);
        appendFullScreenButton(jpTopPanel);
      }
    }, 1000);

    clearLoading();

    return () => {
      clearInterval(timer);
      imageStore.setImageInstance(null);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useUnmount(() => {
    onIframePathChange("");
    Modal.destroyAll();
  });

  useEffect(() => {
    if (!hasEnv) return;
    if (!iframePath) {
      Modal.confirm({
        icon: null,
        title: "启动中...",
        getContainer() {
          return document.getElementById("trans_matrix_content")!;
        },
        style: { left: 200 },
        zIndex: 9,
        content: (
          <div style={{ textAlign: "center" }}>
            <img
              src={`${PUBLICURL}/images/loading.gif`}
              alt="loading"
              className="inline-block"
            />
            <p>正在启动研究环境，请稍等...</p>
          </div>
        ),
        footer: null,
      });
    } else {
      Modal.destroyAll();
    }
  }, [hasEnv, iframePath]);

  const onImageChange = async () => {
    if (imageInstance?.imageType === 2) return;

    const hasVscode = (await checkVSCode(imageInstance?.token || "")) as any;

    if (!hasVscode) {
      return message.info(
        "当前环境仅有jupyterlab编辑器，如需vscode编辑器，请联系管理员"
      );
    }

    Modal.confirm({
      title: "切换编辑器确认",
      content: `是否确定切换为${
        imageInstance?.imageType === 0 ? "vscode" : "jupyter"
      }编辑器？`,
      onOk() {
        onIframePathChange("");

        switchEnvEditor({
          envToken: imageInstance?.token || "",
          editorType: imageInstance?.imageType === 0 ? 1 : 0,
        });
      },
    });
  };

  return (
    <div style={{ marginLeft: collapsed ? 30 : 0, height: "100%" }}>
      {iframePath && (
        <Tooltip
          title={`切换${
            imageInstance?.imageType === 0 ? "vscode" : "jupyter"
          }编辑器`}
        >
          <div
            onClick={onImageChange}
            className="absolute flex items-center justify-between p-2 text-red-600 duration-75 bg-white rounded-l-full cursor-pointer top-1/4 -right-10 hover:right-0"
          >
            <img
              className="mr-1"
              src={`${PUBLICURL}/images/${
                imageInstance?.imageType === 0 ? "vscode.svg" : "jupyter.svg"
              }`}
              alt="icon"
            />
            切换
          </div>
        </Tooltip>
      )}
      <If condition={hasEnv}>
        <Then>
          {iframePath && (
            <div
              className={`${clsPrefix}-analysis-content`}
              id="jupyter-iframe"
            >
              <iframe
                id="jupyterlab"
                src={iframePath}
                width="100%"
                height="100%"
                title="jupyterlab"
                frameBorder="no"
                onLoad={onLoad}
              />
            </div>
          )}
        </Then>
        <Else>
          <Empty
            image={`${PUBLICURL}/images/no-image.png`}
            imageStyle={{ height: 200 }}
            className={`${clsPrefix}-no-image-page`}
            description={<span>您未配置研究环境</span>}
          />
        </Else>
      </If>

      <When condition={envPreview.visible && envPreview.strategyId}>
        <EnvPreviewModal
          strategyId={envPreview.strategyId!}
          visible={envPreview.visible!}
          onVisibleChange={(value) => onEnvPreviewVisibleChange(value)}
        />
      </When>
    </div>
  );
});
