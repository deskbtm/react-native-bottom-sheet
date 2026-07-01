jest.mock("react-native-worklets", () => ({
  scheduleOnRN: (callback: (...args: unknown[]) => void, ...args: unknown[]) => {
    callback(...args);
  },
}));

jest.mock("react-native-gesture-handler", () => {
  const createGestureBuilder = () => {
    const builder: Record<string, jest.Mock> = {};
    for (const method of [
      "activeOffsetY",
      "failOffsetX",
      "manualActivation",
      "onStart",
      "onUpdate",
      "onEnd",
      "onTouchesDown",
      "onTouchesMove",
    ]) {
      builder[method] = jest.fn(() => builder);
    }
    return builder;
  };

  return {
    GestureDetector: ({ children }: { children: React.ReactNode }) => children,
    Gesture: {
      Native: () => ({}),
      Pan: () => createGestureBuilder(),
    },
  };
});

jest.mock("react-native-reanimated", () => {
  const RN = require("react-native");

  const Extrapolation = {
    CLAMP: "clamp",
    EXTEND: "extend",
    IDENTITY: "identity",
  };

  function interpolate(
    value: number,
    inputRange: number[],
    outputRange: number[],
    extrapolation?: string,
  ): number {
    const [inStart, inEnd] = inputRange;
    const [outStart, outEnd] = outputRange;
    const shouldClamp = extrapolation === Extrapolation.CLAMP || extrapolation === "clamp";

    if (inStart === inEnd) {
      return outEnd;
    }

    const progress = (value - inStart) / (inEnd - inStart);
    const clampedProgress = shouldClamp ? Math.min(1, Math.max(0, progress)) : progress;

    return outStart + clampedProgress * (outEnd - outStart);
  }

  const animated = {
    View: RN.View,
    ScrollView: RN.ScrollView,
    FlatList: RN.FlatList,
    createAnimatedComponent: (Component: unknown) => Component,
  };

  return {
    __esModule: true,
    default: animated,
    ...animated,
    Extrapolation,
    interpolate,
    createAnimatedComponent: (Component: unknown) => Component,
    useSharedValue: (initial: number) => {
      const state = { value: initial };

      return {
        get value() {
          return state.value;
        },
        set value(next: number) {
          state.value = next;
        },
      };
    },
    useAnimatedStyle: (factory: () => object) => factory(),
    useAnimatedReaction: jest.fn(),
    useDerivedValue: (factory: () => unknown) => ({ value: factory() }),
    useAnimatedScrollHandler: (handlers: object) => handlers,
    withSpring: (
      value: number,
      _config?: unknown,
      callback?: (finished?: boolean) => void,
    ) => {
      if (typeof callback === 'function') {
        callback(true);
      }
      return value;
    },
  };
});
