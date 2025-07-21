import { Product } from "../types/Product";
import { formatPrice } from "../utils/formatPrice";
import { cartStore } from "../stores/cartStore";

const cartWrapper = document.querySelector(".cart") as HTMLElement;
const cartItemList = document.querySelector(".cart__item-list") as HTMLUListElement;
const cartTotalPrice = document.querySelector(".cart__total--value") as HTMLElement;

const cartItemTemplate = document.querySelector("#cart-item-template") as HTMLTemplateElement;
cartItemTemplate.remove();
const cartItemFragment = cartItemTemplate.content;

const createCartItem = (product: Product) => {
    const clonedCartItemFragment = cartItemFragment.cloneNode(true) as DocumentFragment;

    const cartItem = clonedCartItemFragment.querySelector(".cart__item") as HTMLLIElement;
    const cartItemName = clonedCartItemFragment.querySelector(".cart__item-name") as HTMLHeadingElement;
    const cartItemThumbnail = clonedCartItemFragment.querySelector(".cart__item-thumbnail") as HTMLImageElement;
    const cartItemQuantity = clonedCartItemFragment.querySelector(".cart__item-quantity") as HTMLHeadingElement;
    const cartItemPrice = clonedCartItemFragment.querySelector(".cart__item-price") as HTMLHeadingElement;
    const cartItemSubtotal = clonedCartItemFragment.querySelector(".cart__item-subtotal") as HTMLHeadingElement;
    const cartItemRemoveButton = clonedCartItemFragment.querySelector(".cart__item-remove-btn") as HTMLButtonElement;

    cartItemName.textContent = product.name;
    cartItemThumbnail.src = product.image.thumbnail;
    cartItemPrice.textContent = "@ " + formatPrice(product.price);
    cartItemList.appendChild(cartItem);

    cartStore.subscribe((currentState) => {
        const item = currentState.find((v) => v.product.id === product.id);
        if (!item) return;
        cartItemQuantity.textContent = item.quantity.toString() + "x";
        cartItemSubtotal.textContent = formatPrice(item.quantity * item.product.price);
        cartTotalPrice.textContent = formatPrice(cartStore.calculateTotal());
    }, cartStore.updateItemQuantity.name + product.id);

    cartStore.subscribe(() => {
        cartItem.remove();
        if (cartStore.getItems().length === 0) {
            cartWrapper.setAttribute("data-empty", "");
        }
        cartTotalPrice.textContent = formatPrice(cartStore.calculateTotal());
    }, cartStore.removeItem.name + product.id);

    cartItemRemoveButton.addEventListener("click", () => {
        cartStore.removeItem(product.id);
    });

    return cartItem;
};

cartStore.subscribe((currentState) => {
    cartWrapper.removeAttribute("data-empty");
    cartItemList.appendChild(createCartItem(currentState.at(-1)?.product as Product));
    cartTotalPrice.textContent = formatPrice(cartStore.calculateTotal());
}, cartStore.addItem.name);
