import {BaksetProduct, Product} from '@/lib/types';
import {atom} from 'jotai';

//create basket
export const basketName = atom('');
basketName.debugLabel = 'basketName';
export const basketDescription = atom('');
basketDescription.debugLabel = 'basketDescription';
export const basketDeadline = atom<null | string>(null);
basketDeadline.debugLabel = 'basketDeadline';
export const thumbnail = atom<null | File>(null);
thumbnail.debugLabel = 'thumbnail';
export const imageUrl = atom('');
imageUrl.debugLabel = 'imageUrl';
export const accessStatus = atom<'PUBLIC' | 'PRIVATE'>('PUBLIC');
accessStatus.debugLabel = 'accessStatus';

//select product
export const selectedProduct = atom<BaksetProduct[]>([] as BaksetProduct[]);
selectedProduct.debugLabel = 'selectedProduct';
export const selctedProductCount = atom((get) => get(selectedProduct).length);
export const selectProduct = atom(null, (get, set, product: BaksetProduct) => {
    const selected = get(selectedProduct);
    if (selected.find((p) => p.idx === product.idx)) {
        set(
            selectedProduct,
            selected.filter((p) => p.idx !== product.idx),
        );
    } else {
        set(selectedProduct, [...selected, product]);
    }
});
export const emptySelected = atom(null, (get, set) => {
    set(selectedProduct, []);
});
