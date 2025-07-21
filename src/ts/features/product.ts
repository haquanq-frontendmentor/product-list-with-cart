import { Product } from "../types/Product";
import { cartStore } from "../stores/cartStore";
import { formatPrice } from "../utils/formatPrice";
import products from "../data";

const productItemTemplate = document.querySelector("#products-item-template") as HTMLTemplateElement;
productItemTemplate.remove();
const productItemFragment = productItemTemplate.content;

const createProductItem = (product: Product) => {
    const clone = productItemFragment.cloneNode(true) as DocumentFragment;

    const productItem = clone.querySelector(".products__item") as HTMLLIElement;
    const productPicture = clone.querySelector(".products__picture") as HTMLImageElement;
    const productImage = clone.querySelector(".products__image") as HTMLImageElement;
    const productQuantity = clone.querySelector(".products__quantity") as HTMLSpanElement;
    const productAddToCartButton = clone.querySelector(".products__add-to-cart-btn") as HTMLButtonElement;
    const productQuantityDecreaseButton = clone.querySelector(".products__quantity-btn--decrease") as HTMLButtonElement;
    const productQuantityIncreaseButton = clone.querySelector(".products__quantity-btn--increase") as HTMLButtonElement;
    const productCategory = clone.querySelector(".products__category") as HTMLParagraphElement;
    const productName = clone.querySelector(".products__name") as HTMLHeadingElement;
    const productPrice = clone.querySelector(".products__price") as HTMLParagraphElement;

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

    cartStore.subscribe((currentState) => {
        const item = currentState.find((v) => v.product.id === product.id);
        if (!item) return;
        productQuantity.textContent = item.quantity.toString();
    }, cartStore.updateItemQuantity.name + product.id);

    cartStore.subscribe(() => {
        productItem.removeAttribute("data-selected");
    }, cartStore.removeItem.name + product.id);

    productAddToCartButton.addEventListener("click", () => {
        productItem.setAttribute("data-selected", "");
        cartStore.addItem(product);
    });

    productQuantityIncreaseButton.addEventListener("click", () => {
        cartStore.updateItemQuantity(product.id, (v) => v + 1);
    });

    productQuantityDecreaseButton.addEventListener("click", () => {
        cartStore.updateItemQuantity(product.id, (v) => v - 1);
    });

    return productItem;
};

const productList = document.querySelector(".products__list") as HTMLUListElement;
products.forEach((product) => productList.appendChild(createProductItem(product)));
