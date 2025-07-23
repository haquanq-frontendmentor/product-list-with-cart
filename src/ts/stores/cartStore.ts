import { createStore } from "../helpers/createStore";

type CartItem = { quantity: number; name: string; price: number; thumbnail: string };

type CartState = {
    items: CartItem[];
    total: number;
    confirmModalOpen: boolean;
};

type CartOperations = {
    calculateTotal: (state: CartState) => void;
    updateItemQuantity: (state: CartState, itemIndex: number, value: number) => void;
    addItem: (state: CartState, item: Omit<CartItem, "quantity">) => number;
    removeItem: (state: CartState, itemIndex: number) => void;
    clear: (state: CartState) => void;
};

const CART_ITEM_DEFAULT_QUANTITY = 1;

const cartOperations: CartOperations = {
    calculateTotal: (state) => {
        state.total = state.items.reduce((a, v) => a + v.quantity * v.price, 0);
    },
    updateItemQuantity: (state, itemIndex, value) => {
        state.items[itemIndex].quantity = value;
    },
    addItem: (state, newItem) => {
        const itemIndex = state.items.length;
        state.items.push({ ...newItem, quantity: CART_ITEM_DEFAULT_QUANTITY });
        return itemIndex;
    },
    removeItem: (state, itemIndex) => {
        state.items.splice(itemIndex, 1);
    },
    clear: (state) => {
        state.items = [];
        state.total = 0;
    },
};

const cartStore = createStore<CartState>({
    confirmModalOpen: false,
    total: 0,
    items: [],
});

const cartActions = {
    calculateTotal: () => {
        cartStore.setState(
            (state) => {
                cartOperations.calculateTotal(state);
            },
            [cartOperations.calculateTotal.name],
        );
    },
    updateItemQuantity: (itemIndex: number, value: number) => {
        cartStore.setState(
            (state) => {
                cartOperations.updateItemQuantity(state, itemIndex, value);
            },
            [cartOperations.updateItemQuantity.name, cartOperations.updateItemQuantity.name + itemIndex],
        );
    },
    addItem: (newItem: Omit<CartItem, "quantity">) => {
        let addedAtIndex = -1;
        cartStore.setState(
            (state) => {
                addedAtIndex = cartOperations.addItem(state, newItem);
            },
            [cartOperations.addItem.name],
        );
        return addedAtIndex;
    },
    removeItem: (itemIndex: number) => {
        cartStore.setState(
            (state) => {
                cartOperations.removeItem(state, itemIndex);
            },
            [cartOperations.removeItem.name, cartOperations.removeItem.name + itemIndex],
        );
    },
    clear: () => {
        cartStore.setState(
            (state) => {
                cartOperations.clear(state);
            },
            [cartOperations.clear.name],
        );
    },
};

export { CART_ITEM_DEFAULT_QUANTITY, cartActions, cartOperations, cartStore, CartItem, CartOperations, CartState };
