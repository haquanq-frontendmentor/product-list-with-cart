import { Product } from "../types/Product";
import { CART_ITEM_DEFAULT_QUANTITY, cartActions, CartItem, cartStore } from "../stores/cartStore";
import { formatPrice } from "../utils/formatPrice";
import products from "../data";

const productItemTemplate = document.querySelector("#products-item-template") as HTMLTemplateElement;
productItemTemplate.remove();
const productItemFragment = productItemTemplate.content;

const createProductItem = (product: Product) => {
    const cloned = productItemFragment.cloneNode(true) as DocumentFragment;

    const productWrapper = cloned.querySelector(".products__item") as HTMLLIElement;
    const productPicture = cloned.querySelector(".products__picture") as HTMLImageElement;
    const productImage = cloned.querySelector(".products__image") as HTMLImageElement;
    const productQuantity = cloned.querySelector(".products__quantity") as HTMLSpanElement;
    const productAddToCartButton = cloned.querySelector(".products__add-to-cart-btn") as HTMLButtonElement;
    const productQuantityDecreaseButton = cloned.querySelector(
        ".products__quantity-btn--decrease",
    ) as HTMLButtonElement;
    const productQuantityIncreaseButton = cloned.querySelector(
        ".products__quantity-btn--increase",
    ) as HTMLButtonElement;
    const productCategory = cloned.querySelector(".products__category") as HTMLParagraphElement;
    const productName = cloned.querySelector(".products__name") as HTMLHeadingElement;
    const productPrice = cloned.querySelector(".products__price") as HTMLParagraphElement;

    productPicture.insertBefore(
        (() => {
            const source = document.createElement("source");
            source.srcset = product.image.tablet;
            source.media = "(min-width: 38em)";
            return source;
        })(),
        productImage,
    );
    productPicture.insertBefore(
        (() => {
            const source = document.createElement("source");
            source.srcset = product.image.desktop;
            source.media = "(min-width: 48em)";
            return source;
        })(),
        productImage,
    );

    productImage.src = product.image.mobile;
    productCategory.textContent = product.category;
    productName.textContent = product.name;
    productPrice.textContent = formatPrice(product.price);

    const cartStoreSubsriptionRemovers: (() => void)[] = [];

    let cartItemRef: CartItem | null;

    const unsubcribeCartStoreEvents = () => {
        cartStoreSubsriptionRemovers.forEach((remover) => remover());
    };

    productAddToCartButton.addEventListener("click", () => {
        cartItemRef = cartActions.addItem({
            name: product.name,
            price: product.price,
            thumbnail: product.image.thumbnail,
        });

        if (cartItemRef === null) return;

        productQuantity.textContent = CART_ITEM_DEFAULT_QUANTITY.toString();
        productWrapper.setAttribute("data-selected", "");
        productQuantityIncreaseButton.focus();

        cartStoreSubsriptionRemovers.push(
            cartStore.subscribe(() => {
                productWrapper.removeAttribute("data-selected");
                unsubcribeCartStoreEvents();
            }, [cartActions.clear.name, cartActions.removeItem.name + cartItemRef.id]),
        );
    });

    productQuantityIncreaseButton.addEventListener("click", () => {
        if (cartItemRef === null) return;
        const newQuantity = cartItemRef.quantity + 1;
        cartActions.updateItemQuantity(cartItemRef.id, newQuantity);
        productQuantity.textContent = newQuantity.toString();
    });

    productQuantityDecreaseButton.addEventListener("click", () => {
        if (cartItemRef === null) return;
        const newQuantity = cartItemRef.quantity + 1;
        cartActions.updateItemQuantity(cartItemRef.id, newQuantity);
        productQuantity.textContent = newQuantity.toString();
    });

    return productWrapper;
};

const productList = document.querySelector(".products__list") as HTMLUListElement;
products.forEach((product) => productList.appendChild(createProductItem(product)));
