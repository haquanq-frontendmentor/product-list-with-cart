import { createStore } from "../helpers/createStore";

type CartItem = { id: string; quantity: number; name: string; price: number; thumbnail: string };

type CartState = {
    items: CartItem[];
    total: number;
    confirmModalOpen: boolean;
};

type CartOperations = {
    calculateTotal: (state: CartState) => void;
    updateItemQuantity: (state: CartState, itemId: string, value: number) => void;
    addItem: (state: CartState, item: Omit<CartItem, "quantity" | "id">) => CartItem;
    removeItem: (state: CartState, itemId: string) => void;
    clear: (state: CartState) => void;
};

const CART_ITEM_DEFAULT_QUANTITY = 1;
let globalItemId = 0;

const cartOperations: CartOperations = {
    calculateTotal: (state) => {
        state.total = state.items.reduce((a, v) => a + v.quantity * v.price, 0);
    },
    updateItemQuantity: (state, itemId, value) => {
        const item = state.items.find((v) => v.id === itemId);
        if (item === undefined) throw new Error("Can't find cart item with ID: " + itemId);
        item.quantity = value;
    },
    addItem: (state, newItem) => {
        const addedItem: CartItem = {
            ...newItem,
            id: (globalItemId++).toString(),
            quantity: CART_ITEM_DEFAULT_QUANTITY,
        };
        state.items.push(addedItem);
        return addedItem;
    },
    removeItem: (state, itemId) => {
        state.items = state.items.filter((v) => v.id !== itemId);
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
    updateItemQuantity: (itemId: string, value: number) => {
        cartStore.setState(
            (state) => {
                cartOperations.updateItemQuantity(state, itemId, value);
            },
            [cartOperations.updateItemQuantity.name, cartOperations.updateItemQuantity.name + itemId],
        );
    },
    addItem: (newItem: Omit<CartItem, "quantity" | "id">): CartItem | null => {
        let addedCartItem: CartItem | null = null;
        cartStore.setState(
            (state) => {
                addedCartItem = cartOperations.addItem(state, newItem);
            },
            [cartOperations.addItem.name],
        );
        return addedCartItem;
    },
    removeItem: (itemId: string) => {
        cartStore.setState(
            (state) => {
                cartOperations.removeItem(state, itemId);
            },
            [cartOperations.removeItem.name, cartOperations.removeItem.name + itemId],
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
