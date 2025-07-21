import { createStore } from "../helpers/createStore";
import { Product } from "../types/Product";

type CartState = Array<{ quantity: number; product: Product }>;

const cartStoreInner = createStore<CartState>([]);

export const cartStore = {
    calculateTotal: () => {
        const total = cartStoreInner.getState().reduce((a, v) => (a += v.quantity * v.product.price), 0);
        return total;
    },
    updateItemQuantity: (productId: string, callback: (currentValue: number) => number) => {
        cartStoreInner.setState((currentState) => {
            const item = currentState.find((v) => v.product.id === productId);
            if (!item) throw new Error("Invalid product ID");
            item.quantity = callback(item.quantity);
            if (item.quantity === 0) cartStore.removeItem(productId);
        }, cartStore.updateItemQuantity.name + productId);
    },
    getItems: () => {
        return cartStoreInner.getState();
    },
    addItem: (product: Product) => {
        cartStoreInner.setState((v) => {
            v.push({ product, quantity: 0 });
        }, cartStore.addItem.name);

        cartStore.updateItemQuantity(product.id, (v) => v + 1);
    },
    removeItem: (productId: string) => {
        cartStoreInner.setState(
            (v) => v.filter((v) => v.product.id !== productId),
            cartStore.removeItem.name + productId,
        );
    },
    subscribe: cartStoreInner.subscribe,
};
