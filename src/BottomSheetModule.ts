import { NativeModule, requireNativeModule } from 'expo';

declare class BottomSheetModule extends NativeModule<{}> {}

export default requireNativeModule<BottomSheetModule>('BottomSheet');
