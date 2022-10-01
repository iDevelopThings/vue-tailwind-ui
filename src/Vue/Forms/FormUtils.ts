function selectFirstErrorElement(errors) {
    const errorKeys = Object.keys(errors);
    if (!errorKeys?.length) return;

    const first = errorKeys[0] ? (errorKeys[0].includes(".") ? errorKeys[0].split(".").pop() : errorKeys[0]) : null;
    if (!first) return;

    const element = document.getElementById(first);
    if (element) {
        element.scrollIntoView({behavior : "smooth", block : "center"});
        element.focus();
    }
}

export function isFocusable(element: HTMLElement) {
    if (element.hidden) return false;
    if ((element as any).disabled) return false;
    if (element.tabIndex < 0) return false;
    if (element.tabIndex > 0) return true;
    if (element.tabIndex === 0) return true;
    if (element.hasAttribute("disabled")) return false;
    if (element.ariaDisabled !== null && element.ariaDisabled !== "false") return false;
    if (element.ariaHidden !== null && element.ariaHidden !== "false") return false;
    return false;
}
