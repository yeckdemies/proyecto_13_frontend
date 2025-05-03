export const showLoader = () => document.dispatchEvent(new CustomEvent('loader:show'));
export const hideLoader = () => document.dispatchEvent(new CustomEvent('loader:hide'));
