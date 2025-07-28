import { formatPrice } from "../utils/formatPrice";
import { cartActions, CartItem, cartStore } from "../stores/cartStore";
import { createModal } from "../helpers/createModal";
import { createRovingFocus } from "../helpers/createRovingFocus";

const cartWrapper = document.querySelector(".cart") as HTMLElement;
const cartItemList = document.querySelector(".cart__item-list") as HTMLUListElement;
const cartItemCount = document.querySelector(".cart__item-count") as HTMLElement;
const cartTotal = document.querySelector(".cart__total--value") as HTMLElement;
const cartConfirmButton = document.querySelector(".cart__confirm-btn") as HTMLButtonElement;
const cartMessage = document.querySelector(".cart__message") as HTMLElement;

const cartItemTemplate = document.querySelector("#cart-item-template") as HTMLTemplateElement;
const cartItemFragment = cartItemTemplate.content;
cartItemTemplate.remove();

const confirmModalCartItemTemplate = document.querySelector("#confirm-modal-item-template") as HTMLTemplateElement;
confirmModalCartItemTemplate.remove();
const confirmModalCartItemFragment = confirmModalCartItemTemplate.content;

const cartItemListRovingFocus = createRovingFocus(cartItemList);

let cartMessageTimeout = -1;

const setCartMessage = (message: string) => {
    clearTimeout(cartMessageTimeout);

    cartMessageTimeout = setTimeout(() => {
        cartMessage.textContent = `${message} (total ${formatPrice(cartStore.getState().total)})`;
    }, 300);
};

const createCartItem = (item: CartItem) => {
    const cloned = cartItemFragment.cloneNode(true) as DocumentFragment;

    const itemWrapper = cloned.querySelector(".cart__item") as HTMLLIElement;
    const itemName = cloned.querySelector(".cart__item-name") as HTMLHeadingElement;
    const itemThumbnail = cloned.querySelector(".cart__item-thumbnail") as HTMLImageElement;
    const itemQuantity = cloned.querySelector(".cart__item-quantity") as HTMLHeadingElement;
    const itemPrice = cloned.querySelector(".cart__item-price") as HTMLHeadingElement;
    const itemSubtotal = cloned.querySelector(".cart__item-subtotal") as HTMLHeadingElement;
    const itemRemoveButton = cloned.querySelector(".cart__item-remove-btn") as HTMLButtonElement;

    itemName.textContent = item.name;
    itemThumbnail.src = item.thumbnail;
    itemPrice.textContent = "@ " + formatPrice(item.price);
    itemQuantity.textContent = "1x";
    itemSubtotal.textContent = formatPrice(item.price);

    const itemActionRovingFocus = createRovingFocus(itemRemoveButton, {
        disableOnBlur: true,
        escapeElement: itemWrapper,
    });
    itemActionRovingFocus.addItem(itemRemoveButton);
    const destroyItemRovingFocus = cartItemListRovingFocus.addItem(itemWrapper);
    itemActionRovingFocus.disable();

    const storeSubscriptions: (() => void)[] = [];

    itemRemoveButton.addEventListener("click", () => {
        cartActions.removeItem(item.id);
    });

    itemWrapper.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            itemActionRovingFocus.enable();
            itemActionRovingFocus.selectFirstItem();
        }
    });

    storeSubscriptions.push(
        cartStore.subscribe(() => {
            itemQuantity.textContent = item.quantity.toString() + "x";
            itemSubtotal.textContent = formatPrice(item.quantity * item.price);
            setCartMessage(item.name + " quantity is now " + item.quantity);
            if (item.quantity === 0) cartActions.removeItem(item.id);
        }, [cartActions.updateItemQuantity.name + item.id]),
    );

    storeSubscriptions.push(
        cartStore.subscribe(() => {
            itemWrapper.remove();
            storeSubscriptions.forEach((destroyCallback) => destroyCallback());
            destroyItemRovingFocus();
            setCartMessage(item.name + " removed from cart");
        }, [cartActions.removeItem.name + item.id, cartActions.clear.name]),
    );

    setCartMessage(item.name + " added to cart");
    return itemWrapper;
};

cartStore.subscribe(
    (currentState) => {
        cartWrapper.removeAttribute("data-empty");
        cartItemList.appendChild(createCartItem(currentState.items.at(-1) as CartItem));
    },
    [cartActions.addItem.name],
);

cartStore.subscribe(
    (currentState) => {
        if (currentState.items.length === 0) cartWrapper.setAttribute("data-empty", "");
    },
    [cartActions.removeItem.name, cartActions.clear.name],
);

cartStore.subscribe(() => {
    cartActions.calculateTotal();
}, [
    cartActions.addItem.name,
    cartActions.clear.name,
    cartActions.removeItem.name,
    cartActions.updateItemQuantity.name,
]);

cartStore.subscribe(
    (currentState) => {
        cartTotal.textContent = formatPrice(currentState.total);
        cartItemCount.textContent = currentState.items.length.toString();
    },
    [cartActions.calculateTotal.name],
);

const confirmModal = createModal({
    wrapper: document.querySelector(".confirm-modal") as HTMLDivElement,
    container: document.querySelector(".confirm-modal__container") as HTMLElement,
});

confirmModal.subscribe("open", (wrapper) => {
    const continueButton = wrapper.querySelector(".confirm-modal__continue-btn") as HTMLButtonElement;
    const itemList = wrapper.querySelector(".confirm-modal__item-list") as HTMLUListElement;
    const totalPrice = wrapper.querySelector(".confirm-modal__total--value") as HTMLSpanElement;

    const { items: cartItems, total: cartTotal } = cartStore.getState();

    itemList.innerHTML = "";
    cartItems.forEach((cartItem) => {
        const clonedItemFragment = confirmModalCartItemFragment.cloneNode(true) as DocumentFragment;

        const itemWrapper = clonedItemFragment.querySelector(".confirm-modal__item") as HTMLLIElement;
        const itemName = clonedItemFragment.querySelector(".confirm-modal__item-name") as HTMLHeadingElement;
        const itemThumbnail = clonedItemFragment.querySelector(".confirm-modal__item-thumbnail") as HTMLImageElement;
        const itemQuantity = clonedItemFragment.querySelector(".confirm-modal__item-quantity") as HTMLHeadingElement;
        const itemPrice = clonedItemFragment.querySelector(".confirm-modal__item-price") as HTMLHeadingElement;
        const itemSubtotal = clonedItemFragment.querySelector(".confirm-modal__item-subtotal") as HTMLHeadingElement;

        itemName.textContent = cartItem.name;
        itemThumbnail.src = cartItem.thumbnail;
        itemPrice.textContent = "@ " + formatPrice(cartItem.price);
        itemQuantity.textContent = cartItem.quantity + "x";
        itemSubtotal.textContent = formatPrice(cartItem.price * cartItem.quantity);
        totalPrice.textContent = formatPrice(cartTotal);

        itemList.appendChild(itemWrapper);
    });

    const handleConfirmButtonClick = () => {
        cartActions.clear();
        confirmModal.close();
        setCartMessage("You cart is now empty");
    };

    continueButton.addEventListener("click", handleConfirmButtonClick);

    const unsubscribeCloseEvent = confirmModal.subscribe("close", () => {
        continueButton.removeEventListener("click", handleConfirmButtonClick);
        unsubscribeCloseEvent();
    });
});

cartConfirmButton.addEventListener("click", () => {
    confirmModal.open();
    setCartMessage("Confirming order");
});
