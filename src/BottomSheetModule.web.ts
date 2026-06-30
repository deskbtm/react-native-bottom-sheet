import { registerWebModule, NativeModule } from 'expo';

class BottomSheetModule extends NativeModule<{}> {}

export default registerWebModule(BottomSheetModule, 'BottomSheetModule');
