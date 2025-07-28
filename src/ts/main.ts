import "./features/cart";
import "./features/product";
import { createModal } from "./helpers/createModal";

const guideModal = createModal({
    wrapper: document.querySelector(".guide-modal") as HTMLDivElement,
    container: document.querySelector(".guide-modal__container") as HTMLElement,
});

const guideModalDismissButton = document.querySelector(".guide-modal__dismiss-btn") as HTMLButtonElement;
guideModalDismissButton.addEventListener("click", () => guideModal.close());

setTimeout(() => {
    guideModal.open();
}, 700);
