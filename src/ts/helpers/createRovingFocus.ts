const SELECT_NEXT_KEYS = ["ArrowRight", "ArrowDown"];
const SELECT_PREV_KEYS = ["ArrowLeft", "ArrowUp"];
const SELECT_FIRST_KEY = "Home";
const SELECT_LAST_KEY = "End";
const GO_BACK_KEY = "Escape";

type RovingFocusItem = {
    id: string;
    element: HTMLElement;
};

type RovingFocusSettings = Partial<{
    disableOnBlur?: boolean;
    escapeElement?: HTMLElement;
}>;

let glovalRovingFocusItemId = 0;

export const createRovingFocus = (container: HTMLElement, settings?: RovingFocusSettings) => {
    const items: RovingFocusItem[] = [];

    let currentIndex = -1;
    let isEnabled = false;
    let prevActiveElement: HTMLElement | null = null;

    const isDisabled = () => isEnabled === false;
    const hasNoItems = () => items.length === 0;

    const focusItemAtIndex = (nextIndex: number) => {
        if (isDisabled() || hasNoItems()) return;

        if (prevActiveElement === null) {
            prevActiveElement = document.activeElement as HTMLElement;
        }

        items[currentIndex].element.setAttribute("tabIndex", "-1");
        items[nextIndex].element.setAttribute("tabIndex", "0");
        items[nextIndex].element.focus();
        currentIndex = nextIndex;
    };

    const selectPrevItem = () => {
        focusItemAtIndex(Math.max(currentIndex - 1, 0));
    };

    const selectNextItem = () => {
        focusItemAtIndex(Math.min(currentIndex + 1, items.length - 1));
    };

    const selectFirstItem = () => {
        focusItemAtIndex(0);
    };

    const selectLastItem = () => {
        focusItemAtIndex(items.length - 1);
    };

    const handleKeydown = (event: KeyboardEvent) => {
        if (isDisabled()) return;

        event.stopPropagation();

        if (SELECT_PREV_KEYS.includes(event.key)) {
            selectPrevItem();
        } else if (SELECT_NEXT_KEYS.includes(event.key)) {
            selectNextItem();
        } else if (SELECT_FIRST_KEY === event.key) {
            selectFirstItem();
        } else if (SELECT_LAST_KEY === event.key) {
            selectLastItem();
        } else if (GO_BACK_KEY === event.key) {
            if (settings?.escapeElement) {
                settings.escapeElement.focus();
            } else if (prevActiveElement) {
                prevActiveElement.focus();
                prevActiveElement = null;
            }
        }
    };

    const handleClick = (event: MouseEvent) => {
        if (isDisabled()) return;
        event.stopPropagation();
    };

    const addItem = (element: HTMLElement) => {
        const handleItemClick = () => {
            focusItemAtIndex(newItemIndex);
        };

        const handleItemBlur = () => {
            if (settings?.disableOnBlur) {
                setTimeout(() => {
                    if (!container.contains(document.activeElement)) {
                        disable();
                    }
                }, 50);
            }
        };

        const newItem: RovingFocusItem = {
            id: String(glovalRovingFocusItemId++),
            element,
        };
        const newItemIndex = items.length;
        newItem.element.setAttribute("tabIndex", "-1");
        newItem.element.addEventListener("click", handleItemClick);
        newItem.element.addEventListener("blur", handleItemBlur);
        items.push(newItem);
        if (currentIndex === -1) {
            enable();
        }
        return () => {
            const itemIndex = items.findIndex((v) => v.id === newItem.id);
            if (itemIndex === undefined) throw new Error("Can't find roving item with ID: " + newItem.id);

            newItem.element.removeAttribute("tabIndex");
            newItem.element.removeEventListener("click", handleItemClick);
            newItem.element.removeEventListener("blur", handleItemBlur);

            items.splice(itemIndex, 1);
            focusItemAtIndex(Math.min(itemIndex, items.length - 1));
            if (hasNoItems()) currentIndex = -1;
        };
    };

    const disable = () => {
        if (hasNoItems()) return;
        isEnabled = false;
        items[currentIndex].element.setAttribute("tabIndex", "-1");
        currentIndex = 0;
    };

    const enable = () => {
        isEnabled = true;
        currentIndex = 0;
        items[currentIndex].element.setAttribute("tabIndex", "0");
    };

    container.addEventListener("keydown", handleKeydown);
    container.addEventListener("click", handleClick);

    return { addItem, disable, enable, isDisabled, selectFirstItem, selectLastItem, selectNextItem, selectPrevItem };
};
